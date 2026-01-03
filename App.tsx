import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import SeriesCircuit from './views/SeriesCircuit';
import ParallelCircuit from './views/ParallelCircuit';
import { Zap, Activity, GitMerge } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const activeClass = "bg-cyan-500/10 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]";
  const inactiveClass = "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent";

  return (
    <nav className="fixed w-full top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Electro<span className="text-cyan-400">Sim</span>
            </span>
          </div>
          
          <div className="flex space-x-3">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-md text-sm font-mono uppercase tracking-wide transition-all duration-200 flex items-center gap-2 ${location.pathname === '/' ? activeClass : inactiveClass}`}
            >
              <Activity className="w-4 h-4" /> Series
            </Link>
            <Link 
              to="/parallel" 
              className={`px-4 py-2 rounded-md text-sm font-mono uppercase tracking-wide transition-all duration-200 flex items-center gap-2 ${location.pathname === '/parallel' ? activeClass : inactiveClass}`}
            >
              <GitMerge className="w-4 h-4" /> Parallel
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-transparent pt-16">
        <Header />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<SeriesCircuit />} />
            <Route path="/parallel" element={<ParallelCircuit />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;