import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import api from "../api/api";
import { useAuth } from "./AuthProvider";

type GroupType = {
    id: number;
    name: string;
};

type GroupContextType = {
    groups: GroupType[];
    refreshGroups: () => Promise<void>;
};

const GroupContext = createContext<GroupContextType | undefined>(undefined);

function GroupsProvider({ children }: { children: ReactNode }) {
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

function useGroups() {
    const context = useContext(GroupContext);

    if (context == undefined)
        throw new Error("useGroups must be used within GroupsProvider");

    return context;
}

export { useGroups, GroupsProvider };
