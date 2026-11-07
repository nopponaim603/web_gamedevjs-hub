import { useState, useMemo } from 'react';
import { initialGames } from '@/data/games';

export function useGameCatalog() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [activeGame, setActiveGame] = useState(null);

  const filteredGames = useMemo(() => {
    return initialGames.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchesCategory = selectedCategory === 'ทั้งหมด' || game.category.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchKeyword, selectedCategory]);

  return {
    games: initialGames,
    filteredGames,
    searchKeyword,
    setSearchKeyword,
    selectedCategory,
    setSelectedCategory,
    activeGame,
    setActiveGame
  };
}

