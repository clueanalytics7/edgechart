import { useState, useMemo } from 'react';
import { FiTool, FiCheck, FiRefreshCw, FiHash, FiType, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import * as ss from 'simple-statistics';

export default function DataPrepTools({ data, onDataUpdated, onResetOriginal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cleaningStatus, setCleaningStatus] = useState('');

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  // Drop rows with any empty or null values
  const dropNullRows = () => {
    const beforeCount = data.length;
    const cleaned = data.filter((row) =>
      Object.values(row).every((val) => val !== null && val !== undefined && String(val).trim() !== '')
    );
    const droppedCount = beforeCount - cleaned.length;
    onDataUpdated(cleaned);
    notify(`Removed ${droppedCount} incomplete rows (${cleaned.length} rows remaining)`);
  };

  // Fill empty numeric cells with column mean
  const imputeMeans = () => {
    let filledCount = 0;
    const means = {};

    // Calculate means for numeric columns
    columns.forEach((col) => {
      const nums = data.map((r) => parseFloat(r[col])).filter((v) => !isNaN(v));
      if (nums.length > 0) {
        means[col] = ss.mean(nums);
      }
    });

    const cleaned = data.map((row) => {
      const copy = { ...row };
      columns.forEach((col) => {
        const val = copy[col];
        if ((val === null || val === undefined || String(val).trim() === '') && means[col] !== undefined) {
          copy[col] = Math.round(means[col] * 100) / 100;
          filledCount++;
        }
      });
      return copy;
    });

    onDataUpdated(cleaned);
    notify(`Imputed ${filledCount} missing values with column averages`);
  };

  // Trim whitespace
  const trimWhitespace = () => {
    let trimmedCount = 0;
    const cleaned = data.map((row) => {
      const copy = { ...row };
      columns.forEach((col) => {
        if (typeof copy[col] === 'string') {
          const trimmed = copy[col].trim();
          if (trimmed !== copy[col]) {
            copy[col] = trimmed;
            trimmedCount++;
          }
        }
      });
      return copy;
    });
    onDataUpdated(cleaned);
    notify(`Trimmed whitespace from ${trimmedCount} text cells`);
  };

  const notify = (msg) => {
    setCleaningStatus(msg);
    setTimeout(() => setCleaningStatus(''), 4000);
  };

  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors"
        >
          <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FiTool className="w-3.5 h-3.5" />
          </div>
          <span>Data Cleaning & Preparation</span>
          {isOpen ? <FiChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <FiChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {cleaningStatus && (
          <span className="text-2xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 animate-fade-in">
            {cleaningStatus}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={dropNullRows}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors"
          >
            <FiTrash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Drop Null / Incomplete Rows</span>
          </button>

          <button
            onClick={imputeMeans}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors"
          >
            <FiHash className="w-3.5 h-3.5 text-indigo-500" />
            <span>Fill Missing with Averages</span>
          </button>

          <button
            onClick={trimWhitespace}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors"
          >
            <FiType className="w-3.5 h-3.5 text-blue-500" />
            <span>Trim Whitespace</span>
          </button>

          {onResetOriginal && (
            <button
              onClick={onResetOriginal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-500 hover:text-slate-800 text-xs ml-auto transition-colors"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              <span>Reset Cleaned Data</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
