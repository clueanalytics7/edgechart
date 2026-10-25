<div align="center">

# EdgeChart

**Browser-Native Visual Analytics & Automated Statistical Workbench**

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3-purple.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side-emerald.svg)](https://clue-analytics.web.app/)
[![License](https://img.shields.io/badge/License-MIT-gray.svg)](LICENSE)

<p align="center">
  Transform CSV, TSV, and JSON datasets into publication-ready charts and statistical summaries directly in your browser. 
  <br />
  <strong>No cloud uploads. No external database. 100% local memory execution.</strong>
</p>

</div>

---

## Overview

**EdgeChart** is a modern, privacy-first data visualization and exploratory analysis tool designed for data analysts, researchers, engineers, and business operators. 

Traditional BI dashboards and data SaaS platforms require uploading confidential business spreadsheets to third-party servers. EdgeChart shifts the entire analytical pipeline—from file ingestion and delimiter detection to statistical aggregation, chart compilation, and image rendering—directly into your browser's local sandbox using modern Web APIs.

---

## Key Features

### 🔒 100% Client-Side Privacy
- **Zero Network Transmission:** File contents never leave your device.
- **Ephemeral In-Memory Sandbox:** Data is held strictly in browser RAM and wiped when you close or reload the tab.
- **Audit-Safe:** Compliant with internal data governance, NDA obligations, and GDPR constraints.

### 📊 Multivariate Charting Engine
Powered by Chart.js, simple-statistics, and specialized visualization extensions:
- **Bar & Grouped Bar Charts:** Compare metrics across categorical attributes.
- **Line & Trend Series:** Track temporal velocity, momentum, and progression.
- **Donut & Pie Visualizations:** Proportional slice breakdowns with customizable cutout geometry.
- **Scatter Plots:** Discover multi-variable correlations with interactive mouse-wheel zoom and canvas pan.
- **Distribution Histograms:** Bin-frequency distributions with optional Gaussian Kernel Density Estimation (KDE) curves.
- **Box & Whisker Plots:** Rapid outlier discovery using IQR quartiles (Q1, Median, Q3).
- **Interactive Word Clouds:** Keyword frequency analysis with dynamic sizing and stopword filtering.
- **Statistical Metric Ledgers:** Instant calculations for Mean, Median, Std. Dev ($\sigma$), Min, Max, Range, and Cumulative Sums.

### 🎨 Theme Engine & Smart Dashboarding
- **5 Curated Color Themes:** *Modern Tech*, *Fintech Emerald*, *Sunset Warm*, *Minimal Slate*, and *Accessible High-Contrast*.
- **Auto-Build Smart Dashboard:** Analyzes column signatures to automatically instantiate the most effective visualizations for your data.
- **Responsive Layouts:** Switch seamlessly between a 2-column dashboard grid and single-column editorial stream.

### 📁 Universal Ingestion & Curated Benchmarks
- **Delimiter Auto-Detection:** Automatically parses comma (`,`), semicolon (`;`), tab (`\t`), and pipe (`|`) delimited files.
- **RFC 4180 Compliant:** Seamlessly handles multiline text and quoted cells containing commas (e.g., `"San Francisco, CA"`).
- **JSON Support:** Directly parses array-of-objects JSON structures.
- **1-Click Sample Gallery:** Instant exploration cards featuring curated real-world benchmarks:
  - 💼 *Global Tech Leaders* (Valuations, margins, revenues, employee counts)
  - 🌸 *Fisher's Iris Flower* (Classic multivariate biological benchmark)
  - 🛒 *Retail Sales & Profit* (Regional categories, unit economics, profits)
  - 🌍 *Country Development & Climate* (GDP per capita, life expectancy, renewable energy)

### 🔍 Interactive Data Explorer & Export Suite
- **TanStack Table Power:** Live global keyword search, column sorting, and data-type indicators (`#` numeric vs `Abc` categorical).
- **Export Formats:**
  - High-Resolution PNG (retina canvas snapshot)
  - Vector PDF reports
  - **Copy to Clipboard:** Copy chart images directly to clipboard for slides, or copy tabular data as TSV for instant pasting into Google Sheets or Microsoft Excel.

### 🤖 Local EdgeAgent Intelligence
- A private local assistant that guides data exploration, outlier analysis, chart selection, and statistical interpretation without requiring external cloud API keys.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | React 19, React Router 7 |
| **Build Tooling** | Vite 6, PostCSS, Autoprefixer |
| **Styling** | Tailwind CSS 3.4 |
| **Visualizations** | Chart.js 4, react-chartjs-2, chartjs-plugin-zoom, chartjs-chart-box-and-violin-plot |
| **Data Engine** | simple-statistics, @tanstack/react-table, @tanstack/react-virtual |
| **Export Utilities**| html-to-image, jspdf |
| **Icons & Motion** | react-icons (Feather & FontAwesome), framer-motion |

---

## Getting Started

### Prerequisites
- Node.js 20+ or 22+
- npm (or yarn / pnpm)

### Installation

```bash
# Clone the repository
git clone https://github.com/clueanalytics7/edgechart.git
cd edgechart

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` to interact with the local development instance.

### Production Build

```bash
# Compile and bundle for production
npm run build

# Preview production build locally
npm run preview
```

The production output will be generated inside the `dist/` directory, ready for deployment to any static hosting provider (Vercel, Cloudflare Pages, Netlify, Firebase Hosting, or GitHub Pages).

---

## Project Structure

```text
├── public/                 # Static assets and favicon
├── src/
│   ├── assets/             # Brand graphics and showcase previews
│   ├── components/         # Modular UI components
│   │   ├── ChartBuilder.jsx    # Visualizations engine & theme selector
│   │   ├── DataTable.jsx       # Searchable, sortable tabular explorer
│   │   ├── DatasetInsights.jsx # Automated local statistical takeaways
│   │   ├── DatasetSummary.jsx  # Health metrics (rows, cols, completeness)
│   │   ├── ExportData.jsx      # CSV, JSON, and Clipboard TSV exporter
│   │   ├── FileUpload.jsx      # Multi-format dropzone & sample gallery
│   │   ├── Navbar.jsx          # Header navigation
│   │   ├── Footer.jsx          # Footer & links
│   │   └── CookieConsent.jsx   # Client privacy banner
│   ├── lib/
│   │   ├── dataParser.js       # RFC 4180 CSV, TSV, and JSON parser
│   │   ├── sampleDatasets.js   # Curated demo datasets
│   │   └── analytics.js        # Optional privacy-respecting telemetry
│   ├── pages/              # Route pages (Home, Dashboard, Guide, About, Contact, Privacy, Agent)
│   ├── App.jsx             # Main application layout and state coordinator
│   └── main.jsx            # Entry point
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Design tokens and styling rules
└── vite.config.js          # Vite build and dev server configuration
```

---

## Privacy & Security

EdgeChart is built upon the principle of **Zero-Knowledge Architecture**:
- All data ingestion occurs exclusively through the browser's `FileReader` API.
- Computations occur in your device's memory.
- No dataset cells or files are transmitted across the network.
- No analytics script ever inspects or logs the contents of uploaded datasets.

---

## Contributing

Contributions, feature suggestions, and bug reports are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License & Credits

Distributed under the MIT License. Developed and maintained by [ClueAnalytics](https://clue-analytics.web.app/).
