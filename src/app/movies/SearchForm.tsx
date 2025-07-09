"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import DefaultMovies from "./DefaultMovies";
import SearchedMovies from "./SearchedMovies";

const SearchForm = ({ movies }: { movies: Movies[] }) => {
  const [query, setQuery] = useState("");
  const [searchedMovies, setSearchedMovies] = useState<Movies[]>([]);

  const searchMovie = async (query: string): Promise<Movies[] | undefined> => {
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
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1&include_adult=false&query=${query}`
      );
      const data = await res.json();
      return data.results;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchMovies = await searchMovie(query);
    if (searchMovies) {
      setSearchedMovies(searchMovies);
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
          placeholder="Search for a movie"
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

      {searchedMovies?.length === 0 ? (
        <DefaultMovies movies={movies} />
      ) : (
        <SearchedMovies searchedMovies={searchedMovies} />
      )}
    </>
  );
};

export default SearchForm;
