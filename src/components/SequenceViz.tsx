import { Box, Divider, IconButton, Paper, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SeqViz from "seqviz";
import seqparse from "seqparse";
import file from "../assets/file";
import { useEffect, useState } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  height: '90%',
  bgcolor: 'background.paper',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  p: 4,
};

type SequenceVizProps = {
  title: string,
  onClose: () => void,
  size?: { width: string, height: string },
}

export default function SequenceViz(props: SequenceVizProps) {
  const { title, onClose, size } = props;
  const [ sequence, setSequence ] = useState<any>();

  useEffect(() => {
    seqparse(file).then((seq) => setSequence(seq));
  }, []);

  if (size) {
    style.width = size.width;
    style.height = size.height;
  }

  return (
    <Paper sx={style}>
      <Typography variant="h6" sx={{ m: 0, p: 2 }} >
        {title}
        <IconButton onClick={onClose} aria-label="close" sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </Typography>
      <Divider sx={{ my: 2 }} />
      <div style={{ flexGrow: 1 }} >
        <SeqViz
          name={sequence?.name}
          seq={sequence?.seq}
          annotations={sequence?.annotations}
        />
      </div>
    </Paper>
  );
}
