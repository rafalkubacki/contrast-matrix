/**
 * Convert a 3-digit hex color to a 6-digit hex color
 * @param hex - Hex color without # prefix
 * @returns Extended 6-digit hex color
 */
export const expandShortHex = (hex: string): string => {
  if (hex.length === 3) {
    return hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return hex;
};

/**
 * Convert a hex color to RGB values
 * @param hex - Hex color without # prefix
 * @returns Object with r, g, b values
 */
export const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return { r, g, b };
};

/**
 * Calculate luminance from RGB values
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Luminance value
 */
export const calculateLuminance = ({
  r,
  g,
  b,
}: {
  r: number;
  g: number;
  b: number;
}) => {
  // Convert RGB to sRGB
  const sR = r / 255;
  const sG = g / 255;
  const sB = b / 255;

  // Apply gamma correction
  const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
  const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
  const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

/**
 * Calculate contrast ratio between two colors
 * @param fg - Foreground hex color without # prefix
 * @param bg - Background hex color without # prefix
 * @returns Contrast ratio
 */
export const checkContrast = (fg: string, bg: string): number => {
  // Convert hex to RGB
  const fgRGB = hexToRgb(fg);
  const bgRGB = hexToRgb(bg);

  // Calculate luminance
  const fgLuminance = calculateLuminance(fgRGB);
  const bgLuminance = calculateLuminance(bgRGB);

  // Calculate contrast ratio
  const ratio =
    (Math.max(fgLuminance, bgLuminance) + 0.05) /
    (Math.min(fgLuminance, bgLuminance) + 0.05);

  return parseFloat(ratio.toFixed(2));
};

/**
 * Process input color strings and handle validation
 * @param input - String with colors (one per line)
 * @returns Array of valid colors
 */
export const processColorStrings = (input: string): string[] => {
  const normalizedColors = new Set<string>();

  input
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s !== "")
    .forEach((s) => {
      const color = s.startsWith("#") ? s.substring(1) : s;
      if (/^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/i.test(color)) {
        // Convert to lowercase for normalization
        const normalizedColor = expandShortHex(color.toLowerCase());
        normalizedColors.add(normalizedColor);
      }
    });

  return Array.from(normalizedColors);
};
