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
  const [objectURL, setObjectURL] = useState<string | null>(null);
  const [notebookURL, setNotebookURL] = useState<string | null>(null);

  const generateObjectURL = async () => {
    const url = await getSignedUrl(bucket, object.$raw.Key, 600);
    setObjectURL(url);
  };

  // Get the Object URL
  useEffect(() => {
    generateObjectURL();
  }, []);

  // When the object URL is generated, spawn the notebook
  useEffect(() => {
    // Do nothing if the object URL is not yet set
    if (!objectURL) {
      return;
    }

    // TODO: Make GraphQL request for notebook

    setNotebookURL('placeholder');
  }, [objectURL]);

  return (
    <>
      notebookURL && <iframe src={notebookURL!} />
    </>
  );
}
