import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContentTypeBadge } from "@/components/shared/content-type-badge";

describe("ContentTypeBadge", () => {
  it("renders the human-readable label for a known type", () => {
    render(<ContentTypeBadge type="SOCIAL_CAPTION" />);
    expect(screen.getByText("Social Caption")).toBeInTheDocument();
  });

  it("renders a label for every content type without crashing", () => {
    const types = [
      "BLOG_POST",
      "SOCIAL_CAPTION",
      "EMAIL",
      "PRODUCT_DESCRIPTION",
      "AD_COPY",
      "SEO_META",
      "PRESS_RELEASE",
    ];
    for (const type of types) {
      const { unmount } = render(<ContentTypeBadge type={type} />);
      unmount();
    }
  });
});
