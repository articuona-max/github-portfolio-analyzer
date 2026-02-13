'use client';

import { useState } from 'react';
import { fetchProfileAnalysis, AnalysisResult } from '@/lib/api';
import Dashboard from '@/components/Dashboard';
import { Search, Github, Loader2 } from 'lucide-react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    // Extract username if URL is pasted
    let cleanUsername = username.trim();
    try {
      if (cleanUsername.includes('github.com')) {
        const urlObj = new URL(cleanUsername.startsWith('http') ? cleanUsername : `https://${cleanUsername}`);
        const pathParts = urlObj.pathname.split('/').filter(p => p.length > 0);
        if (pathParts.length > 0) {
          cleanUsername = pathParts[0];
        }
      }
    } catch (e) {
      // Fallback or ignore invalid URL format, assume raw input might be username
      console.warn("Could not parse as URL, using raw input");
    }

    try {
      const result = await fetchProfileAnalysis(cleanUsername);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check the username and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">

      {!data && (
        <div className="flex flex-col items-center justify-center flex-1 max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="bg-blue-500/10 p-4 rounded-full mb-4 ring-1 ring-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <Github size={48} className="text-blue-400" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              GitHub Career Intelligence
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto">
              Analyze your GitHub profile, simulate recruiter feedback, and get actionable insights to boost your career.
            </p>
          </div>

          <form onSubmit={handleAnalyze} className="w-full max-w-md relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative flex bg-slate-900 rounded-lg border border-slate-800 p-1 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xl">
              <div className="pl-3 flex items-center pointer-events-none text-slate-500">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub Username (e.g., torvalds)"
                className="flex-1 bg-transparent border-none text-white placeholder:text-slate-600 focus:ring-0 px-3 py-2 outline-none"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || !username}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Analyze'}
              </button>
            </div>
            {error && <div className="absolute top-16 left-0 right-0 text-red-400 text-sm bg-red-950/50 border border-red-900/50 p-3 rounded-md text-center animate-in slide-in-from-top-2">{error}</div>}
          </form>

          <div className="pt-12 grid grid-cols-3 gap-8 text-center opacity-60">
            <div>
              <div className="text-2xl font-bold text-white">0-100</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Portfolio Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">AI</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Recruiter Sim</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Actionable</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Smart Insights</div>
            </div>
          </div>
        </div>
      )}

      {data && <Dashboard data={data} onReset={() => setData(null)} />}

    </main>
  );
}
