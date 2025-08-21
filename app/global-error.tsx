"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur globale de l'application:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
            <div className="text-red-500 text-6xl mb-4">🚨</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Erreur critique de l'application
            </h1>
            <p className="text-gray-600 mb-6">
              Une erreur grave s'est produite. L'application ne peut pas continuer.
            </p>
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Redémarrer l'application
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                Recharger la page
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 