import { FC } from "react";
import {
  Box,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

interface ColorInputPanelProps {
  backgroundColors: string;
  onBackgroundChange: (value: string) => void;
  foregroundColors: string;
  onForegroundChange: (value: string) => void;
  copyMode: boolean;
  onCopyModeChange: (value: boolean) => void;
}

const ColorInputPanel: FC<ColorInputPanelProps> = ({
  backgroundColors,
  onBackgroundChange,
  foregroundColors,
  onForegroundChange,
  copyMode,
  onCopyModeChange,
}) => {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Background Colors
      </Typography>
      <TextField
        placeholder="One per line e.g. #ffffff or #fff"
        multiline
        minRows={5}
        maxRows={10}
        value={backgroundColors}
        onChange={(e) => onBackgroundChange(e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Foreground Colors
      </Typography>
      <TextField
        placeholder="One per line e.g. #ffffff or #fff"
        multiline
        minRows={5}
        maxRows={10}
        value={foregroundColors}
        InputProps={{
          readOnly: copyMode,
        }}
        onChange={(e) => onForegroundChange(e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={copyMode}
            onChange={() => onCopyModeChange(!copyMode)}
            color="primary"
          />
        }
        label="Use same colors for both"
        sx={{ mb: 1 }}
      />
    </Box>
  );
};

export default ColorInputPanel;
