import { useState, useEffect, useMemo } from "react";
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
import DatasetFilterBar from "./components/DatasetFilterBar";
import DataPrepTools from "./components/DataPrepTools";
import WorkspaceManager from "./components/WorkspaceManager";
import Footer from './components/Footer';
import Home from "./pages/Home";
import Guide from "./pages/Guide";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Agent from "./pages/Agent";
import Privacy from './pages/Privacy';
import { initGA, logPageView } from "./lib/analytics";

function DataAnalysisPage({
  tableData,
  datasetName,
  isLoading,
  error,
  handleDataLoaded,
  handleResetData,
  handleDataUpdated,
  handleResetOriginal
}) {
  const [filterPredicate, setFilterPredicate] = useState(null);

  // Compute reactive slice of data based on active filters
  const displayData = useMemo(() => {
    if (!filterPredicate || !tableData) return tableData;
    return tableData.filter(filterPredicate);
  }, [tableData, filterPredicate]);

  if (tableData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
              Analytics Workspace
            </h1>
            <p className="text-xs text-slate-500">
              Upload your CSV, TSV, or JSON dataset — or pick a curated sample to explore visualizations instantly.
            </p>
          </div>
          <WorkspaceManager
            currentData={tableData}
            datasetName={datasetName}
            onLoadWorkspace={handleDataLoaded}
          />
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
    <div className="space-y-4">
      {/* Workspace toolbar & Dataset Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Workspace:</span>
          <span className="text-xs font-semibold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200">
            {datasetName || 'Active Session'}
          </span>
        </div>
        <WorkspaceManager
          currentData={tableData}
          datasetName={datasetName}
          onLoadWorkspace={handleDataLoaded}
        />
      </div>

      <DatasetSummary 
        data={displayData} 
        datasetName={datasetName} 
        onReset={handleResetData}
      />

      {/* Automated Edge Insights */}
      <DatasetInsights data={displayData} />

      {/* Interactive Slicer / Filter Bar */}
      <DatasetFilterBar
        rawData={tableData}
        onFilterChange={setFilterPredicate}
      />

      {/* 1-Click Data Cleaning & Prep Tools */}
      <DataPrepTools
        data={tableData}
        onDataUpdated={handleDataUpdated}
        onResetOriginal={handleResetOriginal}
      />

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

      {/* Chart Builder Section with Multi-Metric & Presentation Support */}
      <div className="space-y-2">
        <ChartBuilder data={displayData} />
      </div>

      {/* Full Data Explorer Table */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Data Explorer
            </h3>
            <p className="text-xs text-slate-500">
              Search, sort, and inspect tabular records client-side ({displayData.length} records active)
            </p>
          </div>
          <ExportData data={displayData} />
        </div>

        <DataTable data={displayData} initialLimit={5} />
      </div>
    </div>
  );
}

export default function App() {
  const [tableData, setTableData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
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
          setOriginalData(data);
          setDatasetName(sourceName);
        }
        setIsLoading(false);
      }, 150);
    } catch {
      setError("Failed to process the file.");
      setIsLoading(false);
    }
  };

  const handleDataUpdated = (cleanedData) => {
    setTableData(cleanedData);
  };

  const handleResetOriginal = () => {
    if (originalData && originalData.length > 0) {
      setTableData(originalData);
    }
  };

  const handleResetData = () => {
    setTableData([]);
    setOriginalData([]);
    setDatasetName('');
    setError(null);
  };

  const basename = typeof window !== 'undefined' && window.location.pathname.startsWith('/edgechart') ? '/edgechart' : '/';

  return (
    <Router basename={basename}>
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
                  handleDataUpdated={handleDataUpdated}
                  handleResetOriginal={handleResetOriginal}
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
