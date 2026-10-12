import { useContext } from "react";
import { GroupContext } from "./groupsContext";

export function useGroups() {
    const context = useContext(GroupContext);

    if (context === undefined)
        throw new Error("useGroups must be used within GroupsProvider");

    return context;
}
