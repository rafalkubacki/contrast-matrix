import { FC } from "react";
import { Stack, Typography } from "@mui/material";
import ColorSwatch from "./ColorSwatch";

interface CopyableColorItemProps {
  color: string;
  onCopy: (color: string) => void;
  width?: string | number;
}

const CopyableColorItem: FC<CopyableColorItemProps> = ({
  color,
  onCopy,
  width = "100%",
}) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      width={width}
      sx={{
        cursor: "pointer",
        "&:hover": {
          "& .color-code": {
            color: "primary.main",
          },
        },
      }}
      onClick={() => onCopy(`#${color}`)}
    >
      <ColorSwatch color={color} label={`Copy #${color}`} size={16} />
      <Typography
        variant="body2"
        className="color-code"
        sx={{ transition: "color 0.2s" }}
      >
        #{color}
      </Typography>
    </Stack>
  );
};

export default CopyableColorItem;
