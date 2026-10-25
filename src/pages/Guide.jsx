import { Link } from 'react-router-dom';
import { FiUpload, FiTable, FiBarChart2, FiDownload, FiCheck, FiCpu, FiShield, FiArrowRight } from 'react-icons/fi';

export default function Guide() {
  const steps = [
    {
      num: '01',
      title: 'Ingest Your Dataset or Try a Sample',
      desc: 'Drag & drop any CSV, TSV, TXT, or JSON file directly into the Dashboard. EdgeChart auto-detects column delimiters and parses quoted values with commas (RFC 4180). Alternatively, choose from 4 curated sample datasets to start exploring immediately.',
      icon: FiUpload,
    },
    {
      num: '02',
      title: 'Review Dataset Health & Tabular Data',
      desc: 'Instantly view total records, data types, and completion rates on the Dataset Summary bar. Use the interactive Data Explorer to search keywords, sort columns, and switch between compact and full multi-page views.',
      icon: FiTable,
    },
    {
      num: '03',
      title: 'Select & Customize Visualizations',
      desc: 'Toggle chart types in the visualization library: Bar, Line, Donut, Pie, Scatter, Distribution, Box Plot, Word Cloud, and Stats. Switch between 5 curated color palettes or click "Auto-Build Dashboard" for smart recommendations.',
      icon: FiBarChart2,
    },
    {
      num: '04',
      title: 'Export & Share Results',
      desc: 'Download high-resolution PNG images, generate PDF report sheets, or copy chart images directly to your clipboard to paste into Google Slides, PowerPoint, or Notion.',
      icon: FiDownload,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-blue-700 bg-blue-50 border border-blue-200/60 rounded-full mb-3">
          <FiShield className="w-3.5 h-3.5 text-blue-600" />
          <span>Complete User Guide</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          How to Use EdgeChart
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Learn how to visualize, explore, and export data in your browser with zero server transmission.
        </p>
      </div>

      {/* 4 Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    STEP {step.num}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Dives */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">
          Advanced Capabilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <FiBarChart2 className="text-blue-600" />
              <span>Statistical Distributions & Outliers</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use the <strong>Box Plot</strong> visualization to observe quartiles (Q1, Median, Q3) and statistical outliers (1.5× IQR). Enable <strong>Density Curve</strong> on the Distribution chart to render a Gaussian Kernel Density Estimate (KDE).
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <FiCpu className="text-indigo-600" />
              <span>EdgeAgent Assistant</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visit <Link to="/agent" className="text-blue-600 hover:underline">EdgeAgent</Link> anytime to get instant statistical advice, chart recommendations, and troubleshooting tips processed 100% locally on your machine.
            </p>
          </div>
        </div>
      </div>

      {/* File Format Standards */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-slate-900">
          File Format Best Practices
        </h3>
        <ul className="space-y-2 text-xs text-slate-600">
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Header Row:</strong> Ensure the first line contains clear, unique column names (e.g., &quot;Product, Price, Units Sold&quot;).</span>
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Consistent Types:</strong> Keep numbers in numeric columns; currency symbols ($) and percentages (%) are automatically cleaned during analysis.</span>
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Supported Encodings:</strong> UTF-8 formatted CSV, TSV, or JSON array of objects.</span>
          </li>
        </ul>

        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
          >
            <span>Open Dashboard</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
