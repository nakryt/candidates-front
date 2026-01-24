import type { FC } from "react";
import { STATUS_LABELS, STATUS_OPTIONS } from "../../shared/constants/status";
import type { CandidateStatus } from "../../shared/types/candidate";
import { Select } from "../../shared/ui/Select";

interface StatusSelectProps {
  currentStatus: CandidateStatus;
  onChange: (status: CandidateStatus) => void;
  disabled?: boolean;
}

const StatusSelect: FC<StatusSelectProps> = (props) => {
  const { currentStatus, onChange, disabled } = props;
  const options = STATUS_OPTIONS.map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
  }));

  return (
    <Select
      value={currentStatus}
      onChange={(e) => onChange(e.target.value as CandidateStatus)}
      options={options}
      disabled={disabled}
      className="w-full"
      aria-label="Change candidate status"
    />
  );
};

export default StatusSelect;
