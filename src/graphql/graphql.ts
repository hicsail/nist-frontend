/* Generated File DO NOT EDIT. */
/* tslint:disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  JSON: any;
};

export type AccessToken = {
  __typename?: 'AccessToken';
  accessToken: Scalars['String'];
};

export type CargoPermissionChange = {
  admin: Scalars['Boolean'];
  delete: Scalars['Boolean'];
  read: Scalars['Boolean'];
  write: Scalars['Boolean'];
};

export type CargoPermissions = {
  __typename?: 'CargoPermissions';
  _id: Scalars['ID'];
  /** If the user can modify permissions on the bucket */
  admin: Scalars['Boolean'];
  /** The bucket that the user permission is on */
  bucket: Scalars['String'];
  /** If the user can delete objects in the bucket */
  delete: Scalars['Boolean'];
  /** If the user has read access to the bucket */
  read: Scalars['Boolean'];
  user: UserModel;
  /** If the user has write access to the bucket */
  write: Scalars['Boolean'];
};

/** Wrapper for AWS HttpRequest */
export type CargoResourceRequest = {
  body?: InputMaybe<Scalars['JSON']>;
  headers: Scalars['JSON'];
  hostname: Scalars['String'];
  method: Scalars['String'];
  path: Scalars['String'];
  port?: InputMaybe<Scalars['Float']>;
  protocol: Scalars['String'];
  query: Scalars['JSON'];
};

export type CargoSignedRequest = {
  __typename?: 'CargoSignedRequest';
  /** SHA256 Hashed Body */
  bodyHash: Scalars['String'];
  /** AWS Signature based on the request */
  signature: Scalars['String'];
  /** AWS format timestamp */
  timestamp: Scalars['String'];
};

export type ConfigurableProjectSettings = {
  description?: InputMaybe<Scalars['String']>;
  homePage?: InputMaybe<Scalars['String']>;
  logo?: InputMaybe<Scalars['String']>;
  muiTheme?: InputMaybe<Scalars['JSON']>;
  name?: InputMaybe<Scalars['String']>;
  redirectUrl?: InputMaybe<Scalars['String']>;
};

export type EmailLoginDto = {
  email: Scalars['String'];
  password: Scalars['String'];
  projectId: Scalars['String'];
};

export type ForgotDto = {
  email: Scalars['String'];
  projectId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cargoChangePermissions: CargoPermissions;
  cargoServiceAddUser: Array<CargoPermissions>;
  cargoServiceChangePermissions: CargoPermissions;
  createProject: ProjectModel;
  forgotPassword: Scalars['Boolean'];
  loginEmail: AccessToken;
  loginUsername: AccessToken;
  resetPassword: Scalars['Boolean'];
  signup: AccessToken;
  updateProject: ProjectModel;
  updateProjectAuthMethods: ProjectModel;
  updateProjectSettings: ProjectModel;
};


export type MutationCargoChangePermissionsArgs = {
  bucket: Scalars['String'];
  change: CargoPermissionChange;
  user: Scalars['String'];
};


export type MutationCargoServiceAddUserArgs = {
  project: Scalars['String'];
  user: Scalars['String'];
};


export type MutationCargoServiceChangePermissionsArgs = {
  bucket: Scalars['String'];
  change: CargoPermissionChange;
  user: Scalars['String'];
};


export type MutationCreateProjectArgs = {
  authServiceUser: UsernameLoginDto;
  project: ProjectCreateInput;
};


export type MutationForgotPasswordArgs = {
  user: ForgotDto;
};


export type MutationLoginEmailArgs = {
  user: EmailLoginDto;
};


export type MutationLoginUsernameArgs = {
  user: UsernameLoginDto;
};


export type MutationResetPasswordArgs = {
  user: ResetDto;
};


export type MutationSignupArgs = {
  user: UserSignupDto;
};


export type MutationUpdateProjectArgs = {
  id: Scalars['String'];
  settings: ConfigurableProjectSettings;
};


export type MutationUpdateProjectAuthMethodsArgs = {
  id: Scalars['String'];
  projectAuthMethods: ProjectAuthMethodsInput;
};


export type MutationUpdateProjectSettingsArgs = {
  id: Scalars['String'];
  projectSettings: ProjectSettingsInput;
};

export type Organization = {
  __typename?: 'Organization';
  _id: Scalars['ID'];
  bucket: Scalars['String'];
  name: Scalars['String'];
  owner?: Maybe<Scalars['String']>;
};

export type ProjectAuthMethodsInput = {
  googleAuth?: InputMaybe<Scalars['Boolean']>;
};

export type ProjectAuthMethodsModel = {
  __typename?: 'ProjectAuthMethodsModel';
  googleAuth: Scalars['Boolean'];
};

export type ProjectCreateInput = {
  allowSignup: Scalars['Boolean'];
  description: Scalars['String'];
  displayProjectName: Scalars['Boolean'];
  googleAuth: Scalars['Boolean'];
  homePage?: InputMaybe<Scalars['String']>;
  logo?: InputMaybe<Scalars['String']>;
  muiTheme?: InputMaybe<Scalars['JSON']>;
  name: Scalars['String'];
  redirectUrl?: InputMaybe<Scalars['String']>;
};

export type ProjectModel = {
  __typename?: 'ProjectModel';
  authMethods: ProjectAuthMethodsModel;
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  homePage?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  logo?: Maybe<Scalars['String']>;
  muiTheme: Scalars['JSON'];
  name: Scalars['String'];
  redirectUrl?: Maybe<Scalars['String']>;
  settings: ProjectSettingsModel;
  updatedAt: Scalars['DateTime'];
  users: Array<UserModel>;
};

export type ProjectSettingsInput = {
  allowSignup?: InputMaybe<Scalars['Boolean']>;
  displayProjectName?: InputMaybe<Scalars['Boolean']>;
};

export type ProjectSettingsModel = {
  __typename?: 'ProjectSettingsModel';
  allowSignup: Scalars['Boolean'];
  displayProjectName: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  /** Means for the admin to get all permissions for a given bucket */
  cargoGetAllBucketPermissions: Array<CargoPermissions>;
  /** Get all permissions for the user of the JWT for their project */
  cargoGetPermissions: Array<CargoPermissions>;
  /** Allows the currently authenticated user to get their own permisisons for a bucket */
  cargoGetPermissionsForBucket: CargoPermissions;
  cargoSignRequest: CargoSignedRequest;
  getOriganizations: Array<Organization>;
  getProject: ProjectModel;
  getUser: UserModel;
  listProjects: Array<ProjectModel>;
  projectUsers: Array<UserModel>;
  publicKey: Array<Scalars['String']>;
  users: Array<UserModel>;
};


export type QueryCargoGetAllBucketPermissionsArgs = {
  bucket: Scalars['String'];
};


export type QueryCargoGetPermissionsForBucketArgs = {
  bucket: Scalars['String'];
};


export type QueryCargoSignRequestArgs = {
  request: CargoResourceRequest;
};


export type QueryGetProjectArgs = {
  id: Scalars['String'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryProjectUsersArgs = {
  projectId: Scalars['String'];
};


export type QueryUsersArgs = {
  projectId: Scalars['ID'];
};

export type ResetDto = {
  code: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  projectId: Scalars['String'];
};

export type UserModel = {
  __typename?: 'UserModel';
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  email?: Maybe<Scalars['String']>;
  fullname?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  projectId: Scalars['String'];
  role: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
  username?: Maybe<Scalars['String']>;
};

export type UserSignupDto = {
  email: Scalars['String'];
  fullname: Scalars['String'];
  password: Scalars['String'];
  projectId: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
};

export type UsernameLoginDto = {
  password: Scalars['String'];
  projectId: Scalars['String'];
  username: Scalars['String'];
};
