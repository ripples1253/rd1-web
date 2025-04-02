'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { globals } from '@/app/globals';
import { log } from '@/app/utils';

interface Song {
  id: string;
  art: string;
  text: string;
  artist: string;
  title: string;
  album: string;
  genre: string;
  isrc: string;
  lyrics: string;
}

interface NowPlayingData {
  now_playing: {
    sh_id: number;
    song: Song;
  };
  listeners: {
    current: number;
  };
}

const MusicPlayer: React.FC = () => {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null);
  const [listeners, setListeners] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [lastSongId, setLastSongId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const baseStreamUrl = `${globals.azuracast_root}/listen/${globals.azuracast_station_id}/radio.mp3`;
  const apiUrl = `${globals.azuracast_root}/api/nowplaying/${globals.azuracast_station_id}`;

  const [audioSourceUrl, setAudioSourceUrl] = useState(baseStreamUrl);

  const fetchNowPlaying = async () => {
    try {
      const response = await fetch(apiUrl + `?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(buffer);
      const data: NowPlayingData = JSON.parse(text);

      if (data.now_playing?.sh_id !== lastSongId) {
        setNowPlaying(data);
        setLastSongId(data.now_playing?.sh_id);
      }

      if (data.listeners.current !== listeners) {
        setListeners(data.listeners.current);
      }
    } catch (error) {
      console.error("Error fetching Now Playing data:", error);
      setNowPlaying(null);
    }
  };

  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, globals.metadata_fetch_interval);

    return () => clearInterval(interval);
  }, [lastSongId]);

  useEffect(() => {
    setAudioSourceUrl(`${baseStreamUrl}?t=${Date.now()}`);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.load(); // reset the state, otherwise players lag behind on the live stream
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const song = nowPlaying?.now_playing?.song;

  useEffect(() => {
    if ('mediaSession' in navigator && song) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: song.album || 'oops, ripley didn\'t set an album!',
        artwork: [
          { src: song.art, sizes: '512x512', type: 'image/jpeg' },
        ]
      });

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      navigator.mediaSession.setActionHandler('play', () => {
         if (!isPlaying) togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
         if (isPlaying) togglePlayPause();
      });
    }
  }, [song, isPlaying, togglePlayPause]);

  // add keyboard controls for player
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      log('MusicPlayer', `KeyboardEvent call!! code: ${event.code}`);

      switch (event.code) {
        case "Space":
          togglePlayPause();
          break;
        case "ArrowLeft":
        case "ArrowDown":
          if (volume !== 0) {
            setVolume((volume <= 0.05) ? 0 : volume - 0.05);
          }
          break;
        case "ArrowRight":
        case "ArrowUp":
          // change volume
          if (volume !== 1) {
            setVolume((volume >= 0.95) ? 1 : volume + 0.05);
          }
          break;
        case "KeyD":
          // print debug info
          log('MusicPlayer', `nowPlaying: ${nowPlaying}`);
          log('MusicPlayer', `audioSourceUrl: ${audioSourceUrl}`);
          log('MusicPlayer', `volume: ${volume}`);
          log('MusicPlayer', `isPlaying: ${isPlaying}`);
          log('MusicPlayer', `listeners: ${listeners}`);
          log('MusicPlayer', `lastSongId: ${lastSongId}`);
          break;
        default:
          break;
      }
    }
    
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    }
  }, [togglePlayPause]);

  return (
    <div className="bg-primary/20 backdrop-blur-[2px] p-4 rounded-lg shadow-md max-w-sm mx-auto mt-8">
      <div className="flex items-center space-x-4">
        {/* Album Art */}
        <div className="w-20 h-20 relative flex-shrink-0">
          {song?.art ? (
            <Image
              src={song.art}
              alt={song.album || 'Unable to fetch album art!'}
              fill
              className="rounded object-cover"
              unoptimized // will change often, don't optimise it
            />
          ) : (
            <div className="w-full h-full bg-foreground/10 rounded flex items-center justify-center text-foreground/50">
              ?
            </div>
          )}
        </div>

        {/* Song Info & Controls */}
        <div className="flex-grow min-w-0">
           <p className="text-foreground text-sm truncate font-semibold" title={song?.title ?? 'Loading player, give me a sec!'}>
              {song?.title ?? 'Loading player, give me a sec!'}
           </p>
           <p className="text-foreground/80 text-xs truncate" title={song?.artist ?? '-'}>
              {song?.artist ?? '-'}
           </p>
           <p className="text-foreground/60 text-xs mt-1">Listeners: {listeners}</p>

           {/* Audio Element (Hidden) - Use state for the source */}
           <audio ref={audioRef} src={audioSourceUrl} preload="none" />

           {/* Controls */}
           <div className="flex items-center space-x-3 mt-2">
             <button
                onClick={togglePlayPause}
                className="text-foreground hover:text-accent p-1 rounded-full focus:outline-none transition-colors"
                aria-label={isPlaying ? 'Stop' : 'Play'}
             >
                {/* Simple Play/Stop Icon */}
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                  </svg>
                 ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                   </svg>
                 )}
             </button>
             {/* Volume Slider */}
             <input
               type="range"
               min="0"
               max="1"
               step="0.01"
               value={volume}
               onChange={(e) => setVolume(parseFloat(e.target.value))}
               className="w-full h-1 rounded-lg appearance-none cursor-pointer"
               style={{ background: `linear-gradient(to right, var(--foreground) ${volume * 100}%, var(--background) ${volume * 100}%)` }}
               aria-label="Volume"
             />
           </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer; 