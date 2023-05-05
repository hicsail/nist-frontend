import { Card, CardActionArea, Chip, Typography } from '@mui/material'
import React from 'react'
import { Organization } from '../graphql/graphql'
import { useNavigate } from 'react-router';
import thumbnail from '../assets/thumbnail.png';

type OrganizationCardProps = {
  organization: Organization,
  canClick: boolean,
  accessType: string
}

export default function ({ organization, canClick, accessType }: OrganizationCardProps) {

  const navigate = useNavigate();
  const routeToOrganization = (organization: Organization) => {
    // route to path /organization/:orgId and pass organization as props
    navigate(`/organization/${organization._id}`, { state: organization });
  }
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
