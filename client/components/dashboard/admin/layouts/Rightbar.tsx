"use client";

import React from "react";

export const Rightbar: React.FC = () => {
  return (
    <aside className="hidden xl:flex flex-col w-72 border-l bg-white dark:bg-slate-900 p-6 space-y-6 min-h-screen">
      {/* Example widgets for rightbar */}
      <section className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 shadow-sm">
        <h2 className="font-semibold text-lg mb-2 text-amber-700 dark:text-amber-300">Quick Stats</h2>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>Active Users: <span className="font-bold text-amber-700">1,234</span></li>
          <li>Pending Requests: <span className="font-bold text-rose-600">12</span></li>
          <li>System Health: <span className="font-bold text-green-600">Good</span></li>
        </ul>
      </section>
      <section className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
        <h2 className="font-semibold text-lg mb-2">Tips & Updates</h2>
        <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
          <li>Remember to review new templates weekly.</li>
          <li>System maintenance scheduled for Sunday.</li>
        </ul>
      </section>
      <section className="bg-gradient-to-r from-amber-400 to-rose-400 text-white rounded-lg p-4 shadow-md">
        <h2 className="font-semibold text-lg mb-2">Contact Support</h2>
        <p className="text-xs">Need help? Email <a href="mailto:support@uog.edu.et" className="underline">support@uog.edu.et</a></p>
      </section>
    </aside>
  );
};

export default Rightbar;
