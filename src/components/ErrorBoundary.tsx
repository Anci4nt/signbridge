import { Component, type ReactNode, type ErrorInfo } from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-ink-950">
          <div className="glass max-w-lg p-8">
            <h1 className="font-display text-2xl font-bold text-white mb-3">
              Something went wrong
            </h1>
            <p className="text-slate-400 mb-4">
              The application encountered an unexpected error. Reloading the page may fix it.
            </p>
            <pre className="text-xs text-danger-400 bg-ink-950/50 rounded-lg p-3 overflow-auto mb-4 font-mono">
              {this.state.error?.message ?? 'Unknown error'}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
