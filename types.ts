
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
export type LightingStyle = 'Soft light' | 'Hard light' | 'Golden hour' | 'Blue hour' | 'High key' | 'Low key' | 'Dramatic';
export type CameraPerspective = 'Eye-level' | 'High-angle' | 'Low-angle' | 'Dutch angle' | 'Over-the-shoulder' | 'Birds-eye view';

export interface Option<T> {
  value: T;
  label: string;
}
   