import { useState, useEffect, useRef } from "react";
import { FiSend, FiCpu, FiShield, FiHelpCircle, FiBarChart2 } from "react-icons/fi";

const LOCAL_KNOWLEDGE_BASE = [
  {
    triggers: ['recommend', 'chart', 'best chart', 'which chart', 'visualize'],
    title: 'Chart Selection Recommendations',
    response: `Here is a guide to selecting the best chart for your dataset:

• Categorical vs. Numeric (e.g., Department & Sales): Use a **Bar Chart** or **Donut Chart** to easily compare totals across categories.
• Two Numeric Variables (e.g., Price vs. Units Sold, Height vs. Weight): Use a **Scatter Plot** to discover correlations, clusters, and trends.
• Time Series (e.g., Date & Revenue): Use a **Line Chart** to track direction, seasonality, and momentum.
• Single Numeric Distribution: Use a **Distribution (Histogram)** to observe skewness and normality, or a **Box Plot** to spot median, interquartile range (IQR), and outliers.
• Free-text or Keywords: Use a **Word Cloud** to visualize term frequency across articles, comments, or survey feedback.`
  },
  {
    triggers: ['outlier', 'anomaly', 'box plot', 'iqr', 'extreme'],
    title: 'Detecting & Handling Outliers',
    response: `In EdgeChart, you can easily detect outliers using the **Box Plot** tool:

1. Under the Chart Library, select **Boxplot** and pick your numeric column.
2. EdgeChart calculates Q1 (25th percentile), Median (50th), and Q3 (75th percentile).
3. The Interquartile Range (IQR) = Q3 - Q1. Any point beyond 1.5 × IQR from the hinges is flagged as an outlier.
4. Compare the **Mean vs. Median** in the Statistics Summary: if the Mean is significantly higher than the Median, your distribution is right-skewed by high-value outliers.`
  },
  {
    triggers: ['privacy', 'secure', 'server', 'upload', 'cloud', 'leak'],
    title: 'Browser-Native Privacy Architecture',
    response: `EdgeChart operates on a strict **Zero-Telemetry, Client-Side** execution model:

• **No Server Uploads:** Your files are read via the HTML5 FileReader API directly into browser memory.
• **No Analytics on Records:** Data rows, headers, and statistical values never leave your device.
• **Ephemeral Sandbox:** When you close or refresh the tab, the in-memory dataset is immediately wiped.
• Safe for sensitive financial ledgers, proprietary sales lists, and confidential internal metrics.`
  },
  {
    triggers: ['format', 'file', 'csv', 'tsv', 'json', 'excel', 'delimiter'],
    title: 'Supported File Formats & Ingestion',
    response: `EdgeChart supports:

• **CSV (.csv):** Comma-separated files with headers.
• **TSV / TXT (.tsv, .txt):** Tab- or semicolon-separated data. Delimiters are detected automatically.
• **JSON (.json):** JSON arrays of flat objects (e.g., [{"city": "London", "temp": 18}]).
• Quoted fields containing commas (RFC 4180) are parsed automatically without splitting internal commas.`
  },
  {
    triggers: ['correlation', 'pearson', 'relationship', 'scatter'],
    title: 'Understanding Correlation & Relationships',
    response: `To evaluate the relationship between two numeric metrics:

1. Select **Scatter** in the Chart Library.
2. Assign variable X to the independent factor and Y to the outcome.
3. If points form an upward slant, there is a positive relationship; downward indicates a negative relationship.
4. Zoom and pan on the scatter plot using your mouse wheel or drag to examine dense clusters.`
  }
];

export default function Agent() {
  const [messages, setMessages] = useState([
    {
      user: "EdgeAgent",
      text: "Hello! I am EdgeAgent, your private data and visualization assistant. I run locally on your device to help you choose the best charts, analyze distributions, and understand statistical concepts. What would you like to explore?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickPrompts = [
    { label: "Recommend chart types", query: "What is the best chart for my data?" },
    { label: "How to detect outliers", query: "How do I detect outliers using a box plot?" },
    { label: "Client-side privacy", query: "How is my data kept private in EdgeChart?" },
    { label: "Supported file formats", query: "What file formats can EdgeChart parse?" },
  ];

  const getLocalResponse = (userInput) => {
    const lower = userInput.toLowerCase();
    for (const item of LOCAL_KNOWLEDGE_BASE) {
      if (item.triggers.some(t => lower.includes(t))) {
        return item.response;
      }
    }

    return `I can help you analyze datasets and configure charts in EdgeChart!

You can ask me about:
• **Chart Selection:** Which visualization fits categorical, time-series, or numeric data.
• **Statistical Summaries:** Interpreting mean, median, standard deviation, and IQR.
• **Data Ingestion:** Uploading CSV, TSV, or JSON files.
• **Privacy:** How EdgeChart processes all data in-browser with zero server transmission.

Try clicking one of the suggested prompts above or head to the **Dashboard** to explore a dataset!`;
  };

  const handleSend = async (messageText = input) => {
    const textToSend = messageText.trim();
    if (!textToSend || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: textToSend, user: "You" }]);
    setInput("");

    // Simulate snappy local assistant latency
    setTimeout(() => {
      const response = getLocalResponse(textToSend);
      setMessages(prev => [...prev, { text: response, user: "EdgeAgent" }]);
      setIsLoading(false);
    }, 250);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FiCpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">EdgeAgent</h1>
            <p className="text-xs text-slate-500">
              Private, client-side data analysis assistant · Zero server transmission
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200/60 font-medium">
          <FiShield className="w-3.5 h-3.5" />
          <span>Local Engine Active</span>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="mb-4">
        <div className="text-xs text-slate-500 mb-2 font-medium flex items-center gap-1.5">
          <FiHelpCircle className="w-3.5 h-3.5" />
          <span>Quick Exploration Topics</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt.query)}
              className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors shadow-2xs text-left"
            >
              {prompt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-[480px]">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, i) => {
            const isUser = msg.user === "You";
            return (
              <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 text-slate-800 border border-slate-200/70"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold ${isUser ? "text-blue-100" : "text-slate-500"}`}>
                      {msg.user}
                    </span>
                  </div>
                  <div className="whitespace-pre-line text-xs sm:text-sm">
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-t-2 border-b-2 border-blue-600"></div>
                <span>Analyzing request...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about chart selection, statistics, distributions, or data prep..."
              className="flex-1 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <span>Send</span>
              <FiSend className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
