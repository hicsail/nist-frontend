import React, { useContext, createContext, useState, useEffect } from 'react';
import './App.css'
import SideNav from './components/SideNav'
import { Outlet, useNavigate } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, gql, HttpLink, useQuery } from '@apollo/client';
import { Grid } from '@mui/material';
import { AuthContext } from './contexts/Auth';
import { setContext } from '@apollo/client/link/context';
import jwtDecode from 'jwt-decode';


function App() {

  const [token, setToken] = useState<string | null>(null);
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
      console.log('token')
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

  useEffect(() => {
    authLogic({});
  }, []);


  const createNewClient = () => {
    console.log('creating new client')
    return new ApolloClient({
      cache: new InMemoryCache(),
      link: authLink.concat(httpLink),
    });
  }

  const client = createNewClient();

  const authContext = {
    isAuthenticated,
    setIsAuthenticated,
    token,
    setToken
  }

  console.log(authContext);

  return (
    <div className="App">
      <AuthContext.Provider value={authContext}>
        <ApolloProvider client={client}>
          {
            isAuthenticated ? (
              <AuthContext.Provider value={authContext}>
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
    </div>

  )
}

export default App
