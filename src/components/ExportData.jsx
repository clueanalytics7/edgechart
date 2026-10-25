import { useState } from 'react';
import { FiDownload, FiCheck, FiCopy, FiChevronDown } from 'react-icons/fi';

export default function ExportData({ data }) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  if (!data || data.length === 0) return null;

  const exportToCSV = () => {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((h) => {
            const val = row[h] ?? '';
            return typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))
              ? `"${val.replace(/"/g, '""')}"`
              : val;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `edgechart-export-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const exportToJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `edgechart-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const copyToClipboardTSV = async () => {
    const headers = Object.keys(data[0]);
    const tsvContent = [
      headers.join('\t'),
      ...data.map((row) => headers.map((h) => row[h] ?? '').join('\t')),
    ].join('\n');

    try {
      await navigator.clipboard.writeText(tsvContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to copy TSV to clipboard:', err);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div className="inline-flex rounded-lg shadow-2xs">
        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-l-lg transition-colors"
        >
          <FiDownload className="w-3.5 h-3.5 text-blue-600" />
          <span>Export CSV</span>
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-2 py-1.5 text-xs text-slate-600 bg-white hover:bg-slate-50 border border-l-0 border-slate-200 rounded-r-lg transition-colors"
          title="More export options"
        >
          <FiChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-48 rounded-xl bg-white border border-slate-200 shadow-md py-1 z-30 text-xs">
            <button
              onClick={exportToCSV}
              className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Download as .CSV</span>
              <FiDownload className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={exportToJSON}
              className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Download as .JSON</span>
              <FiDownload className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={copyToClipboardTSV}
              className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center justify-between border-t border-slate-100"
            >
              <span>Copy TSV (Paste to Sheets)</span>
              {copied ? (
                <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <FiCopy className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
