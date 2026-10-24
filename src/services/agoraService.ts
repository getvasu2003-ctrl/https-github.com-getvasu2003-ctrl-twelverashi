import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
  IAgoraRTCRemoteUser,
  NetworkQuality,
} from 'agora-rtc-sdk-ng';

// Configure log level for Agora SDK
AgoraRTC.setLogLevel(2); // 0: DEBUG, 1: INFO, 2: WARNING, 3: ERROR, 4: NONE

export interface AgoraSessionConfig {
  appId: string;
  channelName: string;
  token: string | null;
  uid: number;
  isLive: boolean;
}

export interface AgoraEventHandlers {
  onRemoteUserJoined?: (user: IAgoraRTCRemoteUser) => void;
  onRemoteUserLeft?: (user: IAgoraRTCRemoteUser) => void;
  onRemoteVideoReady?: (track: IRemoteVideoTrack, user: IAgoraRTCRemoteUser) => void;
  onRemoteAudioReady?: (track: IRemoteAudioTrack, user: IAgoraRTCRemoteUser) => void;
  onNetworkQuality?: (uplink: number, downlink: number) => void;
  onError?: (err: any) => void;
}

class AgoraService {
  private client: IAgoraRTCClient | null = null;
  private localAudioTrack: IMicrophoneAudioTrack | null = null;
  private localVideoTrack: ICameraVideoTrack | null = null;
  private currentChannel: string | null = null;
  private isJoined: boolean = false;
  private isAudioMuted: boolean = false;
  private isVideoMuted: boolean = false;
  private remoteUsers: Map<string | number, IAgoraRTCRemoteUser> = new Map();

  /**
   * Fetches Agora configuration and authentication token from our backend API
   */
  async fetchToken(channelName: string, uid?: number, role: 'publisher' | 'subscriber' = 'publisher'): Promise<AgoraSessionConfig> {
    try {
      const res = await fetch('/api/agora/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelName, uid, role }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('Could not fetch Agora token, falling back to local mode:', err);
      return {
        appId: '',
        channelName,
        token: null,
        uid: uid || Math.floor(100000 + Math.random() * 899999),
        isLive: false,
      };
    }
  }

  /**
   * Checks if Agora is provisioned with a valid App ID
   */
  async checkConfig(): Promise<{ isConfigured: boolean; appId: string; mode: string }> {
    try {
      const res = await fetch('/api/agora/config');
      return await res.json();
    } catch {
      return { isConfigured: false, appId: '', mode: 'simulation' };
    }
  }

  /**
   * Initializes Agora RTC Client and joins an audio/video session
   */
  async joinSession(
    channelName: string,
    options: {
      video: boolean;
      localVideoContainerId?: string;
      handlers?: AgoraEventHandlers;
      role?: 'publisher' | 'subscriber';
    }
  ): Promise<{ success: boolean; isLiveAgora: boolean; error?: string }> {
    try {
      // 1. Clean up any existing session
      await this.leaveSession();

      // 2. Fetch session token and configuration
      const sessionConfig = await this.fetchToken(channelName, undefined, options.role || 'publisher');

      // 3. Create fresh Agora client
      this.client = AgoraRTC.createClient({
        mode: 'rtc',
        codec: 'vp8',
      });

      this.currentChannel = channelName;
      this.remoteUsers.clear();

      // 4. Setup remote event listeners
      this.client.on('user-published', async (user, mediaType) => {
        try {
          await this.client?.subscribe(user, mediaType);
          this.remoteUsers.set(user.uid, user);
          options.handlers?.onRemoteUserJoined?.(user);

          if (mediaType === 'video' && user.videoTrack) {
            options.handlers?.onRemoteVideoReady?.(user.videoTrack, user);
          }
          if (mediaType === 'audio' && user.audioTrack) {
            user.audioTrack.play();
            options.handlers?.onRemoteAudioReady?.(user.audioTrack, user);
          }
        } catch (subErr) {
          console.warn('Error subscribing to remote user:', subErr);
        }
      });

      this.client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'video') {
          // video track stopped
        }
      });

      this.client.on('user-left', (user) => {
        this.remoteUsers.delete(user.uid);
        options.handlers?.onRemoteUserLeft?.(user);
      });

      this.client.on('network-quality', (stats) => {
        options.handlers?.onNetworkQuality?.(stats.uplinkNetworkQuality, stats.downlinkNetworkQuality);
      });

      // 5. If Agora is configured with a real App ID, join the live Agora cluster
      if (sessionConfig.isLive && sessionConfig.appId) {
        await this.client.join(
          sessionConfig.appId,
          sessionConfig.channelName,
          sessionConfig.token,
          sessionConfig.uid
        );
        this.isJoined = true;
      }

      // 6. Request local media (Microphone and optional Camera)
      try {
        if (options.video) {
          const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
            { AEC: true, ANS: true },
            { encoderConfig: '720p_1' }
          );
          this.localAudioTrack = audioTrack;
          this.localVideoTrack = videoTrack;

          // Play local video in the local container element if provided
          if (options.localVideoContainerId) {
            const container = document.getElementById(options.localVideoContainerId);
            if (container) {
              this.localVideoTrack.play(container);
            }
          }

          // If connected to live Agora channel, publish tracks
          if (this.isJoined && this.client) {
            await this.client.publish([this.localAudioTrack, this.localVideoTrack]);
          }
        } else {
          // Audio only mode
          this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
            AEC: true,
            ANS: true,
          });

          if (this.isJoined && this.client) {
            await this.client.publish([this.localAudioTrack]);
          }
        }
      } catch (mediaErr: any) {
        console.warn('Local media hardware permission skipped or denied:', mediaErr?.message || mediaErr);
        // Do not crash the call; allow seeker to continue in listening/viewing mode
      }

      return {
        success: true,
        isLiveAgora: this.isJoined,
      };
    } catch (err: any) {
      console.warn('Agora session initialization warning:', err?.message || err);
      options.handlers?.onError?.(err);
      return {
        success: false,
        isLiveAgora: false,
        error: err?.message || 'Failed to start RTC session',
      };
    }
  }

  /**
   * Plays local video track inside an HTML container element
   */
  playLocalVideo(containerId: string) {
    if (this.localVideoTrack) {
      const container = document.getElementById(containerId);
      if (container) {
        try {
          this.localVideoTrack.play(container);
        } catch (e) {
          console.warn('Error playing local video track:', e);
        }
      }
    }
  }

  /**
   * Toggles microphone mute state
   */
  async toggleMute(): Promise<boolean> {
    if (!this.localAudioTrack) return this.isAudioMuted;
    this.isAudioMuted = !this.isAudioMuted;
    await this.localAudioTrack.setEnabled(!this.isAudioMuted);
    return this.isAudioMuted;
  }

  /**
   * Toggles camera video mute state
   */
  async toggleVideo(): Promise<boolean> {
    if (!this.localVideoTrack) return this.isVideoMuted;
    this.isVideoMuted = !this.isVideoMuted;
    await this.localVideoTrack.setEnabled(!this.isVideoMuted);
    return this.isVideoMuted;
  }

  /**
   * Returns current mute statuses
   */
  getMuteStates() {
    return {
      isAudioMuted: this.isAudioMuted,
      isVideoMuted: this.isVideoMuted,
      hasAudioTrack: Boolean(this.localAudioTrack),
      hasVideoTrack: Boolean(this.localVideoTrack),
      isJoined: this.isJoined,
    };
  }

  /**
   * Leaves session and frees camera & microphone resources cleanly
   */
  async leaveSession() {
    try {
      if (this.localAudioTrack) {
        this.localAudioTrack.stop();
        this.localAudioTrack.close();
        this.localAudioTrack = null;
      }

      if (this.localVideoTrack) {
        this.localVideoTrack.stop();
        this.localVideoTrack.close();
        this.localVideoTrack = null;
      }

      if (this.client) {
        if (this.isJoined) {
          await this.client.leave();
        }
        this.client.removeAllListeners();
        this.client = null;
      }

      this.isJoined = false;
      this.currentChannel = null;
      this.remoteUsers.clear();
      this.isAudioMuted = false;
      this.isVideoMuted = false;
    } catch (e) {
      console.warn('Error during Agora session leave:', e);
    }
  }
}

export const agoraService = new AgoraService();
