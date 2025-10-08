
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

interface Type {
  name: string;
  url: string;
}

const GalleryView: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      const typesResponse = await axios.get('https://pokeapi.co/api/v2/type');
      setTypes(typesResponse.data.results);

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

  const filteredPokemon = selectedType
    ? pokemon.filter(p => p.types.some(t => t.type.name === selectedType))
    : pokemon;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Pokémon Gallery</h2>
      <div>
        <button onClick={() => setSelectedType(null)}>All</button>
        {types.map(t => (
          <button key={t.name} onClick={() => setSelectedType(t.name)}>
            {t.name}
          </button>
        ))}
      </div>
      <div className="gallery-container">
        {filteredPokemon.map(p => (
          <Link key={p.id} to={`/pokemon/${p.id}`} className="gallery-item">
            <img src={p.sprites.front_default} alt={p.name} />
            <p>{p.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GalleryView;
