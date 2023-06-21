import { FC, ReactNode, useEffect } from 'react';
import { Plugin, S3Object, useS3Context } from '@bu-sail/s3-viewer';
import { Viewer } from '@rcsb/rcsb-molstar/build/src/viewer/index';

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
  const { bucket, getSignedUrl } = useS3Context();

  const loadPDB = async () => {
    const url = await getSignedUrl(bucket, object.$raw.Key, 120);
    console.log(url);
    const viewer = new Viewer('viewer', {
      showImportControls: true,
      showSessionControls: true,
      layoutShowLog: true,
      layoutShowControls: true,
      showMembraneOrientationPreset: true,
      showNakbColorTheme: true,
      detachedFromSierra: true, // needed when running without sierra
    });

    viewer.loadStructureFromUrl(url, 'pdb', false);
  };

  useEffect(() => {
    console.log('here');
    loadPDB();
  }, []);

  return (
    <div id="viewer">
    </div>
  );
};
