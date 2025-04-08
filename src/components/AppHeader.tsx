import { FC } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ColorLens } from "@mui/icons-material";

interface AppHeaderProps {
  isMobile: boolean;
  onMenuClick: () => void;
}

const AppHeader: FC<AppHeaderProps> = ({ isMobile, onMenuClick }) => {
  return (
    <Stack
      direction={isMobile ? "row-reverse" : "row"}
      justifyContent={isMobile ? "space-between" : "flex-start"}
      alignItems="center"
      gap={1}
      sx={{ mb: 4 }}
    >
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={onMenuClick}
      >
        <MenuIcon />
      </IconButton>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "primary.main",
            borderRadius: "50%",
            width: 40,
            height: 40,
          }}
        >
          <ColorLens sx={{ color: "#fff" }} />
        </Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
          Contrast Matrix
        </Typography>
      </Stack>
    </Stack>
  );
};

export default AppHeader;
