import { createContext } from "react";

export type OrganizationPermissionType = {
    _id: string,
    user: string,
    org: any,
    bucket: string,
    read: boolean,
    write: boolean,
    delete: boolean,
    admin: boolean
}

export type PermissionsContextType = {
    permissions: OrganizationPermissionType[],
    adminAccess: string[]
}

export const PermissionsContext = createContext({} as OrganizationPermissionType[]);