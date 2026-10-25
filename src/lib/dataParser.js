/**
 * Robust client-side data parsing utility for EdgeChart.
 * Supports:
 * - RFC 4180 CSV with quotes, escaped quotes (""), multiline fields
 * - Delimiter auto-detection (comma, semicolon, tab, pipe)
 * - JSON arrays of objects
 * - Numeric and date type inference with whitespace trimming
 */

/**
 * Detect delimiter from sample text
 */
function detectDelimiter(sample) {
  const delimiters = [',', ';', '\t', '|'];
  const firstLine = sample.split(/\r\n|\n|\r/)[0] || '';
  
  let bestDelimiter = ',';
  let maxCount = 0;

  for (const delim of delimiters) {
    // Count occurrences not inside quotes
    let inQuotes = false;
    let count = 0;
    for (let i = 0; i < firstLine.length; i++) {
      if (firstLine[i] === '"') inQuotes = !inQuotes;
      else if (!inQuotes && firstLine[i] === delim) count++;
    }
    if (count > maxCount) {
      maxCount = count;
      bestDelimiter = delim;
    }
  }

  return bestDelimiter;
}

/**
 * Parse CSV/TSV text into an array of row tokens
 */
export function parseCSV(text, customDelimiter = null) {
  if (!text || typeof text !== 'string') return [];
  const trimmed = text.trim();
  if (!trimmed) return [];

  const delimiter = customDelimiter || detectDelimiter(trimmed.slice(0, 2000));
  const rows = [];
  let currentRow = [];
  let currentToken = '';
  let inQuotes = false;

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    const nextChar = trimmed[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote: "" -> "
        currentToken += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      currentRow.push(currentToken.trim());
      currentToken = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      currentRow.push(currentToken.trim());
      currentToken = '';
      if (currentRow.some(val => val.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      // Handle \r\n
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
    } else {
      currentToken += char;
    }
  }

  // Push final token and row if any
  if (currentToken.length > 0 || currentRow.length > 0) {
    currentRow.push(currentToken.trim());
    if (currentRow.some(val => val.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) {
    throw new Error('Data file must contain at least a header row and one data row.');
  }

  const headers = rows[0].map((h, idx) => h || `Column_${idx + 1}`);
  const dataRows = rows.slice(1);

  return dataRows.map(row => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx] !== undefined ? row[idx] : '';
    });
    return obj;
  });
}

/**
 * Parse raw text (auto-detects JSON or CSV/TSV)
 */
export function parseDataContent(content) {
  const trimmed = content.trim();
  if (!trimmed) return [];

  // Check if JSON
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      const array = Array.isArray(parsed) ? parsed : [parsed];
      if (array.length > 0 && typeof array[0] === 'object' && array[0] !== null) {
        return array;
      }
    } catch {
      // Fall through to CSV parser
    }
  }

  return parseCSV(trimmed);
}

/**
 * Infer column metadata and types
 */
export function analyzeColumns(data) {
  if (!data || data.length === 0) return { columns: [], numericCols: [], textCols: [], dateCols: [] };

  const sampleSize = Math.min(data.length, 500);
  const sample = data.slice(0, sampleSize);
  const allColumns = Object.keys(data[0]);

  const numericCols = [];
  const textCols = [];
  const dateCols = [];

  allColumns.forEach(col => {
    let numericCount = 0;
    let dateCount = 0;
    let filledCount = 0;

    for (const row of sample) {
      const val = row[col];
      if (val !== undefined && val !== null && val !== '') {
        filledCount++;
        const strVal = String(val).replace(/[$,%]/g, '').trim();
        const num = Number(strVal);
        if (!isNaN(num) && strVal !== '') {
          numericCount++;
        } else if (!isNaN(Date.parse(val)) && isNaN(Number(val)) && String(val).length > 4) {
          dateCount++;
        }
      }
    }

    if (filledCount > 0 && numericCount / filledCount >= 0.75) {
      numericCols.push(col);
    } else if (filledCount > 0 && dateCount / filledCount >= 0.75) {
      dateCols.push(col);
    } else {
      textCols.push(col);
    }
  });

  return {
    columns: allColumns,
    numericCols,
    textCols,
    dateCols
  };
}
