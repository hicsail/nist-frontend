import React, { useContext, createContext, useState, useEffect } from 'react';
import './App.css'
import SideNav from './components/SideNav'
import { Outlet, RouterProvider, Routes, createBrowserRouter, useNavigate } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, gql, HttpLink, useQuery } from '@apollo/client';
import { Grid } from '@mui/material';
import { AuthContext } from './contexts/Auth';
import { PermissionsContext } from './contexts/Permissions';


function App() {

  const storageToken = localStorage.getItem('token');
  const [token, setToken] = useState<string | null>(storageToken);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const navigate = useNavigate();
  const uri = `${import.meta.env.VITE_AUTH_URL}/graphql`;

  const httpLink = new HttpLink({
    fetch: fetch,
    uri: 'https://nist-staging.sail.codes/graphql',
    headers: {
      authorization: `Bearer ${token}`
    }
  });

  const client = new ApolloClient({
    uri: 'https://nist-staging.sail.codes/graphql',
    cache: new InMemoryCache(),
    link: httpLink
  }); // Replace with your authentication logic


  useEffect(() => {

    client.query({
      query: gql`
      query {
        authenticate
      }
    `
    }).then(result => {
      console.log(result);
      if (result.data.authenticate) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setIsAuthenticated(false);
        navigate('/login');
      }
    })
      .catch(err => {
        setIsAuthenticated(false);
        navigate('/login');
      });
  }, [token, isAuthenticated]);

  const authContext = {
    isAuthenticated,
    setIsAuthenticated,
    token,
    setToken
  }

  console.log(authContext);

  client.query({
    query: gql`
    query {
      getUserPermissions {
    _id
    user
    org {
      name
    }
    read
    write
    delete
    admin
  }
    }
  `
  }).then(result => {
    console.log(result);
  }).catch(err => {
    console.log(err);
  });

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
