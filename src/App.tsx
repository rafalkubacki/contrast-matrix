import { useState, useMemo, useCallback } from "react";
import { checkContrast, expandShortHex } from "./utils";
import { standards } from "./constants";
import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ErrorBoundary from "./ErrorBoundary";
import { ColorPair, SortOption } from "./types";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4285F4", // Google blue
    },
    secondary: {
      main: "#34A853", // Google green
    },
    error: {
      main: "#EA4335", // Google red
    },
    warning: {
      main: "#FBBC05", // Google yellow
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      "Roboto",
      "Segoe UI",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

type StandardKey = keyof typeof standards;

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [backgrounds, setBackgrounds] = useState<string>("");
  const [foregrounds, setForegrounds] = useState<string>("");
  const [standardKey, setStandardKey] = useState<StandardKey>("aa");
  const [copy, setCopy] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("contrast");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);

  const standard = standards[standardKey];
  const computedForegrounds = copy ? backgrounds : foregrounds;

  // Handle drawer open/close based on screen size
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Process input color strings and handle validation
  const processColorStrings = useCallback((input: string) => {
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
  }, []);

  // Memoize processed color arrays
  const backgroundsArray = useMemo(
    () => processColorStrings(backgrounds),
    [backgrounds, processColorStrings]
  );

  const foregroundsArray = useMemo(
    () => processColorStrings(computedForegrounds),
    [computedForegrounds, processColorStrings]
  );

  // Memoize matching pairs
  const matchingPairs = useMemo(() => {
    const pairs: ColorPair[] = [];
    for (const bg of backgroundsArray) {
      for (const fg of foregroundsArray) {
        const contrast = checkContrast(fg, bg);
        if (contrast >= standard.value) {
          pairs.push({
            background: bg,
            foreground: fg,
            contrast: contrast,
          });
        }
      }
    }

    // Sort the pairs based on user selection
    return [...pairs].sort((a, b) => {
      let comparison = 0;

      if (sortBy === "contrast") {
        comparison = a.contrast - b.contrast;
      } else if (sortBy === "background") {
        comparison = a.background.localeCompare(b.background);
      } else if (sortBy === "foreground") {
        comparison = a.foreground.localeCompare(b.foreground);
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });
  }, [backgroundsArray, foregroundsArray, standard.value, sortBy, sortOrder]);

  const handleCopyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setNotificationMessage("Copied to clipboard!");
        setTimeout(() => setNotificationMessage(""), 2000);
      },
      () => {
        setNotificationMessage("Failed to copy!");
        setTimeout(() => setNotificationMessage(""), 2000);
      }
    );
  }, []);

  const exportColors = useCallback(() => {
    const data = {
      backgrounds: backgrounds,
      foregrounds: copy ? "" : foregrounds,
      standardKey,
      copy,
    };

    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contrast-matrix-colors.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [backgrounds, foregrounds, standardKey, copy]);

  const importColors = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            setBackgrounds(data.backgrounds || "");
            setForegrounds(data.foregrounds || "");
            setStandardKey(data.standardKey || "aa");
            setCopy(data.copy !== undefined ? data.copy : true);
          } catch (error) {
            setNotificationMessage("Invalid file format!");
            setTimeout(() => setNotificationMessage(""), 2000);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  // Sidebar content
  const drawerContent = (
    <Box
      sx={{
        width: isMobile ? "100%" : 320,
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isMobile && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      <Typography variant="h6" gutterBottom>
        Settings
      </Typography>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Accessibility Standard
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <InputLabel id="standard-select-label">Standard</InputLabel>
        <Select
          labelId="standard-select-label"
          value={standardKey}
          label="Standard"
          onChange={(e) => setStandardKey(e.target.value as StandardKey)}
        >
          {Object.keys(standards).map((key) => (
            <MenuItem
              key={`standard-${key}`}
              value={key}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography>{standards[key as StandardKey].name}</Typography>
              <Chip
                label={`≥ ${standards[key as StandardKey].value}`}
                size="small"
                sx={{ ml: 1 }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Background Colors
      </Typography>
      <TextField
        id="backgrounds-textarea"
        placeholder="One per line e.g. #ffffff or #fff"
        multiline
        minRows={5}
        maxRows={10}
        value={backgrounds}
        onChange={(e) => setBackgrounds(e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Foreground Colors
      </Typography>
      <TextField
        id="foregrounds-textarea"
        placeholder="One per line e.g. #ffffff or #fff"
        multiline
        minRows={5}
        maxRows={10}
        value={computedForegrounds}
        InputProps={{
          readOnly: copy,
        }}
        onChange={(e) => setForegrounds(e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={copy}
            onChange={() => setCopy(!copy)}
            color="primary"
          />
        }
        label="Use same colors for both"
        sx={{ mb: 3 }}
      />

      <Box
        sx={{ mt: "auto", display: "flex", justifyContent: "space-between" }}
      >
        <Tooltip title="Export colors">
          <Button
            variant="outlined"
            onClick={exportColors}
            startIcon={<FileDownloadIcon />}
          >
            Export
          </Button>
        </Tooltip>
        <Tooltip title="Import colors">
          <Button
            variant="outlined"
            onClick={importColors}
            startIcon={<FileUploadIcon />}
          >
            Import
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          {/* Sidebar Drawer */}
          {isMobile ? (
            <Drawer
              variant="temporary"
              open={drawerOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better mobile performance
              }}
            >
              {drawerContent}
            </Drawer>
          ) : (
            <Drawer
              variant="persistent"
              open={drawerOpen}
              sx={{
                width: drawerOpen ? 320 : 0,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: 320,
                  boxSizing: "border-box",
                  borderRight: "1px solid rgba(255, 255, 255, 0.12)",
                  boxShadow: "none",
                },
              }}
            >
              {drawerContent}
            </Drawer>
          )}

          {/* Main content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 3 },
              width: {
                xs: "100%",
                sm: `calc(100% - ${drawerOpen ? 320 : 0}px)`,
              },
              transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }}
          >
            <Stack direction="row" alignItems="center" sx={{ mb: 4 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                edge="start"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
                Contrast Matrix
              </Typography>
            </Stack>

            {/* Notification */}
            <Snackbar
              open={!!notificationMessage}
              message={notificationMessage}
              autoHideDuration={2000}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />

            {backgroundsArray.length > 0 && foregroundsArray.length > 0 ? (
              <Stack spacing={4}>
                {/* Color Matrix */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 1, sm: 2 },
                    overflowX: "auto",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        position: "absolute",
                        top: -28,
                        right: 0,
                        color: "text.secondary",
                      }}
                    >
                      {standard.name} standard (≥ {standard.value})
                    </Typography>

                    <Box sx={{ overflowX: "auto" }}>
                      <Grid
                        container
                        direction="column"
                        spacing={0.5}
                        sx={{ minWidth: isSmall ? 600 : "auto" }}
                      >
                        {/* Header Row - Foreground Colors */}
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
                                  width: 80,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,0.1)",
                                  flexDirection: "column",
                                  gap: 0.5,
                                }}
                              >
                                <Tooltip title="Foreground Color">
                                  <Box
                                    sx={{
                                      width: 20,
                                      height: 20,
                                      backgroundColor: `#${foreground}`,
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                      transition: "0.2s",
                                      "&:hover": {
                                        transform: "scale(1.2)",
                                      },
                                    }}
                                    onClick={() =>
                                      handleCopyToClipboard(`#${foreground}`)
                                    }
                                  />
                                </Tooltip>
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

                        {/* Matrix Rows */}
                        {backgroundsArray.map((background, i) => (
                          <Grid container item spacing={0.5} key={`row-${i}`}>
                            {/* Background Color Cell */}
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
                                <Tooltip title="Background Color">
                                  <Box
                                    sx={{
                                      width: 20,
                                      height: 20,
                                      backgroundColor: `#${background}`,
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                      transition: "0.2s",
                                      "&:hover": {
                                        transform: "scale(1.2)",
                                      },
                                    }}
                                    onClick={() =>
                                      handleCopyToClipboard(`#${background}`)
                                    }
                                  />
                                </Tooltip>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "text.secondary" }}
                                >
                                  #{background}
                                </Typography>
                              </Box>
                            </Grid>

                            {/* Matrix Cells */}
                            {foregroundsArray.map((foreground, j) => {
                              const contrast = checkContrast(
                                foreground,
                                background
                              );
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
                                        opacity: passes ? 1 : 0.15,
                                        cursor: "pointer",
                                        transition: "transform 0.2s",
                                        "&:hover": {
                                          transform: "scale(1.05)",
                                        },
                                        border: passes
                                          ? "1px solid rgba(52, 168, 83, 0.5)"
                                          : "1px solid rgba(234, 67, 53, 0.5)",
                                      }}
                                      onClick={() =>
                                        handleCopyToClipboard(
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
                  </Box>
                </Paper>

                {/* List of matching color pairs */}
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
                        <Typography variant="h6">
                          Compatible Color Pairs
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {matchingPairs.length} pairs meeting {standard.name}{" "}
                          standard (≥ {standard.value})
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: isSmall ? 2 : 0 }}
                      >
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel id="sort-by-label">Sort by</InputLabel>
                          <Select
                            labelId="sort-by-label"
                            value={sortBy}
                            label="Sort by"
                            onChange={(e) =>
                              setSortBy(e.target.value as SortOption)
                            }
                          >
                            <MenuItem value="contrast">Contrast</MenuItem>
                            <MenuItem value="background">Background</MenuItem>
                            <MenuItem value="foreground">Foreground</MenuItem>
                          </Select>
                        </FormControl>

                        <Tooltip
                          title={
                            sortOrder === "asc"
                              ? "Sort Ascending"
                              : "Sort Descending"
                          }
                        >
                          <Button
                            variant="outlined"
                            onClick={() =>
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                            }
                            sx={{ minWidth: 0, px: 1 }}
                          >
                            {sortOrder === "asc" ? (
                              <ArrowUpwardIcon />
                            ) : (
                              <ArrowDownwardIcon />
                            )}
                          </Button>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Box>

                  <Divider />

                  {matchingPairs.length > 0 ? (
                    <>
                      <Box sx={{ maxHeight: "400px", overflow: "auto" }}>
                        <List disablePadding>
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
                                handleCopyToClipboard(
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
                                {/* Color Preview */}
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
                                  <Typography variant="body1">
                                    Sample Text Aa
                                  </Typography>
                                </Box>

                                {/* Color Details */}
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
                                        border:
                                          "1px solid rgba(255,255,255,0.3)",
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
                                        border:
                                          "1px solid rgba(255,255,255,0.3)",
                                      }}
                                    />
                                    <Typography variant="body2">
                                      #{pair.foreground}
                                    </Typography>
                                  </Stack>

                                  <Chip
                                    label={pair.contrast.toFixed(2)}
                                    size="small"
                                    color="primary"
                                    sx={{
                                      width: isSmall ? "auto" : "20%",
                                      mt: isSmall ? 1 : 0,
                                    }}
                                  />
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
                            handleCopyToClipboard(pairsText);
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
              </Stack>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 3,
                  mt: 4,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Enter colors to start
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Add background and foreground colors in the sidebar
                  <br />
                  Format: #000000 or #000 (one per line)
                </Typography>
                {isMobile && (
                  <Button
                    variant="contained"
                    onClick={handleDrawerToggle}
                    sx={{ mt: 2 }}
                  >
                    Open Settings
                  </Button>
                )}
              </Paper>
            )}
          </Box>
        </Box>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
