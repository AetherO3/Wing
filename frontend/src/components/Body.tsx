import { useAuth } from "../context/AuthProvider"
import SearchResults from "../pages/Search/SearchResults"
import { useState } from "react"
import Sidebar from "./Sidebar"
import Group from "../pages/Group/Group"
import "./Body.css"

type groupResult = {
    id: number,
    name: string,
    topic: string
    creatorName: string,
};

function Body({ searchResult, clearSearch }: { searchResult: groupResult[] | null, clearSearch: () => void }) {
    const { isAuthenticated } = useAuth();
    const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

    function openGroup(id: number) {
        setSelectedGroup(id);
        clearSearch();
    }

    return (
        <div className="body">
            {isAuthenticated && (<Sidebar setSelectedGroup={openGroup} />)}

            {isAuthenticated && searchResult != null ? (
                <SearchResults results={searchResult} onSelect={openGroup} />
            ) : isAuthenticated && selectedGroup != null ? (
                <Group id={selectedGroup} />
            ) : <div />}

        </div>
    );
}

export default Body;
