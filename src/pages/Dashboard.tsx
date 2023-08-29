import { FC, useContext } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { OrganizationContext } from '../contexts/organization.context';
import { OrganizationCard } from '../components/OrganizationCard';
import { Organization } from '../graphql/graphql';
import { useNavigate } from 'react-router-dom';

export const Dashboard: FC = () => {
  const { organizations, setOrganization } = useContext(OrganizationContext);
  const navigate = useNavigate();
  const routeToOrganization = (organization: Organization) => {
    setOrganization(organization);
    window.localStorage.setItem('organization', JSON.stringify(organization));
    navigate(`/organization`);
  };

  return (
    <>
      {/* Header information */}
      <Typography variant='h1'>Dashboard</Typography>
      <Divider />
      <Typography variant='h2' sx={{ paddingTop: '1em' }}>Organizations</Typography>

      {/* List of card views */}
      <Box sx={{ display: 'flex' }}>
        {organizations.map((organization) =>
          <OrganizationCard organization={organization} canClick={true} key={organization.name} action={routeToOrganization}/>)}
      </Box>
    </>
  );
}
