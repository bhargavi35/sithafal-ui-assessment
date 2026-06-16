import React from 'react';

export default function FilterPanel({ isOpen, onClose, filters, onFilterChange, onClear, currentFilteredData }) {
  if (!isOpen) return null;

  const filterFields = [
    { label: 'Calendar Year', key: 'calendarYear', options: ['All', '2025', '2026'] },
    { label: 'Branch', key: 'branch', options: ['All', 'Air Force', 'Space Force'] },
    { label: 'TRS', key: 'trs', options: ['All', '333 TRS', '336 TRS', '338 TRS'] },
    { label: 'Rank', key: 'rank', options: ['All', 'SP4', 'Amn', 'A1C', 'AB'] },
    { label: 'AFSC', key: 'afsc', options: ['All', '1B431', '1C131', '1C5X1', '1C731'] },
    { label: 'Gaining Location', key: 'gainingLocation', options: ['All', 'JB ANDREWS AFB', 'Eglin AFB', 'Altus AFB'] },
    { label: 'Gaining PASCODE', key: 'gainingPascode', options: ['All', 'AU06F4Q7', 'KF6TFLG9', 'AU6FF6VF'] },
    { label: 'PPC', key: 'ppc', options: ['All', 'PPC-1', 'PPC-2', 'PPC-3'] },
  ];

  const getCountByStatus = (statusName) => {
    return currentFilteredData.filter(s => s.status === statusName).length;
  };

  return (
    <div className="w-[340px] bg-white border-l border-gray-200 h-full overflow-y-auto flex flex-col shadow-2xl z-20 flex-shrink-0">
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
            <span className="p-1 bg-blue-600 text-white rounded text-xs">⚙️</span> Filters
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClear} className="text-[11px] font-bold text-blue-600 border border-blue-200 px-2.5 py-0.5 rounded-full hover:bg-blue-50 transition">
              Clear All
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filterFields.map(field => (
            <div key={field.key} className="flex flex-col">
              <label className="text-[11px] font-bold text-gray-900 mb-1">{field.label}</label>
              <select 
                value={filters[field.key]} 
                onChange={(e) => onFilterChange(field.key, e.target.value)}
                className="border border-gray-200 rounded-lg p-1.5 text-xs bg-white text-gray-700 font-medium focus:outline-none focus:border-blue-500 transition cursor-pointer"
              >
                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-slate-50 flex-1 space-y-3 overflow-y-auto border-t border-gray-100">
        <div className="bg-[#121E42] text-white rounded-lg flex overflow-hidden shadow-sm">
          <div className="p-3 text-[10px] font-bold uppercase tracking-wider flex-1 flex items-center">Total Students Shown</div>
          <div className="bg-[#4E68B4] px-4 py-3 text-base font-extrabold flex items-center justify-center min-w-[60px]">
            {currentFilteredData.length}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white border border-gray-200 border-l-4 border-l-pink-500 p-2 rounded shadow-sm">
            <p className="text-sm font-extrabold text-pink-600 leading-none">{getCountByStatus('Out-Processing Initiated')}</p>
            <p className="text-[9px] font-bold text-gray-400 mt-1">Out-Processing Initiated</p>
          </div>
          
          <div className="bg-white border border-gray-200 border-l-4 border-l-yellow-500 p-2 rounded shadow-sm">
            <p className="text-sm font-extrabold text-yellow-600 leading-none">{getCountByStatus('Pending Assignment')}</p>
            <p className="text-[9px] font-bold text-gray-400 mt-1">Pending Assignment</p>
          </div>

          <div className="bg-white border border-gray-200 border-l-4 border-l-blue-500 p-2 rounded shadow-sm">
            <p className="text-sm font-extrabold text-blue-600 leading-none">{getCountByStatus('Waiting for Short Sheet QC')}</p>
            <p className="text-[9px] font-bold text-gray-400 mt-1">Waiting for Short Sheet QC</p>
          </div>

          <div className="bg-white border border-gray-200 border-l-4 border-l-purple-500 p-2 rounded shadow-sm">
            <p className="text-sm font-extrabold text-purple-600 leading-none">{getCountByStatus('Short Sheet QC Completed')}</p>
            <p className="text-[9px] font-bold text-gray-400 mt-1">Short Sheet QC Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}