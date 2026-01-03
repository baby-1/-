import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import SeriesCircuit from './views/SeriesCircuit';
import ParallelCircuit from './views/ParallelCircuit';
import { Zap, Activity, GitMerge } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const activeClass = "bg-electric-600 text-white shadow-lg shadow-electric-500/30";
  const inactiveClass = "text-slate-400 hover:text-white hover:bg-slate-800";

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-electric-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-400 to-purple-400">
              ElectroSim
            </span>
          </div>
          
          <div className="flex space-x-2">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${location.pathname === '/' ? activeClass : inactiveClass}`}
            >
              <Activity className="w-4 h-4" /> Series
            </Link>
            <Link 
              to="/parallel" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${location.pathname === '/parallel' ? activeClass : inactiveClass}`}
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
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-electric-500 selection:text-white">
        <Header />
        <main>
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
