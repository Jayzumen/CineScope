import { expect, test } from "@playwright/test";

type LabMetrics = {
  cls: number;
  imageBytes: number;
  inp: number;
  layoutShifts: Array<{ sources: string[]; value: number }>;
  lcp: number;
  resourceCount: number;
  transferBytes: number;
};

const numberFromEnvironment = (name: string, fallback: number) => {
  const value = Number(process.env[name] ?? fallback);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive number`);
  }

  return value;
};

const budgets = {
  cls: numberFromEnvironment("PERFORMANCE_CLS", 0.1),
  imageBytes: numberFromEnvironment("PERFORMANCE_IMAGE_KB", 2_500) * 1_024,
  inp: numberFromEnvironment("PERFORMANCE_INP_MS", 200),
  lcp: numberFromEnvironment("PERFORMANCE_LCP_MS", 2_500),
  resourceCount: numberFromEnvironment("PERFORMANCE_RESOURCES", 100),
  transferBytes:
    numberFromEnvironment("PERFORMANCE_TRANSFER_KB", 3_500) * 1_024,
};

for (const path of ["/", "/movies"]) {
  test(`${path} stays within production experience budgets`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript(() => {
      const metrics = {
        cls: 0,
        inp: 0,
        layoutShifts: [] as Array<{ sources: string[]; value: number }>,
        lcp: 0,
      };
      Object.defineProperty(window, "__cinescopeLabMetrics", {
        configurable: false,
        value: metrics,
        writable: false,
      });

      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            metrics.lcp = Math.max(metrics.lcp, entry.startTime);
          }
        }).observe({ buffered: true, type: "largest-contentful-paint" });
      } catch {
        // A missing API is surfaced by the required positive LCP assertion.
      }

      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & {
              hadRecentInput: boolean;
              sources?: Array<{ node?: Node | null }>;
              value: number;
            };
            if (!shift.hadRecentInput) {
              metrics.cls += shift.value;
              metrics.layoutShifts.push({
                sources: (shift.sources ?? []).map(({ node }) => {
                  if (!(node instanceof Element))
                    return node?.nodeName ?? "unknown";
                  const id = node.id ? `#${node.id}` : "";
                  const classes = [...node.classList]
                    .slice(0, 2)
                    .map((name) => `.${name}`)
                    .join("");
                  return `${node.tagName.toLowerCase()}${id}${classes}`;
                }),
                value: shift.value,
              });
            }
          }
        }).observe({ buffered: true, type: "layout-shift" });
      } catch {
        // Older browsers report zero rather than blocking the other budgets.
      }

      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const event = entry as PerformanceEntry & {
              duration: number;
              interactionId: number;
            };
            if (event.interactionId > 0) {
              metrics.inp = Math.max(metrics.inp, event.duration);
            }
          }
        }).observe({
          buffered: true,
          durationThreshold: 16,
          type: "event",
        } as PerformanceObserverInit & { durationThreshold: number });
      } catch {
        // Fast interactions below the API reporting floor remain zero.
      }
    });

    const response = await page.goto(path, { waitUntil: "networkidle" });
    expect(
      response?.ok(),
      `Expected ${path} to return a successful response`,
    ).toBe(true);

    if (path === "/") {
      const trailer = page
        .getByRole("button", { name: /Watch trailer|Play trailer/ })
        .first();
      await trailer.click();
      await page.keyboard.press("Escape");
    } else {
      const genre = page.getByRole("combobox", { name: "Genre", exact: true });
      await genre.focus();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Escape");
    }

    await page.waitForTimeout(1_000);

    const metrics = await page.evaluate<LabMetrics>(() => {
      const observed = (
        window as unknown as Window & {
          __cinescopeLabMetrics: Pick<
            LabMetrics,
            "cls" | "inp" | "layoutShifts" | "lcp"
          >;
        }
      ).__cinescopeLabMetrics;
      const resources = performance.getEntriesByType(
        "resource",
      ) as PerformanceResourceTiming[];
      const navigation = performance.getEntriesByType("navigation")[0] as
        PerformanceNavigationTiming | undefined;

      return {
        ...observed,
        imageBytes: resources
          .filter((entry) => entry.initiatorType === "img")
          .reduce((total, entry) => total + entry.transferSize, 0),
        resourceCount: resources.length + (navigation ? 1 : 0),
        transferBytes:
          resources.reduce((total, entry) => total + entry.transferSize, 0) +
          (navigation?.transferSize ?? 0),
      };
    });

    const result = {
      budgets,
      metrics,
      page: path,
      project: testInfo.project.name,
    };
    console.log(`PERFORMANCE_RESULT ${JSON.stringify(result)}`);
    await testInfo.attach("performance-result", {
      body: Buffer.from(JSON.stringify(result, null, 2)),
      contentType: "application/json",
    });

    expect(metrics.lcp, "LCP observer did not record a value").toBeGreaterThan(
      0,
    );
    expect(
      metrics.lcp,
      "LCP exceeds the good-experience budget",
    ).toBeLessThanOrEqual(budgets.lcp);
    expect(
      metrics.cls,
      "CLS exceeds the good-experience budget",
    ).toBeLessThanOrEqual(budgets.cls);
    expect(
      metrics.inp,
      "Interaction latency exceeds the INP budget",
    ).toBeLessThanOrEqual(budgets.inp);
    expect(
      metrics.transferBytes,
      "Total transfer exceeds its budget",
    ).toBeLessThanOrEqual(budgets.transferBytes);
    expect(
      metrics.imageBytes,
      "Image transfer exceeds its budget",
    ).toBeLessThanOrEqual(budgets.imageBytes);
    expect(
      metrics.resourceCount,
      "Resource count exceeds its budget",
    ).toBeLessThanOrEqual(budgets.resourceCount);
  });
}
