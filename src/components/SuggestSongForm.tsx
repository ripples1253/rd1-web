'use client';

import React, { useState } from 'react';
import { globals } from '@/app/globals';

interface SuggestSongFormProps {
  onClose: () => void;
}

const SuggestSongForm: React.FC<SuggestSongFormProps> = ({ onClose }) => {
  const [name, setName] = useState('@');
  const [link, setLink] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidLink = (url: string): boolean => {
    if (!url) return false;
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();
      return (
        hostname.includes('osu.ppy.sh') ||
        hostname.includes('soundcloud.com') ||
        hostname.includes('spotify.com')
      );
    } catch (e) {
      return false; // Invalid URL format
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setError('Please enter your nickname or name, so I know who you are!');
      return;
    }

    if (!name.startsWith('@')) {
      setError('Please enter your Discord username, including the @ symbol.');
      return;
    }

    if (!isValidLink(link)) {
      setError('Please enter a valid osu!, SoundCloud, or Spotify link.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${globals.backend_url}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          url: link,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred.' }));
        throw new Error(`Failed to send suggestion. Backend responded with status ${response.status}\nMessage: ${errorData.message || 'No error message was sent to us.'}`);
      }

      setSuccessMessage('tysm! i\'ll get around to it as soon as i can! - rip');
      setName('');
      setLink('');

    } catch (err) {
      console.error("Error submitting suggestion:", err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
        <div className="bg-background/40 backdrop-blur-xl p-6 rounded-lg shadow-xl max-w-md w-full relative text-center">
          <p className="text-lg font-semibold text-accent text-foreground mb-4">{successMessage}</p>

          <img src="/images/miku_thumbsup.png" alt="Miku approves of this suggestion!" className="w-1/2 mx-auto"></img>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-black rounded hover:bg-primary/90 transition-colors center"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-background/40 backdrop-blur-xl p-6 rounded-lg shadow-xl max-w-md w-full relative">
         <button
            onClick={onClose}
            className="absolute top-2 right-2 text-foreground/50 hover:text-foreground p-1 rounded-full focus:outline-none"
            aria-label="Close form"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Suggest a Song</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-1">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-foreground/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-foreground/50"
              placeholder="Your Discord Username"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="link" className="block text-sm font-medium text-foreground/80 mb-1">Song Link</label>
            <input
              type="url"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              className="w-full px-3 py-2 bg-foreground/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-foreground/50"
              placeholder="Song URL"
            />
             <p className="text-xs text-foreground/60 mt-1">Must be a valid osu!, SoundCloud, or Spotify link.</p>
          </div>
          {error && (
            <p className="text-sm text-destructive mb-3 p-2 bg-destructive/10 border border-destructive rounded">{error}</p>
          )}
          <div className="flex justify-end space-x-3">
             <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-white rounded hover:ring-2 hover:ring-primary/50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-black rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuggestSongForm; 