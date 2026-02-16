import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);

        // We can also trigger a toast here if we want, but usually full UI replacement is better for crashes
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{
                    padding: '50px',
                    textAlign: 'center',
                    fontFamily: 'sans-serif',
                    color: '#333',
                    background: '#f8f9fa',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#e11d48' }}>Something went wrong.</h1>
                    <p style={{ maxWidth: '600px', lineHeight: '1.6', marginBottom: '2rem' }}>
                        The application encountered an unexpected error. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px',
                            fontSize: '1rem',
                            background: '#0f172a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Refresh Page
                    </button>

                    {/* Optional: Show error details in development */}
                    {(true) && this.state.error && ( // Always show for now during dev
                        <details style={{ marginTop: '30px', textAlign: 'left', background: '#e2e8f0', padding: '15px', borderRadius: '8px', maxWidth: '800px', width: '100%', overflow: 'auto' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Error Details</summary>
                            <pre style={{ marginTop: '10px', fontSize: '0.85rem' }}>
                                {this.state.error.toString()}
                                <br />
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
