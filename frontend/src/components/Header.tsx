import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import logo from '../assets/logo.png'
import profile from '../assets/profile.jpg'
import api from '../api/api'
import "./Header.css"

type groupResult = {
    id: number,
    name: string,
    topic: string,
    creatorName: string
};

function Header({ onSearchResults }: { onSearchResults: (results: groupResult[] | null) => void }) {
    const nav = useNavigate();
    const { user, isAuthenticated, loading } = useAuth();

    if (loading)
        return null;

    return (
        <div className="header">

            <div> <img src={logo} className='header-logo' alt="logo." /> </div>

            <Search onSearchResults={onSearchResults} />

            <div>
                {isAuthenticated ? (
                    <div className='header-buttons'>
                        <Logout />
                        <div id='userNameAndPfp'>
                            <img src={profile} className='header-logo' id='userPfp' alt="profile picture." />
                            <p>{user?.userName}</p>
                        </div>
                    </div>
                ) : (
                    <div className='header-buttons'>

                        <button  onClick={() => nav("/login")}>
                            Log In
                        </button>

                        <button  onClick={() => nav("/signup")}>
                            Sign Up
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

function Search({ onSearchResults }: { onSearchResults: (results: groupResult[] | null) => void }) {
    const [search, setSearch] = useState("");

    async function handleSearch(e: React.SubmitEvent) {
        e.preventDefault();

        if(!search.trim()){
            onSearchResults(null);
            return;
        }

        try {
            const response = await api.get("/api/groups/search", {
                params: {
                    name: search
                }
            });
            console.log(response.data);
            onSearchResults(response.data.content);

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
function Logout() {
    const { setUser, setIsAuthenticated } = useAuth();

    async function handleLogout() {
        api.post('auth/logout');
        setUser(null);
        setIsAuthenticated(false);
    }

    return (
        <button onClick={handleLogout}> Logout </button>
    );
}

export default Header; 
