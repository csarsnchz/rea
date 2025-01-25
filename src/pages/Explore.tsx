import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../types';
import { supabase } from '../lib/supabase';
import { PropertyCard } from '../components/PropertyCard';

const PROPERTY_TYPES = ['All', 'House', 'Apartment', 'Villa', 'Cabin', 'Loft'];

export function Explore() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeType, setActiveType] = useState('All');
  const navigate = useNavigate();

  const loadProperties = async (type: string) => {
    const query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (type !== 'All') {
      query.eq('property_type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading properties:', error);
      return;
    }

    setProperties(data);
  };

  const handleTypeChange = (type: string) => {
    setActiveType(type);
    loadProperties(type);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 pb-20 pt-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Explore Properties</h1>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {PROPERTY_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
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