import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FC, ReactNode } from 'react';

export interface ThemeProviderProps {
  children: ReactNode;
}

export const MuiThemeProvider: FC<ThemeProviderProps> = (props) => {
  const theme = createTheme({

  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
};
