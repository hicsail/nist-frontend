import React, { useState, useEffect } from 'react';
import './App.css';
import { SideNav } from './components/SideNav';
import { Outlet, useNavigate } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { AuthContext } from './contexts/Auth';
import { PermissionsProvider } from './contexts/Permissions';
import { setContext } from '@apollo/client/link/context';
import jwtDecode from 'jwt-decode';
import { UIContext } from './contexts/UI';
import { MuiThemeProvider } from './contexts/theme.providers';
import { S3Provider } from './contexts/s3.context';
import { OrganizationProvider } from './contexts/organization.context';
import { Organization } from './graphql/graphql';
import { UserProvider } from './contexts/User';
import { Box, Typography, styled } from '@mui/material';
import Header from './components/Header';
import SmallSideNav from './components/SmallSideNav';
import { SnackbarProvider } from './contexts/snackbar.context';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}));

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [path, setPath] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [_organization, setOrganization] = React.useState<Organization | null>(null);
  const navigate = useNavigate();
  const uri = `${import.meta.env.VITE_AUTH_URL}/graphql`;
  const [open, setOpen] = useState(true);

  const httpLink = new HttpLink({
    fetch: fetch,
    uri: uri
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
          authorization: token ? `Bearer ${token}` : ''
        }
      };
    } else {
      setToken(null);
      setIsAuthenticated(false);
      navigate('/login');
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : ''
        }
      };
    }
  };

  const authLink = setContext((_, { headers }) => {
    return authLogic(headers);
  });

  const createNewClient = () => {
    return new ApolloClient({
      cache: new InMemoryCache(),
      link: authLink.concat(httpLink)
    });
  };

  const client = createNewClient();

  useEffect(() => {
    authLogic({});
  }, [token]);

  const authContext = {
    isAuthenticated,
    setIsAuthenticated,
    token,
    setToken
  };

  return (
    <div className="App">
      <MuiThemeProvider>
        <S3Provider s3Endpoint={import.meta.env.VITE_S3_ENDPOINT} cargoEndpoint={import.meta.env.VITE_CARGO_ENDPOINT}>
          <AuthContext.Provider value={authContext}>
            <ApolloProvider client={client}>
              <SnackbarProvider>
                <UIContext.Provider value={{ path: path, setPath: setPath }}>
                  {isAuthenticated ? (
                    <UserProvider>
                      <PermissionsProvider>
                        <OrganizationProvider setOrganization={setOrganization}>
                          <Box>
                            <Header open={open} setOpen={setOpen} />
                          </Box>
                          <Main
                            open={open}
                            sx={{
                              marginTop: '64px'
                            }}
                          >
                            <Box sx={{ display: 'flex' }}>
                              <SideNav open={open} />
                              <SmallSideNav open={!open} />
                              <Box sx={{ flexGrow: 1, p: 3 }}>
                                <Outlet />
                              </Box>
                            </Box>
                          </Main>
                        </OrganizationProvider>
                      </PermissionsProvider>
                    </UserProvider>
                  ) : (
                    <div>
                      <Typography variant="h2">Please login</Typography>
                      <Outlet />
                    </div>
                  )}
                </UIContext.Provider>
              </SnackbarProvider>
            </ApolloProvider>
          </AuthContext.Provider>
        </S3Provider>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
