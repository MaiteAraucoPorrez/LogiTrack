import React from 'react';
import { Chip } from '@mui/material';

type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

const STATUS_COLORS: Record<string, StatusVariant> = {
  Available: 'success',
  Active: 'success',
  Delivered: 'success',
  Confirmed: 'info',
  'In Transit': 'info',
  'On Duty': 'info',
  'In Use': 'warning',
  Processing: 'warning',
  Pending: 'warning',
  'On Leave': 'warning',
  Maintenance: 'warning',
  Cancelled: 'error',
  Inactive: 'error',
};

const CHIP_COLORS: Record<StatusVariant, string> = {
  success: '#2e7d32',
  info: '#0288d1',
  warning: '#ed6c02',
  error: '#d32f2f',
  default: '#757575',
};

interface StatusChipProps {
  label: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ label }) => {
  const variant = STATUS_COLORS[label] ?? 'default';
  const color = CHIP_COLORS[variant];

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: `${color}18`,
        color,
        fontWeight: 600,
        border: `1px solid ${color}40`,
      }}
    />
  );
};

export default StatusChip;
