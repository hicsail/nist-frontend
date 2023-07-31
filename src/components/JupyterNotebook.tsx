import { FC, ReactNode, useEffect, useState } from 'react';
import { Plugin, S3Object, useS3Context } from '@bu-sail/s3-viewer';

export class JupyterNotebookPlugin implements Plugin {
  name: string;
  description: string;
  fileExtensions: string[];

  constructor() {
    this.name = 'Jupyter Notebook';
    this.description = 'View and run Jupyter Notebooks';
    this.fileExtensions = ['ipynb'];
  }

  getView(object: S3Object): ReactNode {
    return <JupterNotebookView object={object} />;
  }
}

const JupterNotebookView: FC<{ object: S3Object }> = ({ object }) => {
  const { bucket, getSignedUrl } = useS3Context();
  const [notebookURL, setNotebookURL] = useState<string | null>(null);

  const spawnNotebook = async () => {
    const url = await getSignedUrl(bucket, object.$raw.Key, 600);
    setNotebookURL(url);
  };

  // Startup the notebook
  useEffect(() => {
    spawnNotebook();
  }, []);

  return (
    <>
      notebookURL && <iframe src={notebookURL!} />
    </>
  );
}
