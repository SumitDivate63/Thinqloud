import React from 'react';

export default function StitchAdminOperations() {
  const auditLogs = [
    { time: '10:04:12 AM', actor: 'admin@thinqsummit.io', action: 'Published Event: ThinqSummit 2026', status: 'SUCCESS' },
    { time: '10:12:05 AM', actor: 'organizer@thinqsummit.io', action: 'Started QR Attendance Window (Session #101)', status: 'ACTIVE' },
    { time: '10:20:44 AM', actor: 'system-auth', action: 'Google OAuth Single Sign-On Verified (Alex Rivers)', status: 'SUCCESS' },
    { time: '10:35:10 AM', actor: 'security-mesh', action: 'Dynamic Token Security Verification Completed', status: 'VERIFIED' }
  ];

  return (
    <div className="w-full bg-background min-h-screen p-4 md:p-8 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/60 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
            ACADEMIC & ENTERPRISE GOVERNANCE
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-1">System Administration & Audit Operations</h1>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          System Health: 100% Operational
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">policy</span>
            <span>Real-time System Audit & Compliance Stream</span>
          </h3>
          <span className="text-xs text-on-surface-variant font-mono">Zero-Trust Logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-on-surface">
            <thead>
              <tr className="border-b border-outline-variant/40 text-on-surface-variant font-semibold">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Identity / Actor</th>
                <th className="py-2.5 px-3">Action Description</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {auditLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low/50">
                  <td className="py-3 px-3 font-mono text-on-surface-variant">{log.time}</td>
                  <td className="py-3 px-3 font-semibold text-on-surface">{log.actor}</td>
                  <td className="py-3 px-3 text-on-surface-variant">{log.action}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
