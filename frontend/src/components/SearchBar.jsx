import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchVideos } from "../features/videos/videoSlice";

const SearchBar = () => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  // Extract video search state from Redux
  const { searchResults, searchLoading, searchError } = useSelector(state => state.videos);

  // Handle form submit to trigger video search
  const handleSearch = (e) => {
    e.preventDefault();

    if (input.trim() !== "") {
      dispatch(searchVideos(input));
    }
  };

  return (
    <div>
      {/* Search Form */}
      <form onSubmit={handleSearch} aria-label="Search videos form">
        <input
          type="text"
          placeholder="Search videos by title..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Search videos"
        />
        <button type="submit" disabled={searchLoading} aria-disabled={searchLoading}>
          Search
        </button>
      </form>

      {/* Loading and Error States */}
      {searchLoading && <p>Loading...</p>}
      {searchError && <p role="alert">Error: {searchError}</p>}

      {/* Search Results List */}
      <ul>
        {searchResults.map((video) => (
          <li key={video._id}>{video.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
