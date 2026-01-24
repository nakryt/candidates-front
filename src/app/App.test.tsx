import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Candidate } from "../entities/candidate/model/types";
import { candidateApi } from "../shared/api/candidateApi";
import { ToastProvider } from "../shared/contexts/ToastContext";
import { App } from "./App";

// Helper function to render App with ToastProvider
const renderApp = () => {
  return render(
    <ToastProvider>
      <App />
    </ToastProvider>,
  );
};

// Mock data
const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "John Doe",
    position: "Frontend Developer",
    status: "interview",
    email: "john.doe@example.com",
    phone: "+1234567890",
    description: "Experienced frontend developer with a passion for React.",
    skills: [
      { id: 1, name: "JavaScript" },
      { id: 2, name: "TypeScript" },
      { id: 3, name: "React" },
    ],
    createdAt: "2026-01-22T14:01:31.627Z",
    updatedAt: "2026-01-22T14:01:31.627Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "Backend Developer",
    status: "active",
    email: "jane.smith@example.com",
    phone: "+1987654321",
    description: "Backend engineer specializing in Node.js.",
    skills: [
      { id: 4, name: "Node.js" },
      { id: 6, name: "PostgreSQL" },
    ],
    createdAt: "2026-01-22T14:01:31.631Z",
    updatedAt: "2026-01-22T14:01:31.631Z",
  },
  {
    id: 3,
    name: "Mike Johnson",
    position: "Fullstack Developer",
    status: "rejected",
    email: "mike.j@example.com",
    phone: "+1122334455",
    description: "Versatile developer comfortable with frontend and backend.",
    skills: [
      { id: 2, name: "TypeScript" },
      { id: 3, name: "React" },
      { id: 4, name: "Node.js" },
    ],
    createdAt: "2026-01-22T14:01:31.633Z",
    updatedAt: "2026-01-22T14:01:31.633Z",
  },
];

describe("App - Functional Testing (7.1)", () => {
  beforeEach(() => {
    // Mock API calls with paginated response format
    candidateApi.getAll = vi.fn().mockResolvedValue({
      data: mockCandidates,
      total: mockCandidates?.length,
      page: 1,
      limit: 100,
      totalPages: 1,
    });
    candidateApi.updateStatus = vi
      .fn()
      .mockImplementation(async (id, status) => {
        const candidate = mockCandidates.find((c) => c.id === id);
        if (!candidate) throw new Error("Candidate not found");
        return { ...candidate, status, updatedAt: new Date().toISOString() };
      });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 7.1.1 - List loads correctly
  it("7.1.1 - should load and display candidate list correctly", async () => {
    renderApp();

    // Initially should show loading skeleton
    expect(screen.getAllByRole("status")?.length).toBeGreaterThan(0);

    // Wait for candidates to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Mike Johnson")).toBeInTheDocument();
    expect(candidateApi.getAll).toHaveBeenCalledTimes(1);
  });

  // 7.1.2 - Modal opens with details
  it("7.1.2 - should open modal with candidate details", async () => {
    const user = userEvent.setup();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Find all "View details" buttons and click the first one
    const viewButtons = screen.getAllByRole("button", {
      name: /view details/i,
    });
    await user.click(viewButtons[0]);

    // Modal should be open with full details
    await waitFor(() => {
      expect(screen.getByText("Candidate Profile")).toBeInTheDocument();
    });

    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("+1234567890")).toBeInTheDocument();
    expect(
      screen.getByText(/Experienced frontend developer/),
    ).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  // 7.1.3 - Modal closes (button, overlay, Escape)
  it("7.1.3 - should close modal via close button", async () => {
    const user = userEvent.setup();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Open modal
    const viewButtons = screen.getAllByRole("button", {
      name: /view details/i,
    });
    await user.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Candidate Profile")).toBeInTheDocument();
    });

    // Close via X button (find by looking in modal header)
    const modalTitle = screen.getByText("Candidate Profile");
    const modalHeader = modalTitle.parentElement;
    const closeButton = within(modalHeader!).getByRole("button");
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Candidate Profile")).not.toBeInTheDocument();
    });
  });

  it("7.1.3 - should close modal via Escape key", async () => {
    const user = userEvent.setup();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Open modal
    const viewButtons = screen.getAllByRole("button", {
      name: /view details/i,
    });
    await user.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Candidate Profile")).toBeInTheDocument();
    });

    // Close via Escape key
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByText("Candidate Profile")).not.toBeInTheDocument();
    });
  });

  // 7.1.4 - Filter by name works
  it("7.1.4 - should filter candidates by name", async () => {
    const user = userEvent.setup();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // All candidates should be visible initially
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Mike Johnson")).toBeInTheDocument();

    // Find search input and type "john"
    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, "john");

    // Wait for debounce (300ms) and check filtered results
    await waitFor(() => {
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });

    // Only John and Mike Johnson (contains "john") should be visible
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Mike Johnson")).toBeInTheDocument(); // Contains "Johnson"
  });

  // 7.1.5 - Filter by status works
  it("7.1.5 - should filter candidates by status", async () => {
    const user = userEvent.setup();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // All candidates should be visible initially
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Mike Johnson")).toBeInTheDocument();

    // Click "Active" status filter button
    const activeButton = screen.getByRole("button", {
      name: /filter by active/i,
    });
    await user.click(activeButton);

    // Only Jane (active) should be visible
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.queryByText("Mike Johnson")).not.toBeInTheDocument();
  });

  // 7.1.6 - Combined filters work
  it("7.1.6 - should apply both name and status filters", async () => {
    const user = userEvent.setup();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Apply status filter first
    const interviewButton = screen.getByRole("button", {
      name: /filter by interview/i,
    });
    await user.click(interviewButton);

    // John (interview) should be visible, others not
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    expect(screen.queryByText("Mike Johnson")).not.toBeInTheDocument();

    // Now apply name filter
    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, "john");

    // Still only John should be visible
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    expect(screen.queryByText("Mike Johnson")).not.toBeInTheDocument();
  });

  // 7.1.7 - Status change works
  it("7.1.7 - should update candidate status", async () => {
    const user = userEvent.setup();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Open John Doe's details
    const viewButtons = screen.getAllByRole("button", {
      name: /view details/i,
    });
    await user.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Candidate Profile")).toBeInTheDocument();
    });

    // Change status from "interview" to "active"
    const statusSelect = screen.getByRole("combobox");
    await user.selectOptions(statusSelect, "active");

    // Verify API was called
    await waitFor(() => {
      expect(candidateApi.updateStatus).toHaveBeenCalledWith(1, "active");
    });
  });

  // 7.1.8 - Status persists (verified via API call)
  it("7.1.8 - should persist status change via API", async () => {
    const user = userEvent.setup();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Open modal
    const viewButtons = screen.getAllByRole("button", {
      name: /view details/i,
    });
    await user.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Candidate Profile")).toBeInTheDocument();
    });

    // Change status
    const statusSelect = screen.getByRole("combobox");
    await user.selectOptions(statusSelect, "rejected");

    // Verify API call to persist the change
    await waitFor(() => {
      expect(candidateApi.updateStatus).toHaveBeenCalledWith(1, "rejected");
    });

    // The actual persistence is verified by the backend API test
  });
});
