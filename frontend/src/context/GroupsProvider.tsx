import {useCallback, useEffect, useState, type ReactNode } from "react";
import { GroupContext, type GroupType } from "./groupsContext";
import { useAuth } from "./useAuth";
import api from "../api/api";

export function GroupsProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [groups, setGroups] = useState<GroupType[]>([]);

    const refreshGroups = useCallback(async () => {
        try {
            const response = await api.get("/api/groups/joinedGroups");
            setGroups(response.data);
        } catch (error) {
            console.log(`Error found ${error}`);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;

        api.get("/api/groups/joinedGroups")
            .then((response) => setGroups(response.data))
            .catch((error) => console.log(`Error found ${error}`));

    }, [isAuthenticated]);

    return (
        <GroupContext.Provider value={{ groups: isAuthenticated ? groups : [], refreshGroups }}>
            {children}
        </GroupContext.Provider>
    );
}

