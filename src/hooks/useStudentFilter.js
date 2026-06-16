import { useState, useMemo } from 'react';
import { mockStudents } from '../data/mockStudents';

const initialFilters = {
  calendarYear: 'All', rnltdMonth: 'All', branch: 'All', trs: 'All',
  mtl: 'All', rank: 'All', afsc: 'All', gainingLocation: 'All',
  gainingPascode: 'All', ppc: 'All', rnltd: 'All'
};

export function useStudentFilter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters(initialFilters);

  const filteredStudents = useMemo(() => {
    return mockStudents.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.id.includes(searchTerm);
      
      const matchesDropdowns = Object.keys(filters).every(key => {
        if (filters[key] === 'All') return true;
        return String(student[key]).toLowerCase() === String(filters[key]).toLowerCase();
      });

      return matchesSearch && matchesDropdowns;
    });
  }, [searchTerm, filters]);

  return { searchTerm, setSearchTerm, filters, handleFilterChange, clearFilters, filteredStudents };
}