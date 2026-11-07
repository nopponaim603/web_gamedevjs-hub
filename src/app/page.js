'use client';

import Header from '@/components/Header';
import GameCard from '@/components/GameCard';
import GameModal from '@/components/GameModal';
import PWAInstallButton from '@/components/PWAInstallButton';
import CategorySection from '@/components/CategorySection';
import { categories } from '@/data/games';
import { useGameCatalog } from '@/hooks/useGameCatalog';
import buildInfo from '../../public/build.json';

export default function Home() {
  const {
    games,
    filteredGames,
    searchKeyword,
    setSearchKeyword,
    selectedCategory,
    setSelectedCategory,
    activeGame,
    setActiveGame
  } = useGameCatalog();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword} />

      <main style={{ flex: 1, padding: '2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        {/* Banner Section */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(79, 172, 254, 0.15) 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          padding: '2.5rem',
          marginBottom: '2rem',
          backdropFilter: 'blur(12px)'
        }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.75rem' }}>
            🎮 HTML5 & Multi-Engine <span className="gradient-text">GameDevJS Hub</span>
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '700px', lineHeight: '1.6', marginBottom: '1.25rem' }}>
            ศูนย์รวมเกม HTML5, Phaser 2D, Babylon.js 3D และ Three.js / WebGPU บนสถาปัตยกรรม Next.js App Router พร้อมรองรับ PWA ออฟไลน์ และการแสดงผลระดับพรีเมียม
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <PWAInstallButton variant="hero" />
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              ⚡ เล่นได้ทันที รองรับบราวเซอร์ทุกอุปกรณ์ และเล่นแบบออฟไลน์ได้
            </span>
          </div>
        </section>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat 
                  ? 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)' 
                  : 'rgba(30, 41, 59, 0.7)',
                color: selectedCategory === cat ? '#0f172a' : '#f8fafc',
                fontWeight: '700',
                fontSize: '0.9rem',
                padding: '0.6rem 1.25rem',
                borderRadius: '9999px',
                border: selectedCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Games Grid grouped by Category Sections */}
        {selectedCategory === 'ทั้งหมด' && !searchKeyword ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Section 1: กลุ่มเกมปริศนา */}
            <CategorySection
              title="กลุ่มเกมปริศนา (Puzzle Games)"
              icon="🧩"
              games={games}
              filterFn={g => g.category.includes('ปริศนา')}
              badgeColor="#34d399"
              badgeBg="rgba(16, 185, 129, 0.15)"
              badgeBorder="rgba(16, 185, 129, 0.3)"
              onPlay={setActiveGame}
            />

            {/* Section 2: กลุ่มเกมกระดาน & วางกลยุทธ์ */}
            <CategorySection
              title="กลุ่มเกมกระดาน & วางกลยุทธ์ (Board & Strategy)"
              icon="🎲"
              games={games}
              filterFn={g => g.category.includes('กระดาน') || g.category.includes('วางกลยุทธ์')}
              badgeColor="#818cf8"
              badgeBg="rgba(99, 102, 241, 0.15)"
              badgeBorder="rgba(99, 102, 241, 0.3)"
              onPlay={setActiveGame}
            />

            {/* Section 3: กลุ่ม Phaser 2D Engine */}
            <CategorySection
              title="Phaser 2D Arcade & Action Engine"
              icon="⚡"
              games={games}
              filterFn={g => g.category.includes('Phaser')}
              badgeColor="#38bdf8"
              badgeBg="rgba(0, 242, 254, 0.15)"
              badgeBorder="rgba(0, 242, 254, 0.3)"
              onPlay={setActiveGame}
            />

            {/* Section 4: กลุ่ม Babylon.js 3D Engine */}
            <CategorySection
              title="Babylon.js 3D WebGL Engine"
              icon="🪐"
              games={games}
              filterFn={g => g.category.includes('Babylon')}
              badgeColor="#fb923c"
              badgeBg="rgba(249, 115, 22, 0.15)"
              badgeBorder="rgba(249, 115, 22, 0.3)"
              onPlay={setActiveGame}
            />

            {/* Section 5: กลุ่ม Three.js 3D Engine */}
            <CategorySection
              title="Three.js & WebGPU 3D Engine"
              icon="🌌"
              games={games}
              filterFn={g => g.category.includes('Three.js')}
              badgeColor="#f472b6"
              badgeBg="rgba(236, 72, 153, 0.15)"
              badgeBorder="rgba(236, 72, 153, 0.3)"
              onPlay={setActiveGame}
            />
          </div>
        ) : (
          <section>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} onPlay={setActiveGame} />
              ))}
            </div>

            {filteredGames.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                <p style={{ fontSize: '1.2rem' }}>ไม่พบเกมที่คุณค้นหา</p>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        padding: '1.5rem',
        textAlign: 'center',
        color: '#64748b',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '0.875rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
        alignItems: 'center'
      }}>
        <div>© 2026 GameDevJS Hub — Built with Next.js & Antigravity AI</div>
        <div style={{ fontSize: '0.75rem', color: '#475569' }}>
          v{buildInfo.version} (Build #{buildInfo.build})
        </div>
      </footer>

      {/* Modal Loader */}
      <GameModal game={activeGame} onClose={() => setActiveGame(null)} />
    </div>
  );
}
