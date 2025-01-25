import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../types';
import { supabase } from '../lib/supabase';
import { PropertyCard } from '../components/PropertyCard';
import { SearchBar } from '../components/SearchBar';

export function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading properties:', error);
      return;
    }

    setProperties(data);
  }

  const handleSearch = async (query: string) => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching properties:', error);
      return;
    }

    setProperties(data);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 pb-20 pt-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Your Dream Home</h1>
      
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={() => navigate(`/property/${property.id}`)}
          />
        ))}
      </div>
    </div>
  );
}