import { FC } from "react";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ColorPair, SortOption, Standard } from "../types";
import SortControls from "./UI/SortControls";

interface ColorPairsListProps {
  matchingPairs: ColorPair[];
  standard: Standard;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  onCopy: (text: string, message?: string) => void;
}

const ColorPairsList: FC<ColorPairsListProps> = ({
  matchingPairs,
  standard,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onCopy,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack
          direction={isSmall ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isSmall ? "flex-start" : "center"}
          sx={{ mb: 2 }}
        >
          <Stack spacing={1}>
            <Typography variant="h6">Compatible Color Pairs</Typography>
            <Typography variant="body2" color="text.secondary">
              {matchingPairs.length} pairs meeting {standard.name} standard (≥{" "}
              {standard.value})
            </Typography>
          </Stack>

          <SortControls
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            isSmall={isSmall}
          />
        </Stack>
      </Box>

      <Divider />

      {matchingPairs.length > 0 ? (
        <>
          <Box>
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: 1.5,
                borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
                display: "flex",
                flexDirection: isSmall ? "column" : "row",
                gap: isSmall ? 1 : 0,
              }}
            >
              {!isSmall && (
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ width: "40%" }}
                >
                  Sample
                </Typography>
              )}
              <Box
                sx={{
                  display: "flex",
                  width: isSmall ? "100%" : "60%",
                  gap: isSmall ? 1 : 3,
                  flexDirection: isSmall ? "column" : "row",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ width: isSmall ? "100%" : "40%" }}
                >
                  Background
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ width: isSmall ? "100%" : "40%" }}
                >
                  Foreground
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ width: isSmall ? "100%" : "20%" }}
                >
                  Contrast Ratio
                </Typography>
              </Box>
            </Box>

            <List disablePadding sx={{ maxHeight: "400px", overflow: "auto" }}>
              {matchingPairs.map((pair, index) => (
                <ListItem
                  key={`pair-${index}`}
                  divider={index < matchingPairs.length - 1}
                  sx={{
                    py: 2,
                    px: { xs: 2, sm: 3 },
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(66, 133, 244, 0.08)",
                    },
                  }}
                  onClick={() =>
                    onCopy(
                      `Background: #${pair.background}, Foreground: #${pair.foreground}, Contrast: ${pair.contrast}`
                    )
                  }
                >
                  <Stack
                    direction={isSmall ? "column" : "row"}
                    spacing={isSmall ? 2 : 3}
                    alignItems={isSmall ? "stretch" : "center"}
                    width="100%"
                  >
                    <Box
                      sx={{
                        backgroundColor: `#${pair.background}`,
                        color: `#${pair.foreground}`,
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        width: isSmall ? "100%" : "40%",
                        height: isSmall ? "auto" : 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body1">Sample Text Aa</Typography>
                    </Box>
                    <Stack
                      direction={isSmall ? "column" : "row"}
                      spacing={isSmall ? 1 : 3}
                      width={isSmall ? "100%" : "60%"}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        width={isSmall ? "100%" : "40%"}
                      >
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            backgroundColor: `#${pair.background}`,
                            borderRadius: "4px",
                            border: "1px solid rgba(255,255,255,0.3)",
                          }}
                        />
                        <Typography variant="body2">
                          #{pair.background}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        width={isSmall ? "100%" : "40%"}
                      >
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            backgroundColor: `#${pair.foreground}`,
                            borderRadius: "4px",
                            border: "1px solid rgba(255,255,255,0.3)",
                          }}
                        />
                        <Typography variant="body2">
                          #{pair.foreground}
                        </Typography>
                      </Stack>
                      <Stack
                        sx={{ width: isSmall ? "100%" : "20%" }}
                        spacing={0.5}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {pair.contrast.toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            21
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            position: "relative",
                            height: 8,
                            width: "100%",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            borderRadius: 4,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              height: "100%",
                              width: `${(pair.contrast / 21) * 100}%`,
                              backgroundColor: "primary.main",
                              borderRadius: 4,
                            }}
                          />
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </Box>
          <Divider />
          <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: "right" }}>
            <Button
              variant="contained"
              onClick={() => {
                const pairsText = matchingPairs
                  .map(
                    (pair) =>
                      `BG: #${pair.background}, FG: #${pair.foreground}, Ratio: ${pair.contrast}`
                  )
                  .join("\n");
                onCopy(pairsText);
              }}
              startIcon={<ContentCopyIcon />}
            >
              Copy All Pairs
            </Button>
          </Box>
        </>
      ) : (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            No color pairs meet the selected contrast standard.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ColorPairsList;
