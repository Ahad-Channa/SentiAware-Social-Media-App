import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getModerationLogs } from '../../api/api';
import { formatDistanceToNow } from 'date-fns';

const ModerationLog = () => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await getModerationLogs();
                setLogs(data);
            } catch (err) {
                console.error('Error fetching logs:', err);
                setError('Failed to load moderation history.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 pt-20 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-4xl mx-auto">
                <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 overflow-hidden">

                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-700 flex items-center gap-3">
                        <button
                            onClick={() => navigate('/settings')}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-all duration-200"
                            title="Back to Settings"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                AI Moderation Log
                            </h2>
                            <p className="mt-0.5 text-sm text-slate-400">
                                Posts that were automatically moderated by our AI system.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : error ? (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                                {error}
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="text-center p-10 border border-slate-700 border-dashed rounded-xl bg-slate-800/50">
                                <svg className="w-10 h-10 text-slate-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-slate-400 font-medium">No moderation logs found</p>
                                <p className="text-slate-500 text-sm mt-1">Your posts are clean — you're all good!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-xl border border-slate-700">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="text-xs text-slate-400 uppercase bg-slate-700/60">
                                        <tr>
                                            <th className="px-4 py-3 rounded-tl-xl">Date / Time</th>
                                            <th className="px-4 py-3">Original (Blocked)</th>
                                            <th className="px-4 py-3 rounded-tr-xl">Cleaned &amp; Published</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/60">
                                        {logs.map((log) => (
                                            <tr key={log._id} className="hover:bg-slate-700/20 transition-colors">
                                                <td className="px-4 py-4 whitespace-nowrap text-slate-400 text-xs">
                                                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                                </td>
                                                <td
                                                    className="px-4 py-4 max-w-[260px] truncate text-red-400 font-medium cursor-help"
                                                    title={log.originalContent}
                                                >
                                                    {log.originalContent || 'N/A'}
                                                </td>
                                                <td
                                                    className="px-4 py-4 max-w-[260px] truncate text-emerald-400 cursor-help"
                                                    title={log.content}
                                                >
                                                    {log.content}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModerationLog;
