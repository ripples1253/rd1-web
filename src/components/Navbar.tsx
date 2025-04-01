'use client';

import React, { useState } from 'react';
import { globals } from '@/app/globals';
import SuggestSongForm from './SuggestSongForm';
import { toast } from 'sonner';

const Navbar = () => {
  const [showSuggestForm, setShowSuggestForm] = useState(false);

  const handleSuggestSong = () => {
    if (globals.suggestions_enabled) {
      setShowSuggestForm(true);
    } else {
      toast.error('Sorry, suggestions aren\'t enabled right now. Try again later!');
    }
  }

  return (
    <>
      <nav className="fixed top-4 left-4 right-4 bg-foreground/10 backdrop-blur-3xl px-4 py-2 rounded-lg shadow-md flex justify-between items-center z-20">
        <div className="text-foreground font-semibold text-lg content flex">
          <a href={globals.root_url}>
            <img src="https://osu.ppy.sh/assets/images/header-pippi.6222e29a.png" className="w-8 h-8" />
          </a>
        </div>

        <button
          onClick={handleSuggestSong}
          className="bg-primary hover:bg-accent text-background font-bold py-2 px-4 rounded"
        >
          Suggest Song
        </button>
      </nav>

      {showSuggestForm && <SuggestSongForm onClose={() => setShowSuggestForm(false)} />}
    </>
  );
};

export default Navbar; 