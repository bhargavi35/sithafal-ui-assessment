import React, { useState } from 'react';
import { useStudentFilter } from './hooks/useStudentFilter';
import FilterPanel from './components/FilterPanel';
import StatusBadge from './components/StatusBadge';

export default function App() {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeShortSheet, setActiveShortSheet] = useState(null);

  // Custom Toast State Configuration
  const [toastMessage, setToastMessage] = useState(null);

  const { searchTerm, setSearchTerm, filters, handleFilterChange, clearFilters, filteredStudents } = useStudentFilter();

  // Helper trigger to show custom validation toast message
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredStudents.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredStudents.map(s => s.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  // Short Sheet Generation with Safe Numeric Metrics
  const handleGenerateShortSheet = () => {
    if (selectedRows.length <= 2) {
      triggerToast("❌ Action Blocked: Please select more than 2 student profiles to generate a short sheet.");
      return;
    }

    // Filter out the selected student records
    const selectedProfiles = filteredStudents.filter(s => selectedRows.includes(s.id));

    // Set the structural data to our new modal state to show it on screen
    setActiveShortSheet({
      count: selectedRows.length,
      students: selectedProfiles
    });

    // Clear checked rows
    setSelectedRows([]);
    triggerToast(`🚀 Short Sheet workflow initialized for ${selectedProfiles.length} students!`);
  };

  //  CSV Data Exporter Compilation & Immediate File Download
  const handleExportToCSV = () => {
    if (selectedRows.length <= 2) {
      triggerToast("❌ Action Blocked: Please select more than 2 student profiles before downloading a CSV data sheet.");
      return;
    }

    const targets = filteredStudents.filter(s => selectedRows.includes(s.id));

    const csvHeaders = ["Student ID", "Name", "TRS", "Rank", "AFSC", "Grad Date", "Gaining Location", "Gaining PASCODE", "RNLTD", "Status"];

    const csvRows = targets.map(s => [
      `"${s.id}"`, `"${s.name}"`, `"${s.trs}"`, `"${s.rank}"`, `"${s.afsc}"`,
      `"${s.gradDate}"`, `"${s.gainingLocation}"`, `"${s.gainingPascode}"`, `"${s.rnltd}"`, `"${s.status}"`
    ].join(","));

    const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders.join(","), ...csvRows].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `USAF_SPC_Filtered_Students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSelectedRows([]);

    triggerToast(`🎉 Data sheet successfully processed! Downloaded ${targets.length} student profile entries.`);
  };

  //  sidebar navigation 
  const sidebarNavigationTop = [
    { label: 'Dashboard', icon: '📊' },
    { label: 'Students', icon: '👥', active: true },
    { label: 'Completed Students', icon: '📁' },
    { label: 'Import Students Data', icon: '📥' },
    { label: 'Announcements', icon: '📢' },
    { label: 'Calendar', icon: '📅' },
    { label: 'Knowledge Graph', icon: '📖' },
    { label: 'Policy Memos & Guidelines', icon: '📄' },
    { label: 'Points of Contact', icon: '📇' },
    { label: 'Q&A', icon: '❓' },
    { label: 'Quick Links', icon: '🔗' },
  ];

  const sidebarNavigationBottom = [
    { label: 'PII', icon: '🛡️' },
    { label: 'Settings', icon: '⚙️' },
    { label: 'Site Feedback', icon: '💬' },
    { label: 'Release Notes', icon: '📋' },
  ];

  return (
    <div className="flex h-screen w-screen bg-slate-50 font-sans text-gray-800 overflow-hidden select-none relative">

      {/* GLOBAL TOAST DISPLAY */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 transition-all duration-300 animate-bounce">
          <span className="text-sm">⚠️</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-4 text-slate-400 hover:text-white font-bold">×</button>
        </div>
      )}

      {/* Sidebar Layout Canvas */}
      <aside className="w-64 bg-[#111A2C] text-slate-300 flex flex-col justify-between p-3 flex-shrink-0 border-r border-slate-900 overflow-y-auto">
        <div>
          <div className="flex items-center justify-between mb-6 px-2 pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-xs shadow-md">🛩️</div>
              <div>
                <h1 className="text-xs font-bold text-white tracking-wide leading-none">USAF - SPC</h1>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Digital Student Processing</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            </button>
          </div>

          <nav className="space-y-0.5">
            {sidebarNavigationTop.map((item) => (
              <button key={item.label} className={`w-full flex items-center gap-3 text-[11px] font-bold px-3 py-2 rounded-md transition duration-150 ${item.active ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'}`}>
                <span className="text-sm opacity-80">{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800/60 mt-4">
          <nav className="space-y-0.5">
            {sidebarNavigationBottom.map((item) => (
              <button key={item.label} className="w-full flex items-center gap-3 text-[11px] font-bold px-3 py-1.5 rounded-md hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition duration-150">
                <span className="text-sm opacity-80">{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Core Window Context Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Profile Header */}
        <div className="h-11 bg-white border-b border-gray-200 px-6 flex items-center justify-end flex-shrink-0 gap-4">
          <button className="text-gray-400 hover:text-gray-600 relative p-1 transition">
            <span className="text-sm">🔔</span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
          </button>
          <div className="flex items-center gap-1.5 border border-blue-600 rounded-full pl-2 pr-3.5 py-1 bg-white hover:bg-blue-50/50 transition cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-blue-600 text-white font-black text-[9px] flex items-center justify-center">👤</div>
            <span className="text-[11px] font-bold text-slate-700">Profile</span>
          </div>
        </div>

        {/* Global Filter */}
        <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-extrabold text-gray-900 text-xs uppercase tracking-wider">
              <span className="text-blue-600 text-sm">👥</span> Students
            </div>

            <div className="flex items-center gap-1.5 ml-4">
              <div className="relative w-64">
                <span className="absolute left-2.5 top-2 text-gray-400 text-xs">🔍</span>
                <input
                  type="text"
                  placeholder="Search Student ID or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-7 pr-3 py-1 border border-gray-200 rounded bg-slate-50 text-[11px] font-medium focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-1 border rounded transition flex items-center justify-center ${isFilterOpen ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleGenerateShortSheet}
              className="bg-[#056846] text-white px-3 py-1.5 rounded text-[11px] font-bold hover:bg-emerald-800 transition shadow-sm flex items-center gap-1 relative"
            >
              📝 Generate Short Sheet
              {selectedRows.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow animate-pulse">
                  {selectedRows.length}
                </span>
              )}
            </button>
            <button
              onClick={handleExportToCSV}
              className="bg-[#145E35] text-white px-3 py-1.5 rounded text-[11px] font-bold hover:bg-green-800 transition shadow-sm"
            >
              📊 Export to CSV
            </button>
          </div>
        </header>

        {/* Canvas Table View */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-5 overflow-y-auto min-w-0">
            <div className="mb-3 border-b border-gray-200 pb-2">
              <h2 className="text-[12px] font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-600 inline-block pb-2 translate-y-[9px]">
                Active Students ({filteredStudents.length}) {selectedRows.length > 0 && <span className="text-slate-400 font-normal text-xs font-sans italic lowercase">({selectedRows.length} selected items active)</span>}
              </h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-slate-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 w-10"><input type="checkbox" checked={selectedRows.length === filteredStudents.length && filteredStudents.length > 0} onChange={toggleSelectAll} className="rounded" /></th>
                    <th className="p-3">Student ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">TRS</th>
                    <th className="p-3">Rank</th>
                    <th className="p-3">AFSC</th>
                    <th className="p-3">Grad Date</th>
                    <th className="p-3">Gaining Location</th>
                    <th className="p-3">Gaining PASCODE</th>
                    <th className="p-3">RNLTD</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold bg-white">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className={`hover:bg-slate-50/80 transition-colors ${selectedRows.includes(student.id) ? 'bg-blue-50/40' : ''}`}>
                      <td className="p-3"><input type="checkbox" checked={selectedRows.includes(student.id)} onChange={() => toggleSelectRow(student.id)} className="rounded text-blue-600 w-3.5 h-3.5" /></td>
                      <td className="p-3 font-bold text-blue-600 whitespace-nowrap">▶ {student.id}</td>
                      <td className="p-3 whitespace-nowrap text-gray-900">{student.name}</td>
                      <td className="p-3 whitespace-nowrap">{student.trs}</td>
                      <td className="p-3">{student.rank}</td>
                      <td className="p-3 font-mono text-gray-600">{student.afsc}</td>
                      <td className="p-3 text-gray-500 whitespace-nowrap">{student.gradDate}</td>
                      <td className="p-3 text-gray-900 whitespace-nowrap">{student.gainingLocation}</td>
                      <td className="p-3 font-mono text-gray-400">{student.gainingPascode}</td>
                      <td className="p-3 text-gray-500 whitespace-nowrap">{student.rnltd}</td>
                      <td className="p-3"><StatusBadge status={student.status} /></td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan="11" className="text-center p-8 text-gray-400 font-normal">No student profiles found matching the current search parameters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <FilterPanel
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={clearFilters}
            currentFilteredData={filteredStudents}
          />
        </div>
      </main>

      {/* DYNAMIC SHORT SHEET SUMMARY MODAL OVERLAY */}
      {activeShortSheet && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-[480px] max-h-[80vh] flex flex-col overflow-hidden border border-slate-100">

            <div className="p-4 bg-[#121E42] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm">📋</span>
                <h3 className="text-xs font-bold uppercase tracking-wider">Generated Short Sheet Summary</h3>
              </div>
              <button
                onClick={() => setActiveShortSheet(null)}
                className="text-slate-300 hover:text-white font-bold text-lg bg-white/10 w-6 h-6 flex items-center justify-center rounded-md"
              >
                ×
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
              <p className="text-xs text-slate-500 font-medium">
                Successfully batched <span className="font-bold text-blue-600">{activeShortSheet.count}</span> student processing records for operational synchronization:
              </p>
              <div className="space-y-1.5">
                {activeShortSheet.students.map((student) => (
                  <div key={student.id} className="bg-slate-50 border border-slate-200 p-2 rounded-lg flex justify-between items-center text-[11px] font-semibold">
                    <div>
                      <span className="text-blue-600 font-bold mr-2">▶ {student.id}</span>
                      <span className="text-slate-800">{student.name}</span>
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                      {student.trs}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveShortSheet(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}