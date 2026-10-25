import { useMemo } from 'react';
import { FiDatabase, FiColumns, FiHash, FiType, FiCheckSquare, FiRefreshCw } from 'react-icons/fi';
import { analyzeColumns } from '../lib/dataParser';

export default function DatasetSummary({ data, datasetName, onReset }) {
  const analysis = useMemo(() => {
    if (!data || data.length === 0) return null;

    const { columns, numericCols, textCols, dateCols } = analyzeColumns(data);
    const totalCells = data.length * columns.length;
    let filledCells = 0;

    data.forEach(row => {
      columns.forEach(col => {
        const val = row[col];
        if (val !== undefined && val !== null && val !== '') filledCells++;
      });
    });

    const completeness = totalCells > 0 ? ((filledCells / totalCells) * 100).toFixed(1) : '100';
    const estimatedKb = Math.round((JSON.stringify(data).length / 1024) * 10) / 10;

    return {
      rowCount: data.length,
      colCount: columns.length,
      numericCount: numericCols.length,
      textCount: textCols.length,
      dateCount: dateCols.length,
      completeness,
      estimatedKb
    };
  }, [data]);

  if (!analysis) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FiDatabase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 leading-tight">
              {datasetName || 'Active Dataset'}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>Client-side in-memory</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{analysis.estimatedKb} KB</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600 font-medium">100% Private</span>
            </div>
          </div>
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            <span>Load Different Data</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50">
          <div className="p-2 bg-white rounded-md text-slate-600 shadow-2xs">
            <FiHash className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Total Rows</div>
            <div className="text-sm font-semibold text-slate-900 font-mono tabular-nums">
              {analysis.rowCount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50">
          <div className="p-2 bg-white rounded-md text-slate-600 shadow-2xs">
            <FiColumns className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Columns</div>
            <div className="text-sm font-semibold text-slate-900 font-mono tabular-nums">
              {analysis.colCount}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50">
          <div className="p-2 bg-white rounded-md text-slate-600 shadow-2xs">
            <FiType className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Data Types</div>
            <div className="text-sm font-semibold text-slate-900 font-mono tabular-nums">
              {analysis.numericCount} num · {analysis.textCount} text
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50">
          <div className="p-2 bg-white rounded-md text-slate-600 shadow-2xs">
            <FiCheckSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Completeness</div>
            <div className="text-sm font-semibold text-slate-900 font-mono tabular-nums">
              {analysis.completeness}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
