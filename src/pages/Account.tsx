import { Button, Checkbox, FormControl, Grid, Paper, Snackbar, TextField, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useUser } from '../contexts/User';
import { PermissionsContext } from '../contexts/Permissions';
import { useGetOrganizationsQuery } from '../graphql/organization/organization';

export default function Account() {
  const { user, setUser, updateError, setUpdateError, updateSuccess, setUpdateSuccess, updateErrorMessage, setUpdateErrorMessage, updating } = useUser();
  const [fullname, setFullname] = React.useState<any>();
  const [email, setEmail] = React.useState<any>();
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');
  const [organizations, setOrganizations] = React.useState<any[]>([]);
  const permissions = useContext(PermissionsContext);

  useGetOrganizationsQuery({
    onCompleted: (data) => {
      console.log(data.getOriganizations);
      setOrganizations(data.getOriganizations);
    },
    onError: (error) => {
      console.log(error);
    }
  });

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
        <FormControl
          fullWidth
          sx={{
            maxWidth: '500px'
          }}
        >
          <TextField label="Full Name" value={fullname ? fullname : ''} onChange={(e) => setFullname(e.target.value)} placeholder="Full Name" margin="normal" />
          <TextField label="Email" value={email ? email : ''} onChange={(e) => setEmail(e.target.value)} placeholder="Email" margin="normal" />
          <div>{updating && <Typography variant="caption">Updating...</Typography>}</div>
          <Typography variant="h6" sx={{ marginTop: '1rem' }}>
            Assigned Organizations
          </Typography>
          <br />

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="body1">Organization</Typography>
            </Grid>
            <Grid item container xs={8} spacing={2}>
              <Grid item xs={2}>
                <Typography variant="body1">Admin</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Read</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Write</Typography>
              </Grid>
            </Grid>
          </Grid>

          {organizations.map((organization) => (
            <Grid key={organization._id} container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <TextField value={organization.name} margin="normal" disabled fullWidth />
              </Grid>

              {permissions.map((permission) => {
                if (permission.bucket === organization.bucket) {
                  return (
                    <Grid key={permission.bucket} container item xs={8} spacing={2} alignItems="center">
                      <Grid item xs={2}>
                        <Checkbox checked={permission.admin} disabled />
                      </Grid>
                      <Grid item xs={2}>
                        <Checkbox checked={permission.read} disabled />
                      </Grid>
                      <Grid item xs={2}>
                        <Checkbox checked={permission.write} disabled />
                      </Grid>
                    </Grid>
                  );
                }
                return null;
              })}
            </Grid>
          ))}

          <br />
          <div>
            <Button onClick={handleSave} disabled={updating} variant="outlined">
              Save
            </Button>
            <span style={{ width: '1rem', margin: 10 }} />
            <Button onClick={handleRevert} variant="outlined">
              Revert
            </Button>
          </div>
        </FormControl>
      </Paper>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} message={snackbarMessage} />
    </div>
  );
}
