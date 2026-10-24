import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { agoraService } from '../../services/agoraService.ts';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  SwitchCamera,
  Shield,
  Compass,
  Radio,
  Wifi,
  Volume2,
} from 'lucide-react';

export const VideoCallModal: React.FC = () => {
  const { activeConsultation, endConsultation, walletBalance, currentKundli, userProfile } = useApp();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isLiveAgora, setIsLiveAgora] = useState(false);
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
  const [networkQuality, setNetworkQuality] = useState<{ uplink: number; downlink: number }>({ uplink: 1, downlink: 1 });
  const [channelName, setChannelName] = useState<string>('');

  useEffect(() => {
    if (!activeConsultation || activeConsultation.type !== 'video') return;

    const channel = `channel_video_${activeConsultation.astrologer.id}`;
    setChannelName(channel);

    let isMounted = true;

    const initAgora = async () => {
      // Small tick to ensure container elements are in DOM
      setTimeout(async () => {
        if (!isMounted) return;

        const res = await agoraService.joinSession(channel, {
          video: true,
          localVideoContainerId: 'agora-local-video-container',
          handlers: {
            onRemoteUserJoined: (user) => {
              console.log('Agora: Remote user joined session', user.uid);
            },
            onRemoteVideoReady: (track, user) => {
              console.log('Agora: Remote video track ready from', user.uid);
              setHasRemoteVideo(true);
              const remoteContainer = document.getElementById('agora-remote-video-container');
              if (remoteContainer) {
                track.play(remoteContainer);
              }
            },
            onRemoteAudioReady: (track) => {
              console.log('Agora: Remote audio track playing');
            },
            onRemoteUserLeft: () => {
              setHasRemoteVideo(false);
            },
            onNetworkQuality: (uplink, downlink) => {
              setNetworkQuality({ uplink, downlink });
            },
          },
        });

        if (isMounted) {
          setIsLiveAgora(res.isLiveAgora);
        }
      }, 100);
    };

    initAgora();

    return () => {
      isMounted = false;
      agoraService.leaveSession();
    };
  }, [activeConsultation]);

  if (!activeConsultation || activeConsultation.type !== 'video') return null;

  const { astrologer, elapsedSeconds } = activeConsultation;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleToggleMute = async () => {
    const muted = await agoraService.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleVideo = async () => {
    const videoMuted = await agoraService.toggleVideo();
    setIsVideoOn(!videoMuted);
  };

  const handleHangup = async () => {
    await agoraService.leaveSession();
    endConsultation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-stone-900 border border-orange-500/40 rounded-3xl w-full max-w-4xl h-[88vh] flex flex-col overflow-hidden text-white shadow-2xl relative animate-in fade-in zoom-in-95">
        {/* Top Video Overlay Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Agora RTC Live</span>
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-black/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>Room: {channelName}</span>
            </span>

            <span className="text-xs text-stone-200 font-medium hidden md:inline">
              {astrologer.name} ({astrologer.title})
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-black/60 px-3 py-1 rounded-full border border-white/20 font-mono text-xs sm:text-sm font-bold text-amber-300">
              {formatTimer(elapsedSeconds)}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold bg-orange-600/90 px-2.5 py-1 rounded-full whitespace-nowrap">
              ₹{astrologer.videoRate}/m • Bal: ₹{walletBalance}
            </div>
          </div>
        </div>

        {/* Video Canvas Area */}
        <div className="relative flex-1 bg-stone-950 flex items-center justify-center overflow-hidden">
          {/* Container for Remote Video stream if published */}
          <div
            id="agora-remote-video-container"
            className={`w-full h-full absolute inset-0 z-10 ${hasRemoteVideo ? 'block' : 'hidden'}`}
          />

          {/* Astrologer Sanctuary Feed (When awaiting remote peer stream or in sanctum mode) */}
          <div className="w-full h-full relative flex items-center justify-center">
            <img
              src={astrologer.avatar}
              alt={astrologer.name}
              className="w-full h-full object-cover opacity-85 filter brightness-95"
            />
            {/* Soft sacred temple glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />

            <div className="absolute bottom-6 left-6 z-20 bg-black/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 max-w-xs shadow-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="text-sm font-bold text-white">{astrologer.name}</h4>
              </div>
              <p className="text-[11px] text-amber-200 mt-0.5 flex items-center gap-1">
                <span>Vedic Sanctum, Varanasi</span>
                <span>•</span>
                <span className="text-emerald-300">Live Agora Stream</span>
              </p>
            </div>
          </div>

          {/* User PiP Video Container (Real Webcam via Agora) */}
          <div className="absolute top-18 right-4 sm:right-6 w-32 sm:w-44 h-44 sm:h-56 rounded-2xl overflow-hidden border-2 border-orange-500 bg-stone-900 shadow-2xl z-30 flex flex-col justify-end p-2">
            {/* Real Agora Local Video container where webcam track plays */}
            <div
              id="agora-local-video-container"
              className={`absolute inset-0 w-full h-full object-cover ${isVideoOn ? 'block' : 'hidden'}`}
            />

            {!isVideoOn && (
              <div className="absolute inset-0 bg-stone-950 flex flex-col items-center justify-center text-xs text-stone-400 gap-1.5">
                <VideoOff className="w-5 h-5 text-stone-500" />
                <span>Camera Off</span>
              </div>
            )}

            <div className="relative z-10 flex items-center justify-between text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
              <span>{userProfile.name} (You)</span>
              {isMuted && <MicOff className="w-3 h-3 text-red-400" />}
            </div>
          </div>

          {/* Side Floating Kundli Pill */}
          {currentKundli && (
            <div className="hidden lg:flex absolute top-18 left-6 z-20 bg-black/70 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-xs text-stone-200 flex-col gap-1 max-w-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold border-b border-white/10 pb-1">
                <Compass className="w-4 h-4 text-orange-400" />
                <span>Client Chart: {currentKundli.name}</span>
              </div>
              <div>Lagna: <strong>{currentKundli.ascendant}</strong></div>
              <div>Moon: <strong>{currentKundli.moonSign}</strong></div>
              <div>Dasha: <strong>{currentKundli.vimshottariDasha.mahadasha}</strong></div>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-center gap-4 sm:gap-6 shrink-0 relative z-30">
          {/* Mute/Unmute Mic */}
          <button
            onClick={handleToggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${
              isMuted ? 'bg-red-600 text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Camera On/Off */}
          <button
            onClick={handleToggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${
              !isVideoOn ? 'bg-red-600 text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
            title={isVideoOn ? 'Turn Camera Off' : 'Turn Camera On'}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={handleHangup}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition transform hover:scale-105 cursor-pointer ring-4 ring-red-600/30"
            title="End Consultation"
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          {/* Switch Camera */}
          <button
            onClick={() => agoraService.playLocalVideo('agora-local-video-container')}
            className="w-12 h-12 rounded-full bg-stone-800 text-stone-300 hover:bg-stone-700 flex items-center justify-center transition cursor-pointer"
            title="Refresh Camera Stream"
          >
            <SwitchCamera className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
