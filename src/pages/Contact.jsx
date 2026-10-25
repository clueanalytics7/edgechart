import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiCheck, FiSend, FiHelpCircle } from "react-icons/fi";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    inquiryType: "general",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxbKvo_PY1U67Wv-ZWLMVFKLCobPcGlRqcrv5SJKLVUyUlHm1RtS3ZOzrF2eSksuesR/exec';

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const submitViaJsonp = () => {
    return new Promise((resolve, reject) => {
      const callbackName = `jsonp_${Date.now()}`;
      const script = document.createElement('script');

      window[callbackName] = (response) => {
        cleanup();
        if (response && response.success) {
          resolve(response);
        } else {
          reject(new Error(response?.message || 'JSONP submission failed: server did not report success.'));
        }
      };

      const cleanup = () => {
        delete window[callbackName];
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };

      script.onerror = () => {
        cleanup();
        reject(new Error('Network error during JSONP request.'));
      };

      const params = new URLSearchParams();
      params.append('callback', callbackName);
      params.append('name', formData.name);
      params.append('email', formData.email);
      params.append('message', formData.message);
      params.append('inquiryType', formData.inquiryType);

      script.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    const { name, email, message, inquiryType } = formData;

    if (!name || !email || !message) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      let postAttemptSuccessful = false;
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message, inquiryType }),
          credentials: 'omit',
        });

        const result = await response.json();
        if (response.ok && result.success) {
          setSubmitted(true);
          setFormData({ name: "", email: "", message: "", inquiryType: "general" });
          postAttemptSuccessful = true;
        } else {
          setError(result.message || `POST failed with status ${response.status}.`);
        }
      } catch {
        // Fall back to JSONP
      }

      if (!postAttemptSuccessful) {
        await submitViaJsonp();
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "", inquiryType: "general" });
      }
    } catch {
      setError("Failed to send message. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <FiMail className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Get in Touch
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Have questions, feedback, a feature suggestion, or a data inquiry? Send us a message and our team will get back to you shortly.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <FiCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-emerald-900">
                  Message Sent Successfully
                </h3>
                <p className="text-xs text-emerald-700 mt-1">
                  Thank you for reaching out! We have received your inquiry and will respond as soon as possible.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="inquiryType" className="block text-xs font-semibold text-slate-700 mb-1">
                  Inquiry Category
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800 transition-colors"
                  disabled={isLoading}
                >
                  <option value="general">General Inquiry</option>
                  <option value="feedback">Product Feedback & Feature Request</option>
                  <option value="dataRequest">Data Inquiry (GDPR / Privacy)</option>
                  <option value="collaboration">Collaboration / Partnership</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800 transition-colors"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800 transition-colors"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-slate-700 mb-1">
                  Message Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we assist you?"
                  rows={4}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800 transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <FiHelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>We usually reply within 24–48 hours</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <FiSend className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
