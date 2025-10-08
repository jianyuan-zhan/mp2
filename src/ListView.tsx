
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Pokemon {
  id: number;
  name: string;
  url: string;
  types: {
    type: {
      name: string;
    };
  }[];
}

const ListView: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortProperty, setSortProperty] = useState<keyof Pokemon>('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchPokemon = async () => {
      const pokemonPromises = [];
      for (let i = 1; i <= 151; i++) {
        pokemonPromises.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`));
      }
      const pokemonResponses = await axios.all(pokemonPromises);
      const pokemonData = pokemonResponses.map(res => res.data);
      setPokemon(pokemonData);
      setLoading(false);
    };

    fetchPokemon();
  }, []);

  const handleSort = (property: keyof Pokemon) => {
    if (property === sortProperty) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortProperty(property);
      setSortOrder('asc');
    }
  };

  const sortedPokemon = [...pokemon].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    if (sortProperty === 'types') {
      aValue = a.types[0].type.name;
      bValue = b.types[0].type.name;
    } else {
      aValue = a[sortProperty];
      bValue = b[sortProperty];
    }

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredPokemon = sortedPokemon.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Pokémon List</h2>
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div>
        <button onClick={() => handleSort('name')}>
          Sort by Name {sortProperty === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
        </button>
        <button onClick={() => handleSort('types')}>
          Sort by Type {sortProperty === 'types' && (sortOrder === 'asc' ? '▲' : '▼')}
        </button>
      </div>
      <ul>
        {filteredPokemon.map(p => (
          <li key={p.name}>
            <Link to={`/pokemon/${p.id}`}>
              {p.name}
              <span className="pokemon-types">
                {p.types.map(t => t.type.name).join(', ')}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListView;

