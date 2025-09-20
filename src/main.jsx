import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Optional: Uncomment if you use global styles
// import "./index.css";

// Simple error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // Log error to service if needed
    console.error("App ErrorBoundary:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please reload the page.</div>;
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </QueryClientProvider>
  </React.StrictMode>
);
