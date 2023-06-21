import { FC, LegacyRef, ReactNode, useEffect, useRef, useState } from 'react';
import { Plugin, S3Object, useS3Context } from '@bu-sail/s3-viewer';
import { Viewer } from '@rcsb/rcsb-molstar/build/src/viewer/index';
import { createPortal } from 'react-dom';

export class RcsbMolestarPlugin implements Plugin {
  name: string;
  description: string;
  fileExtensions: string[];

  constructor() {
    this.name = 'Molestar PDB Viewer';
    this.description = 'Protein Databank file viewer';
    this.fileExtensions = ['pdb', 'ent', 'brk'];
  }

  getView(object: S3Object): ReactNode {
    return <MolestarWrapper object={object} />;
  }
}

const MolestarWrapper: FC<{ object: S3Object }> = ({ object }) => {
  const node = useRef<HTMLIFrameElement>(null);
  const [doc, setDoc] = useState<Document | null>();

  useEffect(() => {
    setDoc(node.current?.contentDocument);
  }, []);

  const { bucket, getSignedUrl } = useS3Context();
  const [url, setUrl] = useState<string | null>(null);


  const loadPDB = async () => {
    setUrl(await getSignedUrl(bucket, object.$raw.Key, 120));
  };

  useEffect(() => {
    console.log('here');
    loadPDB();
  }, []);

  return (
    <iframe ref={node}>
      {node && doc && url && createPortal(<Molestar url={url}/>, doc.body)}
    </iframe>
  );
};

const Molestar: FC<{ url: string }> = ({ url }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) { return; }

    const viewer = new Viewer(ref.current, {
      showImportControls: true,
      showSessionControls: true,
      layoutShowLog: true,
      layoutShowControls: true,
      showMembraneOrientationPreset: true,
      showNakbColorTheme: true,
      detachedFromSierra: true, // needed when running without sierra
    });

    viewer.loadStructureFromUrl(url, 'pdb', false);
  }, [ref]);

  return (
    <div id={'viewer'} ref={ref}>
      <p>hello</p>
    </div>
  )
};
