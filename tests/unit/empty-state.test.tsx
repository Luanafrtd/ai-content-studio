import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sparkles } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(
      <EmptyState
        icon={Sparkles}
        title="No content found"
        description="Try adjusting your filters."
      />,
    );
    expect(screen.getByText("No content found")).toBeInTheDocument();
    expect(screen.getByText("Try adjusting your filters.")).toBeInTheDocument();
  });

  it("renders an action when provided", () => {
    render(
      <EmptyState
        icon={Sparkles}
        title="No content found"
        action={<button type="button">New project</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "New project" })).toBeInTheDocument();
  });

  it("omits the description when not provided", () => {
    const { container } = render(<EmptyState icon={Sparkles} title="No content found" />);
    expect(container.querySelectorAll("p")).toHaveLength(0);
  });
});
