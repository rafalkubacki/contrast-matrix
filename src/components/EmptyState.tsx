import { FC } from "react";
import { Button, Paper, Typography } from "@mui/material";

interface EmptyStateProps {
  isMobile: boolean;
  onOpenSettings: () => void;
}

const EmptyState: FC<EmptyStateProps> = ({ isMobile, onOpenSettings }) => {
  return (
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
        Add background and foreground colors in the sidebar settings menu.
        <br />
        Format: #000000 or #000 (one per line)
      </Typography>
      {isMobile && (
        <Button variant="contained" onClick={onOpenSettings} sx={{ mt: 2 }}>
          Open Settings
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;
