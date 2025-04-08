import { FC } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { SortOption } from "../../types";

interface SortControlsProps {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  isSmall: boolean;
}

const SortControls: FC<SortControlsProps> = ({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  isSmall,
}) => {
  return (
    <Stack direction="row" spacing={1} sx={{ mt: isSmall ? 2 : 0 }}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="sort-by-label">Sort by</InputLabel>
        <Select
          labelId="sort-by-label"
          value={sortBy}
          label="Sort by"
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <MenuItem value="contrast">Contrast</MenuItem>
          <MenuItem value="background">Background</MenuItem>
          <MenuItem value="foreground">Foreground</MenuItem>
        </Select>
      </FormControl>

      <Tooltip
        title={sortOrder === "asc" ? "Sort Ascending" : "Sort Descending"}
      >
        <Button
          variant="outlined"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          sx={{ minWidth: 0, px: 1 }}
        >
          {sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
        </Button>
      </Tooltip>
    </Stack>
  );
};

export default SortControls;
