import { Actor } from "./actors/types";
import { Credits, Movie, MovieDetail, SimilarMovies } from "./movies/types";
import { Show, ShowDetails } from "./shows/types";

// Actors
export async function getActor(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const actor: Actor = await res.json();
  return actor;
}

// Movies
export async function getMovie(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const movie: MovieDetail = await res.json();
  return movie;
}

export async function getSimilar(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const data: SimilarMovies = await res.json();
  return data.results;
}

export async function getCredits(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const credits: Credits = await res.json();
  return credits;
}

export async function getMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const movies = await res.json();
  const results = movies.results as Movie[];
  return results;
}

// TV Shows
export async function getShow(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
  );
  const show: ShowDetails = await res.json();
  return show;
}

export async function getTVShows() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const shows = await res.json();
  const results = shows.results as Show[];
  return results;
}
