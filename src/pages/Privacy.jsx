import { Link } from 'react-router-dom';
import { FiShield, FiLock, FiCheck, FiArrowRight, FiEyeOff } from 'react-icons/fi';

export default function Privacy() {
  const sections = [
    {
      num: '01',
      title: 'Zero Server-Side Data Ingestion',
      content: 'EdgeChart operates exclusively inside your browser runtime. When you load a CSV, TSV, or JSON file, the contents are read directly into browser memory (RAM) via standard client-side FileReader APIs. No dataset records, cell values, column headers, or uploaded files are ever transmitted to our servers or stored on remote databases.',
      icon: FiEyeOff,
    },
    {
      num: '02',
      title: 'Ephemeral Browser Sandbox',
      content: 'All data processing, filtering, chart calculations, and statistical summaries are executed locally on your device. Once you close or reload the browser tab, your active dataset is instantly cleared from memory. No persistent storage or cloud synchronisation is maintained.',
      icon: FiLock,
    },
    {
      num: '03',
      title: 'Cookie & Telemetry Policy',
      content: 'We use anonymised Google Analytics cookies solely to measure overall website traffic, page visits, and performance. We do not track, inspect, or log any contents of your uploaded datasets. You can review or decline cookie preferences at any time via the cookie consent bar.',
      icon: FiShield,
    },
    {
      num: '04',
      title: 'Your Rights & GDPR Compliance',
      content: 'Because EdgeChart does not retain your uploaded files or associate datasets with individual user accounts, your raw data never enters our custody. If you contact us via our contact form, your contact details are kept strictly confidential and used solely to respond to your inquiry.',
      icon: FiCheck,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full">
          <FiShield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Privacy & Security Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Privacy Policy & Data Protection
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          At EdgeChart, data privacy is not a setting—it is the core technical architecture of our application.
        </p>
      </div>

      {/* Structured Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.num}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    SECTION {sec.num}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  {sec.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sec.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inquiries Footer Callout */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Have questions regarding data handling or privacy?
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Our privacy team is happy to address any questions or compliance inquiries.
          </p>
        </div>

        <Link
          to="/contact"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs shrink-0"
        >
          <span>Contact Privacy Team</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
