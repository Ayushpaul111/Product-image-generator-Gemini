
import type { Option, AspectRatio, LightingStyle, CameraPerspective } from './types';

export const ASPECT_RATIO_OPTIONS: Option<AspectRatio>[] = [
  { value: '1:1', label: 'Square (1:1)' },
  { value: '16:9', label: 'Landscape (16:9)' },
  { value: '9:16', label: 'Portrait (9:16)' },
  { value: '4:3', label: 'Standard (4:3)' },
  { value: '3:4', label: 'Tall (3:4)' },
];

export const LIGHTING_STYLE_OPTIONS: Option<LightingStyle>[] = [
  { value: 'Soft light', label: 'Soft Light' },
  { value: 'Hard light', label: 'Hard Light' },
  { value: 'Dramatic', label: 'Dramatic' },
  { value: 'Golden hour', label: 'Golden Hour' },
  { value: 'Blue hour', label: 'Blue Hour' },
  { value: 'High key', label: 'High Key' },
  { value: 'Low key', label: 'Low Key' },
];

export const CAMERA_PERSPECTIVE_OPTIONS: Option<CameraPerspective>[] = [
  { value: 'Eye-level', label: 'Eye-Level' },
  { value: 'High-angle', label: 'High-Angle' },
  { value: 'Low-angle', label: 'Low-Angle' },
  { value: 'Birds-eye view', label: 'Bird\'s-Eye View' },
  { value: 'Dutch angle', label: 'Dutch Angle' },
  { value: 'Over-the-shoulder', label: 'Over-the-Shoulder' },
];
   