import { ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface AppThemeProviderProps {
  children: ReactNode;
}

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4285F4",
    },
    secondary: {
      main: "#34A853",
    },
    error: {
      main: "#EA4335",
    },
    warning: {
      main: "#FBBC05",
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

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
