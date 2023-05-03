import React, { useState, useEffect } from 'react';
import './App.css'
import SideNav from './components/SideNav'
import { Outlet, useNavigate } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, gql, HttpLink, useQuery } from '@apollo/client';
import { Breadcrumbs, Grid, Link, Typography } from '@mui/material';
import { AuthContext } from './contexts/Auth';
import { PermissionsProvider } from './contexts/Permissions';
import { setContext } from '@apollo/client/link/context';
import jwtDecode from 'jwt-decode';
import { UIContext } from './contexts/UI';
import {MuiThemeProvider} from './contexts/theme.providers';
import { S3Provider } from './contexts/s3.context';

function App() {

  const [token, setToken] = useState<string | null>(null);
  const [path, setPath] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
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

  useEffect(() => {
    authLogic({});
  }, [token]);

  const authContext = {
    isAuthenticated,
    setIsAuthenticated,
    token,
    setToken
  }

  return (
    <div className="App">
      <MuiThemeProvider>
        <S3Provider
          s3Endpoint={import.meta.env.VITE_S3_ENDPOINT}
          cargoEndpoint={import.meta.env.VITE_CARGO_ENDPOINT}
        >
          <AuthContext.Provider value={authContext}>
            <ApolloProvider client={client}>
            <UIContext.Provider value={{ path: path, setPath: setPath }}>
              {
                isAuthenticated ? (
                    <PermissionsProvider>
                      <Grid container>
                        <Grid item xs={12} sm={3}>
                          <SideNav />
                        </Grid>
                        <Grid item xs={12} sm={9}>
                          <div id='detail'>
                            <Outlet />
                          </div>
                        </Grid>
                      </Grid>
                    </PermissionsProvider>
                ) : (
                  <div>
                    <h2>
                      Please login
                    </h2>
                    <Outlet />
                  </div>
                )
              }
              </UIContext.Provider>
            </ApolloProvider>
          </AuthContext.Provider>
        </S3Provider>
      </MuiThemeProvider>
    </div>
  )
}

export default App
