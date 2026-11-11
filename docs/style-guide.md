# CineScope style guide

The visual direction is a dark cinema journal: artwork leads, navigation stays compact, and amber identifies actions. Use the semantic variables in src/app/globals.css rather than adding page-specific palettes. The base is near-black #101113, text warm-white #f2f0e9, muted text #a5a6ac, and accent #edc078. These text colors exceed WCAG AA normal-text contrast on the base; verify other surfaces and states separately.

Use the system sans-serif stack, strong display typography only for featured titles, compact catalog headings and quiet metadata. No font network request is required. Keep copy concise and preserve full title access. Poster cards use a stable 2:3 ratio, persistent title/year/rating, and a distinct native save button outside the navigation link.

Use a 4/8px spacing rhythm, responsive gutters and a 1360px content shell. Catalogs use two columns on phones, four on intermediate screens and six on wide screens. Standard corners are 8–12px; pills are for tags. Prefer space and typography over nested bordered panels. Reserve image gradients for readability over backdrops.

Controls need visible focus, adequate contrast, descriptive labels, pending/disabled states and clear recovery errors. Aim for 44px touch targets. Never convey favorites or ratings through color alone. Essential information must remain visible without hover. Use one main landmark and a skip link; headings follow the page hierarchy. Dialogs use Radix focus trapping, Escape dismissal and focus restoration. Motion is short and disabled by reduced-motion preferences.

Each data surface needs loading, success, empty, error and missing-artwork states. Missing content is distinct from upstream failure. Search/filter state lives in URLs. Keep private account collections separate from explicitly shared title links. Use Sonner for notifications and Lucide for primary icons.

Before changing shared CSS, check 390px and 1440px widths, keyboard-only use, 200% zoom, long titles, empty results and missing images. Automated tests supplement manual accessibility review; they do not certify WCAG conformance. Measure production LCP/CLS/INP and image transfer after hosting is configured; development timings are not a production baseline.
