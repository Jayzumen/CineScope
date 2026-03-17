"use client";

import SearchForm from "@/components/SearchForm";
import DefaultMovies from "./DefaultMovies";
import SearchedMovies from "./SearchedMovies";
import { searchMovies } from "@/lib/actions";

const MovieSearchForm = ({ movies }: { movies: Movies[] }) => {
  return (
    <SearchForm
      items={movies}
      onSearch={searchMovies}
      searchTitle="Search Movies"
      placeholder="Search for a movie..."
      defaultTitle="Trending Movies"
      renderDefaultItems={(items) => <DefaultMovies movies={items} />}
      renderSearchedItems={(items) => <SearchedMovies searchedMovies={items} />}
    />
  );
};

export default MovieSearchForm;
