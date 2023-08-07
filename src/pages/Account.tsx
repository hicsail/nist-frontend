import { Button, Card, FormControl, Input, Paper, Snackbar, TextField, Typography } from '@mui/material';
import React from 'react';
import { useUser } from '../contexts/User';

export default function Account() {
  const { user, setUser, updateError, setUpdateError, updateSuccess, setUpdateSuccess, updateErrorMessage, setUpdateErrorMessage, updating } = useUser();
  const [fullname, setFullname] = React.useState<any>();
  const [email, setEmail] = React.useState<any>();
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');

  React.useEffect(() => {
    if (user) {
      setFullname(user?.fullname);
      setEmail(user?.email);
    }
  }, [user]);

  React.useEffect(() => {
    if (updateError) {
      setSnackbarOpen(true);
      setUpdateError(false);
      setSnackbarMessage(updateErrorMessage);
      handleRevert();
    }
  }, [updateError]);

  React.useEffect(() => {
    if (updateSuccess) {
      setSnackbarOpen(true);
      setUpdateSuccess(false);
      setSnackbarMessage('Successfully updated user');
    }
  }, [updateSuccess]);

  const handleSave = () => {
    // check if fullname and email are valid
    if (!user) return;
    if (!fullname || !email) return;
    if (fullname.length < 3 || email.length < 3) return;
    if (!email.includes('@')) return;

    setUser({
      ...user,
      fullname,
      email
    });
  };

  const handleRevert = () => {
    if (user) {
      setFullname(user.fullname);
      setEmail(user.email);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setUpdateSuccess(false);
    setUpdateError(false);
    setUpdateErrorMessage('');
    setSnackbarMessage('');
  };

  return (
    <div>
      <Typography variant="h1">Account</Typography>
      <Paper
        variant="outlined"
        sx={{
          padding: '2rem',
          marginTop: '2rem'
        }}
      >
        <FormControl fullWidth sx={{
          maxWidth: '500px'
        }}>
          <TextField label="Full Name" value={fullname ? fullname : ''} onChange={(e) => setFullname(e.target.value)} placeholder="Full Name" margin="normal"/>
          <TextField label="Email" value={email ? email : ''} onChange={(e) => setEmail(e.target.value)} placeholder="Email" margin="normal"/>
          <div>
            <Button onClick={handleSave} disabled={updating}>
              Save
            </Button>
            <Button onClick={handleRevert}>Revert</Button>
          </div>
          <div>{updating && <Typography variant="caption">Updating...</Typography>}</div>
        </FormControl>
      </Paper>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} message={snackbarMessage} />
    </div>
  );
}
