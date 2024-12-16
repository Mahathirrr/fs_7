"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "../button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Oops, terjadi kesalahan</h2>
            <p className="text-muted-foreground mb-4">
              {this.state.error?.message || "Terjadi kesalahan yang tidak diketahui"}
            </p>
            <Button
              onClick={() => this.setState({ hasError: false })}
            >
              Coba lagi
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}