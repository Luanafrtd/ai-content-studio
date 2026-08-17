import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "@/components/shared/search-input";

afterEach(() => {
  vi.useRealTimers();
});

describe("SearchInput", () => {
  it("renders the provided value", () => {
    render(<SearchInput value="skincare" onChange={() => {}} label="Search content" />);
    expect(screen.getByRole("searchbox", { name: "Search content" })).toHaveValue("skincare");
  });

  it("debounces onChange after the input settles", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();

    render(<SearchInput value="" onChange={onChange} label="Search content" />);
    const input = screen.getByRole("searchbox", { name: "Search content" });

    fireEvent.change(input, { target: { value: "skincare" } });
    expect(onChange).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(onChange).toHaveBeenCalledWith("skincare");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("clears the input and calls onChange with an empty string", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchInput value="skincare" onChange={onChange} label="Search content" />);

    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onChange).toHaveBeenCalledWith("");
  });
});
