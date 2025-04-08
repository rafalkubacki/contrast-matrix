import { useState, useMemo, useCallback } from "react";
import {
  Box,
  Drawer,
  Snackbar,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { standards } from "./utils/constants";
import { AppThemeProvider } from "./providers/ThemeProvider";
import ErrorBoundary from "./ErrorBoundary";
import { ColorPair, SortOption, StandardKey } from "./types";
import { processColorStrings, checkContrast } from "./utils/colorUtils";
import { useClipboard } from "./hooks/useClipboard";
import Sidebar from "./components/Sidebar";
import ColorMatrix from "./components/ColorMatrix";
import ColorPairsList from "./components/ColorPairsList";
import EmptyState from "./components/EmptyState";
import AppHeader from "./components/AppHeader";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [backgrounds, setBackgrounds] = useState<string>("");
  const [foregrounds, setForegrounds] = useState<string>("");
  const [standardKey, setStandardKey] = useState<StandardKey>("aa");
  const [copy, setCopy] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("contrast");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);

  const standard = standards[standardKey];
  const computedForegrounds = copy ? backgrounds : foregrounds;

  const { copyToClipboard, notificationMessage } = useClipboard();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const backgroundsArray = useMemo(
    () => processColorStrings(backgrounds),
    [backgrounds]
  );

  const foregroundsArray = useMemo(
    () => processColorStrings(computedForegrounds),
    [computedForegrounds]
  );

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
            copyToClipboard("", "Invalid file format!");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [copyToClipboard]);

  const hasColors = backgroundsArray.length > 0 && foregroundsArray.length > 0;

  return (
    <AppThemeProvider>
      <ErrorBoundary>
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          {isMobile ? (
            <Drawer
              variant="temporary"
              open={drawerOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
            >
              <Sidebar
                backgrounds={backgrounds}
                setBackgrounds={setBackgrounds}
                foregrounds={computedForegrounds}
                setForegrounds={setForegrounds}
                standardKey={standardKey}
                setStandardKey={setStandardKey}
                copy={copy}
                setCopy={setCopy}
                exportColors={exportColors}
                importColors={importColors}
                isMobile={isMobile}
                onClose={handleDrawerToggle}
              />
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
              <Sidebar
                backgrounds={backgrounds}
                setBackgrounds={setBackgrounds}
                foregrounds={computedForegrounds}
                setForegrounds={setForegrounds}
                standardKey={standardKey}
                setStandardKey={setStandardKey}
                copy={copy}
                setCopy={setCopy}
                exportColors={exportColors}
                importColors={importColors}
                isMobile={false}
              />
            </Drawer>
          )}
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
            <AppHeader isMobile={isMobile} onMenuClick={handleDrawerToggle} />
            <Snackbar
              open={!!notificationMessage.text}
              message={notificationMessage.text}
              autoHideDuration={2000}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />
            {hasColors ? (
              <Stack spacing={4}>
                <ColorMatrix
                  backgroundsArray={backgroundsArray}
                  foregroundsArray={foregroundsArray}
                  standard={standard}
                  checkContrast={checkContrast}
                  onCopy={copyToClipboard}
                />
                <ColorPairsList
                  matchingPairs={matchingPairs}
                  standard={standard}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  onCopy={copyToClipboard}
                />
              </Stack>
            ) : (
              <EmptyState
                isMobile={isMobile}
                onOpenSettings={handleDrawerToggle}
              />
            )}
          </Box>
        </Box>
      </ErrorBoundary>
    </AppThemeProvider>
  );
}

export default App;
