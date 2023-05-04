import { createContext, Dispatch, FC, ReactNode, SetStateAction, useEffect } from 'react';
import { Organization } from '../graphql/graphql';


interface OrganizationContextType {
  organization: Organization | null;
  setOrganization: Dispatch<SetStateAction<Organization | null>>;
}

export const OrganizationContext = createContext<OrganizationContextType>({
  organization: null,
  setOrganization: (_org) => {}
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

  return (
    <OrganizationContext.Provider value={{ organization: currentOrganization, setOrganization: props.setOrganization }}>
      {props.children}
    </OrganizationContext.Provider>
  );
}
