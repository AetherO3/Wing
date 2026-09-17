import { useState } from "react";
import Body from "../../components/Body"
import Header from "../../components/Header"
import { EditUser } from "../EditUser/EditUser";

type groupResult = {
    id: number,
    name: string,
    topic: string,
    creatorName: string
};

function Landing() {
    const [searchResults, setSearchResults] = useState<groupResult[] | null>(null);
    const [showEditUser, setShowEditUser] = useState(false);

    return (<>
        <Header onSearchResults={setSearchResults} editing={setShowEditUser} />
        {!showEditUser ?
            <Body searchResult={searchResults} clearSearch={() => setSearchResults(null)} />
            :
            <EditUser editing={setShowEditUser} />
        }
    </>);
}

export default Landing;
