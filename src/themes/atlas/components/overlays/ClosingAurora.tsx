import Aurora from '@/components/effects/Aurora/Aurora';

// Closing-section dark Aurora background. Replaces crazy/2's custom FBM shader
// (effects.js:354-461) with the react-bits official Aurora component.
export function ClosingAurora() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Aurora
        colorStops={['#0a0a0a', '#1a1a2e', '#3A29FF']}
        speed={0.18}
        blend={0.6}
        amplitude={1.2}
      />
    </div>
  );
}