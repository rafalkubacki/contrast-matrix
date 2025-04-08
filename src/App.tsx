import { useState } from "react";
import { checkContrast, expandShortHex } from "./utils";
import { standards } from "./constants";
import {
  Box,
  Container,
  FormControlLabel,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

type StandardKey = keyof typeof standards;

function App() {
  const [backgrounds, setBackgrounds] = useState<string>("");
  const [foregrounds, setForegrounds] = useState<string>("");
  const [standardKey, setStandardKey] = useState<StandardKey>("aa");
  const standard = standards[standardKey];
  const [copy, setCopy] = useState(true);

  const computedForegrounds = copy ? backgrounds : foregrounds;

  const processColorStrings = (input: string) => {
    return input
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map((s) => {
        const color = s.startsWith("#") ? s.substring(1) : s;
        return /^([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color) ? color : null;
      })
      .filter((s): s is string => s !== null)
      .map(expandShortHex);
  };

  const backgroundsArray = processColorStrings(backgrounds);
  const foregroundsArray = processColorStrings(computedForegrounds);

  const matchingPairs = [];
  for (const bg of backgroundsArray) {
    for (const fg of foregroundsArray) {
      const contrast = checkContrast(fg, bg);
      if (contrast >= standard.value) {
        matchingPairs.push({
          background: bg,
          foreground: fg,
          contrast: contrast,
        });
      }
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Stack
          spacing={2}
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: "100vh", pb: 4 }}
        >
          <Typography variant="h2" component="h1">
            Contrast Matrix
          </Typography>
          <ToggleButtonGroup
            color="primary"
            value={standardKey}
            exclusive
            onChange={(_, value) => setStandardKey(value)}
            aria-label="text alignment"
          >
            {Object.keys(standards).map((key) => (
              <ToggleButton key={`standard-${key}`} value={key}>
                <Tooltip
                  title={standards[key as StandardKey].description}
                  arrow
                >
                  <span>{standards[key as StandardKey].name}</span>
                </Tooltip>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Stack spacing={2} direction="row">
            <TextField
              id="backgrounds-textarea"
              label="Backgrounds"
              placeholder="One per line e.g. #ffffff or #fff"
              multiline
              maxRows={10}
              value={backgrounds}
              onChange={(e) => setBackgrounds(e.target.value)}
            />
            <TextField
              id="foregrounds-textarea"
              label="Foregrounds"
              placeholder="One per line e.g. #ffffff or #fff"
              multiline
              maxRows={10}
              value={computedForegrounds}
              InputProps={{
                readOnly: copy,
              }}
              onChange={(e) => setForegrounds(e.target.value)}
            />
          </Stack>
          <FormControlLabel
            control={<Switch checked={copy} onChange={() => setCopy(!copy)} />}
            label="Copy backgrounds to foregrounds"
          />
          {backgroundsArray.length > 0 && foregroundsArray.length > 0 ? (
            <Stack spacing={3} width="100%">
              <Paper elevation={3} sx={{ padding: "1rem" }}>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="stretch"
                  spacing={0.5}
                >
                  <Grid container direction="row" item spacing={0.5}>
                    <Grid item sx={{ width: 80 }}>
                      <Box
                        sx={{
                          minHeight: 50,
                          minWidth: 80,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1">BG / FG</Typography>
                      </Box>
                    </Grid>
                    {foregroundsArray.map((foreground, j) => (
                      <Grid item key={`header-col-${j}`} xs>
                        <Box
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.1)",
                            minHeight: 50,
                            minWidth: 80,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="caption">
                            #{foreground}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  {backgroundsArray.map((background, i) => (
                    <Grid
                      container
                      direction="row"
                      item
                      spacing={0.5}
                      key={`row-${i}`}
                    >
                      <Grid item sx={{ width: 80 }}>
                        <Box
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.1)",
                            minHeight: 50,
                            minWidth: 80,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="caption">
                            #{background}
                          </Typography>
                        </Box>
                      </Grid>
                      {foregroundsArray.map((foreground, j) => (
                        <Grid item xs key={`col-${j}`}>
                          <Box
                            sx={{
                              backgroundColor: `#${background}`,
                              color: `#${foreground}`,
                              textAlign: "center",
                              position: "relative",
                              opacity:
                                checkContrast(foreground, background) >=
                                standard.value
                                  ? 1
                                  : 0.05,
                              filter:
                                checkContrast(foreground, background) >=
                                standard.value
                                  ? "none"
                                  : "grayscale(1)",
                            }}
                          >
                            <Box
                              sx={{
                                minHeight: 50,
                                minWidth: 80,
                                padding: 0.5,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                              }}
                            >
                              <Tooltip
                                title={`FG: #${foreground}\nBG: #${background}`}
                                arrow
                              >
                                <Typography variant="h6">
                                  {checkContrast(foreground, background)}
                                </Typography>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ))}
                </Grid>
              </Paper>
              <Paper elevation={3} sx={{ padding: "1rem" }}>
                <Typography variant="h6" gutterBottom>
                  Color pairs meeting {standard.name} standard (ratio ≥{" "}
                  {standard.value})
                </Typography>
                {matchingPairs.length > 0 ? (
                  <List dense>
                    <Box>
                      <ListItem>
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          width="100%"
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold", width: "200px" }}
                          >
                            Background
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold", width: "200px" }}
                          >
                            Foreground
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold", width: "100px" }}
                          >
                            Ratio
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold", width: "400px" }}
                          >
                            Sample
                          </Typography>
                        </Stack>
                      </ListItem>
                    </Box>
                    {matchingPairs.map((pair, index) => (
                      <Box key={`pair-${index}`}>
                        {index > 0 && <Divider />}
                        <ListItem>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            width="100%"
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "200px",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  backgroundColor: `#${pair.background}`,
                                  border: "1px solid rgba(255,255,255,0.3)",
                                  borderRadius: "4px",
                                  mr: 1,
                                }}
                              />
                              <Typography variant="body1">
                                #{pair.background}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "200px",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  backgroundColor: `#${pair.foreground}`,
                                  border: "1px solid rgba(255,255,255,0.3)",
                                  borderRadius: "4px",
                                  mr: 1,
                                }}
                              />
                              <Typography variant="body1">
                                #{pair.foreground}
                              </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ width: "100px" }}>
                              {pair.contrast}
                            </Typography>
                            <Box
                              sx={{
                                backgroundColor: `#${pair.background}`,
                                color: `#${pair.foreground}`,
                                padding: "4px 8px",
                                borderRadius: "4px",
                                width: "400px",
                                textAlign: "center",
                              }}
                            >
                              <Typography variant="body1">
                                The quick brown fox jumps over the lazy dog
                              </Typography>
                            </Box>
                          </Stack>
                        </ListItem>
                      </Box>
                    ))}
                  </List>
                ) : (
                  <Typography>
                    No color pairs meet the selected contrast standard.
                  </Typography>
                )}
              </Paper>
            </Stack>
          ) : (
            <Skeleton variant="rectangular" width={420} height={270} />
          )}
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;
