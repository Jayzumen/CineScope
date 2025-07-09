"use client";

import SearchForm from "@/components/SearchForm";
import DefaultShows from "./DefaultShows";
import SearchedShows from "./SearchedShows";

const ShowSearchForm = ({ shows }: { shows: Shows[] }) => {
  const searchShow = async (query: string): Promise<Shows[] | undefined> => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1&include_adult=false&query=${query}`,
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
      items={shows}
      onSearch={searchShow}
      searchTitle="Search TV Shows"
      placeholder="Search for a TV show..."
      defaultTitle="Trending Shows"
      renderDefaultItems={(items) => <DefaultShows shows={items} />}
      renderSearchedItems={(items) => <SearchedShows searchedShows={items} />}
    />
  );
};

export default ShowSearchForm;
