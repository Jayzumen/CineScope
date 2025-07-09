"use client";

import SearchForm from "@/components/SearchForm";
import DefaultMovies from "./DefaultMovies";
import SearchedMovies from "./SearchedMovies";

const MovieSearchForm = ({ movies }: { movies: Movies[] }) => {
  const searchMovie = async (query: string): Promise<Movies[] | undefined> => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1&include_adult=false&query=${query}`,
      );
      const data = await res.json();
      return data.results;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <SearchForm
      items={movies}
      onSearch={searchMovie}
      searchTitle="Search Movies"
      placeholder="Search for a movie..."
      defaultTitle="Trending Movies"
      renderDefaultItems={(items) => <DefaultMovies movies={items} />}
      renderSearchedItems={(items) => <SearchedMovies searchedMovies={items} />}
    />
  );
};

export default MovieSearchForm;
