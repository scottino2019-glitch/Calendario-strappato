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

      {/* COORDY EMBED GENERATOR CODE BLOCK (STYLIZED AS A HAND-TAPED METALLIC RULER NOTE ON THE BOTTOM WALL) */}
      <AnimatePresence>
        {showEmbedHelper && !isEmbed && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mt-6 p-4 relative bg-stone-100 rounded border border-stone-200 bg-linear-to-b from-stone-50 to-stone-100 shadow-md text-xs text-stone-700"
          >
            {/* Visual Mini Adhesive Tape onto settings note */}
            <div className="absolute -top-3 left-[40%] w-16 h-5 opacity-70 bg-white/30 border border-white/5 shadow-sm backdrop-blur-[1px] tape-ripped-x rotate-[-1deg] bg-amber-200/45" />

            <div className="font-semibold text-stone-800 flex items-center gap-1.5 mb-2 select-none">
              <Code className="w-4 h-4 text-amber-600" />
              <span>Copia Codice per il tuo Portfolio / Sito</span>
            </div>

            <p className="text-[10px] text-stone-500 mb-3 select-none">
              Incolla questo blocco di codice sul file HTML del tuo sito (o sul tuo site builder come WordPress, Notion, Webflow) per mostrare questo foglio nel tuo scaffale o scrivania virtuale!
            </p>

            <div className="space-y-3">
              {/* Size selectors */}
              <div>
                <span className="block text-stone-500 mb-1 select-none font-medium">Dimensioni Widget:</span>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <label className="text-[10px] text-stone-500 font-mono">Larghezza: {embedWidth}px</label>
                    <input
                      type="range"
                      min="320"
                      max="600"
                      step="10"
                      value={embedWidth}
                      onChange={(e) => setEmbedWidth(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-stone-500 font-mono">Altezza: {embedHeight}px</label>
                    <input
                      type="range"
                      min="400"
                      max="800"
                      step="10"
                      value={embedHeight}
                      onChange={(e) => setEmbedHeight(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Embed Code snippet */}
              <div className="relative">
                <span className="block text-stone-500 mb-1 select-none font-medium">Codice HTML da Copiare:</span>
                <div className="bg-stone-900 text-stone-300 p-2.5 rounded font-mono text-[9px] break-all border border-stone-800 select-all max-h-24 overflow-y-auto leading-normal">
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
                  className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-amber-500 hover:bg-amber-600 font-bold text-white rounded cursor-pointer leading-tight shadow-xs transition-all active:translate-y-[1px]"
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

              {/* Styling recommendations for the chaotic desk layout */}
              <div className="bg-amber-50 border border-amber-200/40 rounded p-2 text-[10px] text-amber-800 font-medium">
                <span className="font-bold underline block mb-0.5">💡 Suggerimento per Scrivania Caotica:</span>
                Nel CSS del tuo sito, applica uno stile di rotazione all'iframe per dargli quel tocco realistico e disordinato:
                <code className="block mt-1 bg-white/60 p-1 rounded font-mono text-[9px] text-slate-800">
                  {`transform: rotate(${(Math.random() >= 0.5 ? 1.5 : -1.5).toFixed(1)}deg);`}
                </code>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <a
                href={`${window.location.origin}${window.location.pathname}?embed=true&paper=${state.paperStyle}&font=${state.fontStyle}&tape=${state.tapeStyle}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1 py-1 px-2 border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 rounded font-semibold text-center"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Anteprima</span>
              </a>
              <button
                onClick={() => setShowEmbedHelper(false)}
                className="flex-1 bg-stone-200 hover:bg-stone-300 py-1 rounded text-stone-700 font-semibold cursor-pointer"
              >
                Chiudi
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUICK FLOATING CONFIGURATION DRAWER (STYLIZED AS A HAND-TAPED NOTE ON THE BOTTOM WALL) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mt-6 p-4 relative bg-stone-100 rounded border border-stone-200 bg-linear-to-b from-stone-50 to-stone-100 shadow-md text-xs text-stone-700"
          >
            {/* Visual Mini Adhesive Tape onto settings note */}
            <div className="absolute -top-3 left-[40%] w-16 h-5 opacity-70 bg-white/30 border border-white/5 shadow-sm backdrop-blur-[1px] tape-ripped-x rotate-[-1deg]" />

            <div className="font-semibold text-stone-800 flex items-center gap-1.5 mb-3 select-none">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Personalizza Calendario</span>
            </div>

            <div className="space-y-3">
              {/* Paper Selection */}
              <div>
                <span className="block text-stone-500 mb-1 pointer-events-none select-none">Finitura della Carta:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['lined', 'grid', 'plain', 'kraft'] as PaperStyle[]).map((style) => (
                    <button
                      key={style}
                      onClick={() => onChange((prev) => ({ ...prev, paperStyle: style }))}
                      className={`py-1 px-1.5 rounded text-center border capitalize cursor-pointer font-medium ${
                        state.paperStyle === style
                          ? 'bg-amber-500 text-white border-amber-600 font-semibold'
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {style === 'lined' ? 'Righe' : style === 'grid' ? 'Quadri' : style === 'plain' ? 'Bianco' : 'Kraft'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tape Selection */}
              <div>
                <span className="block text-stone-500 mb-1 pointer-events-none select-none font-sans">Stile Nasso Adesivo:</span>
                <div className="grid grid-cols-5 gap-1 shadow-xs">
                  {(['transparent', 'yellow', 'washi-dots', 'washi-stripes', 'green-deco'] as TapeStyle[]).map((style) => (
                    <button
                      key={style}
                      onClick={() => onChange((prev) => ({ ...prev, tapeStyle: style }))}
                      className={`py-1 px-1 rounded text-[10px] text-center shrink-0 border capitalize cursor-pointer font-medium ${
                        state.tapeStyle === style
                          ? 'bg-amber-500 text-white border-amber-600 font-semibold shadow-xs'
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {style === 'transparent' ? 'Scotch' : style === 'yellow' ? 'Giallo' : style === 'washi-dots' ? 'Pois' : style === 'washi-stripes' ? 'Righe' : 'Deco'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Character custom font style */}
              <div>
                <span className="block text-stone-500 mb-1 pointer-events-none select-none">Stile Scrittura:</span>
                <div className="grid grid-cols-2 gap-2">
                  {(['handwriting', 'sans'] as FontStyle[]).map((font) => (
                    <button
                      key={font}
                      onClick={() => onChange((prev) => ({ ...prev, fontStyle: font }))}
                      className={`py-1 px-2 border rounded cursor-pointer font-medium text-center ${
                        state.fontStyle === font
                          ? 'bg-amber-500 text-white border-amber-600 font-semibold'
                          : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      {font === 'handwriting' ? '✎ Grafia' : '⌨ Tastiera'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-3.5 w-full bg-stone-200 hover:bg-stone-300 transition-colors py-1 rounded text-stone-700 font-semibold cursor-pointer"
            >
              Chiudi
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
