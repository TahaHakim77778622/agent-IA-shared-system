import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Pas de clé dynamique, pas de Provider qui change à chaque render
  return <>{children}</>;
} 