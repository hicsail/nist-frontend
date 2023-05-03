import { createContext, ReactNode, FC, useEffect, useState } from 'react';
import { CargoPermissions } from '../graphql/graphql';
import { useCargoGetPermissionsQuery } from '../graphql/permissions/permissions';

export const PermissionsContext = createContext<CargoPermissions[]>([]);

export interface PermissionsProviderProps {
  children: ReactNode;
}

export const PermissionsProvider: FC<PermissionsProviderProps> = (props) => {
  const [permissions, setPermissions] = useState<CargoPermissions[]>([]);
  const { data } = useCargoGetPermissionsQuery({});

  useEffect(() => {
    if (data) {
      setPermissions(data.cargoGetPermissions as CargoPermissions[]);
    }
  }, [data]);

  return <PermissionsContext.Provider value={permissions}>{props.children}</PermissionsContext.Provider>
}
