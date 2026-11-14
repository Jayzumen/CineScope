// Display formatting shared by server-rendered pages. All functions accept
// missing or malformed upstream values and return "" (or a fallback) instead
// of rendering "undefined", "NaN" or raw ISO strings.

const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/;

/** "1 season", "5 seasons". */
export const plural = (count: number, word: string, many = `${word}s`) =>
  `${count.toLocaleString("en-US")} ${count === 1 ? word : many}`;

/** 142 → "2h 22m", 45 → "45m", 120 → "2h". */
export function formatRuntime(minutes: number | null | undefined) {
  if (!minutes || !Number.isFinite(minutes) || minutes <= 0) return "";
  const total = Math.round(minutes);
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  if (!hours) return `${rest}m`;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

/** "en" → "English"; unknown or invalid codes are returned upper-cased. */
export function languageName(code: string | null | undefined) {
  if (!code || !/^[a-z]{2,3}$/i.test(code)) return "";
  try {
    const name = new Intl.DisplayNames(["en"], { type: "language" }).of(code);
    if (name && name.toLowerCase() !== code.toLowerCase()) return name;
  } catch {
    // Fall through to the raw code.
  }
  return code.toUpperCase();
}

function parseDate(value: string | null | undefined) {
  const match = value ? isoDate.exec(value) : null;
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  // Reject rollovers such as 2023-02-31.
  return date.getUTCMonth() === month - 1 && date.getUTCDate() === day
    ? { year, month, day, date }
    : null;
}

/** "1963-03-27" → "27 March 1963". */
export function formatDate(value: string | null | undefined) {
  const parsed = parseDate(value);
  return parsed
    ? parsed.date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";
}

/** Whole years between a birth date and a death date (or `today`). */
export function ageInYears(
  birth: string | null | undefined,
  until: string | null | undefined,
  today = new Date(),
) {
  const from = parseDate(birth);
  const to = until
    ? parseDate(until)
    : {
        year: today.getUTCFullYear(),
        month: today.getUTCMonth() + 1,
        day: today.getUTCDate(),
      };
  if (!from || !to) return null;
  const birthdayPassed =
    to.month > from.month || (to.month === from.month && to.day >= from.day);
  const age = to.year - from.year - (birthdayPassed ? 0 : 1);
  return age >= 0 && age < 150 ? age : null;
}
