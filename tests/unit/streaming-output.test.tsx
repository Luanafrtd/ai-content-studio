import { describe, expect, it, vi } from "vitest";
import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StreamingOutput } from "@/components/generate/streaming-output";

function renderWithQueryClient(ui: ReactElement) {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

const noop = () => {};

describe("StreamingOutput", () => {
  it("shows a placeholder when idle", () => {
    renderWithQueryClient(
      <StreamingOutput
        status="idle"
        title=""
        content=""
        error={null}
        itemId={null}
        onDiscard={noop}
        onReset={noop}
      />,
    );
    expect(screen.getByText("Your generation will appear here")).toBeInTheDocument();
  });

  it("shows streaming content with a live region while generating", () => {
    renderWithQueryClient(
      <StreamingOutput
        status="streaming"
        title="A Guide to Sustainable Skincare"
        content="In today's landscape, sustainable skincare has become essential."
        error={null}
        itemId={null}
        onDiscard={noop}
        onReset={noop}
      />,
    );
    expect(screen.getByText("A Guide to Sustainable Skincare")).toBeInTheDocument();
    expect(screen.getByText(/sustainable skincare has become essential/)).toBeInTheDocument();
  });

  it("shows action buttons once generation is done", () => {
    renderWithQueryClient(
      <StreamingOutput
        status="done"
        title="A Guide to Sustainable Skincare"
        content="Full generated content."
        error={null}
        itemId="item_123"
        onDiscard={noop}
        onReset={noop}
      />,
    );
    expect(screen.getByRole("button", { name: /Copy/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Discard/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Generate another/ })).toBeInTheDocument();
  });

  it("shows an error message and retry button on failure", async () => {
    const onReset = vi.fn();
    renderWithQueryClient(
      <StreamingOutput
        status="error"
        title=""
        content=""
        error="Generation failed. Please try again."
        itemId={null}
        onDiscard={noop}
        onReset={onReset}
      />,
    );
    expect(screen.getByText("Generation failed. Please try again.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Try again/ })).toBeInTheDocument();
  });
});
