import { Button, Checkbox, FormControl, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useUser } from '../contexts/User';
import { PermissionsContext } from '../contexts/Permissions';
import { useGetOrganizationsQuery } from '../graphql/organization/organization';
import { useSnackbar } from '../contexts/snackbar.context';

export default function Account() {
  const { user, setUser, updating } = useUser();
  const [fullname, setFullname] = React.useState<any>();
  const [email, setEmail] = React.useState<any>();
  const [organizations, setOrganizations] = React.useState<any[]>([]);
  const permissions = useContext(PermissionsContext);
  const [userHasOrganizationsAssigned, setUserHasOrganizationsAssigned] = React.useState<boolean>(false);
  const { pushMessage } = useSnackbar();

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
    // if user has no organizations assigned, set noOrganizationsAssigned to true
    if (permissions) {
      // loop over permissions and check if user has any organizations assigned

      for (let i = 0; i < permissions.length; i++) {
        if (permissions[i].read === true || permissions[i].write === true || permissions[i].admin === true || permissions[i].delete === true) {
          setUserHasOrganizationsAssigned(true);
          break;
        }
      }
    }
  }, [permissions]);

  React.useEffect(() => {
    if (user) {
      setFullname(user?.fullname);
      setEmail(user?.email);
    }
  }, [user]);

  const handleSave = () => {
    // check if fullname and email are valid
    if (!user) {
      pushMessage('User not found', 'error');
      return;
    }
    if (!fullname || !email) {
      pushMessage('Full name and email are required', 'error');
      return;
    }
    if (fullname.length < 3 || email.length < 3) {
      pushMessage('Full name and email must be at least 3 characters', 'error');
      return;
    }
    if (!email.includes('@')) {
      pushMessage('Email must be valid', 'error');
      return;
    }

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
          {!userHasOrganizationsAssigned && <Typography variant="body1">No organizations assigned</Typography>}
          {userHasOrganizationsAssigned && (
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
                <Grid item xs={2}>
                  <Typography variant="body1">Delete</Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          {permissions.map((permission) => {
            if (permission.admin || permission.read || permission.write || permission.delete) {
              const organization = organizations.find((organization) => organization.bucket === permission.bucket);
              return (
                <div>
                  <Grid key={organization._id} container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                      <TextField value={organization.name} margin="normal" disabled fullWidth />
                    </Grid>
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
                      <Grid item xs={2}>
                        <Checkbox checked={permission.delete} disabled />
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              );
            }
          })}

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
    </div>
  );
}
