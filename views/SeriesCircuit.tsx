import React, { useState } from 'react';
import { Battery, Bulb, Switch, ElectronPath } from '../components/CircuitVisuals';
import AIAssistant from '../components/AIAssistant';
import { ArrowRight, Settings } from 'lucide-react';
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
    Switch State: ${isSwitchOpen ? 'Open' : 'Closed'}.
    Calculated Total Resistance: ${rTotal}Ω.
    Calculated Current: ${current.toFixed(2)}A.
    Voltage Drop across Bulb 1: ${v1.toFixed(2)}V.
    Voltage Drop across Bulb 2: ${v2.toFixed(2)}V.
  `;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 pb-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Simulation Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-3xl font-bold text-electric-400">Series Circuit</h2>
             <span className="bg-electric-900 text-electric-100 px-3 py-1 rounded-full text-sm font-mono">
               I = V / (R₁ + R₂)
             </span>
          </div>

          <div className="bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700 relative h-[400px] flex items-center justify-center select-none">
             <svg width="100%" height="100%" viewBox="0 0 600 300" className="overflow-visible">
               {/* Circuit Loop Path */}
               {/* Path: Start Battery Top(+), Right to Switch, Right to Bulb1, Down to Bulb2, Left, Up to Battery Bot(-) */}
               
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
               <Switch x={300} y={50} isOpen={isSwitchOpen} toggle={() => setIsSwitchOpen(!isSwitchOpen)} />
               <Bulb x={500} y={100} power={p1} label={`R1: ${r1}Ω`} />
               <Bulb x={500} y={200} power={p2} label={`R2: ${r2}Ω`} />
             </svg>
             
             {/* Readouts overlaid on diagram */}
             <div className="absolute top-4 left-4 font-mono text-sm text-electric-400 space-y-1 bg-slate-900/50 p-2 rounded backdrop-blur-sm">
               <div>I_total: {current.toFixed(2)} A</div>
               <div>V_source: {voltage} V</div>
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
                     <span>Resistance 1</span>
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
                     <span>Resistance 2</span>
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

            <Link to="/parallel" className="md:w-32 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-6 transition-colors group">
              <span className="font-medium">Go to Parallel</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Educational Panel */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 h-full">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-600 pb-2">Key Concepts</h3>
            
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong className="text-electric-400">Current (I):</strong> In a series circuit, the current is the <em>same</em> through all components. It has only one path to flow.
              </p>
              <div className="bg-slate-900 p-3 rounded font-mono text-xs">
                I = I₁ = I₂ = {current.toFixed(2)} A
              </div>

              <p>
                <strong className="text-electric-400">Voltage (V):</strong> The total voltage splits between components. The sum of voltage drops equals the source voltage.
              </p>
              <div className="bg-slate-900 p-3 rounded font-mono text-xs">
                V_total = V₁ + V₂<br/>
                {voltage}V = {v1.toFixed(1)}V + {v2.toFixed(1)}V
              </div>

              <p>
                <strong className="text-electric-400">Total Resistance:</strong> Resistances add up.
              </p>
              <div className="bg-slate-900 p-3 rounded font-mono text-xs">
                R_total = R₁ + R₂<br/>
                {rTotal}Ω = {r1}Ω + {r2}Ω
              </div>

              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="italic text-blue-200">
                  Try increasing R1. Notice how Bulb 2 also gets dimmer? That's because the total resistance increased, lowering the current for everyone!
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