import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  Candidate,
  CandidateStatus,
} from "../entities/candidate/model/types";
import { useCandidates } from "../entities/candidate/model/useCandidates";
import { useFilters } from "../features/candidate-filters/model/useFilters";
import { FilterBar } from "../features/candidate-filters/ui/FilterBar";
import type { CreateCandidatePayload } from "../shared/api/candidateApi";
import { useToast } from "../shared/hooks/useToast";
import { PageLayout } from "../shared/layout/PageLayout";
import { filterCandidates } from "../shared/lib/filterCandidates";
import { lazyWithPreload } from "../shared/lib/lazyWithPreload";
import { LoadingScreen } from "../shared/states/LoadingScreen";
import { Button } from "../shared/ui/Button";
import { ErrorBoundary } from "../shared/ui/ErrorBoundary";
import { Plus } from "../shared/ui/icons";
import {
  InlineLoadingFallback,
  LazyLoadFallback,
} from "../shared/ui/LazyLoadFallback";

const { lazy: CandidateGrid, preload: preloadCandidateGrid } = lazyWithPreload(
  () => import("../entities/candidate/ui/CandidateGrid"),
);
const { lazy: CandidateDetails, preload: preloadCandidateDetails } =
  lazyWithPreload(() => import("../entities/candidate/ui/CandidateDetails"));
const { lazy: Modal, preload: preloadModal } = lazyWithPreload(
  () => import("../shared/ui/Modal"),
);
const { lazy: AddCandidateModal, preload: preloadAddCandidateModal } =
  lazyWithPreload(
    () => import("../features/add-candidate/ui/AddCandidateModal"),
  );

const EmptyState = lazy(() => import("../shared/states/EmptyState"));
const ErrorScreen = lazy(() => import("../shared/states/ErrorScreen"));

export const App = () => {
  const {
    candidates,
    loading,
    error,
    updateCandidateStatus,
    createCandidate,
    refetch,
  } = useCandidates();

  const {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  } = useFilters();

  const { showToast } = useToast();

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredCandidates = useMemo(
    () =>
      filterCandidates(candidates ?? [], debouncedSearchQuery, statusFilter),
    [candidates, debouncedSearchQuery, statusFilter],
  );

  // Preload grid component when data is available
  useEffect(() => {
    if (!loading && !error && candidates?.length > 0) {
      preloadCandidateGrid();
    }
  }, [loading, error, candidates?.length]);

  // Handler to preload modal and details on hover
  const handlePreloadDetails = useCallback(() => {
    preloadModal();
    preloadCandidateDetails();
  }, []);

  const handleViewDetails = useCallback((candidate: Candidate) => {
    // Preload modal and details components when opening (in case hover didn't trigger)
    preloadModal();
    preloadCandidateDetails();
    setSelectedCandidate(candidate);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCandidate(null);
  }, []);

  const handleStatusChange = useCallback(
    async (id: number, newStatus: CandidateStatus) => {
      try {
        const updated = await updateCandidateStatus(id, newStatus);

        if (selectedCandidate?.id === id) {
          setSelectedCandidate(updated);
        }

        showToast("Status updated successfully!", "success");
      } catch {
        showToast("Failed to update status. Please try again.", "error");
      }
    },
    [updateCandidateStatus, selectedCandidate, showToast],
  );

  const handleOpenAddModal = useCallback(() => {
    preloadAddCandidateModal();
    setIsAddModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleCreateCandidate = useCallback(
    async (payload: CreateCandidatePayload) => {
      await createCandidate(payload);
      showToast("Candidate created successfully!", "success");
    },
    [createCandidate, showToast],
  );

  const renderContent = () => {
    if (loading) return <LoadingScreen />;
    if (error)
      return (
        <ErrorBoundary>
          <Suspense fallback={<LazyLoadFallback minHeight="400px" />}>
            <ErrorScreen message={error} onRetry={refetch} />
          </Suspense>
        </ErrorBoundary>
      );
    if (filteredCandidates?.length === 0)
      return (
        <ErrorBoundary>
          <Suspense fallback={<LazyLoadFallback minHeight="400px" />}>
            <EmptyState />
          </Suspense>
        </ErrorBoundary>
      );
    return (
      <ErrorBoundary>
        <Suspense fallback={<LazyLoadFallback variant="grid" />}>
          <CandidateGrid
            candidates={filteredCandidates}
            onViewDetails={handleViewDetails}
            onPreloadDetails={handlePreloadDetails}
          />
        </Suspense>
      </ErrorBoundary>
    );
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Candidates
          </h2>
          <Button
            variant="primary"
            onClick={handleOpenAddModal}
            onMouseEnter={() => preloadAddCandidateModal()}
            className="w-full sm:w-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Candidate
          </Button>
        </div>

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {renderContent()}
      </div>

      {selectedCandidate && (
        <ErrorBoundary>
          <Suspense fallback={<InlineLoadingFallback />}>
            <Modal
              isOpen={!!selectedCandidate}
              onClose={handleCloseModal}
              title="Candidate Profile"
            >
              <Suspense fallback={<LazyLoadFallback variant="details" />}>
                <CandidateDetails
                  candidate={selectedCandidate}
                  onStatusChange={handleStatusChange}
                />
              </Suspense>
            </Modal>
          </Suspense>
        </ErrorBoundary>
      )}

      {isAddModalOpen && (
        <ErrorBoundary>
          <Suspense fallback={<InlineLoadingFallback />}>
            <AddCandidateModal
              isOpen={isAddModalOpen}
              onClose={handleCloseAddModal}
              onSubmit={handleCreateCandidate}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </PageLayout>
  );
};
