import { useAuth } from "../context/AuthProvider"
import SearchResults from "../pages/Search/SearchResults"
import { useState } from "react"
import Sidebar from "./Sidebar"
import Group from "../pages/Group/Group"
import "./Body.css"
import CreateGroup from "../pages/CreateGroup/CreateGroup";

type groupResult = {
    id: number,
    name: string,
    topic: string
    creatorName: string,
};

function Body({ searchResult, clearSearch }: { searchResult: groupResult[] | null, clearSearch: () => void }) {
    const { isAuthenticated } = useAuth();
    const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
    const [creatingNewGroup, setCreatingNewGroup] = useState(false);

    function openGroup(id: number) {
        setSelectedGroup(id);
        clearSearch();
    }

    return (
        <div className="body">
            {isAuthenticated && (<Sidebar setSelectedGroup={openGroup} creation={setCreatingNewGroup} />)}

            {
                !creatingNewGroup ?

                    (isAuthenticated && searchResult != null ?
                        (<SearchResults results={searchResult} onSelect={openGroup} />)
                        :
                        (isAuthenticated && selectedGroup != null ? (<Group id={selectedGroup} />) : (<div />)
                        ))

                    :

                    (< div className="createGroupPage" ><CreateGroup creation={setCreatingNewGroup} group={openGroup} /></div>)
            }
        </div>
    );
}

export default Body;
