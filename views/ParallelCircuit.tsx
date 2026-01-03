import React, { useState } from 'react';
import { Battery, Bulb, Switch, ElectronPath, CircuitDefs } from '../components/CircuitVisuals';
import AIAssistant from '../components/AIAssistant';
import { Settings, ArrowLeft, GitMerge } from 'lucide-react';
import { Link } from 'react-router-dom';

const ParallelCircuit: React.FC = () => {
  const [voltage, setVoltage] = useState(12);
  const [r1, setR1] = useState(12);
  const [r2, setR2] = useState(12);
  const [r3, setR3] = useState(12);
  const [isSwitchOpen, setIsSwitchOpen] = useState(true);

  // Physics Calculations
  const invRTotal = (1/r1) + (1/r2) + (1/r3);
  const rTotal = 1 / invRTotal;
  
  const iTotal = isSwitchOpen ? 0 : voltage / rTotal;
  const i1 = isSwitchOpen ? 0 : voltage / r1;
  const i2 = isSwitchOpen ? 0 : voltage / r2;
  const i3 = isSwitchOpen ? 0 : voltage / r3;
  
  const p1 = i1 * i1 * r1;
  const p2 = i2 * i2 * r2;
  const p3 = i3 * i3 * r3;

  const contextForAI = `
    Current Simulation: Parallel Circuit (3 Branches).
    Source Voltage: ${voltage}V.
    Branch 1 Resistance: ${r1}Ω.
    Branch 2 Resistance: ${r2}Ω.
    Branch 3 Resistance: ${r3}Ω.
    Switch State: ${isSwitchOpen ? 'Open (OFF)' : 'Closed (ON)'}.
    Calculated Total Resistance: ${rTotal.toFixed(2)}Ω.
    Total Current: ${iTotal.toFixed(2)}A.
    Current Branch 1: ${i1.toFixed(2)}A.
    Current Branch 2: ${i2.toFixed(2)}A.
    Current Branch 3: ${i3.toFixed(2)}A.
  `;

  return (
    <div className="min-h-screen p-4 md:p-8 pb-24 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Simulation Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
             <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-fuchsia-950 border border-fuchsia-800 text-fuchsia-400">
                  <GitMerge size={24} />
                </div>
                <div>
                   <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-purple-400 tech-text-glow">
                     Parallel Circuit
                   </h2>
                   <span className="text-sm text-slate-400 tracking-wider">并联电路仿真系统</span>
                </div>
             </div>
             <div className="px-4 py-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-950/30 backdrop-blur-sm">
               <span className="text-fuchsia-400 font-mono text-sm">1/R = Σ(1/Rₙ)</span>
             </div>
          </div>

          <div className="tech-panel rounded-2xl p-4 md:p-8 relative h-[450px] flex items-center justify-center select-none overflow-hidden">
             {/* Background Grid Accent */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{backgroundImage: 'radial-gradient(circle at 50% 50%, #d946ef 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
             </div>

             <svg width="100%" height="100%" viewBox="0 0 800 300" className="overflow-visible relative z-10">
               <CircuitDefs />
               
               {/* MAIN RAILS */}
               <ElectronPath path="M 50 50 L 680 50" current={iTotal} />
               <ElectronPath path="M 680 250 L 50 250" current={iTotal} />
               <ElectronPath path="M 50 250 L 50 50" current={iTotal} />

               {/* Branches */}
               <ElectronPath path="M 280 50 L 280 250" current={i1} />
               <ElectronPath path="M 480 50 L 480 250" current={i2} />
               <ElectronPath path="M 680 50 L 680 250" current={i3} />

               {/* Junction Dots (Glowing) */}
               {[280, 480, 680].map(cx => (
                 <g key={cx}>
                    <circle cx={cx} cy="50" r="3" fill="#fbbf24" filter="url(#glow-yellow)" />
                    <circle cx={cx} cy="250" r="3" fill="#fbbf24" filter="url(#glow-yellow)" />
                 </g>
               ))}

               {/* Components */}
               <Battery x={50} y={150} voltage={voltage} />
               <Switch x={150} y={50} isOpen={isSwitchOpen} toggle={() => setIsSwitchOpen(!isSwitchOpen)} />
               
               <Bulb x={280} y={150} power={p1} label={`R1: ${r1}Ω`} />
               <Bulb x={480} y={150} power={p2} label={`R2: ${r2}Ω`} />
               <Bulb x={680} y={150} power={p3} label={`R3: ${r3}Ω`} />

             </svg>
             
             {/* HUD Readouts */}
             <div className="absolute top-6 left-6 font-mono text-sm space-y-2 pointer-events-none">
               <div className="flex items-center gap-3">
                 <div className="w-1 h-8 bg-fuchsia-500 rounded-full shadow-[0_0_10px_#d946ef]"></div>
                 <div>
                   <div className="text-slate-400 text-xs uppercase tracking-widest">Total Current</div>
                   <div className="text-xl text-fuchsia-300 font-bold tech-text-glow">{iTotal.toFixed(2)} <span className="text-sm text-fuchsia-600">A</span></div>
                   <div className="text-[10px] text-slate-500 mt-1">Total Power: {(voltage * iTotal).toFixed(1)}W</div>
                 </div>
               </div>
             </div>
             
             {/* Dynamic Current Labels */}
             <div className="absolute bottom-20 left-[35%] font-mono text-xs text-cyan-300 bg-slate-950/80 border border-cyan-500/30 px-2 py-1 rounded transform -translate-x-1/2">
               I₁:{i1.toFixed(1)}A
             </div>
             <div className="absolute bottom-20 left-[60%] font-mono text-xs text-cyan-300 bg-slate-950/80 border border-cyan-500/30 px-2 py-1 rounded transform -translate-x-1/2">
               I₂:{i2.toFixed(1)}A
             </div>
             <div className="absolute bottom-20 left-[85%] font-mono text-xs text-cyan-300 bg-slate-950/80 border border-cyan-500/30 px-2 py-1 rounded transform -translate-x-1/2">
               I₃:{i3.toFixed(1)}A
             </div>
          </div>

          {/* Navigation & Controls */}
          <div className="flex flex-col md:flex-row gap-6">
             <Link to="/" className="md:w-40 flex flex-col items-center justify-center gap-2 tech-panel hover:bg-fuchsia-950/40 border-r-4 border-r-transparent hover:border-r-fuchsia-400 rounded-xl p-6 transition-all group order-2 md:order-1">
                <div className="w-full">
                  <span className="block text-sm font-bold text-slate-200 group-hover:text-fuchsia-300 transition-colors">PREV MODE</span>
                  <span className="block text-xs text-slate-500">Series / 串联</span>
                </div>
                <div className="w-full flex justify-start">
                   <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-fuchsia-400 group-hover:-translate-x-1 transition-all" />
                </div>
             </Link>

             <div className="flex-1 tech-panel rounded-xl p-6 order-1 md:order-2">
               <div className="flex items-center gap-2 mb-6 text-fuchsia-400 border-b border-fuchsia-500/10 pb-2">
                 <Settings className="w-5 h-5" />
                 <h3 className="font-semibold uppercase tracking-wider text-sm">Control Panel <span className="text-xs text-slate-500 ml-2 normal-case">参数设置</span></h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                 <div className="space-y-2 col-span-1 md:col-span-2">
                   <div className="flex justify-between text-xs font-mono uppercase text-slate-400">
                      <span>Input Voltage</span>
                      <span className="text-fuchsia-300">{voltage}V</span>
                   </div>
                   <input 
                      type="range" min="1" max="24" value={voltage} 
                      onChange={(e) => setVoltage(Number(e.target.value))}
                      className="w-full"
                    />
                 </div>
                 {[
                   { label: 'R1', val: r1, set: setR1 },
                   { label: 'R2', val: r2, set: setR2 },
                   { label: 'R3', val: r3, set: setR3 }
                 ].map((r, idx) => (
                   <div key={idx} className="space-y-2">
                     <div className="flex justify-between text-xs font-mono uppercase text-slate-400">
                        <span>{r.label}</span>
                        <span className="text-fuchsia-300">{r.val}Ω</span>
                     </div>
                     <input 
                        type="range" min="1" max="20" value={r.val} 
                        onChange={(e) => r.set(Number(e.target.value))}
                        className="w-full"
                      />
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>

        {/* Educational Panel */}
        <div className="space-y-6">
          <div className="tech-panel rounded-xl p-6 h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-fuchsia-500/20 pb-4 flex items-center gap-2">
               <span className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse"></span>
               Data Analysis
               <span className="text-xs font-normal text-slate-500 ml-auto">数据分析</span>
            </h3>
            
            <div className="space-y-6 text-slate-300 text-sm leading-relaxed flex-1">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <strong className="text-fuchsia-400 block mb-2 text-xs uppercase tracking-widest">Parallel Voltage / 电压</strong> 
                <p className="mb-2 text-slate-400">Full source voltage reaches every branch.</p>
                <div className="font-mono text-xs text-fuchsia-200">
                  V = V₁ = V₂ = V₃ = {voltage}V
                </div>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <strong className="text-cyan-400 block mb-2 text-xs uppercase tracking-widest">Current Sum / 电流</strong> 
                <p className="mb-2 text-slate-400">Total current is the sum of all branch currents.</p>
                <div className="font-mono text-xs text-cyan-200">
                  {iTotal.toFixed(2)}A = {i1.toFixed(1)} + {i2.toFixed(1)} + {i3.toFixed(1)}
                </div>
              </div>

              <div className="mt-auto p-4 bg-fuchsia-900/20 border border-fuchsia-500/20 rounded-lg">
                <p className="italic text-fuchsia-200 text-xs">
                  <strong className="block not-italic text-fuchsia-500 mb-1">Observation Tip:</strong>
                   Changes to one branch do not affect the others. The system is modular.
                  <br/>
                  <span className="opacity-50 mt-1 block">改变任意支路电阻，其他支路互不影响。</span>
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

export default ParallelCircuit;