import { Button } from '@/components/Button';
import { authStore } from '@/services/AuthServices/authStore';
import {
  getConsultation,
  type Consultation,
} from '@/services/consultation.service';
import { colors, radius, spacing, typography } from '@/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MessageCircle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const statusLabel: Record<Consultation['status'], string> = {
  PENDING: 'Menunggu dokter',
  IN_PROGRESS: 'Sedang ditangani',
  RESOLVED: 'Selesai',
};

function formatDate(value: string) {
  return new Date(value).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ConsultationDetailScreen() {
  const { consultationId } = useLocalSearchParams<{ consultationId: string }>();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!authStore.token || !consultationId) {
        setError('Sesi atau data konsultasi tidak ditemukan.');
        setLoading(false);
        return;
      }
      try {
        const result = await getConsultation(consultationId, authStore.token);
        if (active) setConsultation(result);
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Detail konsultasi gagal dimuat.',
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [consultationId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgBase }}>
      <View style={{ paddingHorizontal: spacing.screenPadding, paddingTop: spacing.md }}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.lg }}
        >
          <ArrowLeft size={20} color={colors.primary} />
          <Text style={{ ...typography.bodyMedium, color: colors.primary }}>Kembali</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : error ? (
          <Text style={{ ...typography.body, color: colors.danger }}>{error}</Text>
        ) : consultation ? (
          <View
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: radius.lg,
              padding: spacing.md,
            }}
          >
            <Text style={{ ...typography.label, color: colors.primary }}>
              {statusLabel[consultation.status] ?? consultation.status}
            </Text>
            <Text style={{ ...typography.display, color: colors.textPrimary, marginTop: spacing.xs }}>
              {consultation.subject}
            </Text>
            <Text style={{ ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs }}>
              Dikirim {formatDate(consultation.createdAt)}
            </Text>

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.md }} />
            <Text style={{ ...typography.h2, color: colors.textPrimary }}>Keluhan</Text>
            <Text style={{ ...typography.body, color: colors.textSecondary, marginTop: spacing.xs }}>
              {consultation.description}
            </Text>

            {(consultation.location || consultation.painScale) && (
              <View style={{ marginTop: spacing.md, gap: spacing.xs }}>
                {consultation.location ? (
                  <Text style={{ ...typography.caption, color: colors.textSecondary }}>
                    Lokasi keluhan: {consultation.location}
                  </Text>
                ) : null}
                {consultation.painScale ? (
                  <Text style={{ ...typography.caption, color: colors.textSecondary }}>
                    Skala nyeri: {consultation.painScale}/10
                  </Text>
                ) : null}
              </View>
            )}

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.md }} />
            <Text style={{ ...typography.h2, color: colors.textPrimary }}>Tanggapan dokter</Text>
            {consultation.response ? (
              <Text style={{ ...typography.body, color: colors.textSecondary, marginTop: spacing.xs }}>
                {consultation.response}
              </Text>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm }}>
                <MessageCircle size={18} color={colors.textSecondary} />
                <Text style={{ ...typography.caption, color: colors.textSecondary }}>
                  Dokter belum memberikan tanggapan.
                </Text>
              </View>
            )}

            {consultation.nakes ? (
              <Text style={{ ...typography.caption, color: colors.textSecondary, marginTop: spacing.md }}>
                Dokter: {consultation.nakes.namaLengkap}
                {consultation.nakes.spesialisasi ? ` · ${consultation.nakes.spesialisasi}` : ''}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
