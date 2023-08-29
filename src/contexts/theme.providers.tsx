import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FC, ReactNode } from 'react';

export interface ThemeProviderProps {
  children: ReactNode;
}

export const MuiThemeProvider: FC<ThemeProviderProps> = (props) => {
  const theme = createTheme({
    typography: {
      fontFamily: 'Poppins',
      h1: {
        fontSize: 34
      },
      h2: {
        fontSize: 24
      },
      h3: {
        fontSize: 20
      },
      h4: {
        fontSize: 15
      },
      button: {
        textTransform: 'none'
      }
    },
    spacing: 2
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
};
