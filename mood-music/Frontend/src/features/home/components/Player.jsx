import "../styles/player.scss";
import React, { useEffect, useRef, useState } from "react";
import {
  IoPlay,
  IoPause,
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoVolumeHigh,
  IoChevronUp,
  IoChevronDown,
  IoShuffle,
  IoRepeat,
  IoHeart,
  IoEllipsisVertical,
} from "react-icons/io5";

import { useSong } from "../hooks/useSong";

const Player = () => {
  const { song } = useSong();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(1);

  // handlers (same as before)
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime || 0);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current?.duration || 0);
  };

  const handleSeek = (e) => {
    const value = Number(e.target.value);
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const handleForward = () => {
    audioRef.current.currentTime = Math.min(
      audioRef.current.currentTime + 10,
      duration,
    );
  };

  const handleBackward = () => {
    audioRef.current.currentTime = Math.max(
      audioRef.current.currentTime - 10,
      0,
    );
  };

  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value) / 100;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const formatTime = (t) => {
    if (!t || Number.isNaN(t)) return "0:00";
    const minutes = Math.floor(t / 60);
    const seconds = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.load();
    setCurrentTime(0);
    setIsPlaying(false);
    togglePlay()
  }, [song.url]);

  return (
    <>
      <div className={`player ${isExpanded ? "expanded" : "compact"}`}>
        {/* Compact bottom bar */}
        <div className="player-bar">
          <div className="left-section">
            <img
              src={song.posterUrl}
              alt={song.title}
              className="album-thumb"
            />
            <div className="song-details">
              <div className="title">{song.title}</div>
              <div className="artist">{song.artist}</div>
            </div>
            <IoHeart className="like-btn" />
          </div>

          <div className="center-controls">
            <div className="main-controls">
              <IoShuffle className="control-icon small" />
              <button onClick={handleBackward} className="control-btn">
                <IoPlaySkipBack />
              </button>
              <button onClick={togglePlay} className="play-btn">
                {isPlaying ? <IoPause /> : <IoPlay />}
              </button>
              <button onClick={handleForward} className="control-btn">
                <IoPlaySkipForward />
              </button>
              <IoRepeat className="control-icon small" />
            </div>
            <div className="progress-container">
              <span className="time-current">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="progress-slider"
              />
              <span className="time-total">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="right-section">
            <IoVolumeHigh className="volume-icon" />
            <input
              type="range"
              min={0}
              max={100}
              value={volume * 100}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
            <IoEllipsisVertical className="more-btn" />
          </div>

          <button
            className="expand-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <IoChevronDown /> : <IoChevronUp />}
          </button>
        </div>

        {/* Expanded overlay */}
        {isExpanded && (
          <div className="expanded-overlay">
            <div className="expanded-content">
              {/* Full album art, lyrics, etc. - same as premium version */}
              <img
                src={song.posterUrl}
                alt={song.title}
                className="expanded-art"
              />
              <div className="expanded-info">
                <h1>{song.title}</h1>
                <p>{song.artist}</p>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="close-expanded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <audio
        ref={audioRef}
        src={song.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
    </>
  );
};

export default Player;
