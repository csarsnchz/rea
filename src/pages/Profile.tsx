import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Profile as ProfileType, Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { LogOut, Settings, Camera } from 'lucide-react';

export function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (user) {
      loadProfile();
      loadFavorites();
    }
  }, [user]);

  async function loadProfile() {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      // Create profile if it doesn't exist
      if (error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata.full_name || '',
              avatar_url: user.user_metadata.avatar_url || ''
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return;
        }

        setProfile(newProfile);
        setFullName(newProfile.full_name || '');
      }
      return;
    }

    setProfile(data);
    setFullName(data.full_name || '');
  }

  async function loadFavorites() {
    if (!user) return;

    const { data, error } = await supabase
      .from('favorites')
      .select('property_id, properties (*)')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error loading favorites:', error);
      return;
    }

    setFavorites(data.map((f: any) => f.properties));
  }

  async function handleUpdateProfile() {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      return;
    }

    setEditing(false);
    loadProfile();
  }

  async function handleSignOut() {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 pb-20 pt-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setEditing(!editing)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <Settings className="w-6 h-6" />
          </button>
          <button
            onClick={handleSignOut}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={profile.avatar_url || 'https://via.placeholder.com/100'}
              alt={profile.full_name || 'Profile'}
              className="w-20 h-20 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Full Name"
                />
                <button
                  onClick={handleUpdateProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile.full_name || 'Anonymous User'}
                </h2>
                <p className="text-gray-600">{profile.email}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Favorite Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((property) => (
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