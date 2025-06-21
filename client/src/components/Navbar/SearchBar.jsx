import { useState, useEffect, useCallback, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { searchContent } from "@/services/searchService";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const communityMatch = location.pathname.match(/^\/r\/([^/]+)/);
  const currentCommunity = communityMatch ? communityMatch[1] : null;

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await searchContent(query, currentCommunity);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => handleSearch(query), 300),
    []
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      debouncedSearch(query);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleResultClick = (result) => {
    switch (result.type) {
      case "post":
        navigate(`/post/${result._id}`);
        break;
      case "user":
        navigate(`/u/${result.username}`);
        break;
      case "community":
        navigate(`/r/${result.name}`);
        break;
      default:
        break;
    }
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-xl" ref={searchRef}>
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => {
            if (searchQuery.trim()) {
              setShowResults(true);
            }
          }}
          placeholder={
            currentCommunity
              ? `Search in r/${currentCommunity}`
              : "Search Anonverse"
          }
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {((showResults && (searchResults.length > 0 || isLoading)) ||
          (hasSearched && searchQuery && !searchResults.length)) && (
          <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                Searching {currentCommunity && `in r/${currentCommunity}`}...
              </div>
            ) : searchResults.length > 0 ? (
              <>
                {currentCommunity && (
                  <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                    Showing results in r/{currentCommunity}
                  </div>
                )}
                {searchResults.map((result) => (
                  <button
                    key={result._id}
                    onClick={() => handleResultClick(result)}
                    className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    {result.type === "community" && (
                      <>
                        <span className="text-sm font-medium">
                          r/{result.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {result.members.length} members
                        </span>
                      </>
                    )}
                    {result.type === "user" && (
                      <span className="text-sm font-medium">
                        u/{result.username}
                      </span>
                    )}
                    {result.type === "post" && (
                      <div>
                        <div className="text-sm font-medium">
                          {result.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          in r/{result.community.name}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No results found for "{searchQuery}"
                {currentCommunity && ` in r/${currentCommunity}`}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
