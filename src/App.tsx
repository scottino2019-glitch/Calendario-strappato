import { useState, useEffect } from 'react';
import { BackgroundWall } from './components/BackgroundWall';
import { PaperCalendar } from './components/PaperCalendar';
import { AppState, PaperStyle, TapeStyle, FontStyle } from './types';

const STORAGE_KEY = 'foglio_strappato_app_state';
const WALL_PREFERENCE_KEY = 'foglio_strappato_wall';

// Generates persistent, visually stable angles so the scotch tapes do not re-jitter during typing state updates
const makeStableTapeRotations = () => {
  const angle1 = Math.floor(Math.random() * 8) - 6; // -6 to 2 deg
  const angle2 = Math.floor(Math.random() * 8) - 2; // -2 to 6 deg
  return [angle1 || -4, angle2 || 3];
};

const DEFAULT_STATE: AppState = {
  notes: '',
  todoItems: [],
  isChecklistMode: false,
  paperStyle: 'lined',
  tapeStyle: 'transparent',
  fontStyle: 'handwriting',
  tapeRotations: makeStableTapeRotations(),
};

export default function App() {
  // Detect if under embed mode either via URL parameter or if running in an iframe
  const [isEmbed, setIsEmbed] = useState(false);

  // 1. Core State with LocalStorage re-hydration & Query Params hydration
  const [state, setState] = useState<AppState>(() => {
    let initial = DEFAULT_STATE;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        initial = {
          ...DEFAULT_STATE,
          ...parsed,
          tapeRotations: parsed.tapeRotations || makeStableTapeRotations(),
        };
      }
    } catch (e) {
      console.error('Could not load notes state from localStorage:', e);
    }
    return initial;
  });

  // 2. Wall theme persistence and Override
  const [wallType, setWallType] = useState<'plaster' | 'wood' | 'minimal'>('plaster');

  // Parse URL search parameters on client side mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const embedParam = params.get('embed') === 'true';
      const isIframe = window.self !== window.top;
      
      setIsEmbed(embedParam || isIframe);

      // Extract custom styling overrides from URL
      const wallParam = params.get('wall');
      const paperParam = params.get('paper');
      const fontParam = params.get('font');
      const tapeParam = params.get('tape');

      if (wallParam === 'plaster' || wallParam === 'wood' || wallParam === 'minimal') {
        setWallType(wallParam);
      } else {
        const storedWall = localStorage.getItem(WALL_PREFERENCE_KEY);
        if (storedWall === 'plaster' || storedWall === 'wood' || storedWall === 'minimal') {
          setWallType(storedWall);
        }
      }

      setState(prev => {
        let updated = { ...prev };
        if (paperParam === 'lined' || paperParam === 'grid' || paperParam === 'plain' || paperParam === 'kraft') {
          updated.paperStyle = paperParam as PaperStyle;
        }
        if (fontParam === 'handwriting' || fontParam === 'sans') {
          updated.fontStyle = fontParam as FontStyle;
        }
        if (tapeParam === 'transparent' || tapeParam === 'yellow' || tapeParam === 'washi-dots' || tapeParam === 'washi-stripes' || tapeParam === 'green-deco') {
          updated.tapeStyle = tapeParam as TapeStyle;
        }
        return updated;
      });
    } catch (e) {
      console.error('Error reading configuration parameters:', e);
    }
  }, []);

  // Save state on modifications
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }, [state]);

  // Save wallpaper type unless it was forced via query URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (!params.get('wall')) {
        localStorage.setItem(WALL_PREFERENCE_KEY, wallType);
      }
    } catch (e) {}
  }, [wallType]);

  // Clean, modular type-safe state dispatcher
  const handleStateChange = (updater: (prev: AppState) => AppState) => {
    setState((prev) => updater(prev));
  };

  return (
    <BackgroundWall
      tapeStyle={state.tapeStyle}
      wallType={wallType}
      setWallType={setWallType}
      isEmbed={isEmbed}
    >
      <PaperCalendar 
        state={state} 
        onChange={handleStateChange} 
        isEmbed={isEmbed}
      />
    </BackgroundWall>
  );
}

