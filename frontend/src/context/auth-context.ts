import { createContext } from "react";

export interface AuthContextType {
    isAuthenticated: boolean;
    LogIn: (userName: string, password: string) => Promise<void>;
    LogOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
