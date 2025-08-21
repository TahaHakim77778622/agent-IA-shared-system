"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestDashboardPage() {
  const [actionHistory, setActionHistory] = useState<any[]>([]);
  const [accessLogs, setAccessLogs] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  // Fonction pour générer des IDs uniques
  const generateUniqueId = (prefix: string = 'id') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${performance.now().toString(36).substr(2, 6)}`;
  };

  // Ajouter une action de test
  const addTestAction = () => {
    const newAction = {
      id: generateUniqueId('action'),
      action: 'test',
      target: 'Test',
      timestamp: new Date(),
      details: { message: 'Action de test' }
    };
    
    setActionHistory(prev => [newAction, ...prev.slice(0, 9)]);
    setMessage(`Action ajoutée avec ID: ${newAction.id}`);
  };

  // Ajouter un log de test
  const addTestLog = () => {
    const newLog = {
      id: generateUniqueId('log'),
      action: 'test_log',
      ip: '127.0.0.1',
      userAgent: navigator.userAgent,
      timestamp: new Date(),
      success: true,
      details: { message: 'Log de test' }
    };
    
    setAccessLogs(prev => [newLog, ...prev.slice(0, 9)]);
    setMessage(`Log ajouté avec ID: ${newLog.id}`);
  };

  // Nettoyer les données
  const clearData = () => {
    setActionHistory([]);
    setAccessLogs([]);
    setMessage("Données effacées");
  };

  // Vérifier les IDs dupliqués
  const checkDuplicateIds = () => {
    const actionIds = actionHistory.map(a => a.id);
    const logIds = accessLogs.map(l => l.id);
    
    const duplicateActions = actionIds.filter((id, index) => actionIds.indexOf(id) !== index);
    const duplicateLogs = logIds.filter((id, index) => logIds.indexOf(id) !== index);
    
    if (duplicateActions.length > 0 || duplicateLogs.length > 0) {
      setMessage(`❌ IDs dupliqués trouvés:\nActions: ${duplicateActions.length}\nLogs: ${duplicateLogs.length}`);
    } else {
      setMessage("✅ Aucun ID dupliqué trouvé");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test du Dashboard - Gestion des IDs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={addTestAction}>Ajouter Action</Button>
              <Button onClick={addTestLog}>Ajouter Log</Button>
              <Button onClick={checkDuplicateIds} variant="outline">Vérifier IDs</Button>
              <Button onClick={clearData} variant="destructive">Effacer</Button>
            </div>
            
            {message && (
              <div className="p-3 bg-blue-100 text-blue-800 rounded-md whitespace-pre-wrap">
                {message}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Action History */}
          <Card>
            <CardHeader>
              <CardTitle>Action History ({actionHistory.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {actionHistory.length > 0 ? (
                <div className="space-y-2">
                  {actionHistory.map((action) => (
                    <div key={action.id} className="p-2 bg-gray-100 rounded text-sm">
                      <div className="font-mono text-xs text-gray-600">{action.id}</div>
                      <div>{action.action} - {action.target}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Aucune action</p>
              )}
            </CardContent>
          </Card>

          {/* Access Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Access Logs ({accessLogs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {accessLogs.length > 0 ? (
                <div className="space-y-2">
                  {accessLogs.map((log) => (
                    <div key={log.id} className="p-2 bg-gray-100 rounded text-sm">
                      <div className="font-mono text-xs text-gray-600">{log.id}</div>
                      <div>{log.action} - {log.success ? '✅' : '❌'}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Aucun log</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <a href="/dashboard" className="text-blue-600 hover:underline">
            → Aller au Dashboard complet
          </a>
        </div>
      </div>
    </div>
  );
} 