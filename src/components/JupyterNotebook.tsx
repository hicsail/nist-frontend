import { FC, ReactNode, useEffect, useState } from 'react';
import { Plugin, S3Object, useS3Context } from '@bu-sail/s3-viewer';
import { useNistGetJupterNotebookMutation } from '../graphql/jupyterhub/jupyterhub';
import { Paper } from '@mui/material';

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
      {objectURL && <JupyterNotebookView objectURL={objectURL!} objectName={object.name} />}
    </>
  );
};

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

/**
 * The Jupyter Notebook view visualizes a file that is provided as a
 * presigned URL
 */
const JupyterNotebookView: FC<{ objectURL: string; objectName: string }> = ({ objectURL, objectName }) => {
  const [notebookURL, setNotebookURL] = useState<string | null>(null);

  const mutation = useNistGetJupterNotebookMutation()[0];

  const getURL = async () => {
    const result = await mutation({ variables: { fileName: objectName, fileURL: objectURL } });

    if (result.errors) {
      console.error(result.errors);
      return;
    }

    if (!result.data) {
      console.error('Failed to retrieve notebook URL');
      return;
    }

    console.log(result.data.nistGetJupterNotebook);

    setNotebookURL(result.data.nistGetJupterNotebook);
  };


  // With the query result, set the notebook URL to visualize
  // TODO: Add query result to update list
  useEffect(() => {
    getURL();
  }, []);

  return (
    <Paper sx={style}>
      {notebookURL && <iframe src={notebookURL!} style={{ width: '100%', height: '100%' }} />}
    </Paper>
  );
};
