'use client';

import React, { useState } from 'react';
import { globals } from '@/app/globals';
import SuggestSongForm from './SuggestSongForm';
import { toast } from 'sonner';

const Navbar = () => {
  const [showSuggestForm, setShowSuggestForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSuggestSong = () => {
    if (globals.suggestions_enabled) {
      setShowSuggestForm(true);
    } else {
      toast.error('Sorry, suggestions aren\'t enabled right now. Try again later!');
    }
  }

  return (
    <>
      <nav className="fixed top-4 left-4 right-4 bg-foreground/10 backdrop-blur-[2px] px-4 py-2 rounded-lg shadow-md flex justify-between items-center z-20">
        <div className="text-foreground font-semibold text-lg content flex">
          <a href={globals.root_url}>
            <img src="/images/osu-pippi.png" className="w-8 h-8" />
          </a>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6">
          {globals.navbar_links.map((link) => (
            <li key={link.name}>
              <a href={link.href} className='hover:underline drop-shadow-xl'>{link.name}</a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden p-2 rounded-lg hover:bg-foreground/10"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {showMobileMenu ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <button
          onClick={handleSuggestSong}
          className="bg-primary hover:bg-accent text-background font-bold py-2 px-4 rounded"
        >
          Suggest Song
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="fixed top-20 left-4 right-4 bg-foreground/10 backdrop-blur-3xl rounded-lg shadow-md p-4 z-10 md:hidden">
          <ul className="flex flex-col gap-4">
            {globals.navbar_links.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href}
                  className="block py-2 px-4 rounded-lg hover:bg-foreground/10"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSuggestForm && <SuggestSongForm onClose={() => setShowSuggestForm(false)} />}
    </>
  );
};

export default Navbar; 