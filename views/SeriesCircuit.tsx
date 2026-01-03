import React, { useState } from 'react';
import { Battery, Bulb, Switch, ElectronPath, CircuitDefs } from '../components/CircuitVisuals';
import AIAssistant from '../components/AIAssistant';
import { ArrowRight, Settings, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const SeriesCircuit: React.FC = () => {
  const [voltage, setVoltage] = useState(12);
  const [r1, setR1] = useState(6);
  const [r2, setR2] = useState(6);
  const [isSwitchOpen, setIsSwitchOpen] = useState(true);

  // Physics Calculations
  const rTotal = r1 + r2;
  const current = isSwitchOpen ? 0 : voltage / rTotal;
  const p1 = current * current * r1;
  const p2 = current * current * r2;
  const v1 = current * r1;
  const v2 = current * r2;

  const contextForAI = `
    Current Simulation: Series Circuit.
    Source Voltage: ${voltage}V.
    Resistor 1 (Bulb 1): ${r1}Ω.
    Resistor 2 (Bulb 2): ${r2}Ω.
    Switch State: ${isSwitchOpen ? 'Open (OFF)' : 'Closed (ON)'}.
    Calculated Total Resistance: ${rTotal}Ω.
    Calculated Current: ${current.toFixed(2)}A.
    Voltage Drop across Bulb 1: ${v1.toFixed(2)}V.
    Voltage Drop across Bulb 2: ${v2.toFixed(2)}V.
  `;

  return (
    <div className="min-h-screen p-4 md:p-8 pb-24 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Simulation Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded bg-cyan-950 border border-cyan-800 text-cyan-400">
                 <Activity size={24} />
               </div>
               <div>
                 <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 tech-text-glow">
                   Series Circuit
                 </h2>
                 <span className="text-sm text-slate-400 tracking-wider">串联电路仿真系统</span>
               </div>
             </div>
             <div className="px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-950/30 backdrop-blur-sm">
               <span className="text-cyan-400 font-mono text-sm">I = V / R_total</span>
             </div>
          </div>

          <div className="tech-panel rounded-2xl p-8 relative h-[400px] flex items-center justify-center select-none overflow-hidden">
             {/* Background Grid Accent */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{backgroundImage: 'radial-gradient(circle at 50% 50%, #22d3ee 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
             </div>

             <svg width="100%" height="100%" viewBox="0 0 600 300" className="overflow-visible relative z-10">
               <CircuitDefs />
               
               {/* Top Wire */}
               <ElectronPath path="M 100 50 L 500 50" current={current} />
               {/* Right Wire (containing Bulb 1 and 2) */}
               <ElectronPath path="M 500 50 L 500 250" current={current} />
               {/* Bottom Wire */}
               <ElectronPath path="M 500 250 L 100 250" current={current} />
               {/* Left Wire (Battery) */}
               <ElectronPath path="M 100 250 L 100 50" current={current} />

               {/* Components */}
               <Battery x={100} y={150} voltage={voltage} />
               {/* Switch Positioned on Top Wire */}
               <Switch x={300} y={50} isOpen={isSwitchOpen} toggle={() => setIsSwitchOpen(!isSwitchOpen)} />
               
               <Bulb x={500} y={100} power={p1} label={`R1: ${r1}Ω`} />
               <Bulb x={500} y={200} power={p2} label={`R2: ${r2}Ω`} />
             </svg>
             
             {/* HUD Readouts */}
             <div className="absolute top-6 left-6 font-mono text-sm space-y-2 pointer-events-none">
               <div className="flex items-center gap-3">
                 <div className="w-1 h-8 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></div>
                 <div>
                   <div className="text-slate-400 text-xs uppercase tracking-widest">Total Current</div>
                   <div className="text-xl text-cyan-300 font-bold tech-text-glow">{current.toFixed(2)} <span className="text-sm text-cyan-600">A</span></div>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                 <div>
                   <div className="text-slate-400 text-xs uppercase tracking-widest">Source Voltage</div>
                   <div className="text-xl text-blue-300 font-bold">{voltage} <span className="text-sm text-blue-600">V</span></div>
                 </div>
               </div>
             </div>
          </div>

          {/* Controls Panel */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 tech-panel rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6 text-cyan-400 border-b border-cyan-500/10 pb-2">
                <Settings className="w-5 h-5" />
                <h3 className="font-semibold uppercase tracking-wider text-sm">Control Panel <span className="text-xs text-slate-500 ml-2 normal-case">参数设置</span></h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono uppercase text-slate-400">
                     <span>Input Voltage</span>
                     <span className="text-cyan-300">{voltage}V</span>
                  </div>
                  <input 
                     type="range" min="1" max="24" value={voltage} 
                     onChange={(e) => setVoltage(Number(e.target.value))}
                     className="w-full"
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono uppercase text-slate-400">
                       <span>Resistor R1</span>
                       <span className="text-cyan-300">{r1}Ω</span>
                    </div>
                    <input 
                       type="range" min="1" max="20" value={r1} 
                       onChange={(e) => setR1(Number(e.target.value))}
                       className="w-full"
                     />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono uppercase text-slate-400">
                       <span>Resistor R2</span>
                       <span className="text-cyan-300">{r2}Ω</span>
                    </div>
                    <input 
                       type="range" min="1" max="20" value={r2} 
                       onChange={(e) => setR2(Number(e.target.value))}
                       className="w-full"
                     />
                  </div>
                </div>
              </div>
            </div>

            <Link to="/parallel" className="md:w-40 flex flex-col items-center justify-center gap-2 tech-panel hover:bg-cyan-950/40 border-l-4 border-l-transparent hover:border-l-cyan-400 rounded-xl p-6 transition-all group">
              <div className="text-right w-full mb-2">
                <span className="block text-sm font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">NEXT MODE</span>
                <span className="block text-xs text-slate-500">Parallel / 并联</span>
              </div>
              <div className="w-full flex justify-end">
                 <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </div>

        {/* Educational Panel */}
        <div className="space-y-6">
          <div className="tech-panel rounded-xl p-6 h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-cyan-500/20 pb-4 flex items-center gap-2">
               <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
               Data Analysis
               <span className="text-xs font-normal text-slate-500 ml-auto">数据分析</span>
            </h3>
            
            <div className="space-y-6 text-slate-300 text-sm leading-relaxed flex-1">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <strong className="text-cyan-400 block mb-2 text-xs uppercase tracking-widest">Current Flow / 电流</strong> 
                <p className="mb-2 text-slate-400">In series, current is uniform across the entire loop.</p>
                <div className="font-mono text-xs text-cyan-200">
                  I = I₁ = I₂ = {current.toFixed(2)} A
                </div>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <strong className="text-blue-400 block mb-2 text-xs uppercase tracking-widest">Voltage Division / 分压</strong> 
                <p className="mb-2 text-slate-400">Total voltage divides proportionally based on resistance.</p>
                <div className="font-mono text-xs text-blue-200">
                  {voltage}V = {v1.toFixed(1)}V (R1) + {v2.toFixed(1)}V (R2)
                </div>
              </div>

              <div className="mt-auto p-4 bg-cyan-900/20 border border-cyan-500/20 rounded-lg">
                <p className="italic text-cyan-200 text-xs">
                  <strong className="block not-italic text-cyan-500 mb-1">Observation Tip:</strong>
                  Increasing R1 resistance will dim both bulbs because total circuit resistance increases.
                  <br/>
                  <span className="opacity-50 mt-1 block">增大R1阻值会使两个灯泡都变暗。</span>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
      <AIAssistant contextData={contextForAI} />
    </div>
  );
};

export default SeriesCircuit;