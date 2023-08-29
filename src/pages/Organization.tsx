import { Box, Typography, Tabs, Tab } from '@mui/material';
import { FC, ReactNode, useContext, useState } from 'react';
import { OrganizationContext } from '../contexts/organization.context';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const TabPanel: FC<TabPanelProps> = ({ children, index, value }) => {
  return (
    <Box hidden={value !== index}>
      {value == index && (children)}
    </Box>
  )
}

export const OrganizationView: FC = () => {
  const { organization } = useContext(OrganizationContext);
  const [value, setValue] = useState<number>(0);

  return (
    <>
      {organization &&
        <Box>
          <Typography variant='h1'>{organization.name}</Typography>
          <Tabs value={value} onChange={(_event, newValue) => setValue(newValue)}>
            <Tab label='About' />
            <Tab label='Protocols' />
          </Tabs>
          <TabPanel value={value} index={0} children={<p>About</p>}/>
          <TabPanel value={value} index={1} children={<p>Protocols</p>} />
        </Box>
      }
    </>
  );
}
