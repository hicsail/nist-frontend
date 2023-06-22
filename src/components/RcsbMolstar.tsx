import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Plugin, S3Object, useS3Context } from '@bu-sail/s3-viewer';
import { Viewer } from '@rcsb/rcsb-molstar/build/src/viewer/index';
import { createPortal } from 'react-dom';
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

export class RcsbMolstarPlugin implements Plugin {
  name: string;
  description: string;
  fileExtensions: string[];

  constructor() {
    this.name = 'Molestar PDB Viewer';
    this.description = 'Protein Databank file viewer';
    this.fileExtensions = ['pdb', 'ent', 'brk'];
  }

  getView(object: S3Object): ReactNode {
    return <MolstarWrapper object={object} />;
  }
}

/** Wrapper that provides an iframe for the molstar view */
const MolstarWrapper: FC<{ object: S3Object }> = ({ object }) => {
  // Handle the logic to embed the view in an iframe
  const node = useRef<HTMLIFrameElement>(null);
  const [doc, setDoc] = useState<Document | null>();

  useEffect(() => {
    // Add in style to iframe
    if (!node) {
      return;
    }
    const styleLink = document.createElement('link');
    styleLink.href = '/src/assets/rcsb-molstar.css';
    styleLink.rel = 'stylesheet';
    styleLink.type = 'text/css';

    const iframeHead = node.current?.contentWindow?.document.head;
    if (iframeHead) {
      iframeHead.appendChild(styleLink);
    }

    setDoc(node.current?.contentDocument);
  }, []);

  const { bucket, getSignedUrl } = useS3Context();
  const [url, setUrl] = useState<string | null>(null);

  const loadPDB = async () => {
    setUrl(await getSignedUrl(bucket, object.$raw.Key, 360));
  };

  useEffect(() => {
    loadPDB();
  }, []);

  // Wrap the protein view in an iframe since the view is not provided
  // as a typical React node.
  return (
    <Paper sx={style}>
      <Typography variant="h6" sx={{ m: 0, p: 2 }}>
        {'RCSB PDB Mol* Viewer'}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <div style={{ flexGrow: 1 }}>
        <iframe ref={node} style={{ width: '100%', height: '100%' }}>
          {node && doc && url && createPortal(<Molstar url={url} />, doc.body)}
        </iframe>
      </div>
    </Paper>
  );
};


/** Provides the internal view that is modified by the RCSB code */
const Molstar: FC<{ url: string }> = ({ url }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const viewer = new Viewer(ref.current, {
      showImportControls: false,
      showSessionControls: true,
      layoutShowLog: true,
      layoutShowControls: true,
      showMembraneOrientationPreset: true,
      showNakbColorTheme: true,
      detachedFromSierra: true
    });

    viewer.loadStructureFromUrl(url, 'pdb', false);
  }, [ref]);

  return <div id={'viewer'} ref={ref} />;
};
