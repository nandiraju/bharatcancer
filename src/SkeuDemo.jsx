import { SkeuButton, SkeuButtonGroup } from './components/SkeuButton';
import {
  MousePointer2, Hash, Square, PenTool, Type,
  Hand, MessageCircle, ZoomIn, ZoomOut, RotateCcw,
  Trash2, Star, Map, Activity, Heart,
} from 'lucide-react';

export default function SkeuDemo() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#1c1c1e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 48,
      padding: 40,
      fontFamily: 'Inter, sans-serif',
    }}>

      {/* Title */}
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase' }}>
        SkeuButton · Reusable Component
      </div>

      {/* ── Figma-style toolbar ─────────────────────────── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 4 }}>TOOLBAR — MD SIZE</div>
        <SkeuButtonGroup gap={8} dividerAfter={[4]}>
          <SkeuButton icon={<MousePointer2 size={18} strokeWidth={1.5} />} label="Select"  active />
          <SkeuButton icon={<Hash         size={18} strokeWidth={1.5} />} label="Frame"  />
          <SkeuButton icon={<Square       size={18} strokeWidth={1.5} />} label="Shape"  />
          <SkeuButton icon={<PenTool      size={18} strokeWidth={1.5} />} label="Pen"    />
          <SkeuButton icon={<Type         size={18} strokeWidth={1.5} />} label="Text"   />
          <SkeuButton icon={<Hand         size={18} strokeWidth={1.5} />} label="Hand"   />
          <SkeuButton icon={<MessageCircle size={18} strokeWidth={1.5} />} label="Comment" />
        </SkeuButtonGroup>
      </section>

      {/* ── Sizes ───────────────────────────────────────── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 4 }}>SIZES</div>
        <SkeuButtonGroup gap={12}>
          <SkeuButton size="sm" icon={<Map size={14} strokeWidth={1.5} />} label="Small" />
          <SkeuButton size="md" icon={<Map size={18} strokeWidth={1.5} />} label="Medium" />
          <SkeuButton size="lg" icon={<Map size={24} strokeWidth={1.5} />} label="Large" />
        </SkeuButtonGroup>
      </section>

      {/* ── Variants ────────────────────────────────────── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 4 }}>VARIANTS</div>
        <SkeuButtonGroup gap={10}>
          <SkeuButton variant="default" icon={<Activity size={18} strokeWidth={1.5} />} label="Default" />
          <SkeuButton variant="accent"  icon={<Star     size={18} strokeWidth={1.5} />} label="Accent"  />
          <SkeuButton variant="danger"  icon={<Trash2   size={18} strokeWidth={1.5} />} label="Danger"  />
        </SkeuButtonGroup>
      </section>

      {/* ── States ──────────────────────────────────────── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 4 }}>STATES</div>
        <SkeuButtonGroup gap={10}>
          <SkeuButton icon={<Heart size={18} strokeWidth={1.5} />} label="Default"  />
          <SkeuButton icon={<Heart size={18} strokeWidth={1.5} />} label="Active"   active   />
          <SkeuButton icon={<Heart size={18} strokeWidth={1.5} />} label="Disabled" disabled />
        </SkeuButtonGroup>
      </section>

      {/* ── Map zoom controls example ────────────────────── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 4 }}>VERTICAL STACK (MAP CONTROLS)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <SkeuButton size="sm" icon={<ZoomIn    size={14} strokeWidth={2} />} label="Zoom In"   />
          <SkeuButton size="sm" icon={<ZoomOut   size={14} strokeWidth={2} />} label="Zoom Out"  />
          <SkeuButton size="sm" icon={<RotateCcw size={14} strokeWidth={2} />} label="Reset"     />
        </div>
      </section>

    </div>
  );
}
