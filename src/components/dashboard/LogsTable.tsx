"use client";

import { useState, useEffect } from 'react';
import { fetchLogs, type LogRow } from '@/services/logs';
import type { LogsFilters } from '@/types/logs';
import LogsDetailsModal from './LogsDetailsModal';

interface LogsTableProps {
  filters?: LogsFilters;
}

export default function LogsTable({ filters }: LogsTableProps) {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        const data = await fetchLogs(filters);
        setLogs(data);
        setError(null);
      } catch (err) {
        console.error('Error loading logs:', err);
        setError('Failed to load logs');
      } finally {
        setLoading(false);
      }
    }

    void loadLogs();
  }, [filters]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-900/20 text-green-400 border-green-700/50',
      cancelled: 'bg-red-900/20 text-red-400 border-red-700/50',
      'no-show': 'bg-orange-900/20 text-orange-400 border-orange-700/50',
      rescheduled: 'bg-yellow-900/20 text-yellow-400 border-yellow-700/50',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || 'bg-gray-900/20 text-gray-400 border-gray-700/50'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const diff = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex space-x-4 mb-3">
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-6">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700/50">
          <h3 className="text-lg font-semibold text-white">Session Logs</h3>
          <p className="text-gray-400 text-sm">
            {logs.length} {logs.length === 1 ? 'session' : 'sessions'} found
          </p>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 mb-2">No session logs found</p>
            <p className="text-gray-500 text-sm">Sessions will appear here after appointments are completed</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-700/20 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">{log.client_name}</div>
                        <div className="text-sm text-gray-400">{log.client_email}</div>
                        {log.client_phone && (
                          <div className="text-sm text-gray-500">{log.client_phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">
                        {formatDate(log.appointment_date)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatTime(log.appointment_time_start)} - {formatTime(log.appointment_time_end)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">
                        {calculateDuration(log.appointment_time_start, log.appointment_time_end)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {log.session_notes ? (
                          <p className="text-gray-300 text-sm truncate">{log.session_notes}</p>
                        ) : (
                          <span className="text-gray-500 text-sm italic">No notes</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <LogsDetailsModal
          selectedLog={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </>
  );
}