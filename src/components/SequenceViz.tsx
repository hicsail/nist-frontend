import SeqViz from 'seqviz';
import seqparse, { Seq } from 'seqparse';
import { useEffect, useState } from 'react';
import { Plugin } from '@bu-sail/s3-viewer';
import { S3Object, useS3Context } from '@bu-sail/s3-viewer';
import { FC, ReactNode } from 'react';
import { Paper, Typography, Divider } from '@mui/material';

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
  p: 4
};

export class SeqVizPlugin implements Plugin {
  name: string;
  description: string;
  fileExtensions: string[];

  constructor() {
    this.name = 'SeqViz';
    this.description = 'DNA and RNA visualization';
    this.fileExtensions = ['dna', 'fasta', 'gb'];
  }

  getView(object: S3Object): ReactNode {
    return <SeqVizWrapper object={object} />;
  }
}

const SeqVizWrapper: FC<{ object: S3Object }> = ({ object }) => {
  const { bucket, getSignedUrl } = useS3Context();
  const [sequence, setSequence] = useState<Seq | null>();

  const loadSequence = async () => {
    // Get the sequence string from the file
    const url = await getSignedUrl(bucket, object.$raw.Key, 60);
    const fileContents = await fetch(url);
    const fileString = await fileContents.text();

    // Parse and update the sequence
    const seq = await seqparse(fileString);
    setSequence(seq);
  };

  useEffect(() => {
    loadSequence();
  }, []);

  return (
    <Paper sx={style}>
      <Typography variant="h6" sx={{ m: 0, p: 2 }}>
        {'SeqViz'}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <div style={{ flexGrow: 1 }}>
        <SeqViz name={sequence?.name} seq={sequence?.seq} annotations={sequence?.annotations} />
      </div>
    </Paper>
  );
};
