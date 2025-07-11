'use client';

import { useState, useEffect } from 'react';
import { apiService, handleApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export function ApiTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const connected = await apiService.healthCheck();
      setIsConnected(connected);
    } catch (err) {
      setError(handleApiError(err));
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusColor = () => {
    if (isConnected === null) return 'bg-gray-500';
    return isConnected ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = () => {
    if (isConnected === null) return 'Vérification...';
    return isConnected ? 'Connecté' : 'Déconnecté';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Test de Connexion API
          <Badge 
            variant={isConnected ? 'default' : 'destructive'}
            className={getStatusColor()}
          >
            {getStatusText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={testConnection} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Test en cours...' : 'Tester la connexion'}
        </Button>
        
        {isConnected && (
          <Alert>
            <AlertDescription>
              ✅ L'API backend est accessible et fonctionne correctement.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 