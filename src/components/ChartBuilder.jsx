import { useState, useEffect, useMemo } from 'react';
import { Bar, Line, Pie, Scatter, Doughnut } from 'react-chartjs-2';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import SimpleWordCloud from './SimpleWordCloud';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartJSZoomPlugin from 'chartjs-plugin-zoom';
import { kernelDensityEstimation } from 'simple-statistics';
import { BoxAndWhiskers } from 'chartjs-chart-box-and-violin-plot';
import * as ss from 'simple-statistics';
import {
  FiDownload,
  FiMaximize2,
  FiMinimize2,
  FiTrash2,
  FiSliders,
  FiLayout,
  FiCheck,
  FiZap,
  FiCopy,
  FiTv,
  FiX
} from 'react-icons/fi';

// Attempt to register BoxAndWhiskers with error handling
let boxPlotRegistered = false;
try {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    ChartJSZoomPlugin,
    BoxAndWhiskers
  );
  boxPlotRegistered = true;
} catch (err) {
  console.warn('BoxAndWhiskers plugin registration notice:', err?.message || err);
}

const chartTypes = [
  'bar',
  'line',
  'doughnut',
  'pie',
  'scatter',
  'distribution',
  'boxplot',
  'wordcloud',
  'stats',
];

const THEMES = {
  modern: {
    name: 'Modern Tech',
    colors: ['#3B82F6', '#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#14B8A6'],
  },
  fintech: {
    name: 'Fintech Emerald',
    colors: ['#0D9488', '#0284C7', '#16A34A', '#D97706', '#6366F1', '#E11D48', '#059669'],
  },
  sunset: {
    name: 'Sunset Warm',
    colors: ['#F97316', '#EF4444', '#F59E0B', '#84CC16', '#06B6D4', '#8B5CF6', '#EC4899'],
  },
  slate: {
    name: 'Minimal Slate',
    colors: ['#334155', '#64748B', '#94A3B8', '#475569', '#0F172A', '#1E293B', '#52525B'],
  },
  highContrast: {
    name: 'High Contrast',
    colors: ['#0000FF', '#D97706', '#059669', '#DC2626', '#7C3AED', '#0891B2', '#000000'],
  },
};

export default function ChartBuilder({ data }) {
  const [activeCharts, setActiveCharts] = useState([]);
  const [currentTheme, setCurrentTheme] = useState('modern');
  const [chartConfigs, setChartConfigs] = useState({
    bar: { xAxis: '', yAxis: '', yAxis2: '', xAxisLabel: '', yAxisLabel: '' },
    line: { xAxis: '', yAxis: '', yAxis2: '', xAxisLabel: '', yAxisLabel: '' },
    doughnut: { xAxis: '', yAxis: '', xAxisLabel: '', yAxisLabel: '' },
    pie: { xAxis: '', yAxis: '', xAxisLabel: '', yAxisLabel: '' },
    scatter: { xAxis: '', yAxis: '', xAxisLabel: '', yAxisLabel: '' },
    wordcloud: { textColumn: '' },
    distribution: { column: '' },
    boxplot: { column: '' },
    stats: { column: '' },
  });
  const [expandedChart, setExpandedChart] = useState(null);
  const [isPresentation, setIsPresentation] = useState(false);
  const [columns, setColumns] = useState([]);
  const [numericColumns, setNumericColumns] = useState([]);
  const [textColumns, setTextColumns] = useState([]);
  const [layout, setLayout] = useState('grid');
  const [dataLimit, setDataLimit] = useState(100);
  const [wordCloudLimit, setWordCloudLimit] = useState(100);
  const [minWordLength, setMinWordLength] = useState(2);
  const [binCount, setBinCount] = useState(10);
  const [showKDE, setShowKDE] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(null);

  const activeColors = useMemo(() => {
    return THEMES[currentTheme]?.colors || THEMES.modern.colors;
  }, [currentTheme]);

  // Analyze columns on data change
  useEffect(() => {
    if (!data || data.length === 0) return;

    try {
      const allColumns = Object.keys(data[0]);
      const numericCols = allColumns.filter((key) => {
        return data.some(
          (row) =>
            typeof row[key] === 'number' ||
            (!isNaN(parseFloat(row[key])) && isFinite(row[key]))
        );
      });
      const textCols = allColumns.filter(
        (key) => typeof data[0][key] === 'string' && !numericCols.includes(key)
      );

      setColumns(allColumns);
      setNumericColumns(numericCols);
      setTextColumns(textCols);

      const defaultX = textCols[0] || allColumns[0] || '';
      const defaultY = numericCols[0] || allColumns[1] || allColumns[0] || '';
      const scatterX = numericCols[0] || allColumns[0] || '';
      const scatterY = numericCols[1] || numericCols[0] || allColumns[0] || '';

      setChartConfigs({
        bar: { xAxis: defaultX, yAxis: defaultY, yAxis2: '', xAxisLabel: defaultX, yAxisLabel: defaultY },
        line: { xAxis: defaultX, yAxis: defaultY, yAxis2: '', xAxisLabel: defaultX, yAxisLabel: defaultY },
        doughnut: { xAxis: defaultX, yAxis: defaultY, xAxisLabel: defaultX, yAxisLabel: defaultY },
        pie: { xAxis: defaultX, yAxis: defaultY, xAxisLabel: defaultX, yAxisLabel: defaultY },
        scatter: { xAxis: scatterX, yAxis: scatterY, xAxisLabel: scatterX, yAxisLabel: scatterY },
        wordcloud: { textColumn: textCols[0] || allColumns[0] || '' },
        distribution: { column: numericCols[0] || allColumns[0] || '' },
        boxplot: { column: numericCols[0] || allColumns[0] || '' },
        stats: { column: numericCols[0] || allColumns[0] || '' },
      });

      setActiveCharts((prev) => {
        if (prev.length > 0) return prev;
        if (textCols.length > 0 && numericCols.length > 0) {
          return ['bar', 'doughnut', 'stats'];
        } else if (numericCols.length >= 2) {
          return ['scatter', 'bar', 'distribution'];
        }
        return ['bar', 'stats'];
      });
    } catch (err) {
      console.error('Error initializing chart columns:', err);
    }
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isPresentation) {
        setIsPresentation(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentation]);

  const toggleChart = (type) => {
    setActiveCharts((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const autoRecommendDashboard = () => {
    if (numericColumns.length >= 2 && textColumns.length >= 1) {
      setActiveCharts(['bar', 'doughnut', 'scatter', 'stats']);
    } else if (textColumns.length >= 1 && numericColumns.length >= 1) {
      setActiveCharts(['bar', 'doughnut', 'stats']);
    } else if (numericColumns.length >= 2) {
      setActiveCharts(['scatter', 'distribution', 'boxplot', 'stats']);
    } else {
      setActiveCharts(['bar', 'stats']);
    }
  };

  const downloadChart = async (id, format) => {
    const el = document.getElementById(id);
    if (!el) return;

    try {
      const dataUrl = await toPng(el, { quality: 0.95, backgroundColor: '#ffffff' });
      if (format === 'png') {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${id}-${Date.now()}.png`;
        a.click();
      } else if (format === 'pdf') {
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [el.offsetWidth, el.offsetHeight] });
        pdf.addImage(dataUrl, 'PNG', 0, 0, el.offsetWidth, el.offsetHeight);
        pdf.save(`${id}-${Date.now()}.pdf`);
      }
    } catch (err) {
      console.error('Error downloading chart:', err);
    }
  };

  const copyChartImage = async (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    try {
      const dataUrl = await toPng(el, { quality: 0.95, backgroundColor: '#ffffff' });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopyFeedback(id);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error('Failed to copy chart image:', err);
    }
  };

  // Build chart dataset mappings
  const chartDataMap = useMemo(() => {
    if (!data || data.length === 0) return {};
    const map = {};

    activeCharts.forEach((type) => {
      const config = chartConfigs[type];
      if (!config) return;

      try {
        switch (type) {
          case 'wordcloud': {
            if (!config.textColumn) {
              map[type] = null;
              return;
            }
            const textData = {};
            data.slice(0, wordCloudLimit).forEach((row) => {
              const words = (row[config.textColumn] || '').toString().split(/\s+/);
              words.forEach((word) => {
                const cleanedWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                if (cleanedWord.length >= minWordLength) {
                  textData[cleanedWord] = (textData[cleanedWord] || 0) + 1;
                }
              });
            });
            map[type] = Object.entries(textData)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 50)
              .map(([text, value]) => ({ text, value }));
            break;
          }

          case 'distribution': {
            if (!config.column) {
              map[type] = null;
              return;
            }
            const values = data
              .map((row) => parseFloat(row[config.column]))
              .filter((v) => !isNaN(v));
            if (values.length === 0) {
              map[type] = null;
              return;
            }
            const bins = {};
            const min = Math.min(...values);
            const max = Math.max(...values);
            const step = (max - min) / (binCount || 10) || 1;

            values.forEach((value) => {
              const bin = Math.floor((value - min) / step) * step + min;
              const roundedBin = Math.round(bin * 100) / 100;
              bins[roundedBin] = (bins[roundedBin] || 0) + 1;
            });

            const datasets = [
              {
                label: `${config.column} Frequency`,
                data: Object.values(bins),
                backgroundColor: activeColors[0],
                borderRadius: 4,
              },
            ];

            if (showKDE) {
              const kde = kernelDensityEstimation(values, 'gaussian', (max - min) / 100);
              datasets.push({
                label: 'Density Curve',
                data: kde.map(([x, y]) => ({ x, y: y * values.length * step })),
                type: 'line',
                borderColor: activeColors[1],
                fill: false,
                tension: 0.3,
              });
            }

            map[type] = {
              labels: Object.keys(bins),
              datasets,
            };
            break;
          }

          case 'boxplot': {
            if (!config.column) {
              map[type] = null;
              return;
            }
            const boxplotValues = data
              .map((row) => parseFloat(row[config.column]))
              .filter((v) => !isNaN(v));
            if (boxplotValues.length < 5) {
              map[type] = null;
              return;
            }
            map[type] = {
              labels: [config.column],
              datasets: [
                {
                  label: `Distribution for ${config.column}`,
                  data: [
                    {
                      min: ss.min(boxplotValues),
                      q1: ss.quantile(boxplotValues, 0.25),
                      median: ss.median(boxplotValues),
                      q3: ss.quantile(boxplotValues, 0.75),
                      max: ss.max(boxplotValues),
                    },
                  ],
                  backgroundColor: activeColors[0] + '88',
                  borderColor: activeColors[0],
                  borderWidth: 1.5,
                },
              ],
            };
            break;
          }

          case 'stats': {
            if (!config.column) {
              map[type] = null;
              return;
            }
            const colData = data.map((row) => row[config.column]);
            const numericData = colData.map((val) => parseFloat(val)).filter((v) => !isNaN(v));
            const stats = { 'Total Records': colData.length };

            if (numericData.length > 0 && numericData.length / colData.length > 0.5) {
              Object.assign(stats, {
                'Numeric Count': numericData.length,
                'Mean Average': ss.mean(numericData).toFixed(2),
                'Median (50%)': ss.median(numericData).toFixed(2),
                'Standard Deviation': ss.standardDeviation(numericData).toFixed(2),
                'Minimum Value': ss.min(numericData),
                'Maximum Value': ss.max(numericData),
                'Range': (ss.max(numericData) - ss.min(numericData)).toFixed(2),
                'Cumulative Sum': ss.sum(numericData).toLocaleString(),
              });
            } else {
              const frequencies = {};
              colData.forEach((val) => {
                const s = String(val ?? '');
                frequencies[s] = (frequencies[s] || 0) + 1;
              });
              const uniqueCount = Object.keys(frequencies).length;
              const topValue = Object.entries(frequencies).sort((a, b) => b[1] - a[1])[0];
              Object.assign(stats, {
                'Unique Categories': uniqueCount,
                'Top Frequent': topValue ? `"${topValue[0]}" (${topValue[1]} times)` : 'None',
              });
            }
            map[type] = stats;
            break;
          }

          case 'pie':
          case 'doughnut': {
            if (!config.xAxis || !config.yAxis) {
              map[type] = null;
              return;
            }
            const sliced = data.slice(0, Math.min(dataLimit, 15));
            map[type] = {
              labels: sliced.map((row, idx) => String(row[config.xAxis] || `Row ${idx + 1}`)),
              datasets: [
                {
                  label: config.yAxisLabel || config.yAxis,
                  data: sliced.map((row) => parseFloat(row[config.yAxis]) || 0),
                  backgroundColor: activeColors,
                  borderWidth: 1,
                  borderColor: '#ffffff',
                },
              ],
            };
            break;
          }

          case 'scatter': {
            if (!config.xAxis || !config.yAxis) {
              map[type] = null;
              return;
            }
            const scatterPoints = data
              .slice(0, dataLimit)
              .map((row) => ({
                x: parseFloat(row[config.xAxis]) || 0,
                y: parseFloat(row[config.yAxis]) || 0,
              }))
              .filter((pt) => !isNaN(pt.x) && !isNaN(pt.y));

            map[type] = {
              datasets: [
                {
                  label: `${config.yAxis} vs. ${config.xAxis}`,
                  data: scatterPoints,
                  backgroundColor: activeColors[0],
                  borderColor: activeColors[0],
                  pointRadius: 5,
                  pointHoverRadius: 7,
                },
              ],
            };
            break;
          }

          default: {
            // bar, line
            if (!config.xAxis || !config.yAxis) {
              map[type] = null;
              return;
            }
            const sliced = data.slice(0, dataLimit);
            const datasets = [
              {
                label: config.yAxisLabel || config.yAxis,
                data: sliced.map((row) => parseFloat(row[config.yAxis]) || 0),
                backgroundColor: type === 'line' ? activeColors[0] + '33' : activeColors[0],
                borderColor: activeColors[0],
                borderWidth: 2,
                fill: type === 'line',
                tension: 0.25,
                borderRadius: type === 'bar' ? 4 : 0,
              },
            ];

            if (config.yAxis2) {
              datasets.push({
                label: config.yAxis2,
                data: sliced.map((row) => parseFloat(row[config.yAxis2]) || 0),
                backgroundColor: type === 'line' ? (activeColors[1] || '#10B981') + '33' : (activeColors[1] || '#10B981'),
                borderColor: activeColors[1] || '#10B981',
                borderWidth: 2,
                fill: type === 'line',
                tension: 0.25,
                borderRadius: type === 'bar' ? 4 : 0,
              });
            }

            map[type] = {
              labels: sliced.map((row, index) => String(row[config.xAxis] || `Row ${index + 1}`)),
              datasets,
            };
            break;
          }
        }
      } catch (err) {
        console.error(`Error calculating data for ${type}:`, err);
        map[type] = null;
      }
    });

    return map;
  }, [data, activeCharts, chartConfigs, activeColors, dataLimit, wordCloudLimit, minWordLength, binCount, showKDE]);

  const renderChartControls = (type) => {
    const config = chartConfigs[type];
    if (!config) return null;

    if (['bar', 'line', 'pie', 'doughnut', 'scatter'].includes(type)) {
      return (
        <div className="flex flex-wrap items-center gap-2 mb-3 p-2 bg-slate-50/80 rounded-lg text-xs border border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">{type === 'scatter' ? 'X Axis:' : 'Category (X):'}</span>
            <select
              value={config.xAxis}
              onChange={(e) =>
                setChartConfigs((prev) => ({
                  ...prev,
                  [type]: { ...prev[type], xAxis: e.target.value, xAxisLabel: e.target.value },
                }))
              }
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
            >
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Metric (Y):</span>
            <select
              value={config.yAxis}
              onChange={(e) =>
                setChartConfigs((prev) => ({
                  ...prev,
                  [type]: { ...prev[type], yAxis: e.target.value, yAxisLabel: e.target.value },
                }))
              }
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
            >
              {numericColumns.length > 0
                ? numericColumns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))
                : columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
            </select>
          </div>

          {(type === 'bar' || type === 'line') && numericColumns.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Compare (Y2):</span>
              <select
                value={config.yAxis2 || ''}
                onChange={(e) =>
                  setChartConfigs((prev) => ({
                    ...prev,
                    [type]: { ...prev[type], yAxis2: e.target.value },
                  }))
                }
                className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
              >
                <option value="">None (Single Metric)</option>
                {numericColumns
                  .filter((col) => col !== config.yAxis)
                  .map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      );
    }

    if (['distribution', 'boxplot', 'stats'].includes(type)) {
      return (
        <div className="flex flex-wrap items-center gap-2 mb-3 p-2 bg-slate-50/80 rounded-lg text-xs border border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Select Column:</span>
            <select
              value={config.column}
              onChange={(e) =>
                setChartConfigs((prev) => ({
                  ...prev,
                  [type]: { ...prev[type], column: e.target.value },
                }))
              }
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
            >
              {(type === 'boxplot' && numericColumns.length > 0 ? numericColumns : columns).map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {type === 'distribution' && (
            <div className="flex items-center gap-3 ml-2">
              <label className="flex items-center gap-1 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showKDE}
                  onChange={(e) => setShowKDE(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Density Curve</span>
              </label>
              <div className="flex items-center gap-1">
                <span className="text-slate-500">Bins:</span>
                <select
                  value={binCount}
                  onChange={(e) => setBinCount(Number(e.target.value))}
                  className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 text-xs"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (type === 'wordcloud') {
      return (
        <div className="flex flex-wrap items-center gap-3 mb-3 p-2 bg-slate-50/80 rounded-lg text-xs border border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Text Field:</span>
            <select
              value={config.textColumn}
              onChange={(e) =>
                setChartConfigs((prev) => ({
                  ...prev,
                  [type]: { ...prev[type], textColumn: e.target.value },
                }))
              }
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
            >
              {(textColumns.length > 0 ? textColumns : columns).map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-slate-500">Words:</span>
              <select
                value={wordCloudLimit}
                onChange={(e) => setWordCloudLimit(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 text-xs"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-500">Min Len:</span>
              <select
                value={minWordLength}
                onChange={(e) => setMinWordLength(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 text-xs"
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderChart = (type) => {
    const chartData = chartDataMap[type];
    const isExpanded = expandedChart === type;

    if (!chartData) {
      return (
        <div
          id={`chart-${type}`}
          className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500 shadow-xs"
        >
          <div className="text-sm font-medium mb-1">Configuration Required</div>
          <p className="text-xs text-slate-400">
            Please pick a valid column in the controls above to render the {type} visualization.
          </p>
        </div>
      );
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            font: { family: 'inherit', size: 12 },
            color: '#475569',
          },
        },
        title: { display: false },
        tooltip: {
          backgroundColor: '#0F172A',
          padding: 8,
          cornerRadius: 6,
        },
      },
      scales:
        type !== 'pie' && type !== 'doughnut' && type !== 'wordcloud' && type !== 'stats'
          ? {
              x: {
                grid: { color: '#F1F5F9' },
                ticks: { font: { family: 'inherit', size: 11 }, color: '#64748B' },
              },
              y: {
                grid: { color: '#F1F5F9' },
                ticks: { font: { family: 'inherit', size: 11 }, color: '#64748B' },
              },
            }
          : undefined,
    };

    if (type === 'stats') {
      return (
        <div
          id={`chart-${type}`}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-900 capitalize">
                Statistics Summary
              </h4>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => downloadChart(`chart-${type}`, 'png')}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
                  title="Download PNG"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => toggleChart(type)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                  title="Remove Chart"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {renderChartControls(type)}
            <div className="overflow-hidden border border-slate-100 rounded-lg">
              <table className="min-w-full text-xs divide-y divide-slate-100">
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(chartData).map(([k, v]) => (
                    <tr key={k} className="hover:bg-slate-50">
                      <td className="px-3 py-1.5 font-medium text-slate-500">{k}</td>
                      <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-800 font-semibold">
                        {v}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        id={`chart-${type}`}
        className={`bg-white p-4 rounded-xl border border-slate-200 shadow-xs transition-all ${
          isExpanded ? 'col-span-1 md:col-span-2' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-900 capitalize">
              {type === 'doughnut' ? 'Donut' : type} Chart
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              {chartConfigs[type]?.yAxis || chartConfigs[type]?.column || ''}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => copyChartImage(`chart-${type}`)}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
              title="Copy chart image to clipboard"
            >
              {copyFeedback === `chart-${type}` ? (
                <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <FiCopy className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={() => downloadChart(`chart-${type}`, 'png')}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
              title="Download PNG"
            >
              <FiDownload className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setExpandedChart(isExpanded ? null : type)}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand full width'}
            >
              {isExpanded ? <FiMinimize2 className="w-3.5 h-3.5" /> : <FiMaximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => toggleChart(type)}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
              title="Remove Chart"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {renderChartControls(type)}

        <div className={`${isExpanded ? 'h-80' : 'h-64'} pt-1`}>
          {type === 'bar' && <Bar data={chartData} options={options} />}
          {type === 'line' && <Line data={chartData} options={options} />}
          {type === 'doughnut' && (
            <Doughnut
              data={chartData}
              options={{ ...options, cutout: '65%' }}
            />
          )}
          {type === 'pie' && <Pie data={chartData} options={options} />}
          {type === 'scatter' && <Scatter data={chartData} options={options} />}
          {type === 'distribution' && <Bar data={chartData} options={options} />}
          {type === 'boxplot' && boxPlotRegistered && (
            <Bar type="boxplot" data={chartData} options={options} />
          )}
          {type === 'wordcloud' && (
            <SimpleWordCloud
              words={chartData}
              onWordClick={(word) => setSelectedWord(word.text)}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Chart Library & Color Theme Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Chart library chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <FiSliders className="w-3.5 h-3.5" />
              <span>Visualizations:</span>
            </span>
            {chartTypes.map((type) => {
              const isActive = activeCharts.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleChart(type)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type === 'doughnut' ? 'Donut' : type}
                </button>
              );
            })}
          </div>

          {/* Quick Auto-Recommend Button */}
          <button
            onClick={autoRecommendDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/70 rounded-lg transition-colors shrink-0"
          >
            <FiZap className="w-3.5 h-3.5 text-blue-600" />
            <span>Auto-Build Dashboard</span>
          </button>
        </div>

        {/* Second row: Themes & Layout */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Theme Palette:</span>
            <div className="flex items-center gap-1">
              {Object.entries(THEMES).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => setCurrentTheme(key)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs transition-colors ${
                    currentTheme === key
                      ? 'border-blue-500 bg-blue-50/50 font-semibold text-slate-900'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex -space-x-1">
                    {theme.colors.slice(0, 3).map((c, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full ring-1 ring-white"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span>{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Rows:</span>
              <select
                value={dataLimit}
                onChange={(e) => setDataLimit(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs"
              >
                <option value={25}>25 rows</option>
                <option value={50}>50 rows</option>
                <option value={100}>100 rows</option>
                <option value={500}>500 rows</option>
              </select>
            </div>
            <button
              onClick={() => setLayout(layout === 'grid' ? 'single' : 'grid')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
            >
              <FiLayout className="w-3.5 h-3.5" />
              <span>{layout === 'grid' ? 'Grid View' : 'Single Column'}</span>
            </button>
            <button
              onClick={() => setIsPresentation(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-slate-700 hover:text-blue-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors font-medium shadow-2xs"
              title="Fullscreen presentation mode (Esc to exit)"
            >
              <FiTv className="w-3.5 h-3.5 text-blue-600" />
              <span>Present</span>
            </button>
          </div>
        </div>
      </div>

      {selectedWord && (
        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-800">
          <span>
            Selected keyword: <strong>{selectedWord}</strong>
          </span>
          <button
            onClick={() => setSelectedWord(null)}
            className="text-blue-600 hover:underline font-medium"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Render Active Charts Grid */}
      {activeCharts.length > 0 ? (
        <div
          className={
            layout === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
              : 'space-y-4'
          }
        >
          {activeCharts.map((type) => (
            <div key={type}>{renderChart(type)}</div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-10 text-center border border-slate-200 shadow-2xs">
          <h3 className="text-base font-semibold text-slate-800">No Visualizations Active</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click on any chart type in the toolbar above, or click &ldquo;Auto-Build Dashboard&rdquo; to instantly generate charts from your columns.
          </p>
          <button
            onClick={autoRecommendDashboard}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-2xs"
          >
            Auto-Build Dashboard
          </button>
        </div>
      )}

      {/* Fullscreen Presentation Mode */}
      {isPresentation && (
        <div className="fixed inset-0 z-50 bg-slate-900/98 backdrop-blur-md overflow-y-auto p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              <h2 className="text-sm font-bold text-white tracking-tight">
                EdgeChart Presentation View
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xs text-slate-400 hidden sm:inline">Press ESC or</span>
              <button
                onClick={() => setIsPresentation(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors shadow-xs"
              >
                <FiX className="w-3.5 h-3.5" />
                <span>Exit Presentation</span>
              </button>
            </div>
          </div>

          <div className="py-6 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeCharts.map((type) => (
                <div key={type} className="rounded-xl overflow-hidden shadow-2xl">
                  {renderChart(type)}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-2xs text-slate-500">
            <span>Client-side Presentation Canvas · Zero Cloud Transmission</span>
            <span>EdgeChart Analytics</span>
          </div>
        </div>
      )}
    </div>
  );
}
