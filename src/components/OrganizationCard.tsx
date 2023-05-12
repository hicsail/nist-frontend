import { Card, CardActionArea, Chip, Typography } from '@mui/material'
import React, {useContext} from 'react'
import { Organization } from '../graphql/graphql'
import { useNavigate } from 'react-router';
import {OrganizationContext} from '../contexts/organization.context';
import emblemBU from '../assets/nist-boston-university.png';
import emblemUCDavis from '../assets/nist-uc-davis.png';
import emblemJHU from '../assets/nist-john-hopkins.png';
import emblemUG from '../assets/nist-university-of-georgia.png';
import emblemUTAustin from '../assets/nist-university-of-texas-austin.png';
import emblemBioMade from '../assets/nist-biomade.png';

type OrganizationCardProps = {
  organization: Organization,
  canClick: boolean,
  accessType: string
}

// TODO: Hard coded institutions for demo purposes. Should be deleted after demo.
const emblemLookup = {
  'nist-boston-university': emblemBU,
  'nist-uc-davis': emblemUCDavis,
  'nist-john-hopkins': emblemJHU,
  'nist-university-of-georgia': emblemUG,
  'nist-university-of-texas-austin': emblemUTAustin,
  'nist-biomade': emblemBioMade
}

export default function ({ organization, canClick, accessType }: OrganizationCardProps) {

  const navigate = useNavigate();
  const { setOrganization } = useContext(OrganizationContext);

  const routeToOrganization = (organization: Organization) => {
    // Set the current organization and route to that organization's file
    // view
    setOrganization(organization);
    window.localStorage.setItem('organization', JSON.stringify(organization));
    navigate(`/organization/`);
  }

  // TODO: Hard coded institutions for demo purposes. Should be deleted after demo.
  const thumbnail = emblemLookup[organization.bucket as keyof typeof emblemLookup];

  return (
    <Card onClick={() => canClick ? routeToOrganization(organization) : alert("Contact Administrator for Org to request Access")} style={{width: 330, margin: 10}}>
      <CardActionArea>
        <div style={{ padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <img src={thumbnail} style={{ width: 100, height: 100, margin: 20 }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 10 }}>
            <div style={{ marginBottom: 15 }}>
              <Chip label={accessType} variant="outlined" />
              {/* right now there is no favorite functionality <BookmarkBorderIcon style={{ marginLeft: 10 }} /> */}
            </div>
            <Typography variant='h3'>{organization.name}</Typography>
          </div>
        </div>
      </CardActionArea>
    </Card>
  )
}
