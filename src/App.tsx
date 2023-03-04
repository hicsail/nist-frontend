import './App.css'
import SideNav from './components/SideNav'
import { Outlet } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { Grid } from '@mui/material';

function App() {

  const client = new ApolloClient({
    uri: 'https://nist-staging.sail.codes/graphql',
    cache: new InMemoryCache(),
  });

  console.log(client);

  return (
    <div className="App">
      <ApolloProvider client={client}>
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
      </ApolloProvider>
    </div>
  )
}

export default App
