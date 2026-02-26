import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Candidate, CandidateDetail } from "../entities/candidate/model/types";
import { candidateApi } from "../shared/api/candidateApi";
import { skillApi } from "../shared/api/skillApi";
import { ToastProvider } from "../shared/contexts/ToastContext";
import { App } from "./App";

// Shared wrapper — CR-F025: single renderApp helper used across all tests
const renderApp = () => {
  return render(
    <ToastProvider>
      <App />
    </ToastProvider>,
  );
};

// List-type mock data — no email/phone/description (Candidate type)
const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "John Doe",
    position: "Frontend Developer",
    status: "interview",
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
    skills: [
      { id: 2, name: "TypeScript" },
      { id: 3, name: "React" },
      { id: 4, name: "Node.js" },
    ],
    createdAt: "2026-01-22T14:01:31.633Z",
    updatedAt: "2026-01-22T14:01:31.633Z",
  },
];

// Detail-type mock data — includes PII fields (CandidateDetail type)
const mockCandidateDetails: CandidateDetail[] = [
  {
    ...mockCandidates[0],
    email: "john.doe@example.com",
    phone: "+1234567890",
    description: "Experienced frontend developer with a passion for React.",
  },
  {
    ...mockCandidates[1],
    email: "jane.smith@example.com",
    phone: "+1987654321",
    description: "Backend engineer specializing in Node.js.",
  },
  {
    ...mockCandidates[2],
    email: "mike.j@example.com",
    phone: "+1122334455",
    description: "Versatile developer comfortable with frontend and backend.",
  },
];

describe("App - Functional Testing (7.1)", () => {
  beforeEach(() => {
    // Mock paginated list response
    candidateApi.getAll = vi.fn().mockResolvedValue({
      data: mockCandidates,
      total: mockCandidates.length,
      page: 1,
      limit: 100,
      totalPages: 1,
    });

    // Mock getById to return the matching CandidateDetail
    candidateApi.getById = vi.fn().mockImplementation(async (id: number) => {
      const detail = mockCandidateDetails.find((d) => d.id === id);
      if (!detail) throw new Error(`Candidate ${id} not found`);
      return detail;
    });

    // Mock status update to return updated CandidateDetail
    candidateApi.updateStatus = vi
      .fn()
      .mockImplementation(async (id: number, status: string) => {
        const detail = mockCandidateDetails.find((d) => d.id === id);
        if (!detail) throw new Error("Candidate not found");
        return { ...detail, status, updatedAt: new Date().toISOString() };
      });

    // Mock create to return a CandidateDetail
    candidateApi.create = vi.fn().mockResolvedValue({
      id: 99,
      name: "New Candidate",
      position: "Developer",
      status: "active",
      email: "new@example.com",
      phone: "+1000000000",
      description: "",
      skills: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } satisfies CandidateDetail);

    // Mock skillApi so AddCandidateModal does not make real HTTP requests
    skillApi.getAll = vi.fn().mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 7.1.1 - List loads correctly
  it("7.1.1 - should load and display candidate list correctly", async () => {
    renderApp();

    // Initially should show loading skeleton
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);

    // Wait for candidates to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Mike Johnson")).toBeInTheDocument();
    expect(candidateApi.getAll).toHaveBeenCalledTimes(1);
  });

  // 7.1.2 - Modal opens with details (fetched asynchronously via getById)
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

    // Modal opens with the profile title
    await waitFor(() => {
      expect(screen.getByText("Candidate Profile")).toBeInTheDocument();
    });

    // CandidateDetails fetches detail on mount — wait for getById to resolve
    await waitFor(() => {
      expect(candidateApi.getById).toHaveBeenCalledWith(1);
    });

    // PII fields become visible once the detail response arrives
    await waitFor(() => {
      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    });

    expect(screen.getByText("+1234567890")).toBeInTheDocument();
    expect(
      screen.getByText(/Experienced frontend developer/),
    ).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  // 7.1.3 - Modal closes via close button
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

    // Close via X button found inside the modal header
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

    // Wait for debounce and check filtered results
    await waitFor(() => {
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });

    // John Doe and Mike Johnson (contains "Johnson") should remain visible
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Mike Johnson")).toBeInTheDocument();
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

    // Verify API was called with the correct arguments
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
  });

  // CR-F026: Empty state
  it("CR-F026 - should render empty state when no candidates exist", async () => {
    candidateApi.getAll = vi.fn().mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 100,
      totalPages: 0,
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText("No candidates found")).toBeInTheDocument();
    });
  });

  // CR-F026: Network error
  it("CR-F026 - should show error message on network failure", async () => {
    candidateApi.getAll = vi.fn().mockRejectedValue({
      message: "Unable to connect",
      statusCode: 0,
      code: "NETWORK_ERROR",
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    // The specific network error message rendered by useCandidates + ErrorScreen
    expect(
      screen.getByText(
        /Unable to connect to the server/i,
      ),
    ).toBeInTheDocument();
  });

  // CR-F026: Add Candidate modal opens and closes
  it("CR-F026 - should open and close the Add Candidate modal", async () => {
    const user = userEvent.setup();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Open the modal
    const addButton = screen.getByRole("button", { name: /add candidate/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Add New Candidate")).toBeInTheDocument();
    });

    // Close via Cancel button
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Add New Candidate")).not.toBeInTheDocument();
    });
  });

  // CR-F026: Validation errors in add candidate form
  it("CR-F026 - should show validation errors when add candidate form is submitted empty", async () => {
    const user = userEvent.setup();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Open the modal
    const addButton = screen.getByRole("button", { name: /add candidate/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Add New Candidate")).toBeInTheDocument();
    });

    // Submit the empty form
    const submitButton = screen.getByRole("button", {
      name: /create candidate/i,
    });
    await user.click(submitButton);

    // Validation error messages should appear
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });

    expect(screen.getByText("Position is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Phone is required")).toBeInTheDocument();
  });

  // CR-F026: Skills load failure shows no error (graceful degradation)
  it("CR-F026 - should render the add candidate form even when skills fail to load", async () => {
    skillApi.getAll = vi.fn().mockRejectedValue(new Error("Skills API error"));

    const user = userEvent.setup();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Open the modal
    const addButton = screen.getByRole("button", { name: /add candidate/i });
    await user.click(addButton);

    // Form must still render despite skills fetch failure
    await waitFor(() => {
      expect(screen.getByText("Add New Candidate")).toBeInTheDocument();
    });

    // Core form fields should be present — query by placeholder to avoid
    // ambiguity with the search bar's aria-label "Search candidates by name"
    expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Frontend Developer"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("john.doe@example.com"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("+1234567890")).toBeInTheDocument();
  });
});
