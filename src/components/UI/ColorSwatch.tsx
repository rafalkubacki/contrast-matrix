import { FC } from "react";
import { Box, Tooltip } from "@mui/material";

interface ColorSwatchProps {
  color: string;
  label: string;
  onClick?: () => void;
  size?: number;
}

const ColorSwatch: FC<ColorSwatchProps> = ({
  color,
  label,
  onClick,
  size = 20,
}) => {
  return (
    <Tooltip title={label}>
      <Box
        sx={{
          width: size,
          height: size,
          backgroundColor: `#${color}`,
          borderRadius: "4px",
          cursor: onClick ? "pointer" : "default",
          transition: "0.2s",
          "&:hover": onClick
            ? {
                transform: "scale(1.2)",
              }
            : {},
        }}
        onClick={onClick}
      />
    </Tooltip>
  );
};

export default ColorSwatch;
