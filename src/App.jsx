import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";
import Navbar from "./components/Navbar";
import FileUpload from "./components/FileUpload";
import DataTable from "./components/DataTable";
import ChartBuilder from "./components/ChartBuilder";
import CookieConsent from "./components/CookieConsent";
import SupportBanner from "./components/SupportBanner";
import ExportData from "./components/ExportData";
import DatasetSummary from "./components/DatasetSummary";
import DatasetInsights from "./components/DatasetInsights";
import Footer from './components/Footer';
import Home from "./pages/Home";
import Guide from "./pages/Guide";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Agent from "./pages/Agent";
import Privacy from './pages/Privacy';
import { initGA, logPageView } from "./lib/analytics";

function DataAnalysisPage({ tableData, datasetName, isLoading, error, handleDataLoaded, handleResetData }) {
  if (tableData.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            Analytics Workspace
          </h1>
          <p className="text-xs text-slate-500">
            Upload your CSV, TSV, or JSON dataset — or pick a curated sample to explore visualizations instantly.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <FiAlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <FileUpload onDataLoaded={handleDataLoaded} compact={false} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Dataset Summary & Metrics Bar */}
      <DatasetSummary 
        data={tableData} 
        datasetName={datasetName} 
        onReset={handleResetData}
      />

      {/* Automated Edge Insights */}
      <DatasetInsights data={tableData} />

      {isLoading && (
        <div className="flex items-center justify-center p-8 bg-white rounded-xl border border-slate-200">
          <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-xs text-slate-600 font-medium">Processing dataset...</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
          <FiAlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Chart Builder Section */}
      <div className="space-y-2">
        <ChartBuilder data={tableData} />
      </div>

      {/* Full Data Explorer Table */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Data Explorer
            </h3>
            <p className="text-xs text-slate-500">
              Search, sort, and inspect tabular values client-side
            </p>
          </div>
          <ExportData data={tableData} />
        </div>

        <DataTable data={tableData} initialLimit={5} />
      </div>
    </div>
  );
}

export default function App() {
  const [tableData, setTableData] = useState([]);
  const [datasetName, setDatasetName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initGA('G-98SPL77FT1');
    logPageView();
  }, []);

  const handleDataLoaded = (data, sourceName = 'Uploaded Data') => {
    setIsLoading(true);
    setError(null);
    
    try {
      setTimeout(() => {
        if (!data || data.length === 0) {
          setError("The file appears to be empty or contains invalid records.");
        } else if (Object.keys(data[0]).length < 2) {
          setError("The file needs at least 2 columns to perform visualization and analysis.");
        } else {
          setTableData(data);
          setDatasetName(sourceName);
        }
        setIsLoading(false);
      }, 150);
    } catch {
      setError("Failed to process the file.");
      setIsLoading(false);
    }
  };

  const handleResetData = () => {
    setTableData([]);
    setDatasetName('');
    setError(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <CookieConsent />
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-grow w-full">
          <SupportBanner />
          <Routes>
            <Route path="/" element={<Home onSelectSample={handleDataLoaded} />} />
            <Route 
              path="/dashboard" 
              element={
                <DataAnalysisPage 
                  tableData={tableData}
                  datasetName={datasetName}
                  isLoading={isLoading}
                  error={error}
                  handleDataLoaded={handleDataLoaded}
                  handleResetData={handleResetData}
                />
              } 
            />
            <Route path="/guide" element={<Guide />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/agent" element={<Agent />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
