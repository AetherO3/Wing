import { useAuth } from "../../context/AuthProvider";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import SearchResults from "../Search/SearchResults";
import "../../components/Body.css"

type GroupResults = {
    id: number,
    name: string,
    topic: string,
    creatorName: string
};

function Landing() {
    const { isAuthenticated } = useAuth();
    const [searchResults, setSearchResults] = useState<GroupResults[] | null>(null);

    return (
        <>
            <Header onSearchResults={setSearchResults} />
            <div className="body">
                {isAuthenticated && <Sidebar />}
                {isAuthenticated && searchResults != null ?
                    <SearchResults results={searchResults} clearSearch={() => setSearchResults(null)} />
                    :
                    <Outlet />
                }
            </div>

        </>
    );
}

export default Landing;
