import React, { useState, useEffect } from 'react';
import './App.css'
import SideNav from './components/SideNav'
import { Outlet, useNavigate } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, gql, HttpLink } from '@apollo/client';
import { Breadcrumbs, Grid, Link, Typography } from '@mui/material';
import { AuthContext } from './contexts/Auth';
import { PermissionsContext, OrganizationPermissionType } from './contexts/Permissions';
import { setContext } from '@apollo/client/link/context';
import jwtDecode from 'jwt-decode';
import {S3Provider} from './contexts/s3.context';

function App() {

  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [path, setPath] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<OrganizationPermissionType[]>();
  const navigate = useNavigate();
  const uri = `${import.meta.env.VITE_AUTH_URL}/graphql`;

  const httpLink = new HttpLink({
    fetch: fetch,
    uri: uri,
  });

  const authLogic = async (headers: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        // token expired, logic for handling token expiration
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
        navigate('/login');
      }

      setToken(token);
      setIsAuthenticated(true);
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        }
      }
    } else {
      setToken(null);
      setIsAuthenticated(false);
      navigate('/login');
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        }
      }
    }
  }

  const authLink = setContext((_, { headers }) => {
    return authLogic(headers);
  });

  const createNewClient = () => {
    return new ApolloClient({
      cache: new InMemoryCache(),
      link: authLink.concat(httpLink),
    });
  }

  const client = createNewClient();
  
  const GET_PERMISSIONS = gql`
    query cargoGetPermissions {
        cargoGetPermissions {
            read
            write
            delete
            admin
            bucket
        }
    }
  `;

  useEffect(() => {
    authLogic({}).then(() => {
      client.query({ query: GET_PERMISSIONS }).then(async (result) => {
        const allPermissions = result.data.cargoGetPermissions;
        setPermissions(allPermissions);
      });
    });
  }, [token]);

  const authContext = {
    isAuthenticated,
    setIsAuthenticated,
    token,
    setToken
  }

  return (
    <div className="App">
      <S3Provider
        s3Endpoint={import.meta.env.VITE_S3_ENDPOINT}
        cargoEndpoint={import.meta.env.VITE_CARGO_ENDPOINT}
      >
        <AuthContext.Provider value={authContext}>
          <ApolloProvider client={client}>
            {
              isAuthenticated && permissions ? (
                <AuthContext.Provider value={authContext}>
                  <PermissionsContext.Provider value={permissions}>
                    <Grid container>
                      <Grid item xs={12} sm={3}>
                        <SideNav />
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <div>
                        <Breadcrumbs separator="›" aria-label="breadcrumb">
                          {
                            path.map((path : any) => {
                              return (
                                <Link key={path.name} color="text.primary" href={path.path}>
                                  {path.name}
                                </Link>
                              )
                            })
                          }
                          </Breadcrumbs>
                        </div>
                        <div id='detail'>
                          <Outlet />
                        </div>
                      </Grid>
                    </Grid>
                  </PermissionsContext.Provider>
                </AuthContext.Provider>
              ) : (
                <div>
                  <h2>
                    Please login
                  </h2>
                  <Outlet />
                </div>
              )
            }
          </ApolloProvider>
        </AuthContext.Provider>
      </S3Provider>
    </div>
  )
}

export default App
