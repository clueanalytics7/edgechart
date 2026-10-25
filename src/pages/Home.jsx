import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShield, FiBarChart2, FiCpu, FiDownload, FiCheck, FiPlay } from 'react-icons/fi';
import { SAMPLE_DATASETS } from '../lib/sampleDatasets';
import exampleChart1 from '../assets/example-chart1.png';

export default function Home({ onSelectSample }) {
  const navigate = useNavigate();

  const handleLaunchSample = (sample) => {
    if (onSelectSample) {
      onSelectSample(sample.data, sample.title);
    }
    navigate('/dashboard');
  };

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200/60 rounded-full">
          <FiShield className="w-3.5 h-3.5 text-blue-600" />
          <span>Zero-Telemetry · 100% Client-Side Privacy</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Visual Analytics at the Edge of Your Browser
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Transform CSV, TSV, and JSON files into publication-quality charts and statistical summaries. No uploads, no servers, zero data leakage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
          >
            <span>Launch Dashboard</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/guide"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
          >
            Read User Guide
          </Link>
        </div>
      </section>

      {/* 1-Click Interactive Sample Showcase */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Try It Instantly With Curated Data
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any real-world benchmark to launch live charts without uploading your own file
            </p>
          </div>
          <Link
            to="/dashboard"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
          >
            <span>View empty dashboard</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_DATASETS.map((sample) => (
            <div
              key={sample.id}
              className="group border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span className="font-medium text-slate-600">{sample.category}</span>
                  <span className="font-mono tabular-nums text-2xs">{sample.badge}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {sample.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {sample.subtitle}
                </p>
              </div>

              <button
                onClick={() => handleLaunchSample(sample)}
                className="mt-4 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors w-full"
              >
                <span className="flex items-center gap-1.5">
                  <FiPlay className="w-3 h-3 fill-current" />
                  <span>Explore Charts</span>
                </span>
                <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FiShield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            Absolute Client Privacy
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All data parsing, filtering, and chart renders occur strictly inside browser memory using Web APIs. No cloud storage, no cookies, no tracking.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <FiBarChart2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            Multivariate Visualizations
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Switch effortlessly between Bar, Line, Donut, Scatter, Box Plots, KDE Distribution curves, and statistical summaries with synchronized palettes.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FiDownload className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            Export Suite & Clipboard
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Export presentation-ready PNG and PDF documents with high resolution, or copy chart images directly to your clipboard for slide decks.
          </p>
        </div>
      </section>

      {/* Visual Showcase Split */}
      <section className="grid md:grid-cols-2 gap-8 items-center bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Intuitive Controls Built for Speed
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Upload files with arbitrary delimiters, inspect full tables with TanStack pagination, and zoom/pan on dense numerical charts.
          </p>
          <ul className="space-y-2.5 text-xs text-slate-600 pt-2">
            <li className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Handles quoted CSV text, semicolons, and TSV files seamlessly</span>
            </li>
            <li className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Auto-detects numerical metrics vs. categorical attributes</span>
            </li>
            <li className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Interactive zoom and pan on scatter plots and distribution curves</span>
            </li>
            <li className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>5 accessible, modern color theme palettes</span>
            </li>
          </ul>

          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <span>Get started now</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 shadow-2xs overflow-hidden">
          <img 
            src={exampleChart1} 
            alt="EdgeChart visualization sample" 
            className="rounded-lg w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}
