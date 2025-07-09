import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const baseUrl = "https://image.tmdb.org/t/p/original/";

export const truncateString = (str: string | undefined, num: number) => {
  if (typeof str === "string")
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
};
