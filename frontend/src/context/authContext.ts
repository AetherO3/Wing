import { createContext } from "react";

export type User = {
    id: number;
    userName: string;
    email: string;
};

export type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    setIsAuthenticated: (value: boolean) => void;
    setUser: (user: User | null) => void;
    refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
