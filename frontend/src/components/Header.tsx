import { useState } from 'react'
import logo from '../assets/logo.png'
import profile from '../assets/profile.jpg'
import api from '../api'
import "./Header.css"

function Header() {
    return (
        <div className="header">
            <div>
                <img src={logo} className='header-logo' alt="logo." />
            </div>

            <Search />

            <div>
                <img src={profile} className='header-logo' alt="profile picture." />
            </div>
        </div>
    )
}

function Search() {
    const [search, setSearch] = useState("");

    async function handleSearch(e: React.SubmitEvent) {
        e.preventDefault();

        try {
            // const response = await api.get(`api/groups/${search}`);
            const response = await api.get("/api/groups/search", {
                params: {
                    name: search
                }
            });
            console.log(response.data);

            return;
        }
        catch (error) {
            console.log(`An error occured, ${error}`)
        }

    }

    return (<>
        <form onSubmit={handleSearch}>
            <label htmlFor="search">
                <input type="text" id="search" placeholder="search....." value={search} onChange={(e) => setSearch(e.target.value)} />
            </label>
        </form>
    </>);
}

export default Header; 
