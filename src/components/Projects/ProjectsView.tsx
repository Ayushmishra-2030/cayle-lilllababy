import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Sparkles, MapPin, Shield, Star, Compass, Layers, CheckCircle2 } from 'lucide-react';

interface BureauProject {
  id: string;
  title: string;
  codeName: string;
  category: string;
  lead: string;
  status: 'Active' | 'Deployed' | 'Experimental';
  icon: string;
  summary: string;
  specs: { label: string; value: string }[];
  fieldNotes: string;
}

const PROJECTS: BureauProject[] = [
  {
    id: 'proj-1',
    title: 'Project SlumberLight',
    codeName: 'OPERATION-SOOT-SWEEP',
    category: 'Celestial Maintenance',
    lead: 'Caylee & Barnaby',
    status: 'Active',
    icon: '✨',
    summary: 'A standardized protocol for locating, cleaning, and recharging sleepy stars that have lost their twinkle due to passing comet dust clouds.',
    specs: [
      { label: 'Deployed Tools', value: 'Chamois Stardust Brushes & Pure Moon Polish' },
      { label: 'Average Restoration Time', value: '45 seconds per star node' },
      { label: 'Sector Coverage', value: 'Northern Horizon Quadrants 1 through 7' },
      { label: 'Success Rate', value: '99.4% luminous revival' },
    ],
    fieldNotes: 'Always inspect the star crown before polishing. Some sleepy stars tickle easily and may sneeze golden pollen across your satchel!',
  },
  {
    id: 'proj-2',
    title: 'The Cosmic Comet Rescue Net',
    codeName: 'TETHER-AND-SAFEGUARD',
    category: 'Sky Safety Engineering',
    lead: 'Lunetta & Caylee',
    status: 'Deployed',
    icon: '🕸️',
    summary: 'An elastic celestial net woven from spun cloud wool and starlight filament, engineered to cushion runaway comets before they disturb delicate dream clouds.',
    specs: [
      { label: 'Material', value: '80% Cloud Fluff, 20% Moonbeam Thread' },
      { label: 'Tension Capacity', value: 'Up to Class-4 Ice Comets' },
      { label: 'Anchor Points', value: 'Anchored to Ursa Major & Cygnus nodes' },
      { label: 'Rescues Recorded', value: '142 comets safely redirected' },
    ],
    fieldNotes: 'Lunetta spins the fluff each morning when the air is crisp. Pip assists by applying a friction-reducing layer of snail glitter.',
  },
  {
    id: 'proj-3',
    title: 'Wish Cartography Atlas',
    codeName: 'STELLAR-DREAM-CHART',
    category: 'Cosmic Cartography',
    lead: 'Pip & Caylee',
    status: 'Experimental',
    icon: '🗺️',
    summary: 'A real-time topographical sky map charting the migratory flight paths of unsent wishes as they travel on solar winds from Earth to the Bureau.',
    specs: [
      { label: 'Mapping Coordinates', value: 'RA 18h 36m / Dec +38° 47′' },
      { label: 'Wind Patterns', value: 'Borealis Gentle Breeze (12 knots)' },
      { label: 'Wish Traffic', value: 'High density during full moon nights' },
      { label: 'Storage Method', value: 'Gilded parchment rolls in cedar canisters' },
    ],
    fieldNotes: 'Wishes for courage travel fastest, often hitching rides on shooting stars. Wishes for quiet peaceful mornings drift slowly on lavender mist.',
  },
];

export const ProjectsView: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS[0].id);

  const activeProject = PROJECTS.find((p) => p.id === selectedProjectId) || PROJECTS[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="paper-card p-6 sm:p-8 bg-gradient-to-r from-amber-50 to-purple-50 dark:from-[#1e1b4b] dark:to-[#171233] relative overflow-hidden">
        <div className="washi-tape washi-tape-lavender -top-2.5 left-10 w-36 rotate-[-1deg] rounded" />

        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#a34063]/10 dark:bg-pink-900/40 text-[#a34063] dark:text-pink-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bureau R&amp;D Archives • 3 Major Initiatives</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
            Bureau Character Projects
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Discover how Caylee, Barnaby, Pip, and Lunetta engineer magical systems to protect slumbering dreamers and repair the celestial skyways.
          </p>
        </div>
      </div>

      {/* Project Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PROJECTS.map((proj) => {
          const isSelected = proj.id === selectedProjectId;
          return (
            <button
              key={proj.id}
              onClick={() => {
                sound.playTap();
                setSelectedProjectId(proj.id);
              }}
              className={`paper-card p-5 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-2 border-[#a34063] dark:border-pink-400 ring-2 ring-[#a34063]/20 shadow-lg'
                  : 'hover:border-[#a34063]/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{proj.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {proj.status}
                  </span>
                </div>
                <h3 className="font-serif-heading font-bold text-base text-[#5c4033] dark:text-purple-100 leading-tight">
                  {proj.title}
                </h3>
                <span className="text-[10px] font-semibold text-stone-400 block mt-0.5">
                  {proj.codeName}
                </span>
              </div>

              <div className="mt-4 pt-2 border-t border-[#5c4033]/10 text-xs font-semibold text-[#a34063] dark:text-pink-400">
                Lead: {proj.lead}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Project Dossier */}
      <div className="paper-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#5c4033]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-purple-900/60 flex items-center justify-center text-3xl shadow-sm">
              {activeProject.icon}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#a34063] dark:text-pink-300 tracking-wider">
                {activeProject.category}
              </span>
              <h3 className="font-serif-heading font-bold text-xl sm:text-2xl text-[#5c4033] dark:text-purple-100">
                {activeProject.title}
              </h3>
            </div>
          </div>

          <div className="bg-stone-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 dark:text-purple-200 self-start sm:self-auto">
            Lead Team: {activeProject.lead}
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm leading-relaxed text-stone-800 dark:text-stone-200">
          {activeProject.summary}
        </p>

        {/* Technical Specs Grid */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            Technical Specifications &amp; Field Benchmarks
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeProject.specs.map((spec, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700"
              >
                <div className="text-[10px] uppercase font-bold text-stone-400">{spec.label}</div>
                <div className="text-xs sm:text-sm font-semibold text-[#5c4033] dark:text-purple-100 mt-0.5">
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Field Notes from Caylee */}
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-purple-950/60 border border-amber-200 dark:border-purple-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#a34063] dark:text-pink-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Caylee&apos;s Handwritten Field Note:</span>
          </div>
          <p className="font-handwriting text-xl text-stone-800 dark:text-purple-100 leading-snug">
            &ldquo;{activeProject.fieldNotes}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};
