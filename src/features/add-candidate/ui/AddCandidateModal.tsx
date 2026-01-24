import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import type { CreateCandidatePayload } from "../../../shared/api/candidateApi";
import { skillApi } from "../../../shared/api/skillApi";
import { isApiError } from "../../../shared/api/types";
import type { CandidateStatus, Skill } from "../../../shared/types/candidate";
import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";
import Modal from "../../../shared/ui/Modal";
import { MultiSelect } from "../../../shared/ui/MultiSelect";
import { Select } from "../../../shared/ui/Select";
import { Textarea } from "../../../shared/ui/Textarea";

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCandidatePayload) => Promise<void>;
}

interface FormData {
  name: string;
  position: string;
  email: string;
  phone: string;
  description: string;
  status: CandidateStatus;
  skillIds: number[];
}

interface FormErrors {
  name?: string;
  position?: string;
  email?: string;
  phone?: string;
  description?: string;
  status?: string;
  skillIds?: string;
  general?: string;
}

const initialFormData: FormData = {
  name: "",
  position: "",
  email: "",
  phone: "",
  description: "",
  status: "active",
  skillIds: [],
};

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "interview", label: "Interview" },
  { value: "rejected", label: "Rejected" },
];

const AddCandidateModal: FC<AddCandidateModalProps> = (props) => {
  const { isOpen, onClose, onSubmit } = props;
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
      setErrors({});
      setIsSubmitting(false);
      return;
    }

    const fetchSkills = async () => {
      try {
        setSkillsLoading(true);
        const data = await skillApi.getAll();
        setSkills(data);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setSkillsLoading(false);
      }
    };

    fetchSkills();
  }, [isOpen]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name?.length < 2 || formData.name?.length > 100) {
      newErrors.name = "Name must be between 2 and 100 characters";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    } else if (
      formData.position?.length < 2 ||
      formData.position?.length > 100
    ) {
      newErrors.position = "Position must be between 2 and 100 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (
      formData.description.trim() &&
      (formData.description?.length < 10 || formData.description?.length > 2000)
    ) {
      newErrors.description =
        "Description must be between 10 and 2000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload: CreateCandidatePayload = {
        name: formData.name.trim(),
        position: formData.position.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        status: formData.status,
        skillIds: formData.skillIds,
      };

      if (formData.description.trim()) {
        payload.description = formData.description.trim();
      }

      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error("Failed to create candidate:", error);

      let errorMessage = "Failed to create candidate. Please try again.";

      if (isApiError(error)) {
        if (error.statusCode === 409) {
          errorMessage =
            error.message || "Email or phone number already exists";
        } else if (error.statusCode === 429) {
          errorMessage =
            "Too many requests. Please wait a moment and try again.";
        } else if (error.statusCode >= 500) {
          errorMessage = "Server error occurred. Please try again later.";
        } else {
          errorMessage = error.message || errorMessage;
        }
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (
    field: keyof FormData,
    value: string | number[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Candidate">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="name"
            label="Name *"
            value={formData.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            error={errors.name}
            placeholder="John Doe"
            disabled={isSubmitting}
          />

          <Input
            id="position"
            label="Position *"
            value={formData.position}
            onChange={(e) => handleFieldChange("position", e.target.value)}
            error={errors.position}
            placeholder="Frontend Developer"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="email"
            type="email"
            label="Email *"
            value={formData.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            error={errors.email}
            placeholder="john.doe@example.com"
            disabled={isSubmitting}
          />

          <Input
            id="phone"
            type="tel"
            label="Phone *"
            value={formData.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            error={errors.phone}
            placeholder="+1234567890"
            disabled={isSubmitting}
          />
        </div>

        <Select
          id="status"
          label="Status"
          value={formData.status}
          onChange={(e) =>
            handleFieldChange("status", e.target.value as CandidateStatus)
          }
          options={statusOptions}
          error={errors.status}
          disabled={isSubmitting}
        />

        {skillsLoading ? (
          <div className="text-sm text-gray-500">Loading skills...</div>
        ) : (
          <MultiSelect
            label="Skills"
            options={skills}
            selectedIds={formData.skillIds}
            onChange={(skillIds) => handleFieldChange("skillIds", skillIds)}
            error={errors.skillIds}
            placeholder="Select skills..."
          />
        )}

        <Textarea
          id="description"
          label="Description"
          value={formData.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          error={errors.description}
          placeholder="Brief description about the candidate..."
          rows={4}
          disabled={isSubmitting}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Candidate"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCandidateModal;
