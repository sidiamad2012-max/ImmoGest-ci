import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimer?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Auto-retry for specific errors after a delay
    if (this.shouldAutoRetry(error) && this.state.retryCount < 2) {
      this.retryTimer = setTimeout(() => {
        this.handleRetry();
      }, 2000);
    }
  }

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  private shouldAutoRetry(error: Error): boolean {
    const retryableErrors = [
      'timeout',
      'network',
      'loading chunk failed',
      'dynamically imported module'
    ];
    
    const errorMessage = error.message?.toLowerCase() || '';
    return retryableErrors.some(keyword => errorMessage.includes(keyword));
  }

  private handleRetry = () => {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
    
    this.setState(prevState => ({ 
      hasError: false, 
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }));
  };

  private handleReload = () => {
    window.location.reload();
  };

  private getErrorMessage(error?: Error): string {
    if (!error) return 'Une erreur inattendue s\'est produite';
    
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('timeout')) {
      return 'Délai d\'attente dépassé. Vérifiez votre connexion internet.';
    }
    
    if (message.includes('network')) {
      return 'Erreur de réseau. Vérifiez votre connexion internet.';
    }
    
    if (message.includes('chunk')) {
      return 'Erreur de chargement. L\'application va se recharger automatiquement.';
    }
    
    return 'Une erreur technique s\'est produite.';
  }

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message?.includes('chunk') || 
                          this.state.error?.message?.includes('dynamically imported');
      
      // Auto-reload for chunk errors
      if (isChunkError && this.state.retryCount === 0) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
        return (
          <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <RefreshCw className="w-12 h-12 mx-auto animate-spin text-primary" />
                  <h2>Mise à jour en cours...</h2>
                  <p className="text-sm text-muted-foreground">
                    L'application se recharge automatiquement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <div>
                  <CardTitle>Oops ! Une erreur s'est produite</CardTitle>
                  <CardDescription>
                    {this.getErrorMessage(this.state.error)}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.retryCount < 3 && (
                <Button 
                  onClick={this.handleRetry} 
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer ({3 - this.state.retryCount} tentatives restantes)
                </Button>
              )}
              
              <Button 
                onClick={this.handleReload} 
                variant="outline" 
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Recharger l'application
              </Button>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 p-3 bg-gray-50 rounded border">
                  <summary className="cursor-pointer text-sm font-medium">
                    Détails techniques (dev mode)
                  </summary>
                  <div className="mt-2 text-xs">
                    <p><strong>Erreur:</strong> {this.state.error.message}</p>
                    <p><strong>Stack:</strong></p>
                    <pre className="mt-1 text-xs overflow-auto">
                      {this.state.error.stack}
                    </pre>
                    {this.state.errorInfo && (
                      <>
                        <p><strong>Component Stack:</strong></p>
                        <pre className="mt-1 text-xs overflow-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}