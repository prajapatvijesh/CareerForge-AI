import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export const AdminAuditLogsPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-audit-logs', page],
    queryFn: () => adminApi.getAuditLogs({ page }),
    placeholderData: (prev) => prev
  });

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Security and administrative action trail.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-400">
              <tr>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Admin</th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">Target Entity</th>
                <th className="py-3 px-4 font-semibold">Metadata</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && !data ? (
                <tr><td colSpan={5} className="py-8 text-center animate-pulse">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="py-8 text-center text-red-500">Failed to load logs.</td></tr>
              ) : data?.logs.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center">No logs found.</td></tr>
              ) : (
                data?.logs.map((log: any) => (
                  <tr key={log._id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 whitespace-nowrap">{format(new Date(log.createdAt), 'MMM dd, HH:mm:ss')}</td>
                    <td className="py-3 px-4">
                      {log.adminId ? (
                        <div>
                          <p className="font-medium">{log.adminId.name}</p>
                          <p className="text-xs text-gray-500">{log.adminId.email}</p>
                        </div>
                      ) : 'System'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p>{log.entityType}</p>
                      <p className="text-xs font-mono text-gray-500">{log.entityId}</p>
                    </td>
                    <td className="py-3 px-4">
                      <pre className="text-[10px] bg-gray-50 dark:bg-gray-900 p-2 rounded max-w-[300px] overflow-x-auto overflow-y-auto max-h-20">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {data && data.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <span className="text-sm text-gray-500">Page {page} of {data.totalPages}</span>
            <Button variant="outline" disabled={page === data.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
};
