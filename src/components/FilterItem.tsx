import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";

export default function FilterItem({ selected, availableItems, onChangeSelectedFilter }: any) {
  const [selectedItem, setSelectedItem] = useState<string>(selected);

  const handleSelectFilter = (event: SelectChangeEvent) => {
    setSelectedItem((prevState) => {
      onChangeSelectedFilter(prevState, event.target.value);
      return event.target.value;
    });
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <Select value={selectedItem} onChange={handleSelectFilter}>
        <MenuItem key={selectedItem} value={selectedItem}>
          {selectedItem}
        </MenuItem>
        {availableItems.map((item: string) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
