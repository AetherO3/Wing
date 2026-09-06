import Header from "./Header"
import Body from "./Body"
import { useState } from "react";

type groupResult = {
    id: number,
    name: string,
    topic: string,
    creatorName: string
};

function Landing() {
    const [searchResults, setSearchResults] = useState<groupResult[] | null>(null);

    return (<>
        <Header onSearchResults={setSearchResults} />
        <Body searchResult={searchResults} clearSearch={() => setSearchResults(null)} />
    </>);
}

export default Landing;
