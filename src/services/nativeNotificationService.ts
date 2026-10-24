/**
 * Native Device Push & In-App Notification Service for 12Rashi
 * Handles Web Push API, Notification API, Service Worker ShowNotification,
 * Daily Horoscope Push Delivery, and Automated Consultation Slot Reminders.
 */

import { RASHIS_DATA } from '../data/horoscopeData.ts';
import { ScheduledBooking } from '../types/astrology.ts';

export interface NativeNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  url?: string;
  data?: any;
  requireInteraction?: boolean;
  actions?: Array<{ action: string; title: string }>;
}

class NativeNotificationService {
  private schedulerInterval: number | null = null;
  private alertedConsultationsKey = '12rashi_alerted_consultation_slots';
  private lastDailyHoroscopeDateKey = '12rashi_last_horoscope_push_date';

  /**
   * Check if the device's native notification API is supported
   */
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  /**
   * Get the current native permission status
   */
  public getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }

  /**
   * Request native notification permission from the user
   */
  public async requestPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (!this.isSupported()) return 'unsupported';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (err) {
      console.warn('[NativeNotificationService] Permission request failed:', err);
      return Notification.permission;
    }
  }

  /**
   * Send a native device notification using Service Worker or fallback
   */
  public async sendNotification(payload: NativeNotificationPayload): Promise<boolean> {
    if (!this.isSupported()) {
      console.log('[NativeNotificationService] Notifications not supported in environment.');
      return false;
    }

    // If permission is not yet decided, attempt to ask
    let currentPerm: NotificationPermission | 'unsupported' = Notification.permission;
    if (currentPerm === 'default') {
      currentPerm = await this.requestPermission();
    }

    if (currentPerm !== 'granted') {
      console.warn('[NativeNotificationService] Permission denied or dismissed.');
      return false;
    }

    const title = payload.title;
    const options: NotificationOptions = {
      body: payload.body,
      icon: payload.icon || '/icons/icon-192.png',
      badge: payload.badge || '/icons/icon-192.png',
      tag: payload.tag || '12rashi-alert',
      data: {
        url: payload.url || '/',
        ...payload.data,
      },
      requireInteraction: Boolean(payload.requireInteraction),
    };

    // Attempt Service Worker showNotification first (best for mobile and Android PWA)
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration && registration.showNotification) {
          await registration.showNotification(title, options);
          return true;
        }
      } catch (swErr) {
        console.warn('[NativeNotificationService] SW showNotification failed, using fallback:', swErr);
      }
    }

    // Fallback: Standard window Notification constructor
    try {
      const notif = new Notification(title, options);
      if (payload.url) {
        notif.onclick = () => {
          window.focus();
          window.location.href = payload.url!;
          notif.close();
        };
      }
      return true;
    } catch (notifErr) {
      console.warn('[NativeNotificationService] Direct Notification creation failed:', notifErr);
      return false;
    }
  }

  /**
   * Deliver Native Push Notification for Daily Horoscope
   */
  public async deliverDailyHoroscopePush(targetRashi: string = 'Leo'): Promise<boolean> {
    // Locate Rashi data
    const normalized = targetRashi.toLowerCase().replace(/[^a-z]/g, '');
    const foundRashi =
      RASHIS_DATA.find(
        (r) =>
          r.nameEn.toLowerCase().includes(normalized) ||
          r.id.toLowerCase().includes(normalized) ||
          normalized.includes(r.id)
      ) || RASHIS_DATA[4]; // Default to Leo (Simha)

    const title = `✨ Today's Horoscope: ${foundRashi.nameEn} (${foundRashi.nameHi})`;
    const body = `${foundRashi.today.summary}\n🍀 Lucky Color: ${foundRashi.today.luckyColor} • Lucky No: ${foundRashi.today.luckyNumber} • Best Time: ${foundRashi.today.luckyTime}`;

    const sent = await this.sendNotification({
      title,
      body,
      tag: `daily-horoscope-${foundRashi.id}`,
      url: `/?tab=horoscope&rashi=${foundRashi.id}`,
      data: { rashi: foundRashi.id, type: 'daily_horoscope' },
      requireInteraction: false,
    });

    if (sent) {
      const todayStr = new Date().toDateString();
      try {
        localStorage.setItem(this.lastDailyHoroscopeDateKey, todayStr);
      } catch {}
    }

    return sent;
  }

  /**
   * Deliver Native Push Notification for a Scheduled Consultation
   */
  public async deliverConsultationNotification(
    booking: ScheduledBooking,
    reminderType: 'confirmed' | 'upcoming_15m' | 'starting_now'
  ): Promise<boolean> {
    let title = '';
    let body = '';
    let tag = `consultation-${booking.id}-${reminderType}`;

    if (reminderType === 'confirmed') {
      title = `📅 Consultation Confirmed: ${booking.astrologerName}`;
      body = `Your ${booking.durationMins}-min ${booking.type.toUpperCase()} session is secured for ${booking.date} at ${booking.timeSlot}.`;
    } else if (reminderType === 'upcoming_15m') {
      title = `🔔 Consultation in 15 Mins: ${booking.astrologerName}`;
      body = `Your private ${booking.type.toUpperCase()} session starts at ${booking.timeSlot}. Tap here to prepare your chart and enter.`;
    } else {
      title = `🔴 Consultation Starting Now: ${booking.astrologerName}`;
      body = `Your consultation room is open! Tap to connect with ${booking.astrologerName} immediately.`;
    }

    return this.sendNotification({
      title,
      body,
      tag,
      url: `/?tab=consultations&bookingId=${booking.id}`,
      data: { bookingId: booking.id, type: 'consultation_reminder', reminderType },
      requireInteraction: reminderType !== 'confirmed',
    });
  }

  /**
   * Background monitoring engine: checks upcoming consultations and morning horoscope
   */
  public startBackgroundScheduler(
    getBookings: () => ScheduledBooking[],
    getUserRashi: () => string,
    getMorningPushConfig: () => { enabled: boolean; timeSlot: string }
  ) {
    if (this.schedulerInterval) return;

    // Run every 60 seconds
    this.schedulerInterval = window.setInterval(() => {
      this.checkConsultationReminders(getBookings);
      this.checkDailyHoroscopeSchedule(getUserRashi, getMorningPushConfig);
    }, 60000);

    // Initial check on launch
    setTimeout(() => {
      this.checkConsultationReminders(getBookings);
      this.checkDailyHoroscopeSchedule(getUserRashi, getMorningPushConfig);
    }, 3000);
  }

  public stopBackgroundScheduler() {
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
    }
  }

  /**
   * Check if any upcoming booked consultations are approaching within 15 minutes
   */
  private checkConsultationReminders(getBookings: () => ScheduledBooking[]) {
    try {
      const bookings = getBookings();
      if (!bookings || bookings.length === 0) return;

      const alertedRaw = localStorage.getItem(this.alertedConsultationsKey);
      const alertedIds: string[] = alertedRaw ? JSON.parse(alertedRaw) : [];

      const now = new Date();
      const todayStr = now.toDateString();

      bookings.forEach((b) => {
        if (b.status === 'CANCELLED') return;

        // Check if date matches today or contains "Today"
        const isToday =
          b.date.toLowerCase().includes('today') ||
          new Date(b.date).toDateString() === todayStr;

        if (isToday) {
          const alert15mKey = `${b.id}_15m`;
          const alertNowKey = `${b.id}_now`;

          // Parse start time (e.g. "11:00 AM - 11:30 AM")
          const timeParts = b.timeSlot.split('-');
          if (timeParts.length > 0) {
            const startTimeStr = timeParts[0].trim(); // "11:00 AM"
            const slotDate = new Date();
            const [timeStr, modifier] = startTimeStr.split(' ');
            if (timeStr && modifier) {
              let [hours, minutes] = timeStr.split(':').map(Number);
              if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
              if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
              slotDate.setHours(hours, minutes, 0, 0);

              const diffMins = (slotDate.getTime() - now.getTime()) / (1000 * 60);

              // 15-minute reminder window: 0 to 18 mins before start
              if (diffMins > 0 && diffMins <= 18 && !alertedIds.includes(alert15mKey)) {
                this.deliverConsultationNotification(b, 'upcoming_15m');
                alertedIds.push(alert15mKey);
                localStorage.setItem(this.alertedConsultationsKey, JSON.stringify(alertedIds));
              }

              // Starting now reminder window: -5 to +5 mins
              if (diffMins >= -5 && diffMins <= 2 && !alertedIds.includes(alertNowKey)) {
                this.deliverConsultationNotification(b, 'starting_now');
                alertedIds.push(alertNowKey);
                localStorage.setItem(this.alertedConsultationsKey, JSON.stringify(alertedIds));
              }
            }
          }
        }
      });
    } catch (err) {
      console.warn('[NativeNotificationService] Consultation check error:', err);
    }
  }

  /**
   * Check if daily horoscope should be pushed according to user's morning time slot
   */
  private checkDailyHoroscopeSchedule(
    getUserRashi: () => string,
    getMorningPushConfig: () => { enabled: boolean; timeSlot: string }
  ) {
    try {
      const config = getMorningPushConfig();
      if (!config || !config.enabled) return;

      const now = new Date();
      const todayStr = now.toDateString();
      const lastSentDate = localStorage.getItem(this.lastDailyHoroscopeDateKey);

      if (lastSentDate === todayStr) {
        return; // Already delivered today
      }

      // Check current hour vs user's configured morning timeSlot (e.g. "06:30" or "07:00")
      const [targetHour, targetMinute] = (config.timeSlot || '06:30').split(':').map(Number);
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Trigger if current time is equal or past the configured morning slot
      if (
        currentHour > targetHour ||
        (currentHour === targetHour && currentMinute >= targetMinute)
      ) {
        const rashi = getUserRashi() || 'Leo';
        this.deliverDailyHoroscopePush(rashi);
      }
    } catch (err) {
      console.warn('[NativeNotificationService] Daily horoscope schedule check error:', err);
    }
  }
}

export const nativeNotificationService = new NativeNotificationService();
