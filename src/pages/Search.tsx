import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../types';
import { supabase } from '../lib/supabase';
import { PropertyCard } from '../components/PropertyCard';
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';

interface Filters {
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  propertyType: string;
}

export function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<Filters>({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
  });

  const propertyTypes = ['Any', 'House', 'Apartment', 'Villa', 'Cabin', 'Loft'];

  const handleSearch = async () => {
    let queryBuilder = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    // Text search
    if (query) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`
      );
    }

    // Price range
    if (filters.minPrice) {
      queryBuilder = queryBuilder.gte('price', parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      queryBuilder = queryBuilder.lte('price', parseFloat(filters.maxPrice));
    }

    // Bedrooms and bathrooms
    if (filters.bedrooms) {
      queryBuilder = queryBuilder.eq('bedrooms', parseInt(filters.bedrooms));
    }
    if (filters.bathrooms) {
      queryBuilder = queryBuilder.eq('bathrooms', parseInt(filters.bathrooms));
    }

    // Property type
    if (filters.propertyType && filters.propertyType !== 'Any') {
      queryBuilder = queryBuilder.eq('property_type', filters.propertyType);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error searching properties:', error);
      return;
    }

    setProperties(data);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 pb-20 pt-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Properties</h1>

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by location, title, or description..."
              className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, minPrice: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, maxPrice: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) =>
                    setFilters({ ...filters, bedrooms: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}+
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) =>
                    setFilters({ ...filters, bathrooms: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}+
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  value={filters.propertyType}
                  onChange={(e) =>
                    setFilters({ ...filters, propertyType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSearch}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
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