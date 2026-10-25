import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { FiSearch, FiChevronUp, FiChevronDown, FiHash, FiType, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { analyzeColumns } from '../lib/dataParser';

export default function DataTable({ data, initialLimit = null }) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(initialLimit || 10);
  const [isExpanded, setIsExpanded] = useState(false);

  // Analyze column types
  const columnTypes = useMemo(() => {
    return analyzeColumns(data);
  }, [data]);

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];

    return Object.keys(data[0]).map((key) => {
      const isNumeric = columnTypes.numericCols.includes(key);
      const isDate = columnTypes.dateCols.includes(key);

      return {
        accessorKey: key,
        header: ({ column }) => (
          <div 
            onClick={column.getToggleSortingHandler()}
            className="flex items-center gap-1.5 cursor-pointer select-none group"
          >
            <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
              {isNumeric ? <FiHash className="w-3.5 h-3.5" /> : <FiType className="w-3.5 h-3.5" />}
            </span>
            <span className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
              {key}
            </span>
            <span className="text-xs text-slate-400 ml-0.5">
              {{
                asc: <FiChevronUp className="w-3.5 h-3.5 text-blue-600" />,
                desc: <FiChevronDown className="w-3.5 h-3.5 text-blue-600" />,
              }[column.getIsSorted()] ?? (
                <span className="opacity-0 group-hover:opacity-50">↕</span>
              )}
            </span>
          </div>
        ),
        cell: (info) => {
          const val = info.getValue();
          if (val === null || val === undefined || val === '') {
            return <span className="text-slate-300 italic text-xs">null</span>;
          }
          if (isNumeric) {
            const num = Number(val);
            return (
              <span className="font-mono tabular-nums text-slate-700">
                {!isNaN(num) ? num.toLocaleString() : String(val)}
              </span>
            );
          }
          if (isDate) {
            return <span className="text-slate-600">{String(val)}</span>;
          }
          return <span className="text-slate-800">{String(val)}</span>;
        },
      };
    });
  }, [data, columnTypes]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize: isExpanded ? pageSize : (initialLimit || 5),
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Search and view toggle controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all records..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <>
                <FiMinimize2 className="w-3.5 h-3.5" />
                <span>Compact View (5 rows)</span>
              </>
            ) : (
              <>
                <FiMaximize2 className="w-3.5 h-3.5" />
                <span>Full Interactive Table</span>
              </>
            )}
          </button>

          {isExpanded && (
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          )}
        </div>
      </div>

      {/* Table viewport */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-xs">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2.5 font-medium text-slate-600 tracking-wider whitespace-nowrap"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2.5 whitespace-nowrap text-slate-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination & row count status */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-700 font-mono tabular-nums">
            {table.getRowModel().rows.length > 0 ? table.getState().pagination.pageIndex * pageSize + 1 : 0}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-700 font-mono tabular-nums">
            {Math.min((table.getState().pagination.pageIndex + 1) * pageSize, table.getFilteredRowModel().rows.length)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-slate-700 font-mono tabular-nums">
            {table.getFilteredRowModel().rows.length}
          </span>{' '}
          entries
        </div>

        {isExpanded && table.getPageCount() > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-2.5 py-1 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="font-mono tabular-nums px-1 text-slate-600">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-2.5 py-1 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
