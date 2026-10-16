import { Platform } from 'react-native';
import { MedicationSchedule } from './medication.service';
import type * as Notifications from 'expo-notifications';

export const MEDICATION_NOTIFICATION_CHANNEL = 'medication-reminders';
const REMINDER_OFFSETS = [60, 45, 30, 15] as const;
const MAX_SCHEDULED_NOTIFICATIONS = 450;
const SCHEDULE_WINDOW_DAYS = 7;

type NotificationsModule = typeof Notifications;

async function getNotificationsModule(): Promise<NotificationsModule> {
  try {
    const notifications = await import('expo-notifications');
    notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    return notifications;
  } catch {
    throw new Error(
      'Pengingat belum tersedia di aplikasi ini. Gunakan development build Android/iOS, bukan Expo Go.',
    );
  }
}

function datePart(value: string): string {
  return value.slice(0, 10);
}

function localDateFromParts(dateValue: string, timeValue: string): Date | null {
  const date = datePart(dateValue);
  const timeMatch = /^(\d{1,2}):(\d{2})/.exec(timeValue.trim());
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!dateMatch || !timeMatch) return null;

  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  if (hour > 23 || minute > 59) return null;

  return new Date(
    Number(dateMatch[1]),
    Number(dateMatch[2]) - 1,
    Number(dateMatch[3]),
    hour,
    minute,
  );
}

function formatReminderDate(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function formatReminderTime(date: Date): string {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function prepareNotificationPermissions(
  notifications: NotificationsModule,
): Promise<boolean> {
  if (Platform.OS === 'android') {
    await notifications.setNotificationChannelAsync(MEDICATION_NOTIFICATION_CHANNEL, {
      name: 'Pengingat minum obat',
      importance: notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const current = await notifications.getPermissionsAsync();
  if (current.status === 'granted') return true;

  const requested = await notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

function getScheduleDates(schedule: MedicationSchedule): Date[] {
  const start = datePart(schedule.startDate);
  const end = datePart(schedule.endDate);
  const startMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(start);
  const endMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(end);
  if (!startMatch || !endMatch) return [];

  const dates: Date[] = [];
  const cursor = new Date(
    Number(startMatch[1]),
    Number(startMatch[2]) - 1,
    Number(startMatch[3]),
  );
  const lastDate = new Date(
    Number(endMatch[1]),
    Number(endMatch[2]) - 1,
    Number(endMatch[3]),
  );
  const windowEnd = new Date();
  windowEnd.setHours(23, 59, 59, 999);
  windowEnd.setDate(windowEnd.getDate() + SCHEDULE_WINDOW_DAYS);
  const effectiveLastDate = lastDate < windowEnd ? lastDate : windowEnd;

  while (cursor <= effectiveLastDate) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export async function scheduleMedicationReminders(
  schedules: MedicationSchedule[],
): Promise<number> {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') return 0;

  const notifications = await getNotificationsModule();
  const permissionGranted = await prepareNotificationPermissions(notifications);
  if (!permissionGranted) {
    throw new Error(
      'Izin notifikasi belum diberikan. Aktifkan izin notifikasi agar pengingat obat muncul.',
    );
  }

  await notifications.cancelAllScheduledNotificationsAsync();

  const reminderJobs: {
    schedule: MedicationSchedule;
    medicationTime: Date;
    reminderTime: Date;
    offsetMinutes: number;
  }[] = [];
  const now = new Date();

  for (const schedule of schedules) {
    for (const date of getScheduleDates(schedule)) {
      for (const time of schedule.timeToTake ?? []) {
        const medicationTime = localDateFromParts(
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
            date.getDate(),
          ).padStart(2, '0')}`,
          time,
        );
        if (!medicationTime) continue;

        for (const offsetMinutes of REMINDER_OFFSETS) {
          const reminderTime = new Date(
            medicationTime.getTime() - offsetMinutes * 60 * 1000,
          );
          if (reminderTime <= now) continue;

          reminderJobs.push({
            schedule,
            medicationTime,
            reminderTime,
            offsetMinutes,
          });
        }
      }
    }
  }

  reminderJobs.sort(
    (first, second) => first.reminderTime.getTime() - second.reminderTime.getTime(),
  );

  let scheduledCount = 0;
  for (const job of reminderJobs.slice(0, MAX_SCHEDULED_NOTIFICATIONS)) {
    try {
      await notifications.scheduleNotificationAsync({
        content: {
          title: 'Waktunya bersiap minum obat',
          body: `${job.schedule.medicationName} (${
            job.schedule.dosage
          }) dijadwalkan pukul ${formatReminderTime(job.medicationTime)}.\n${
            formatReminderDate(job.medicationTime)
          } — tinggal ${job.offsetMinutes} menit lagi.`,
          data: {
            screen: '/medication',
            scheduleId: job.schedule.id,
            medicationTime: job.medicationTime.toISOString(),
          },
        },
        trigger: {
          type: notifications.SchedulableTriggerInputTypes.DATE,
          date: job.reminderTime,
          channelId: MEDICATION_NOTIFICATION_CHANNEL,
        },
      });
      scheduledCount += 1;
    } catch (scheduleError) {
      if (
        scheduleError instanceof Error &&
        scheduleError.message.toLowerCase().includes('maximum limit')
      ) {
        break;
      }
      throw scheduleError;
    }
  }

  return scheduledCount;
}
