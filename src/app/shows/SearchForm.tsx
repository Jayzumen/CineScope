"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import DefaultShows from "./DefaultShows";
import SearchedShows from "./SearchedShows";

const SearchForm = ({ shows }: { shows: Shows[] }) => {
  const [query, setQuery] = useState("");
  const [searchedShows, setSearchedShows] = useState<Shows[]>([]);

  const searchShow = async (query: string): Promise<Shows[] | undefined> => {
    if (!query) {
      toast("Please enter a search term");
      return;
    }
    if (query.length < 4) {
      toast("Please enter at least 4 characters");
      return;
    }
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1&include_adult=false&query=${query}`
      );
      const data = await res.json();
      return data.results;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchShows = await searchShow(query);
    if (searchShows) {
      setSearchedShows(searchShows);
      setQuery("");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSearch}
        className="mb-4 flex w-[70%] flex-col items-center justify-center lg:w-[40%]"
      >
        <label className="sr-only" htmlFor="search">
          Search
        </label>
        <input
          className="mb-4 w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 focus:border-gray-500 focus:bg-white focus:outline-none"
          type="text"
          placeholder="Search for a TV show"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
          type="submit"
        >
          Search
        </button>
      </form>

      {searchedShows?.length === 0 ? (
        <DefaultShows shows={shows} />
      ) : (
        <SearchedShows searchedShows={searchedShows} />
      )}
    </>
  );
};

export default SearchForm;
