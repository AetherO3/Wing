import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type User } from "./authContext.ts";
import api, { setUnauthorizedHandler } from "../api/api.ts";

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    async function refreshUser() {
        const response = await api.get('/api/users/me');
        setUser(response.data);
        setIsAuthenticated(true);
    }

    useEffect(() => {
        setUnauthorizedHandler(() => {
            setUser(null);
            setIsAuthenticated(false);
        });
        return () => setUnauthorizedHandler(null);
    }, []);

    useEffect(() => {
        api.get("/api/users/me")
            .then((response) => {
                setUser(response.data);
                setIsAuthenticated(true);
            })
            .catch(() => {
                setUser(null);
                setIsAuthenticated(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, setIsAuthenticated, refreshUser, setUser }} >
            {children}
        </AuthContext.Provider>
    );
}

