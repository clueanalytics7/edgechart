import { Link } from 'react-router-dom';
import { FiShield, FiCpu, FiEyeOff, FiZap, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

export default function About() {
  const pillars = [
    {
      title: 'Zero-Server Architecture',
      desc: 'All file parsing, calculations, and chart rendering happen in your local browser sandbox via modern Web APIs.',
      icon: FiEyeOff,
    },
    {
      title: 'Edge Performance',
      desc: 'Zero network round-trips for calculations. Filter, sort, and zoom across datasets with instantaneous responsiveness.',
      icon: FiZap,
    },
    {
      title: 'Zero Tracking or Telemetry on Data',
      desc: 'Your confidential records, financials, and datasets are never transmitted to external cloud servers.',
      icon: FiShield,
    },
    {
      title: 'Local Intelligence',
      desc: 'Built-in statistical algorithms calculate quartiles, kernel density estimates, and correlations right in memory.',
      icon: FiCpu,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4">
      {/* Header */}
      <div className="space-y-4 pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-blue-700 bg-blue-50 border border-blue-200/60 rounded-full">
          <FiShield className="w-3.5 h-3.5 text-blue-600" />
          <span>Our Mission & Technology</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Democratizing Data Analytics at the Edge
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
          At EdgeChart, we believe data analysis should be private, instantaneous, and accessible to everyone without requiring cloud subscriptions or uploading sensitive records to third-party servers.
        </p>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                {pillar.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Why Choose EdgeChart */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Why Professionals Choose EdgeChart
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Built for data engineers, financial analysts, and privacy-conscious researchers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="flex items-start gap-2.5">
            <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>No Registration or Authentication:</strong> Open the dashboard and start working immediately with zero sign-up friction.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Multivariate Chart Engine:</strong> 9 chart types with synchronized theme palettes and interactive zoom/pan controls.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>High-Resolution Exports:</strong> Export publication-ready vector PDFs and Retina PNGs, or copy images directly to your clipboard.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Transparent Open Architecture:</strong> Built on verified open-source components including React, Chart.js, and TanStack Table.</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Have questions, feedback, or custom feature inquiries?
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline"
            >
              Contact Us
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
            >
              <span>Explore Dashboard</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
