import { useState } from "react";
import { addLeadingHash, checkContrast } from "./utils";
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
  const backgroundsArray = backgrounds
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s !== "" && s.length === 7);
  const foregroundsArray = computedForegrounds
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s !== "" && s.length === 7);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Stack
          spacing={2}
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: "100vh" }}
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
              placeholder="One per line e.g. #ffffff"
              multiline
              maxRows={10}
              value={backgrounds}
              onChange={(e) => setBackgrounds(e.target.value)}
            />
            <TextField
              id="foregrounds-textarea"
              label="Foregrounds"
              placeholder="One per line e.g. #ffffff"
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
            <Paper elevation={3} sx={{ padding: "1rem" }}>
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="stretch"
                spacing={0.5}
                columns={backgrounds.length}
              >
                {backgroundsArray.map((background, i) => (
                  <Grid
                    container
                    direction="row"
                    item
                    xs
                    spacing={0.5}
                    columns={foregrounds.length}
                    key={`row-${i}`}
                  >
                    {foregroundsArray.map((foreground, j) => (
                      <Grid item xs key={`col-${j}`}>
                        <Box
                          key={j}
                          sx={{
                            backgroundColor: addLeadingHash(background),
                            color: addLeadingHash(foreground),

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
                              title={`${foreground}\n${background}`}
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
          ) : (
            <Skeleton variant="rectangular" width={420} height={270} />
          )}
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;
