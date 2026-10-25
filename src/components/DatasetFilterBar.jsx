import { useState, useMemo } from 'react';
import { FiFilter, FiX, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { analyzeColumns } from '../lib/dataParser';

export default function DatasetFilterBar({ rawData, onFilterChange }) {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);

  // Detect categorical text columns suitable for filtering
  const { textCols } = useMemo(() => {
    if (!rawData || rawData.length === 0) return { textCols: [] };
    const analysis = analyzeColumns(rawData);
    // Include text columns, or columns with < 30 unique values
    const candidateCols = analysis.columns.filter((col) => {
      if (analysis.textCols.includes(col)) return true;
      const uniqueVals = new Set(rawData.map((r) => String(r[col] ?? ''))).size;
      return uniqueVals > 1 && uniqueVals <= 25;
    });
    return { textCols: candidateCols };
  }, [rawData]);

  // Set default filter column when columns load
  const activeCol = selectedColumn || textCols[0] || '';

  // Get unique distinct values for the active filter column
  const distinctValues = useMemo(() => {
    if (!rawData || !activeCol) return [];
    const counts = {};
    rawData.forEach((row) => {
      const val = String(row[activeCol] ?? '');
      if (val.trim() !== '') {
        counts[val] = (counts[val] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([val, count]) => ({ val, count }));
  }, [rawData, activeCol]);

  // Handle column change
  const handleColumnChange = (newCol) => {
    setSelectedColumn(newCol);
    setSelectedValues([]);
    onFilterChange(null);
  };

  // Toggle a single value filter
  const toggleValue = (val) => {
    let next;
    if (selectedValues.includes(val)) {
      next = selectedValues.filter((v) => v !== val);
    } else {
      next = [...selectedValues, val];
    }
    setSelectedValues(next);
    applyFilter(activeCol, next);
  };

  // Select all or clear all
  const selectAll = () => {
    const allVals = distinctValues.map((d) => d.val);
    setSelectedValues(allVals);
    applyFilter(activeCol, allVals);
  };

  const clearFilter = () => {
    setSelectedValues([]);
    onFilterChange(null);
  };

  const applyFilter = (col, vals) => {
    if (!vals || vals.length === 0) {
      onFilterChange(null);
      return;
    }
    onFilterChange((row) => {
      const rowVal = String(row[col] ?? '');
      return vals.includes(rowVal);
    });
  };

  if (!rawData || rawData.length === 0 || textCols.length === 0) return null;

  const isFiltering = selectedValues.length > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FiFilter className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Filter By Column:</span>
            <select
              value={activeCol}
              onChange={(e) => handleColumnChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:bg-white"
            >
              {textCols.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isFiltering ? (
            <button
              onClick={clearFilter}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200/60 transition-colors"
            >
              <FiX className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </button>
          ) : (
            <button
              onClick={selectAll}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              Select All Values
            </button>
          )}
        </div>
      </div>

      {/* Categorical value filter chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 max-h-24 overflow-y-auto">
        <span className="text-xs text-slate-400 mr-1">Values:</span>
        {distinctValues.map(({ val, count }) => {
          const isSelected = selectedValues.includes(val);
          return (
            <button
              key={val}
              onClick={() => toggleValue(val)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs transition-colors ${
                isSelected
                  ? 'bg-blue-600 text-white font-medium shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isSelected && <FiCheck className="w-3 h-3" />}
              <span className="truncate max-w-[150px]">{val}</span>
              <span className={`text-2xs font-mono tabular-nums ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
