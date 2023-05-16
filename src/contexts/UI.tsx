import { createContext } from 'react';

type Path = {
  name: string;
  path: string;
};

type UIContext = {
  path: Path[];
  setPath: (path: Path[]) => void;
};

export const UIContext = createContext({} as UIContext);
