import { FC } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { StandardKey } from "../types";
import { standards } from "../utils/constants";

interface SidebarProps {
  backgrounds: string;
  setBackgrounds: (value: string) => void;
  foregrounds: string;
  setForegrounds: (value: string) => void;
  standardKey: StandardKey;
  setStandardKey: (value: StandardKey) => void;
  copy: boolean;
  setCopy: (value: boolean) => void;
  exportColors: () => void;
  importColors: () => void;
  isMobile: boolean;
  onClose?: () => void;
}

const Sidebar: FC<SidebarProps> = ({
  backgrounds,
  setBackgrounds,
  foregrounds,
  setForegrounds,
  standardKey,
  setStandardKey,
  copy,
  setCopy,
  exportColors,
  importColors,
  isMobile,
  onClose,
}) => {
  return (
    <Box
      sx={{
        width: isMobile ? "100%" : 320,
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems={"center"}
      >
        <Typography variant="h6">Settings</Typography>
        {isMobile && onClose && (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
      </Stack>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Accessibility Standard
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <Select
          value={standardKey}
          onChange={(e) => setStandardKey(e.target.value as StandardKey)}
          displayEmpty
          renderValue={(selected) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography>{standards[selected as StandardKey].name}</Typography>
              <Chip
                label={`≥ ${standards[selected as StandardKey].value}`}
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
          )}
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
        value={foregrounds}
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
        sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1 }}
      >
        <Tooltip title="Export colors">
          <Button
            sx={{ width: "100%" }}
            variant="outlined"
            onClick={exportColors}
            startIcon={<FileDownloadIcon />}
          >
            Export
          </Button>
        </Tooltip>
        <Tooltip title="Import colors">
          <Button
            sx={{ width: "100%" }}
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
};

export default Sidebar;
