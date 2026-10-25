import { useState, useEffect } from 'react';
import { FiSave, FiFolder, FiTrash2, FiDownload, FiUpload, FiCheck, FiX } from 'react-icons/fi';

const STORAGE_KEY = 'edgechart_saved_workspaces';

export default function WorkspaceManager({ currentData, datasetName, onLoadWorkspace }) {
  const [savedWorkspaces, setSavedWorkspaces] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Load saved workspaces from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedWorkspaces(JSON.parse(stored));
      }
    } catch {
      // ignore parse error
    }
  }, []);

  const saveCurrentWorkspace = () => {
    if (!currentData || currentData.length === 0) return;
    const name = saveName.trim() || datasetName || `Project ${new Date().toLocaleDateString()}`;

    const newProject = {
      id: `proj_${Date.now()}`,
      name,
      savedAt: new Date().toISOString(),
      datasetName: datasetName || 'Dataset',
      rowCount: currentData.length,
      data: currentData,
    };

    const updated = [newProject, ...savedWorkspaces.filter((p) => p.name !== name)].slice(0, 10);
    setSavedWorkspaces(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Storage quota exceeded:', err);
    }
    setSaveName('');
    notify(`Saved "${name}" to local projects`);
  };

  const deleteWorkspace = (id, e) => {
    e.stopPropagation();
    const updated = savedWorkspaces.filter((p) => p.id !== id);
    setSavedWorkspaces(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const exportWorkspaceJSON = () => {
    if (!currentData || currentData.length === 0) return;
    const exportObj = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      datasetName: datasetName || 'EdgeChart Project',
      data: currentData,
    };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(datasetName || 'edgechart-project').replace(/\s+/g, '_')}.edgechart.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Project recipe exported as JSON');
  };

  const importWorkspaceJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const data = parsed.data || (Array.isArray(parsed) ? parsed : null);
        if (data && Array.isArray(data) && data.length > 0) {
          onLoadWorkspace(data, parsed.datasetName || file.name.replace(/\.[^/.]+$/, ''));
          notify(`Loaded workspace from ${file.name}`);
          setIsOpen(false);
        } else {
          notify('File does not contain valid tabular dataset array');
        }
      } catch {
        notify('Invalid JSON project file');
      }
    };
    reader.readAsText(file);
  };

  const notify = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
        >
          <FiFolder className="w-3.5 h-3.5 text-blue-600" />
          <span>Workspaces</span>
          {savedWorkspaces.length > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-2xs bg-blue-100 text-blue-700 font-mono">
              {savedWorkspaces.length}
            </span>
          )}
        </button>

        {statusMessage && (
          <span className="text-2xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
            {statusMessage}
          </span>
        )}
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-4 z-40 space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-semibold text-slate-900">Workspace Sessions</h4>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Save active session input */}
            {currentData && currentData.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
                  Save Active Session
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder={datasetName || 'Project name...'}
                    className="flex-1 px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={saveCurrentWorkspace}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shrink-0 transition-colors shadow-2xs"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* List of saved projects */}
            <div className="space-y-1.5">
              <div className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
                Saved in Browser Memory
              </div>

              {savedWorkspaces.length === 0 ? (
                <p className="text-2xs text-slate-400 italic py-2 text-center">
                  No saved projects yet. Click Save above to preserve this session.
                </p>
              ) : (
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                  {savedWorkspaces.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        onLoadWorkspace(proj.data, proj.datasetName);
                        notify(`Loaded "${proj.name}"`);
                        setIsOpen(false);
                      }}
                      className="group flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 cursor-pointer transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-800 truncate text-xs group-hover:text-blue-700">
                          {proj.name}
                        </div>
                        <div className="text-2xs text-slate-400 font-mono tabular-nums">
                          {proj.rowCount.toLocaleString()} rows · {new Date(proj.savedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={(e) => deleteWorkspace(proj.id, e)}
                        className="p-1 text-slate-300 hover:text-rose-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete project"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Export & Import JSON Recipe */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={exportWorkspaceJSON}
                disabled={!currentData || currentData.length === 0}
                className="inline-flex items-center gap-1 text-2xs text-slate-600 hover:text-blue-600 disabled:opacity-40"
              >
                <FiDownload className="w-3 h-3" />
                <span>Export Recipe JSON</span>
              </button>

              <label className="inline-flex items-center gap-1 text-2xs text-slate-600 hover:text-blue-600 cursor-pointer">
                <FiUpload className="w-3 h-3" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json,.edgechart.json"
                  onChange={importWorkspaceJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
