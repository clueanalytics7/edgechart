import { useState, useCallback } from 'react';
import { FiUpload, FiFileText, FiArrowRight, FiCheck } from 'react-icons/fi';
import { parseDataContent } from '../lib/dataParser';
import { SAMPLE_DATASETS } from '../lib/sampleDatasets';

export default function FileUpload({ onDataLoaded, compact = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeSampleId, setActiveSampleId] = useState(null);

  const processFile = useCallback((file) => {
    if (!file) return;
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const rows = parseDataContent(content);
        if (rows.length === 0) {
          setErrorMessage('The file appears to be empty or could not be parsed.');
          onDataLoaded([], file.name);
          return;
        }
        onDataLoaded(rows, file.name.replace(/\.[^/.]+$/, ''));
      } catch (err) {
        setErrorMessage(err.message || 'Failed to parse file.');
        onDataLoaded([], file.name);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Could not read the selected file.');
    };
    reader.readAsText(file);
  }, [onDataLoaded]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleLoadSample = (sample) => {
    setActiveSampleId(sample.id);
    setErrorMessage(null);
    onDataLoaded(sample.data, sample.title);
  };

  if (compact) {
    return (
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-2.5 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400 bg-white'
        }`}
      >
        <input 
          type="file" 
          accept=".csv,.tsv,.txt,.json" 
          onChange={handleChange} 
          className="hidden" 
          id="compact-file-upload"
        />
        <label htmlFor="compact-file-upload" className="flex items-center justify-center gap-2 cursor-pointer text-slate-700 hover:text-blue-600 text-sm font-medium">
          <FiUpload className="h-4 w-4 text-blue-500" />
          <span>Upload New CSV or JSON</span>
        </label>
        {errorMessage && (
          <p className="text-xs text-red-600 mt-1 font-medium">{errorMessage}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging ? 'border-blue-500 bg-blue-50/40' : 'border-slate-300 hover:border-blue-400 bg-white'
        }`}
      >
        <input 
          type="file" 
          accept=".csv,.tsv,.txt,.json" 
          onChange={handleChange} 
          className="hidden" 
          id="full-file-upload"
        />
        <label htmlFor="full-file-upload" className="flex flex-col items-center justify-center cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <FiUpload className="h-6 w-6" />
          </div>
          <span className="text-base font-semibold text-slate-900 mb-1">
            Drag & drop your dataset here, or click to browse
          </span>
          <p className="text-xs text-slate-500 max-w-sm">
            Supports CSV, TSV, TXT, or JSON array. Parsed 100% locally in your browser.
          </p>
          <div className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-2xs">
            Select File from Device
          </div>
        </label>

        {errorMessage && (
          <div className="mt-4 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Instant Curated Sample Datasets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiFileText className="text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900">
              Or Try An Instant Sample Dataset
            </h3>
          </div>
          <span className="text-xs text-slate-500">1-click demo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_DATASETS.map((sample) => {
            const isActive = activeSampleId === sample.id;
            return (
              <button
                key={sample.id}
                onClick={() => handleLoadSample(sample)}
                className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isActive 
                    ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{sample.category}</span>
                    <span className="font-mono tabular-nums text-2xs">{sample.badge}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-1">
                    {sample.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {sample.subtitle}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-blue-600">
                  <span>{isActive ? 'Loaded' : 'Load dataset'}</span>
                  {isActive ? <FiCheck className="w-3.5 h-3.5 text-blue-600" /> : <FiArrowRight className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
