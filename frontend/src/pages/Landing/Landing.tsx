import { useAuth } from "../../context/AuthProvider";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
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
    const location = useLocation();
    const [search, setSearch] = useState<{ results: GroupResults[], key: string } | null>(null);

    const searchResults = search && search.key === location.key ? search.results : null;

    function handleSearchResults(results: GroupResults[] | null) {
        setSearch(results === null ? null : { results, key: location.key });
    }

    return (
        <>
            {isAuthenticated && <Header onSearchResults={handleSearchResults} />}
            <div className="body">
                {isAuthenticated && <Sidebar />}
                {isAuthenticated && searchResults != null ?
                    <SearchResults results={searchResults} clearSearch={() => setSearch(null)} />
                    :
                    <Outlet />
                }
            </div>

        </>
    );
}

export default Landing;
