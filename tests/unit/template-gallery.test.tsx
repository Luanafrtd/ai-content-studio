import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TemplateGallery } from "@/components/generate/template-gallery";

describe("TemplateGallery", () => {
  it("renders every content type as a selectable option", () => {
    render(<TemplateGallery value="BLOG_POST" onChange={() => {}} />);
    expect(screen.getAllByRole("radio")).toHaveLength(7);
  });

  it("marks the selected template as checked", () => {
    render(<TemplateGallery value="EMAIL" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: /Email/ })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: /Blog Post/ })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("calls onChange with the clicked template's value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TemplateGallery value="BLOG_POST" onChange={onChange} />);

    await user.click(screen.getByRole("radio", { name: /Ad Copy/ }));
    expect(onChange).toHaveBeenCalledWith("AD_COPY");
  });
});
