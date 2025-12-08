// Type declarations for @google/model-viewer custom element

declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': ModelViewerJSX & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

interface ModelViewerJSX {
  src?: string;
  alt?: string;
  poster?: string;
  loading?: 'auto' | 'lazy' | 'eager';
  reveal?: 'auto' | 'interaction' | 'manual';
  'camera-controls'?: boolean;
  'auto-rotate'?: boolean;
  'rotation-per-second'?: string;
  autoplay?: boolean;
  ar?: boolean;
  'ar-modes'?: string;
  'ar-scale'?: string;
  'camera-orbit'?: string;
  'camera-target'?: string;
  'field-of-view'?: string;
  'min-camera-orbit'?: string;
  'max-camera-orbit'?: string;
  'min-field-of-view'?: string;
  'max-field-of-view'?: string;
  'interaction-prompt'?: string;
  'interaction-prompt-style'?: string;
  'interaction-prompt-threshold'?: string;
  exposure?: string;
  'shadow-intensity'?: string;
  'shadow-softness'?: string;
  'environment-image'?: string;
  skybox?: string;
  style?: React.CSSProperties;
  className?: string;
}

export {};
