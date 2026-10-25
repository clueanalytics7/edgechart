import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => {
    try {
      return typeof window !== 'undefined' && !localStorage.getItem('cookieConsent');
    } catch {
      return false;
    }
  });

  const acceptCookies = () => {
    try {
      localStorage.setItem('cookieConsent', 'true');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xs text-white p-3.5 z-50 border-t border-slate-800 shadow-xl">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-slate-300">
          <FiShield className="text-emerald-400 w-4 h-4 shrink-0" />
          <p>
            EdgeChart processes all data locally on your device. We use anonymous traffic cookies to improve our tool.
            <Link to="/privacy" className="underline text-white hover:text-blue-300 ml-1.5 font-medium">
              Privacy details
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setVisible(false)}
            className="px-3 py-1.5 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors shadow-2xs"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
