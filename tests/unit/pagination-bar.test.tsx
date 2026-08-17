import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaginationBar } from "@/components/shared/pagination-bar";

describe("PaginationBar", () => {
  it("shows the current page and total", () => {
    render(
      <PaginationBar
        page={2}
        totalPages={5}
        total={42}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />,
    );
    expect(screen.getByText("Page 2 of 5 · 42 total")).toBeInTheDocument();
  });

  it("shows a no-results message when total is zero", () => {
    render(
      <PaginationBar
        page={1}
        totalPages={1}
        total={0}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />,
    );
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("disables the previous button on the first page", () => {
    render(
      <PaginationBar
        page={1}
        totalPages={3}
        total={30}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
  });

  it("disables the next button on the last page", () => {
    render(
      <PaginationBar
        page={3}
        totalPages={3}
        total={30}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("calls onPageChange when the next button is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <PaginationBar
        page={1}
        totalPages={3}
        total={30}
        pageSize={10}
        onPageChange={onPageChange}
        onPageSizeChange={() => {}}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
