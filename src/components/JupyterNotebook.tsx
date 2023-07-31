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
    return <JupyterNotebookWrapper object={object} />;
  }
}

/**
 * Wrapper which handles the process of generating the object URL. The object
 * URL is the presigned URL which is then passed to the Jupyter Notebook for
 * viewing
 */
const JupyterNotebookWrapper: FC<{ object: S3Object }> = ({ object }) => {
  const { bucket, getSignedUrl } = useS3Context();
  const [objectURL, setObjectURL] = useState<string | null>(null);

  const generateObjectURL = async () => {
    const url = await getSignedUrl(bucket, object.$raw.Key, 600);
    setObjectURL(url);
  };

  // Get the Object URL
  useEffect(() => {
    generateObjectURL();
  }, []);

  return (
    <>
      objectURL && <JupyterNotebookView objectURL={objectURL!} objectName={object.name} />
    </>
  );
};

/**
 * The Jupyter Notebook view visualizes a file that is provided as a
 * presigned URL
 */
const JupyterNotebookView: FC<{ objectURL: string; objectName: string }> = ({ objectURL, objectName }) => {
  const [notebookURL, setNotebookURL] = useState<string | null>(null);

  // TODO: Add GQL query

  // With the query result, set the notebook URL to visualize
  // TODO: Add query result to update list
  useEffect(() => {
    setNotebookURL('placeholder');
  }, []);

  return (
    <>
      notebookURL && <iframe src={notebookURL!} />
    </>
  );
};
