export const baseUrl = "https://image.tmdb.org/t/p/original/";

export const truncateString = (str: string | undefined, num: number) => {
  if (typeof str === "string")
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
};
