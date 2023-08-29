import { Card, CardActionArea, Chip, Typography } from '@mui/material';
import { useContext, FC } from 'react';
import { Organization } from '../graphql/graphql';
import { useNavigate } from 'react-router';
import { OrganizationContext } from '../contexts/organization.context';

type OrganizationCardProps = {
  organization: Organization;
  canClick: boolean;
  accessType?: string;
  action: (organization: Organization) => void;
};

export const OrganizationCard: FC<OrganizationCardProps> = ({ organization, canClick, accessType, action }: OrganizationCardProps) => {
  const navigate = useNavigate();
  const { setOrganization } = useContext(OrganizationContext);

  return (
    <Card onClick={() => (canClick ? action(organization) : alert('Contact Administrator for Org to request Access'))} style={{ width: 330, margin: 10 }}>
      <CardActionArea>
        <div style={{ padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <img src={organization.logoURL} style={{ width: 100, height: 100, margin: 20 }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 10 }}>
            <div style={{ marginBottom: 15 }}>
              {accessType && <Chip label={accessType} variant="outlined" />}
              {/* right now there is no favorite functionality <BookmarkBorderIcon style={{ marginLeft: 10 }} /> */}
            </div>
            <Typography variant="h3">{organization.name}</Typography>
          </div>
        </div>
      </CardActionArea>
    </Card>
  );
}
