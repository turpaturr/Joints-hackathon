import { colors, radius, spacing, typography } from '@/theme';
import { Calendar, CheckCircle2, ChevronRight, Repeat } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

const cardBackground = require('@/assets/images/therapy-card-bg.png');

interface TherapyProgressCardProps {
  title: string;
  time?: string;
  currentDay: number;
  totalDays: number;
  frequency: string;
  percent?: number;
  dateRange?: string;
  hasPrescription?: boolean;
  onPress?: () => void;
}

const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}.${minutes}`; // Formats as HH.mm (e.g., 08.00)
};

export function TherapyProgressCard({
  title,
  time: propTime,
  currentDay,
  totalDays,
  frequency,
  percent: propPercent,
  dateRange,
  hasPrescription = true,
  onPress,
}: TherapyProgressCardProps) {
  const [currentTime, setCurrentTime] = useState(getCurrentTime);

  useEffect(() => {
    // If a static time was passed as a prop, don't run the live timer
    if (propTime) return;

    // Update time immediately and setup a 60s interval
    setCurrentTime(getCurrentTime());
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000);

    return () => clearInterval(interval);
  }, [propTime]);

  const displayTime = propTime ?? currentTime;

  const percent =
    propPercent !== undefined
      ? propPercent
      : totalDays > 0
        ? Math.min(100, Math.max(0, Math.round((currentDay / totalDays) * 100)))
        : 0;

  const content = (
    <ImageBackground
      source={cardBackground}
      resizeMode="cover"
      style={{ borderRadius: radius.lg, overflow: 'hidden' }}
    >
      {/* Scrim for text legibility */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(8, 28, 92, 0.45)',
        }}
      />

      <View style={{ padding: spacing.md }}>
        {/* Today's session */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text
              style={{ ...typography.caption, color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}
            >
              {hasPrescription ? 'Terapi Hari Ini' : 'Program Terapi'}
            </Text>
            {dateRange ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: radius.full,
                  backgroundColor: 'rgba(255,255,255,0.18)',
                }}
              >
                <Calendar size={11} color="rgba(255,255,255,0.9)" />
                <Text style={{ ...typography.caption, color: 'rgba(255,255,255,0.9)', fontSize: 11 }}>
                  {dateRange}
                </Text>
              </View>
            ) : null}
          </View>

          <View
            style={{
              paddingHorizontal: spacing.sm + 2,
              paddingVertical: spacing.xs,
              borderRadius: radius.full,
              backgroundColor: 'rgba(255,255,255,0.22)',
            }}
          >
            <Text style={{ ...typography.label, color: colors.white }}>
              {displayTime}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs }}>
          <Text
            style={{
              ...typography.h1,
              color: colors.white,
              flex: 1,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          {onPress && (
            <ChevronRight size={20} color="rgba(255,255,255,0.8)" style={{ marginLeft: spacing.xs }} />
          )}
        </View>

        {/* Progress: the focal point */}
        <View style={{ marginTop: spacing.lg }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ ...typography.display, color: colors.white }}>
                {currentDay}
              </Text>
              <Text
                style={{
                  ...typography.body,
                  color: 'rgba(255,255,255,0.85)',
                  marginLeft: spacing.xs,
                }}
              >
                / {totalDays} hari
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {percent >= 100 && <CheckCircle2 size={16} color={colors.accentLime} />}
              <Text style={{ ...typography.h2, color: colors.accentLime }}>
                {percent}%
              </Text>
            </View>
          </View>

          <View
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={`Hari ke-${currentDay} dari ${totalDays}`}
            accessibilityValue={{ min: 0, max: totalDays, now: currentDay }}
            style={{
              height: 10,
              borderRadius: radius.full,
              backgroundColor: 'rgba(255,255,255,0.25)',
              marginTop: spacing.sm,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                width: `${percent}%`,
                height: '100%',
                borderRadius: radius.full,
                backgroundColor: colors.accentLime,
              }}
            />
          </View>
        </View>

        {/* Frequency footer */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: spacing.md,
            paddingTop: spacing.md,
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.2)',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Repeat size={14} color="rgba(255,255,255,0.85)" />
            <Text
              style={{
                ...typography.caption,
                color: 'rgba(255,255,255,0.9)',
                marginLeft: spacing.sm,
              }}
            >
              Frekuensi {frequency}
            </Text>
          </View>

          {onPress && (
            <Text
              style={{
                ...typography.caption,
                color: colors.accentLime,
                fontWeight: '600',
              }}
            >
              Mulai Terapi →
            </Text>
          )}
        </View>
      </View>
    </ImageBackground>
  );

  return (
    <View
      style={{
        borderRadius: radius.lg,
        shadowColor: colors.primaryDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 14,
        elevation: 4,
      }}
    >
      {onPress ? (
        <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}
    </View>
  );
}