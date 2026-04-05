import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "../routes/collection/route";
import { NATURES, POKE_BALLS, LANGUAGES, GAMES } from "../lib/constants";


export function FilterBar() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/collection" });

  const [searchText, setSearchText] = useState(search.search ?? "");

  // Sync local search text when URL changes externally
  useEffect(() => {
    setSearchText(search.search ?? "");
  }, [search.search]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchText.trim();
      if (trimmed !== (search.search ?? "")) {
        navigate({
          search: (prev) => ({ ...prev, search: trimmed || undefined }),
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText, search.search, navigate]);

  const [showMore, setShowMore] = useState(false);

  const setFilter = useCallback(
    (key: string, value: string | boolean | number | undefined) => {
      navigate({
        search: (prev) => ({ ...prev, [key]: value }),
      });
    },
    [navigate],
  );

  const clearAllFilters = useCallback(() => {
    setSearchText("");
    navigate({
      search: { sortBy: "dex_number", sortOrder: "asc" },
    });
  }, [navigate]);

  // Count active "more" filters
  const moreFilterCount = useMemo(() => {
    let count = 0;
    if (search.gameOfOrigin) count++;
    if (search.nature) count++;
    if (search.languageTag) count++;
    if (search.currentLocation) count++;
    if (search.isEvent) count++;
    if (search.isAlpha) count++;
    if (search.isHiddenAbility) count++;
    return count;
  }, [search]);

  const hasAnyFilter = useMemo(() => {
    return !!(
      search.search ||
      search.isShiny ||
      search.ball ||
      moreFilterCount > 0
    );
  }, [search, moreFilterCount]);

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4 space-y-4">
      {/* Always visible filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by species, nickname, OT..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Shiny toggle */}
        <button
          onClick={() => setFilter("isShiny", search.isShiny ? undefined : true)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
            search.isShiny
              ? "bg-yellow-100 border-yellow-400 text-yellow-800"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span>Shiny</span>
        </button>

        {/* Ball dropdown */}
        <select
          value={search.ball ?? ""}
          onChange={(e) =>
            setFilter("ball", e.target.value || undefined)
          }
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Balls</option>
          {POKE_BALLS.map((ball) => (
            <option key={ball} value={ball}>
              {ball}
            </option>
          ))}
        </select>

        {/* More Filters toggle */}
        <button
          onClick={() => setShowMore((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
            showMore || moreFilterCount > 0
              ? "bg-blue-50 border-blue-300 text-blue-700"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span>More Filters</span>
          {moreFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs">
              {moreFilterCount}
            </span>
          )}
        </button>

        {/* Clear all */}
        {hasAnyFilter && (
          <button
            onClick={clearAllFilters}
            className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Expandable more filters */}
      {showMore && (
        <div className="border-t border-gray-200 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Game of origin */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Game of Origin
            </label>
            <select
              value={search.gameOfOrigin ?? ""}
              onChange={(e) =>
                setFilter("gameOfOrigin", e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Games</option>
              {GAMES.map((game) => (
                <option key={game} value={game}>
                  {game}
                </option>
              ))}
            </select>
          </div>

          {/* Nature */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Nature
            </label>
            <select
              value={search.nature ?? ""}
              onChange={(e) =>
                setFilter("nature", e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Natures</option>
              {NATURES.map((nature) => (
                <option key={nature} value={nature}>
                  {nature}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Language
            </label>
            <select
              value={search.languageTag ?? ""}
              onChange={(e) =>
                setFilter("languageTag", e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Languages</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Current location */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Current Location
            </label>
            <input
              type="text"
              placeholder="e.g. HOME, Sword..."
              value={search.currentLocation ?? ""}
              onChange={(e) =>
                setFilter("currentLocation", e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Toggle filters */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap gap-3">
            <button
              onClick={() =>
                setFilter("isHiddenAbility", search.isHiddenAbility ? undefined : true)
              }
              className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                search.isHiddenAbility
                  ? "bg-purple-100 border-purple-400 text-purple-800"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Hidden Ability
            </button>
            <button
              onClick={() =>
                setFilter("isEvent", search.isEvent ? undefined : true)
              }
              className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                search.isEvent
                  ? "bg-pink-100 border-pink-400 text-pink-800"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Event
            </button>
            <button
              onClick={() =>
                setFilter("isAlpha", search.isAlpha ? undefined : true)
              }
              className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                search.isAlpha
                  ? "bg-red-100 border-red-400 text-red-800"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Alpha
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
