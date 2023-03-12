import { createContext } from "react";

type PermissionsContext = {
    _id: string,
    user: string,
    org: any,
    read: boolean,
    write: boolean,
    delete: boolean,
    admin: boolean
}

export const PermissionsContext = createContext({} as PermissionsContext[]);