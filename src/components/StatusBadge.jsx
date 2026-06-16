import React from 'react';

export default function StatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status) {
      case 'Out-Processing Initiated':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'Pending Assignment':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Waiting for Short Sheet QC':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Short Sheet QC Completed':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${getStatusStyles()}`}>
      {status}
    </span>
  );
}