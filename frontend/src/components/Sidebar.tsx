import { useEffect, useState } from "react";
import group from "../assets/group.jpg"
import api from "../api/api"
import "./Sidebar.css"

type GroupType = {
    id: number;
    name: string;
};

function Sidebar({ setSelectedGroup, creation }: { setSelectedGroup: (id: number) => void, creation: (value: boolean) => void }) {
    const [groups, setGroups] = useState<GroupType[]>([]);

    useEffect(() => {
        api.get("/api/groups/joinedGroups").then((response) => setGroups(response.data)).catch((error) => console.log(`Error found ${error}`));
    }, []);

    return (
        <div className="sidebar">
            {
                (!groups || groups.length == 0) ?
                    (<div  >
                        No Joined Groups
                        <div className="sidebar" onClick={() => creation(true)}> Add New Group? </div>
                    </div>)
                    :
                    (<div>
                        {groups.map((group) => (
                            <SideGroup name={group.name} id={group.id} key={group.id} setSelectedGroup={setSelectedGroup} />
                        )) }
                        < div onClick={() => creation(true)}> Add New Group? </div>
                    </div>)
            }

        </div >
    );
}

function SideGroup({ name, id, setSelectedGroup }: { name: string, id: number, setSelectedGroup: (id: number) => void }) {
    return (
        <div className="sidebar-group" onClick={() => setSelectedGroup(id)}>
            <img src={group} className='group-logo' alt="profile picture." />
            <p>{name}</p>
        </div>
    )
}

export default Sidebar;
