import { FC, useContext } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { OrganizationContext } from '../contexts/organization.context';
import { OrganizationCard } from '../components/OrganizationCard';

export const Dashboard: FC = () => {
  const { organizations } = useContext(OrganizationContext);


  return (
    <>
      {/* Header information */}
      <Typography variant='h1'>Dashboard</Typography>
      <Divider />
      <Typography variant='h2' sx={{ paddingTop: '1em' }}>Organizations</Typography>

      {/* List of card views */}
      <Box sx={{ display: 'flex' }}>
        {organizations.map((organization) =>
          <OrganizationCard organization={organization} canClick={true} key={organization.name} action={(_org) => console.log(_org)}/>)}
      </Box>
    </>
  );
}
