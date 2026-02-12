import React from 'react';

interface ActionCardProps {
  title: string;
  metadata: string;
  value: string;
  error?: string;
  buttonText: string;
  buttonPending?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  metadata,
  value,
  error,
  buttonText,
  buttonPending = false,
  disabled = false,
  onChange,
  onSubmit
}) => {
  return (
    <div className="action-card">
      <h3>{title}</h3>
      <p className="action-meta">{metadata}</p>
      <input
        type="number"
        min="0"
        step="0.000001"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'input-error' : ''}
      />
      {error && <p className="field-error">{error}</p>}
      <button
        className="primary"
        disabled={disabled}
        onClick={onSubmit}
      >
        {buttonPending ? 'Pending...' : buttonText}
      </button>
    </div>
  );
};
