import React, { useState } from 'react';
import { Battery, Bulb, Switch, ElectronPath } from '../components/CircuitVisuals';
import AIAssistant from '../components/AIAssistant';
import { Settings, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ParallelCircuit: React.FC = () => {
  const [voltage, setVoltage] = useState(12);
  const [r1, setR1] = useState(12);
  const [r2, setR2] = useState(12);
  const [isSwitchOpen, setIsSwitchOpen] = useState(true);

  // Physics Calculations
  // 1/Rtot = 1/R1 + 1/R2 => Rtot = (R1*R2)/(R1+R2)
  const rTotal = (r1 * r2) / (r1 + r2);
  const iTotal = isSwitchOpen ? 0 : voltage / rTotal;
  const i1 = isSwitchOpen ? 0 : voltage / r1;
  const i2 = isSwitchOpen ? 0 : voltage / r2;
  
  const p1 = i1 * i1 * r1;
  const p2 = i2 * i2 * r2;

  const contextForAI = `
    Current Simulation: Parallel Circuit (Ladder Topology).
    Source Voltage: ${voltage}V.
    Branch 1 Resistance: ${r1}Ω.
    Branch 2 Resistance: ${r2}Ω.
    Switch State: ${isSwitchOpen ? 'Open' : 'Closed'}.
    Calculated Total Resistance: ${rTotal.toFixed(2)}Ω.
    Total Current: ${iTotal.toFixed(2)}A.
    Current in Branch 1: ${i1.toFixed(2)}A.
    Current in Branch 2: ${i2.toFixed(2)}A.
    Note: Voltage across both branches is equal to source voltage (${voltage}V).
  `;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 pb-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Simulation Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-3xl font-bold text-electric-400">Parallel Circuit</h2>
             <span className="bg-electric-900 text-electric-100 px-3 py-1 rounded-full text-sm font-mono">
               1/R = 1/R₁ + 1/R₂
             </span>
          </div>

          <div className="bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700 relative h-[400px] flex items-center justify-center select-none">
             <svg width="100%" height="100%" viewBox="0 0 600 300" className="overflow-visible">
               
               {/* 
                 LADDER DIAGRAM LAYOUT
                 X Coords: Battery=80, Junction1=350, Junction2=520
                 Y Coords: Top=50, Bottom=250
               */}

               {/* 1. Main Loop (Battery to First Junction) */}
               {/* Top Wire: Battery(80,50) -> Switch -> Junction1(350,50) */}
               <ElectronPath path="M 80 50 L 350 50" current={iTotal} />
               
               {/* Bottom Wire: Junction1(350,250) -> Battery(80,250) */}
               <ElectronPath path="M 350 250 L 80 250" current={iTotal} />
               
               {/* Battery Vertical Wire */}
               <ElectronPath path="M 80 250 L 80 50" current={iTotal} />

               {/* 2. Branch 1 (Vertical at x=350) */}
               <ElectronPath path="M 350 50 L 350 250" current={i1} />

               {/* 3. Extension to Branch 2 (Top and Bottom Rails) */}
               <ElectronPath path="M 350 50 L 520 50" current={i2} />
               <ElectronPath path="M 520 250 L 350 250" current={i2} />

               {/* 4. Branch 2 (Vertical at x=520) */}
               <ElectronPath path="M 520 50 L 520 250" current={i2} />

               {/* Junction Dots */}
               <circle cx="350" cy="50" r="4" fill="#facc15" />
               <circle cx="520" cy="50" r="4" fill="#facc15" />
               <circle cx="350" cy="250" r="4" fill="#facc15" />
               <circle cx="520" cy="250" r="4" fill="#facc15" />

               {/* Components */}
               <Battery x={80} y={150} voltage={voltage} />
               <Switch x={200} y={50} isOpen={isSwitchOpen} toggle={() => setIsSwitchOpen(!isSwitchOpen)} />
               
               {/* Branch 1 Bulb */}
               <Bulb x={350} y={150} power={p1} label={`R1: ${r1}Ω`} />
               
               {/* Branch 2 Bulb */}
               <Bulb x={520} y={150} power={p2} label={`R2: ${r2}Ω`} />

             </svg>
             
             {/* Readouts */}
             <div className="absolute top-4 left-4 font-mono text-sm text-electric-400 space-y-1 bg-slate-900/50 p-2 rounded backdrop-blur-sm">
               <div>I_total: {iTotal.toFixed(2)} A</div>
               <div>V_source: {voltage} V</div>
             </div>
             
             {/* Current Labels on wires */}
             <div className="absolute top-16 left-[56%] font-mono text-xs text-electric-300 bg-slate-900/80 px-1 rounded">
               {i1.toFixed(2)} A
             </div>
             <div className="absolute top-16 left-[85%] font-mono text-xs text-electric-300 bg-slate-900/80 px-1 rounded">
               {i2.toFixed(2)} A
             </div>
          </div>

          {/* Navigation & Controls */}
          <div className="flex flex-col md:flex-row gap-6">
             <div className="flex-1 bg-slate-800 rounded-xl p-6 border border-slate-700">
               <div className="flex items-center gap-2 mb-4 text-electric-400">
                 <Settings className="w-5 h-5" />
                 <h3 className="font-semibold">Circuit Controls</h3>
               </div>
               
               <div className="space-y-4">
                 <div className="space-y-1">
                   <div className="flex justify-between text-sm text-slate-400">
                      <span>Voltage</span>
                      <span>{voltage}V</span>
                   </div>
                   <input 
                      type="range" min="1" max="24" value={voltage} 
                      onChange={(e) => setVoltage(Number(e.target.value))}
                      className="w-full accent-electric-500"
                    />
                 </div>
                 <div className="space-y-1">
                   <div className="flex justify-between text-sm text-slate-400">
                      <span>Resistor 1 (Left)</span>
                      <span>{r1}Ω</span>
                   </div>
                   <input 
                      type="range" min="1" max="20" value={r1} 
                      onChange={(e) => setR1(Number(e.target.value))}
                      className="w-full accent-electric-500"
                    />
                 </div>
                 <div className="space-y-1">
                   <div className="flex justify-between text-sm text-slate-400">
                      <span>Resistor 2 (Right)</span>
                      <span>{r2}Ω</span>
                   </div>
                   <input 
                      type="range" min="1" max="20" value={r2} 
                      onChange={(e) => setR2(Number(e.target.value))}
                      className="w-full accent-electric-500"
                    />
                 </div>
               </div>
             </div>

             <Link to="/" className="md:w-32 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-6 transition-colors group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Go to Series</span>
             </Link>
          </div>
        </div>

        {/* Educational Panel */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 h-full">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-600 pb-2">Key Concepts</h3>
            
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong className="text-electric-400">Voltage (V):</strong> In parallel, each branch is connected directly to the source. Therefore, <em>V₁ = V₂ = V_source</em>.
              </p>
              
              <p>
                <strong className="text-electric-400">Current (I):</strong> The main current splits at the junction.
                <br/>
                <span className="font-mono text-electric-200">I_total = I₁ + I₂</span>
              </p>

              <div className="bg-slate-900 p-4 rounded-lg font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span>I_total:</span>
                  <span className="text-white">{iTotal.toFixed(2)}A</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Branch 1 (V/R₁):</span>
                  <span>{i1.toFixed(2)}A</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Branch 2 (V/R₂):</span>
                  <span>{i2.toFixed(2)}A</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                <p className="italic text-emerald-200">
                  <strong>Experiment:</strong> Change R1. Notice that I2 doesn't change! The branches are independent.
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