import { standards } from "../utils/constants";

export type StandardKey = keyof typeof standards;

export type SortOption = "contrast" | "background" | "foreground";

export interface ColorPair {
  background: string;
  foreground: string;
  contrast: number;
}

export interface NotificationMessage {
  text: string;
  timestamp: number;
}

export interface Standard {
  name: string;
  value: number;
  description: string;
}
