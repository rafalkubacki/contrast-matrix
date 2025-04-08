import { Standard } from "../types";

export const standards: Record<string, Standard> = {
  aa: {
    name: "WCAG AA",
    value: 4.5,
    description:
      "WCAG AA requires a contrast ratio of at least 4.5:1 for normal text",
  },
  aaLarge: {
    name: "WCAG AA Large",
    value: 3,
    description:
      "WCAG AA requires a contrast ratio of at least 3:1 for large text",
  },
  aaa: {
    name: "WCAG AAA",
    value: 7,
    description:
      "WCAG AAA requires a contrast ratio of at least 7:1 for normal text",
  },
  aaaLarge: {
    name: "WCAG AAA Large",
    value: 4.5,
    description:
      "WCAG AAA requires a contrast ratio of at least 4.5:1 for large text",
  },
};
