import { render } from "@testing-library/react";
import ToastUtils from "../app/components/ToastUtils";

describe("ToastUtils", () => {
  it("renders without crashing", () => {
    expect(ToastUtils).toBeTruthy();
    render(<ToastUtils />);
  });
});
