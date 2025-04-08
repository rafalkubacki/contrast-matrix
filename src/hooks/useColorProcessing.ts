import {
  processColorStrings,
  checkContrast,
  expandShortHex,
} from "../utils/colorUtils";

export const useColorProcessing = () => {
  return {
    processColorStrings,
    expandShortHex,
    checkContrast,
  };
};
