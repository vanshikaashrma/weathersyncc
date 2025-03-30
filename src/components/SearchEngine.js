import React from "react";

function SearchEngine({ query, setQuery, search }) {
  return (
    <div>
      <input
  type="text"
  placeholder="Enter city..."
  value={query === "Delhi" ? "" : query} 
  onChange={(e) => setQuery(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && search(e)} 
/>

      <button onClick={search}>Search</button>
    </div>
  );
}

export default SearchEngine;
