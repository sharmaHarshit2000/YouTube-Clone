import { useEffect } from "react";

export default function Loader() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      @keyframes colorCycle {
        0% {
          border-top-color: #3b82f6; /* blue */
          border-right-color: #10b981; /* green */
          border-bottom-color: #f59e0b; /* yellow */
          border-left-color: #ef4444; /* red */
        }
        25% {
          border-top-color: #ef4444; /* red */
          border-right-color: #3b82f6; /* blue */
          border-bottom-color: #10b981; /* green */
          border-left-color: #f59e0b; /* yellow */
        }
        50% {
          border-top-color: #f59e0b; /* yellow */
          border-right-color: #ef4444; /* red */
          border-bottom-color: #3b82f6; /* blue */
          border-left-color: #10b981; /* green */
        }
        75% {
          border-top-color: #10b981; /* green */
          border-right-color: #f59e0b; /* yellow */
          border-bottom-color: #ef4444; /* red */
          border-left-color: #3b82f6; /* blue */
        }
        100% {
          border-top-color: #3b82f6; /* blue */
          border-right-color: #10b981; /* green */
          border-bottom-color: #f59e0b; /* yellow */
          border-left-color: #ef4444; /* red */
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
      <div
        className="w-16 h-16 rounded-full border-[6px] border-solid border-transparent"
        style={{
          animation: "spin 1.2s linear infinite, colorCycle 3.6s linear infinite",
        }}
        aria-label="Loading"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}