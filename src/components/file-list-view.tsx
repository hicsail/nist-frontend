import {
  Paper,
  TableContainer,
  TableHead,
  TableCell,
  TableRow
} from '@mui/material';
import { FC } from 'react';

export const FileListView: FC = () => {
  return (
    <TableContainer component={Paper}>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Created Date</TableCell>
          <TableCell>Size</TableCell>
        </TableRow>
      </TableHead>
    </TableContainer>
  );
}
