import Footer from "../app/components/Footer";
import { render } from "@testing-library/react";

describe("Footer", () => {
  it("renders correctly", () => {
    render(<Footer />);

    const text = document.querySelector("p")?.textContent;
    expect(text).toEqual(
      "This product uses the TMDB API but is not endorsed or certified by TMDB."
    );
  });
});
