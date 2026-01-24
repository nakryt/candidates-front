import type { FC } from "react";
import StatusSelect from "../../../features/candidate-status-update/StatusSelect";
import { Avatar } from "../../../shared/ui/Avatar";
import { Chip } from "../../../shared/ui/Chip";
import { Calendar, Mail, Phone } from "../../../shared/ui/icons";
import type { Candidate, CandidateStatus } from "../model/types";

interface CandidateDetailsProps {
  candidate: Candidate;
  onStatusChange: (id: number, status: CandidateStatus) => Promise<void>;
}

const CandidateDetails: FC<CandidateDetailsProps> = (props) => {
  const { candidate, onStatusChange } = props;
  const handleChangeStatus = (status: CandidateStatus) =>
    onStatusChange(candidate.id, status);

  const appliedDate = new Date(candidate.createdAt).toLocaleDateString();
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Avatar name={candidate.name} size="xl" />
        <div className="text-center sm:text-left pt-2">
          <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
          <p className="text-lg text-gray-500 font-medium">
            {candidate.position}
          </p>

          <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4">
            <a
              href={`mailto:${candidate.email}`}
              className="inline-flex items-center text-sm text-blue-600 hover:underline"
            >
              <Mail className="h-4 w-4 mr-1.5" />
              {candidate.email}
            </a>
            <a
              href={`tel:${candidate.phone}`}
              className="inline-flex items-center text-sm text-blue-600 hover:underline"
            >
              <Phone className="h-4 w-4 mr-1.5" />
              {candidate.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Description
            </h4>
            <p className="text-gray-600 leading-relaxed">
              {candidate.description}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <Chip key={skill.id} label={skill.name} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Application Status
            </h4>
            <StatusSelect
              currentStatus={candidate.status}
              onChange={handleChangeStatus}
            />

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                Applied on {appliedDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
