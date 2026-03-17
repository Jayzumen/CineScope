"use client";

import SearchForm from "@/components/SearchForm";
import DefaultShows from "./DefaultShows";
import SearchedShows from "./SearchedShows";
import { searchShows } from "@/lib/actions";

const ShowSearchForm = ({ shows }: { shows: Shows[] }) => {
  return (
    <SearchForm
      items={shows}
      onSearch={searchShows}
      searchTitle="Search TV Shows"
      placeholder="Search for a TV show..."
      defaultTitle="Trending Shows"
      renderDefaultItems={(items) => <DefaultShows shows={items} />}
      renderSearchedItems={(items) => <SearchedShows searchedShows={items} />}
    />
  );
};

export default ShowSearchForm;
