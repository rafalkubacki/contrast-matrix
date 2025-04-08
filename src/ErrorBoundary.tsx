import { Component, ErrorInfo, ReactNode } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
            padding: 2,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              maxWidth: 600,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom color="error">
              Something went wrong
            </Typography>
            <Typography variant="body1" paragraph>
              We're sorry, but the application has encountered an unexpected
              error.
            </Typography>
            {this.state.error && (
              <Typography
                variant="body2"
                component="pre"
                sx={{
                  textAlign: "left",
                  bgcolor: "rgba(0,0,0,0.1)",
                  p: 2,
                  borderRadius: 1,
                  overflow: "auto",
                  maxHeight: "200px",
                }}
              >
                {this.state.error.toString()}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              sx={{ mt: 2 }}
            >
              Reload Application
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
