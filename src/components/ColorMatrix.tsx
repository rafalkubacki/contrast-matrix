import { FC } from "react";
import {
  Box,
  Grid,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Standard } from "../types";
import ColorSwatch from "./UI/ColorSwatch";

interface ColorMatrixProps {
  backgroundsArray: string[];
  foregroundsArray: string[];
  standard: Standard;
  checkContrast: (fg: string, bg: string) => number;
  onCopy: (text: string, message?: string) => void;
}

const ColorMatrix: FC<ColorMatrixProps> = ({
  backgroundsArray,
  foregroundsArray,
  standard,
  checkContrast,
  onCopy,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1, sm: 2 },
        overflowX: "auto",
        border: "1px solid rgba(255, 255, 255, 0.12)",
      }}
    >
      <Box sx={{ overflowX: "auto" }}>
        <Grid
          container
          direction="column"
          spacing={0.5}
          sx={{ minWidth: isSmall ? 600 : "auto" }}
        >
          <Grid container item spacing={0.5}>
            <Grid item sx={{ width: 80 }}>
              <Box
                sx={{
                  height: 60,
                  width: 80,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    transform: "rotate(-45deg)",
                    color: "text.secondary",
                    fontWeight: 500,
                  }}
                >
                  BG / FG
                </Typography>
              </Box>
            </Grid>
            {foregroundsArray.map((foreground, j) => (
              <Grid item key={`header-col-${j}`} xs>
                <Box
                  sx={{
                    height: 60,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 0.5,
                  }}
                >
                  <ColorSwatch
                    color={foreground}
                    label="Foreground Color"
                    onClick={() => onCopy(`#${foreground}`)}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    #{foreground}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          {backgroundsArray.map((background, i) => (
            <Grid container item spacing={0.5} key={`row-${i}`}>
              <Grid item sx={{ width: 80 }}>
                <Box
                  sx={{
                    height: 50,
                    width: 80,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  <ColorSwatch
                    color={background}
                    label="Background Color"
                    onClick={() => onCopy(`#${background}`)}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    #{background}
                  </Typography>
                </Box>
              </Grid>
              {foregroundsArray.map((foreground, j) => {
                const contrast = checkContrast(foreground, background);
                const passes = contrast >= standard.value;

                return (
                  <Grid item xs key={`col-${j}`}>
                    <Tooltip
                      title={
                        <>
                          <Typography variant="body2">
                            FG: #{foreground} / BG: #{background}
                          </Typography>
                          <Typography variant="body2">
                            {passes
                              ? `Passes ${standard.name} (≥ ${standard.value})`
                              : `Fails ${standard.name} (< ${standard.value})`}
                          </Typography>
                        </>
                      }
                      arrow
                    >
                      <Box
                        sx={{
                          backgroundColor: `#${background}`,
                          color: `#${foreground}`,
                          height: 50,
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 1,
                          opacity: passes ? 1 : 0.05,
                          cursor: "pointer",
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                        onClick={() =>
                          onCopy(
                            `Background: #${background}, Foreground: #${foreground}, Contrast: ${contrast}`
                          )
                        }
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.9rem",
                          }}
                        >
                          {contrast.toFixed(2)}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default ColorMatrix;
