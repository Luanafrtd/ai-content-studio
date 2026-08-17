import { describe, expect, it } from "vitest";
import { formatContentType, formatWordCount, getInitials } from "@/lib/format";

describe("formatContentType", () => {
  it("maps known enum values to readable labels", () => {
    expect(formatContentType("BLOG_POST")).toBe("Blog Post");
    expect(formatContentType("SEO_META")).toBe("SEO Meta");
    expect(formatContentType("PRESS_RELEASE")).toBe("Press Release");
  });

  it("falls back to the raw value for unknown types", () => {
    expect(formatContentType("SOMETHING_ELSE")).toBe("SOMETHING_ELSE");
  });
});

describe("formatWordCount", () => {
  it("counts words separated by whitespace", () => {
    expect(formatWordCount("hello world")).toBe(2);
  });

  it("returns 0 for an empty string", () => {
    expect(formatWordCount("")).toBe(0);
  });

  it("returns 0 for whitespace-only input", () => {
    expect(formatWordCount("   \n  ")).toBe(0);
  });

  it("collapses multiple spaces between words", () => {
    expect(formatWordCount("one   two    three")).toBe(3);
  });
});

describe("getInitials", () => {
  it("returns initials for a two-word name", () => {
    expect(getInitials("Jane Doe")).toBe("JD");
  });

  it("returns a single initial for a one-word name", () => {
    expect(getInitials("Cher")).toBe("C");
  });

  it("caps at two initials for longer names", () => {
    expect(getInitials("Mary Jane Watson")).toBe("MJ");
  });

  it("handles extra whitespace", () => {
    expect(getInitials("  Jane   Doe  ")).toBe("JD");
  });
});
