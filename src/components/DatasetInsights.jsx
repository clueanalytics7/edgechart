import { useMemo } from 'react';
import { FiTrendingUp, FiAlertCircle, FiAward, FiPieChart } from 'react-icons/fi';
import * as ss from 'simple-statistics';
import { analyzeColumns } from '../lib/dataParser';

export default function DatasetInsights({ data }) {
  const insights = useMemo(() => {
    if (!data || data.length < 2) return [];

    const items = [];
    const { numericCols, textCols } = analyzeColumns(data);

    // 1. Highlight top numeric metric
    if (numericCols.length > 0) {
      const col = numericCols[0];
      const vals = data.map(r => parseFloat(r[col])).filter(v => !isNaN(v));
      if (vals.length > 0) {
        const mean = ss.mean(vals);
        const max = ss.max(vals);
        const maxRow = data.find(r => parseFloat(r[col]) === max);
        const labelCol = textCols[0];
        const leaderName = labelCol && maxRow ? ` (${maxRow[labelCol]})` : '';

        items.push({
          icon: FiAward,
          iconColor: 'text-amber-500 bg-amber-50',
          title: `Peak Value in ${col}`,
          description: `Highest recorded value is ${max.toLocaleString()}${leaderName}, compared to a dataset average of ${mean.toFixed(1).toLocaleString()}.`
        });
      }
    }

    // 2. Correlation discovery if 2+ numeric columns
    if (numericCols.length >= 2) {
      const colA = numericCols[0];
      const colB = numericCols[1];
      const pairs = data
        .map(r => [parseFloat(r[colA]), parseFloat(r[colB])])
        .filter(([a, b]) => !isNaN(a) && !isNaN(b));

      if (pairs.length >= 5) {
        try {
          const r = ss.sampleCorrelation(pairs.map(p => p[0]), pairs.map(p => p[1]));
          if (!isNaN(r)) {
            const strength = Math.abs(r) > 0.7 ? 'Strong' : Math.abs(r) > 0.4 ? 'Moderate' : 'Mild';
            const direction = r > 0 ? 'positive' : 'inverse';

            items.push({
              icon: FiTrendingUp,
              iconColor: 'text-blue-500 bg-blue-50',
              title: `${strength} ${direction} correlation between ${colA} & ${colB}`,
              description: `Pearson coefficient r = ${r.toFixed(2)}. Suggests as ${colA} changes, ${colB} tends to move in the ${direction} direction.`
            });
          }
        } catch {
          // ignore calculation error
        }
      }
    }

    // 3. Category concentration (Pareto check)
    if (textCols.length > 0) {
      const catCol = textCols[0];
      const counts = {};
      data.forEach(r => {
        const val = String(r[catCol] || 'Unknown');
        counts[val] = (counts[val] || 0) + 1;
      });
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      if (sorted.length > 1) {
        const topCat = sorted[0];
        const share = Math.round((topCat[1] / data.length) * 100);
        items.push({
          icon: FiPieChart,
          iconColor: 'text-indigo-500 bg-indigo-50',
          title: `Category Leader in ${catCol}`,
          description: `"${topCat[0]}" is the most frequent category, representing ${share}% of all rows (${topCat[1]} entries).`
        });
      }
    }

    // 4. Outlier alert (IQR method)
    if (numericCols.length > 0) {
      const col = numericCols[0];
      const vals = data.map(r => parseFloat(r[col])).filter(v => !isNaN(v)).sort((a, b) => a - b);
      if (vals.length >= 6) {
        const q1 = ss.quantile(vals, 0.25);
        const q3 = ss.quantile(vals, 0.75);
        const iqr = q3 - q1;
        const lowBound = q1 - 1.5 * iqr;
        const highBound = q3 + 1.5 * iqr;
        const outliers = vals.filter(v => v < lowBound || v > highBound);

        if (outliers.length > 0) {
          items.push({
            icon: FiAlertCircle,
            iconColor: 'text-rose-500 bg-rose-50',
            title: `${outliers.length} statistical anomaly detected in ${col}`,
            description: `Values outside the standard 1.5× IQR threshold (boundaries: ${lowBound.toFixed(1)} to ${highBound.toFixed(1)}). Inspect using Box Plot.`
          });
        }
      }
    }

    return items.slice(0, 3);
  }, [data]);

  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <span>Automated Edge Insights</span>
        </h3>
        <span className="text-2xs text-slate-400 font-medium uppercase tracking-wider">
          Computed locally
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {insights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-3 rounded-lg bg-slate-50/70 border border-slate-100 flex items-start gap-3">
              <div className={`p-2 rounded-lg shrink-0 ${item.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-slate-800 leading-snug line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
