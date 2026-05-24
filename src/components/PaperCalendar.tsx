import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, CheckSquare, Settings2, Sparkles, RefreshCw, FileText, Code, Copy, Check, ExternalLink } from 'lucide-react';
import { PaperStyle, TapeStyle, FontStyle, TodoItem, AppState } from '../types';
import { Tape } from './Tape';
import { SavedStamp } from './SavedStamp';

interface PaperCalendarProps {
  state: AppState;
  onChange: (updater: (prev: AppState) => AppState) => void;
  isEmbed?: boolean;
}

export const PaperCalendar: React.FC<PaperCalendarProps> = ({ state, onChange, isEmbed = false }) => {
  const [stampTrigger, setStampTrigger] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showEmbedHelper, setShowEmbedHelper] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [embedWidth, setEmbedWidth] = useState(380);
  const [embedHeight, setEmbedHeight] = useState(580);
  
  // Track today's date dynamically
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    // Keep date updated if the user stays on the page past midnight
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== today.getDate()) {
        setToday(now);
      }
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [today]);

  const dateNum = today.getDate();
  const yearNum = today.getFullYear();

  // Italian dates helper
  const monthsIT = [
    'GENNAIO', 'FEBBRAIO', 'MARZO', 'APRILE', 'MAGGIO', 'GIUGNO',
    'LUGLIO', 'AGOSTO', 'SETTEMBRE', 'OTTOBRE', 'NOVEMBRE', 'DICEMBRE'
  ];
  const daysIT = [
    'Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'
  ];

  const monthName = monthsIT[today.getMonth()];
  const dayName = daysIT[today.getDay()];

  // Auto-save logic with debounce
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerSaveStamp = () => {
    setIsSaving(true);
    setStampTrigger(true);
    setTimeout(() => {
      setIsSaving(false);
      setStampTrigger(false);
    }, 1500);
  };

  // Persists notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange((prev) => ({ ...prev, notes: val }));

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      triggerSaveStamp();
    }, 1000);
  };

  // Persist todo items modification
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const newItem: TodoItem = {
      id: crypto.randomUUID(),
      text: newTodoText.trim(),
      completed: false,
    };

    onChange((prev) => ({
      ...prev,
      todoItems: [...prev.todoItems, newItem]
    }));
    setNewTodoText('');
    triggerSaveStamp();
  };

  const handleToggleTodo = (id: string) => {
    onChange((prev) => ({
      ...prev,
      todoItems: prev.todoItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }));
    triggerSaveStamp();
  };

  const handleDeleteTodo = (id: string) => {
    onChange((prev) => ({
      ...prev,
      todoItems: prev.todoItems.filter((item) => item.id !== id)
    }));
    triggerSaveStamp();
  };

  const handleClearAll = () => {
    if (confirm('Sei sicuro di voler ripulire il foglio di oggi? Questa operazione svuoterà le note corrente.')) {
      onChange((prev) => ({
        ...prev,
        notes: '',
        todoItems: []
      }));
      triggerSaveStamp();
    }
  };

  const getFontFamilyClass = () => {
    return state.fontStyle === 'handwriting' ? 'font-hand text-xl tracking-wide font-medium text-slate-800' : 'font-sans text-sm tracking-normal text-slate-800';
  };

  const getPaperBackgroundClass = () => {
    switch (state.paperStyle) {
      case 'lined':
        return 'paper-lined shadow-inner';
      case 'grid':
        return 'paper-grid shadow-inner';
      case 'kraft':
        return 'paper-kraft';
      default:
        return 'paper-plain shadow-inner';
    }
  };

  return (
    <div className="relative mx-auto my-12 w-full max-w-[380px] px-4 selection:bg-amber-100 select-none">
      
      {/* SCOTCH TAPE PLACEMENTS (Angled organically at the top corners or center) */}
      <Tape 
        style={state.tapeStyle} 
        rotation={state.tapeRotations[0] || -4} 
        className="-top-5 -left-3 scale-95" 
      />
      <Tape 
        style={state.tapeStyle} 
        rotation={state.tapeRotations[1] || 3} 
        className="-top-6 right-8 scale-95" 
      />

      {/* Main calendar block wrapper simulating paper thickness and shadow physics */}
      <motion.div 
        layout
        className="relative bg-amber-50/5 shadow-page-curl rounded-b-md transition-all duration-300 transform"
        style={{
          transformOrigin: 'top center'
        }}
      >
        {/* TOP REMNANTS BAR: Represents the brown cardboard backing from which the daily page is torn */}
        <div className="h-6 w-full bg-stone-700 rounded-t-[3px] border-b border-stone-800 flex items-center justify-between px-3 relative z-30 overflow-hidden shadow-sm">
          {/* Cardboard fibrous dots */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:5px_5px] opacity-70" />
          
          {/* Calendar hanger holes */}
          <div className="flex gap-12 mx-auto pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1b1713] border border-stone-800 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#1b1713] border border-stone-800 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]" />
          </div>
          
          {/* Metal staple remnants or vintage trim details */}
          <div className="absolute left-[15%] w-3 h-1.5 bg-stone-500 rounded-sm shadow-[0_1px_1px_rgba(255,255,255,0.1)] border-b border-stone-600" />
          <div className="absolute right-[15%] w-3 h-1.5 bg-stone-500 rounded-sm shadow-[0_1px_1px_rgba(255,255,255,0.1)] border-b border-stone-600" />
        </div>

        {/* TORN PERFORATIONS: The white ragged edge peeking out immediately from underneath the cardboard binding */}
        <div className="w-full h-4 bg-transparent relative z-20 flex items-start select-none pointer-events-none -mt-0.5">
          {/* Decorative ripped paper fibers - we make a series of small interlocking semi-circles */}
          <div className="flex w-full overflow-hidden">
            {Array.from({ length: 42 }).map((_, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 shrink-0 bg-[#ebe6df] rounded-full -mt-2.5"
                style={{
                  boxShadow: '0 1px 2px rgba(0,0,0,0.12), inset 0 -1.5px 1px rgba(255,255,255,0.9)',
                  marginLeft: i > 0 ? '-3px' : '0px',
                  // Slightly randomize heights to give organic, irregular ripped look
                  transform: `translateY(${(i % 3 === 0) ? '1px' : (i % 3 === 1) ? '-0.5px' : '0px'}) rotate(${i * 15}deg)`
                }}
              />
            ))}
          </div>
        </div>

        {/* CALENDAR BODY CARD (The torn off leaf) - Incorporates the Artistic Flair design style */}
        <div className="relative paper-artistic-clip bg-[#fff9e6] p-7 md:p-8 pt-10 shadow-2xl relative z-10 flex flex-col min-h-[480px]">
          
          {/* PAPER HEADER: Inspired directly by the "Artistic Flair" design specifications */}
          <div className="border-b-2 border-red-200/50 pb-4 mb-5 flex justify-between items-end select-none">
            <div className="text-left">
              <h1 className="text-5xl font-extrabold text-slate-800 tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>
                {dateNum}
              </h1>
              <p className="uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] text-red-500 mt-1">
                {monthName} {yearNum}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-xs sm:text-sm italic font-serif text-slate-500">
                {dayName}
              </p>
            </div>
          </div>

          {/* ACTION & MODE TOGGLE TABS (Styled cleanly underneath the header) */}
          <div className="flex items-center justify-between border-b border-stone-200/30 pb-2.5 mb-2 text-xs select-none">
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => onChange((prev) => ({ ...prev, isChecklistMode: !prev.isChecklistMode }))}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all cursor-pointer font-medium ${
                  state.isChecklistMode
                    ? 'bg-amber-100/60 text-amber-900 shadow-xs border border-amber-200/40'
                    : 'text-stone-500 hover:bg-stone-100'
                }`}
                title="Cambia modalità"
              >
                {state.isChecklistMode ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5 text-amber-700" />
                    <span>Lista Spunta</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5 text-stone-500" />
                    <span>Foglio Libero</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearAll}
                className="p-1 rounded-full text-stone-400 hover:text-red-600 hover:bg-stone-100 transition-colors cursor-pointer"
                title="Svuota foglio"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {!isEmbed && (
                <button
                  onClick={() => {
                    setShowEmbedHelper(!showEmbedHelper);
                    setShowSettings(false);
                  }}
                  className={`p-1 rounded-full transition-colors cursor-pointer ${
                    showEmbedHelper 
                      ? 'bg-amber-100 text-amber-950 border border-amber-300' 
                      : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                  }`}
                  title="Ottieni Codice Embed"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => {
                  setShowSettings(!showSettings);
                  setShowEmbedHelper(false);
                }}
                className={`p-1 rounded-full transition-colors cursor-pointer ${
                  showSettings 
                    ? 'bg-stone-200/50 text-stone-800' 
                    : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                }`}
                title="Personalizza"
              >
                <Settings2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* INTERNAL SETTINGS & EMBED CONFIGURATION COLLAPSIBLE SHEETS */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-b border-dashed border-stone-300/60 pb-3 mb-3 z-20"
              >
                <div className="p-3 text-xs text-stone-700 bg-stone-500/5 rounded border border-stone-200/30 space-y-3 font-sans select-none relative">
                  <div>
                    <span className="block font-bold text-[9px] text-stone-500 uppercase tracking-wider mb-1">Finitura della Carta:</span>
                    <div className="grid grid-cols-4 gap-1">
                      {(['lined', 'grid', 'plain', 'kraft'] as PaperStyle[]).map((style) => (
                        <button
                          key={style}
                          onClick={() => onChange((prev) => ({ ...prev, paperStyle: style }))}
                          className={`py-1 px-1 rounded text-[10px] text-center border capitalize cursor-pointer transition-all duration-150 ${
                            state.paperStyle === style
                              ? 'bg-amber-600 text-white border-amber-700 font-semibold'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {style === 'lined' ? 'Righe' : style === 'grid' ? 'Quadri' : style === 'plain' ? 'Bianco' : 'Kraft'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block font-bold text-[9px] text-stone-500 uppercase tracking-wider mb-1">Nastro Adesivo:</span>
                    <div className="grid grid-cols-5 gap-0.5">
                      {(['transparent', 'yellow', 'washi-dots', 'washi-stripes', 'green-deco'] as TapeStyle[]).map((style) => (
                        <button
                          key={style}
                          onClick={() => onChange((prev) => ({ ...prev, tapeStyle: style }))}
                          className={`py-1 px-0.5 rounded text-[9px] text-center shrink-0 border capitalize truncate cursor-pointer transition-all duration-150 ${
                            state.tapeStyle === style
                              ? 'bg-amber-600 text-white border-amber-700 font-semibold'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          {style === 'transparent' ? 'Scotch' : style === 'yellow' ? 'Giallo' : style === 'washi-dots' ? 'Pois' : style === 'washi-stripes' ? 'Righe' : 'Deco'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block font-bold text-[9px] text-stone-500 uppercase tracking-wider mb-1">Stile Calligrafia:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['handwriting', 'sans'] as FontStyle[]).map((font) => (
                        <button
                          key={font}
                          onClick={() => onChange((prev) => ({ ...prev, fontStyle: font }))}
                          className={`py-1 px-2 border rounded cursor-pointer transition-all duration-150 text-center ${
                            state.fontStyle === font
                              ? 'bg-amber-600 text-white border-amber-700 font-semibold shadow-xs'
                              : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          {font === 'handwriting' ? '✎ Grafia' : '⌨ Calligrafo'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showEmbedHelper && !isEmbed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-b border-dashed border-stone-300/60 pb-3 mb-3 z-20"
              >
                <div className="p-3 text-xs text-stone-700 bg-stone-500/5 rounded border border-stone-200/30 space-y-2.5 font-sans relative">
                  <div className="font-semibold text-stone-800 flex items-center gap-1.5 select-none">
                    <Code className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span>Incolla il foglio nel tuo sito</span>
                  </div>

                  <p className="text-[10px] text-stone-500 leading-normal select-none">
                    Incolla questo iframe HTML sul tuo sito (WordPress, Portfolio, Notion o codice personalizzato) per averlo integrato nella tua scrivania virtuale!
                  </p>

                  <div className="space-y-2.5">
                    <div className="flex gap-4 items-center select-none">
                      <div className="flex-1">
                        <label className="text-[9px] text-stone-500 font-mono block mb-0.5">Larghezza: {embedWidth}px</label>
                        <input
                          type="range"
                          min="320"
                          max="600"
                          step="10"
                          value={embedWidth}
                          onChange={(e) => setEmbedWidth(Number(e.target.value))}
                          className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] text-stone-500 font-mono block mb-0.5">Altezza: {embedHeight}px</label>
                        <input
                          type="range"
                          min="400"
                          max="800"
                          step="10"
                          value={embedHeight}
                          onChange={(e) => setEmbedHeight(Number(e.target.value))}
                          className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="bg-stone-900 text-stone-300 p-2.5 rounded font-mono text-[9px] break-all border border-stone-800 select-all max-h-20 overflow-y-auto leading-relaxed">
                        {`<iframe src="${window.location.origin}${window.location.pathname}?embed=true&paper=${state.paperStyle}&font=${state.fontStyle}&tape=${state.tapeStyle}" width="${embedWidth}" height="${embedHeight}" style="border:none; overflow:hidden; background:transparent;" allowtransparency="true"></iframe>`}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const iframeText = `<iframe src="${window.location.origin}${window.location.pathname}?embed=true&paper=${state.paperStyle}&font=${state.fontStyle}&tape=${state.tapeStyle}" width="${embedWidth}" height="${embedHeight}" style="border:none; overflow:hidden; background:transparent;" allowtransparency="true"></iframe>`;
                          navigator.clipboard.writeText(iframeText);
                          setCopiedCode(true);
                          setTimeout(() => setCopiedCode(false), 2000);
                        }}
                        className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 px-3 bg-amber-600 hover:bg-amber-700 font-bold text-white rounded text-[10px] cursor-pointer transition-colors active:translate-y-[1.5px]"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copiato negli Appunti!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copia Codice HTML</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded p-2 text-[9px] text-amber-800 leading-snug">
                      <span className="font-bold block">💡 Per darti quel tocco disordinato e magico:</span>
                      Nel CSS del tuo sito, applica una leggera rotazione all'iframe:
                      <code className="block mt-0.5 bg-white/70 p-1 rounded font-mono text-[8px] text-stone-800">
                        {`transform: rotate(${(Math.random() >= 0.5 ? 1.2 : -1.2).toFixed(1)}deg);`}
                      </code>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* WRITING AREA */}
          <div className="relative flex-1 flex flex-col">
            
            {/* Elegant double-ruled margin lines (shifted beautifully) */}
            <div className="absolute left-[30px] top-0 bottom-0 w-[1px] bg-red-400/25 pointer-events-none" />

            {/* Paper patterns overlaid using CSS classes */}
            <div className={`flex-1 flex flex-col pl-10 ${getPaperBackgroundClass()} relative`}>
              
              {/* Retro ink aging or subtle textured overlay */}
              <div className="absolute inset-0 bg-repeat bg-contain opacity-[0.03] pointer-events-none" />

                <AnimatePresence mode="wait">
                  {!state.isChecklistMode ? (
                    /* FREE WRITING MODE */
                    <motion.div
                      key="text-notes"
                      className="flex-1 flex flex-col h-full"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                    >
                      <textarea
                        value={state.notes}
                        onChange={handleNotesChange}
                        placeholder="Inizia a scrivere la nota di oggi...&#10;In automatico si salverà sul tuo browser."
                        className={`w-full flex-1 bg-transparent resize-none border-none outline-none focus:ring-0 select-text font-medium placeholder-slate-400/50 leading-[28px] ${getFontFamilyClass()}`}
                        style={{
                          lineHeight: '28px',
                        }}
                      />
                    </motion.div>
                  ) : (
                    /* CHECKLIST MODE */
                    <motion.div
                      key="checklist-notes"
                      className="flex-1 flex flex-col"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                    >
                      {/* Interactive Add Item Input */}
                      <form onSubmit={handleAddTodo} className="flex gap-2 mb-4 pr-1 relative z-10 select-none">
                        <input
                          type="text"
                          value={newTodoText}
                          onChange={(e) => setNewTodoText(e.target.value)}
                          placeholder="Aggiungi impegno..."
                          className="flex-1 bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-sans text-slate-700 outline-none focus:border-amber-500 focus:bg-white transition-all placeholder-slate-400"
                        />
                        <button
                          type="submit"
                          className="bg-amber-500 hover:bg-amber-600 active:translate-y-[1px] text-white px-2.5 py-1 rounded text-xs font-semibold cursor-pointer select-none shadow-sm flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Incolla</span>
                        </button>
                      </form>

                      {/* Display Task Items */}
                      <div className="flex-1 space-y-[4px] py-1 select-none">
                        {state.todoItems.length === 0 ? (
                          <div className={`text-slate-400/60 font-medium italic select-none pt-4 pr-2 ${getFontFamilyClass()}`}>
                            Nessun appunto per oggi.
                            <br />
                            Aggiungi un impegno qui sopra!
                          </div>
                        ) : (
                          state.todoItems.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between group pr-1 select-none"
                              style={{ height: '28px' }}
                            >
                              <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                {/* Custom hand-drawn checkbox look */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleTodo(item.id)}
                                  className="relative w-4 h-4 shrink-0 rounded border border-amber-600/40 cursor-pointer flex items-center justify-center bg-transparent group-hover:bg-amber-50/50 transition-colors"
                                >
                                  {item.completed && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute text-red-600 font-bold text-center text-xs pointer-events-none line-clamp-1 -mt-[3px]"
                                    >
                                      ✓
                                    </motion.div>
                                  )}
                                </button>

                                <span
                                  onClick={() => handleToggleTodo(item.id)}
                                  className={`truncate cursor-pointer flex-1 transition-all select-none ${
                                    item.completed
                                      ? 'line-through decoration-red-500/80 decoration-2 text-slate-400'
                                      : ''
                                  } ${getFontFamilyClass()}`}
                                >
                                  {item.text}
                                </span>
                              </div>

                              <button
                                onClick={() => handleDeleteTodo(item.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-opacity cursor-pointer block"
                                title="Elimina impegno"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* THE "SALVATO" INK STAMP */}
                <SavedStamp trigger={stampTrigger} />
              </div>
            </div>

            {/* PERSISTENT REAL-TIME AUTO-SAVE FOOT NOTE */}
            <div className="mt-4 pt-3 border-t-2 border-slate-200/40 text-[10px] text-slate-500 font-mono flex items-center justify-between select-none opacity-60">
              <div className="flex gap-1.5 items-center">
                <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isSaving ? 'bg-amber-500' : 'bg-slate-400'}`} />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              </div>
              <div className="uppercase tracking-widest font-bold text-[9px]">
                {isSaving ? 'SCRITTURA IN CORSO...' : 'Local Storage Attivo'}
              </div>
            </div>
          </div>
        </motion.div>
    </div>
  );
};
