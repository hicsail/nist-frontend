import { createContext, Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { Organization } from '../graphql/graphql';
import { useGetOrganizationsQuery } from '../graphql/organization/organization';

interface OrganizationContextType {
  /** Currently selected organizaiton */
  organization: Organization | null;
  /** Update the selected organization */
  setOrganization: Dispatch<SetStateAction<Organization | null>>;
  /** List of all available organizations */
  organizations: Organization[];
}

export const OrganizationContext = createContext<OrganizationContextType>({
  organization: null,
  setOrganization: (_org) => {},
  organizations: []
});

export interface OrganizationProviderProps {
  children: ReactNode;
  setOrganization: Dispatch<SetStateAction<Organization | null>>;
}

export const OrganizationProvider: FC<OrganizationProviderProps> = (props) => {
  const orgStr = window.localStorage.getItem('organization');
  let currentOrganization: Organization | null = null;

  if (orgStr) {
    currentOrganization = JSON.parse(orgStr);
  }

  // Setup list of available organizations
  const orgQuery = useGetOrganizationsQuery();
  useEffect(() => {
    if (orgQuery.data) {
      setOrganizations(orgQuery.data.getOriganizations);
    }
  }, [orgQuery.data, orgQuery.error]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);


  return <OrganizationContext.Provider value={{ organization: currentOrganization, setOrganization: props.setOrganization, organizations: organizations }}>{props.children}</OrganizationContext.Provider>;
};
