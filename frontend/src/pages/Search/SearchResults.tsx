import './SearchResults.css'
type groupResult = {
    id: number
    name: string,
    topic: string,
    creatorName: string
};

function SearchResults({ results, onSelect }: { results: groupResult[], onSelect: (id: number) => void }) {
    if (results.length == 0) {
        return (<div className="searchResults">No groups found.</div>);
    }

    return (<div className="searchResults">
        {results.map((group) => (
            <div className="searchResultsCard" key={group.id} onClick={() => onSelect(group.id)}>
                <p className="searchResultName">{group.name}</p>
                <p className="searchResultTopic">{group.topic}</p>
                <p className="searchResultCreator"> with luv from {group.creatorName}</p>
            </div>
        ))}
    </div>);
}

export default SearchResults;
