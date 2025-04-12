import { createContext, useContext } from 'react';

interface AuthenticationContext {
  jwt: string;
}

const defaultAuthenticationContext: AuthenticationContext = {
    jwt: "",
};

const saluhudMobileAppAuthenticationContext = createContext<AuthenticationContext>(defaultAuthenticationContext);

export const useSaluhudMobileAppAuthenticationContext = () => useContext(saluhudMobileAppAuthenticationContext);