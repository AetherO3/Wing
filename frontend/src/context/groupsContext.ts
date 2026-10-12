import { createContext } from "react";

export type GroupType = {
    name: string;
    id: number;
};

export type GroupContextType = {
    groups: GroupType[];
    refreshGroups: () => Promise<void>;
};

export const GroupContext = createContext<GroupContextType | undefined>(undefined);
