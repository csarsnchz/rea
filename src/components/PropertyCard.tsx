import React from 'react';
import { Property } from '../types';
import { Home, Bath, BedDouble, Square } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
    >
      <img 
        src={property.image_url} 
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
        <p className="text-xl font-bold text-blue-600 mt-1">
          ${property.price.toLocaleString()}
        </p>
        <p className="text-gray-600 text-sm mt-2">{property.location}</p>
        
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1">
            <BedDouble className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{property.area} sq ft</span>
          </div>
        </div>
      </div>
    </div>
  );
}