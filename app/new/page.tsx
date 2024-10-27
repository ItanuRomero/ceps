'use client'

import { useState } from 'react';
import { FullAddress, search } from '../actions/search';

const addZipCodeToFavorites = async (street: string, number: number, code: string, name: string) => {
  if (!street || !code || !name || !number) {
    throw new Error('Missing required fields');
  }

  const response = await fetch('/api/cep', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address: street,
      number,
      code,
      name,
    }),
  });

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.error);
  }

  return 'Zip code added to favorites!';
};

export default function New() {
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [fullAddress, setFullAddress] = useState<FullAddress>();
  const [error, setError] = useState('');


  const handleSearch = async () => {
    try {
      const fullAddress = await search(address)
      setFullAddress(fullAddress)
      setError('')
    } catch (error) {
      console.error(error)
      setError('Endereço não encontrado')
    }
  };

  const handleAddToFavorites = async () => {
    if (fullAddress) {
      const { street, zip: code, number } = fullAddress;

      try {
        const message = await addZipCodeToFavorites(street, number, code, name);
        alert(message);
      } catch (error) {
        if (error instanceof Error) alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className='container'>
      <h1>Buscar endereço (coloque logradouro, número, bairro e cidade.)</h1>
      <input
        className='w-full'
        type="text"
        placeholder="Rua dos Bobos, 0, bairro, cidade"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {fullAddress && (
        <div>
          <h2>Resultado:</h2>
          <p>Rua: {fullAddress.street}</p>
          <p>Número: {fullAddress.number}</p>
          <p>CEP: {fullAddress.zip}</p>
          <input
            type="text"
            placeholder="Coloque um nome para favoritar"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button disabled={!name} onClick={handleAddToFavorites}>Add to Favorites</button>
        </div>
      )}
    </div>
  );
};
