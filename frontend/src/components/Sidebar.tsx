import profile from "../assets/profile.jpg"
import "./Sidebar.css"

function Sidebar({ name }:{name : string}) {

    return (
        <div className="sidebar">

        <Group name = {name} />
        <Group name = {name} />
        <Group name = {name} />
        <Group name = {name} />

        </div>
    )
}

function Group({ name }:{name : string}) {
    return (
        <div className="sidebar-group">
                <img src={profile} className='header-logo' alt="profile picture." />
                <p>{ name }</p>
        </div>
    )
}

export default Sidebar
