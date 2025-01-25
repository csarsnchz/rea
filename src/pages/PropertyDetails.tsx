import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Property } from '../types';
import { supabase } from '../lib/supabase';
import { Heart, BedDouble, Bath, Square, MapPin } from 'lucide-react';

export function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      loadProperty();
      checkFavorite();
    }
  }, [id]);

  async function loadProperty() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error loading property:', error);
      return;
    }

    setProperty(data);
  }

  async function checkFavorite() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('property_id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error checking favorite:', error);
      return;
    }

    setIsFavorite(!!data);
  }

  async function toggleFavorite() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('property_id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error removing favorite:', error);
        return;
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ property_id: id, user_id: user.id });

      if (error) {
        console.error('Error adding favorite:', error);
        return;
      }
    }

    setIsFavorite(!isFavorite);
  }

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 pb-20 pt-4">
      <div className="relative">
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md"
        >
          <Heart
            className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
          />
        </button>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
          <p className="text-2xl font-bold text-blue-600">
            ${property.price.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <p className="text-gray-600">{property.location}</p>
        </div>

        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-2">
            <Square className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">{property.area} sq ft</span>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
          <p className="text-gray-700 leading-relaxed">{property.description}</p>
        </div>
      </div>
    </div>
  );
}