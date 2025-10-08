
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

interface PokemonDetails {
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

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(response => {
        setPokemon(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Pokémon not found');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!pokemon) {
    return null;
  }

  const prevPokemonId = pokemon.id - 1 > 0 ? pokemon.id - 1 : 1;
  const nextPokemonId = pokemon.id + 1;

  return (
    <div className="detail-container">
      <h2>{pokemon.name}</h2>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <div>
        <h3>Types</h3>
        <ul>
          {pokemon.types.map(t => (
            <li key={t.type.name}>{t.type.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <Link to={`/pokemon/${prevPokemonId}`}>Previous</Link>
        <Link to={`/pokemon/${nextPokemonId}`}>Next</Link>
      </div>
    </div>
  );
};

export default DetailView;
