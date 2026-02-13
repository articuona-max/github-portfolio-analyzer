import React from 'react';
import { AnalysisResult } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RefreshCw, Star, GitFork, Code } from 'lucide-react';

interface DashboardProps {
    data: AnalysisResult;
    onReset: () => void;
}

export default function Dashboard({ data, onReset }: DashboardProps) {
    const scoreColor = data.total_score >= 80 ? 'text-green-500' : data.total_score >= 50 ? 'text-yellow-500' : 'text-red-500';

    const chartData = [
        { name: 'Docs', value: data.breakdown.documentation },
        { name: 'Structure', value: data.breakdown.code_structure },
        { name: 'Activity', value: data.breakdown.activity },
        { name: 'Impact', value: data.breakdown.impact },
        { name: 'Tech', value: data.breakdown.technical },
        { name: 'Pro', value: data.breakdown.professionalism },
    ];

    return (
        <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="flex items-center gap-4">
                    <img src={data.avatar_url} alt={data.username} className="w-16 h-16 rounded-full border-2 border-slate-700" />
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            {data.username}
                            <span className="text-sm font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                Score: <span className={scoreColor}>{data.total_score}</span>
                            </span>
                        </h2>
                        <p className="text-slate-400 text-sm">Analyzed just now</p>
                    </div>
                </div>
                <button onClick={onReset} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <RefreshCw size={18} /> New Analysis
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score & Chart */}
                <div className="md:col-span-2 bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-lg font-semibold mb-4">Performance Breakdown</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" domain={[0, 20]} hide />
                                <YAxis dataKey="name" type="category" width={80} stroke="#94a3b8" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                    cursor={{ fill: '#334155', opacity: 0.4 }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.value < 10 ? '#ef4444' : '#3b82f6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-lg font-semibold mb-4">Profile Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-2 text-slate-300"><Star size={16} /> Total Stars</div>
                            <span className="font-mono font-bold text-xl">{data.stats.total_stars}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-2 text-slate-300"><GitFork size={16} /> Total Forks</div>
                            <span className="font-mono font-bold text-xl">{data.stats.total_forks}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-2 text-slate-300"><Code size={16} /> Languages</div>
                            <span className="font-mono font-bold text-xl">{Object.keys(data.stats.languages).length}</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-sm font-semibold text-slate-400 mb-2">Top Languages</h4>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(data.stats.languages)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 5)
                                .map(([lang]) => (
                                    <span key={lang} className="px-2 py-1 bg-slate-800 text-xs rounded-md text-slate-300 border border-slate-700">
                                        {lang}
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Repos & Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-lg font-semibold mb-4">Top Repositories</h3>
                    <div className="space-y-3">
                        {data.top_repos.map(repo => (
                            <a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer"
                                className="block p-3 bg-slate-800/30 hover:bg-slate-800 transition-colors rounded-lg border border-slate-800 hover:border-slate-600 group">
                                <div className="flex justify-between items-start">
                                    <span className="font-medium text-blue-400 group-hover:underline">{repo.name}</span>
                                    <div className="flex items-center gap-3 text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><Star size={12} /> {repo.stars}</span>
                                        <span className="flex items-center gap-1"><GitFork size={12} /> {repo.forks}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{repo.description || "No description provided."}</p>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-lg font-semibold mb-4 text-amber-400">Actionable Feedback</h3>
                    <ul className="space-y-2">
                        {data.improvement_tips.map((tip, i) => (
                            <li key={i} className="flex gap-2 text-sm text-slate-300 p-2 bg-amber-500/10 border-l-2 border-amber-500 rounded-r">
                                <span>🚀</span> {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
