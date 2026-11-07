import GameCard from '@/components/GameCard';

export default function CategorySection({
  title,
  icon,
  games,
  filterFn,
  badgeColor = '#34d399',
  badgeBg = 'rgba(16, 185, 129, 0.15)',
  badgeBorder = 'rgba(16, 185, 129, 0.3)',
  onPlay
}) {
  const sectionGames = filterFn ? games.filter(filterFn) : games;

  if (sectionGames.length === 0) return null;

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {icon} {title}
        </h2>
        <span style={{
          fontSize: '0.8rem',
          background: badgeBg,
          border: `1px solid ${badgeBorder}`,
          color: badgeColor,
          padding: '0.2rem 0.75rem',
          borderRadius: '9999px',
          fontWeight: '700'
        }}>
          {sectionGames.length} เกม
        </span>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
        gap: '1.5rem'
      }}>
        {sectionGames.map(game => (
          <GameCard key={game.id} game={game} onPlay={onPlay} />
        ))}
      </div>
    </section>
  );
}

