export const standards = {
  none: {
    name: "None",
    description: "No contrast requirement.",
    value: 0,
  },
  graphical: {
    name: "WCAG Graphical",
    description:
      "WCAG 2.1 requires a contrast ratio of at least 3:1 for graphics and user interface components (such as form input borders).",
    value: 3,
  },
  aa: {
    name: "WCAG AA",
    description:
      "WCAG 2.0 level AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.",
    value: 4.5,
  },
  aaa: {
    name: "WCAG AAA",
    description:
      "WCAG Level AAA requires a contrast ratio of at least 7:1 for normal text and 4.5:1 for large text.",
    value: 7,
  },
} as const;
