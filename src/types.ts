export type PaperStyle = 'lined' | 'grid' | 'plain' | 'kraft';
export type TapeStyle = 'transparent' | 'washi-dots' | 'washi-stripes' | 'yellow' | 'green-deco';
export type FontStyle = 'handwriting' | 'sans';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface AppState {
  notes: string;
  todoItems: TodoItem[];
  isChecklistMode: boolean;
  paperStyle: PaperStyle;
  tapeStyle: TapeStyle;
  fontStyle: FontStyle;
  tapeRotations: number[]; // Specific random rotations persisted so they don't jump around on re-render
}
