import { S3Client } from '@aws-sdk/client-s3';
import { registerMiddleware } from '@bu-sail/cargo-middleware';
import { createContext, FC, ReactNode } from 'react';

/** Function which gets the JWT token from local storage */
const getJWTToken = (): Promise<string> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token not found in local storage');
  }
  return Promise.resolve(token);
};

// Create the context, no default value provided so the provider is needed
export const S3Context = createContext<S3Client>({} as any);

export interface S3ProviderProps {
  s3Endpoint: string;
  cargoEndpoint: string;
  region?: string;
  children: ReactNode;
}

export const S3Provider: FC<S3ProviderProps> = (props) => {
  // Create the S3 client
  const client = new S3Client({
    forcePathStyle: true,
    endpoint: props.s3Endpoint,
    region: props.region || 'us-east-1',

    // The credentials are required to make a client, but are functionally
    // not used due to the Cargo middleware handling the signing process
    credentials: {
      accessKeyId: 'placeholder',
      secretAccessKey: 'placeholder'
    }
  });

  // Register the Cargo middleware
  registerMiddleware({
    cargoEndpoint: props.cargoEndpoint,
    jwtTokenProvider: getJWTToken
  }, client.middlewareStack)

  return <S3Context.Provider value={client}>{props.children}</S3Context.Provider>
}
