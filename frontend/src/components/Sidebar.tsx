import { useEffect, useState } from "react";
import group from "../assets/group.jpg"
import api from "../api"
import "./Sidebar.css"

type GroupType = {
    id: number;
    name: string;
};

function Sidebar({ setSelectedGroup }: { setSelectedGroup: (id: number) => void }) {
    const [groups, setGroups] = useState<GroupType[]>([]);

    useEffect(() => {
        api.get("/api/groups/joinedGroups").then((response) => setGroups(response.data)).catch((error) => console.log(`Error found ${error}`));
    }, []);

    if (!groups || groups.length == 0)
        return (
            <div className="sidebar" >
                No Joined Groups
            </div>
        )
    else
        return (
            <div className="sidebar" >
                {groups.map((group) => (
                    <SideGroup name={group.name} id={group.id} key={group.id} setSelectedGroup={setSelectedGroup} />
                ))}
            </div>
        )
}

function SideGroup({ name, id, setSelectedGroup }: { name: string, id: number, setSelectedGroup: (id: number) => void }) {
    return (
        <div className="sidebar-group" onClick={()=>setSelectedGroup(id)}>
            <img src={group} className='group-logo' alt="profile picture." />
            <p>{name}</p>
        </div>
    )
}

export default Sidebar;
