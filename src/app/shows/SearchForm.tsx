"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DefaultShows from "./DefaultShows";
import SearchedShows from "./SearchedShows";

const SearchForm = ({ shows }: { shows: Shows[] }) => {
  const [query, setQuery] = useState("");
  const [searchedShows, setSearchedShows] = useState<Shows[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
      setIsSearching(true);
      const res = await fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1&include_adult=false&query=${query}`,
      );
      const data = await res.json();
      return data.results;
    } catch (error) {
      console.log(error);
      toast("Error searching for shows");
    } finally {
      setIsSearching(false);
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
      {/* Search Form */}
      <div className="mb-12">
        <Card className="mx-auto max-w-2xl border-slate-700 bg-slate-800/50">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
              <Search className="h-6 w-6 text-purple-400" />
              Search TV Shows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  className="flex-1 border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                  type="text"
                  placeholder="Search for a TV show..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  disabled={isSearching}
                  className="bg-purple-600 px-6 text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  {isSearching ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <div className="space-y-8">
        {searchedShows?.length === 0 ? (
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-purple-500"></div>
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Trending Shows
              </h2>
            </div>
            <DefaultShows shows={shows} />
          </div>
        ) : (
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-purple-500"></div>
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Search Results
              </h2>
            </div>
            <SearchedShows searchedShows={searchedShows} />
          </div>
        )}
      </div>
    </>
  );
};

export default SearchForm;
