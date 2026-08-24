import React from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary Caught]', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[300px] w-full flex items-center justify-center p-6 my-4 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-2xl shadow-sm">
          <div className="max-w-md text-center">
            <div className="w-14 h-14 mx-auto mb-4 bg-rose-50 dark:bg-rose-950/60 rounded-2xl flex items-center justify-center text-rose-500 shadow-inner">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {this.props.title || 'Something went wrong in this section'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
              {this.state.error?.message || 'An unexpected error occurred while rendering this component. Other parts of the application are working normally.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
              >
                <Home className="w-4 h-4" />
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
