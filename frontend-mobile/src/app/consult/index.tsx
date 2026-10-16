import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { authStore } from '@/services/AuthServices/authStore';
import {
  createConsultation,
  getConsultations,
  type Consultation,
} from '@/services/consultation.service';
import { colors, radius, spacing, typography } from '@/theme';
import { router, useFocusEffect } from 'expo-router';
import { ArrowLeft, MessageCircle, Plus, X } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const statusLabel: Record<Consultation['status'], string> = {
  PENDING: 'Menunggu dokter',
  IN_PROGRESS: 'Sedang ditangani',
  RESOLVED: 'Selesai',
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ConsultationsScreen() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [painScale, setPainScale] = useState('');
  const [error, setError] = useState('');

  const loadConsultations = useCallback(async () => {
    if (!authStore.token) {
      setError('Sesi login tidak ditemukan. Silakan masuk kembali.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      setConsultations(await getConsultations(authStore.token));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Konsultasi gagal dimuat. Coba lagi.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadConsultations();
    }, [loadConsultations]),
  );

  const submitConsultation = async () => {
    if (!subject.trim() || !description.trim()) {
      setError('Judul dan cerita keluhan wajib diisi.');
      return;
    }
    if (painScale && (!Number.isInteger(Number(painScale)) || Number(painScale) < 1 || Number(painScale) > 10)) {
      setError('Skala nyeri harus berupa angka 1 sampai 10.');
      return;
    }
    if (!authStore.token) {
      setError('Sesi login tidak ditemukan. Silakan masuk kembali.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const consultation = await createConsultation(
        {
          subject: subject.trim(),
          description: description.trim(),
          location: location.trim() || null,
          painScale: painScale ? Number(painScale) : null,
        },
        authStore.token,
      );
      setSubject('');
      setDescription('');
      setLocation('');
      setPainScale('');
      setShowForm(false);
      router.push(`/consult/${consultation.id}`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Konsultasi gagal dikirim. Coba lagi.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgBase }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.screenPadding,
          paddingTop: spacing.lg,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing.lg,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ ...typography.display, color: colors.textPrimary }}>
              Konsultasi
            </Text>
            <Text style={{ ...typography.caption, color: colors.textSecondary }}>
              Sampaikan keluhan dan pantau tindak lanjut dokter.
            </Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={showForm ? 'Tutup formulir' : 'Buat konsultasi'}
            onPress={() => {
              setShowForm(!showForm);
              setError('');
            }}
            style={{
              width: 46,
              height: 46,
              borderRadius: radius.full,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: spacing.sm,
            }}
          >
            {showForm ? <X size={22} color={colors.white} /> : <Plus size={22} color={colors.white} />}
          </TouchableOpacity>
        </View>

        {showForm && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: radius.lg,
              padding: spacing.md,
              marginBottom: spacing.lg,
            }}
          >
            <Text style={{ ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md }}>
              Ceritakan keluhanmu
            </Text>
            <Input
              label="Judul keluhan"
              value={subject}
              onChangeText={setSubject}
              placeholder="Contoh: Nyeri lutut setelah latihan"
              maxLength={120}
              returnKeyType="next"
            />
            <Text style={{ ...typography.label, color: colors.textPrimary, marginBottom: spacing.xs }}>
              Detail keluhan
            </Text>
            <TextInput
              accessibilityLabel="Detail keluhan"
              value={description}
              onChangeText={setDescription}
              placeholder="Jelaskan gejala, kapan mulai, dan apa yang memperburuknya"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={3000}
              style={{
                minHeight: 120,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: '#F1F5F8',
                borderRadius: radius.sm,
                padding: spacing.md,
                color: colors.textPrimary,
                ...typography.body,
                marginBottom: spacing.md,
              }}
            />
            <Input
              label="Lokasi keluhan (opsional)"
              value={location}
              onChangeText={setLocation}
              placeholder="Contoh: Lutut kanan"
              maxLength={120}
            />
            <Input
              label="Skala nyeri 1–10 (opsional)"
              value={painScale}
              onChangeText={setPainScale}
              placeholder="Misalnya 5"
              keyboardType="number-pad"
              maxLength={2}
            />
            {error ? (
              <Text accessibilityRole="alert" style={{ ...typography.caption, color: colors.danger, marginBottom: spacing.sm }}>
                {error}
              </Text>
            ) : null}
            <Button
              title="Kirim konsultasi"
              onPress={() => void submitConsultation()}
              loading={submitting}
              disabled={submitting}
            />
          </View>
        )}

        {!showForm && error ? (
          <Text style={{ ...typography.caption, color: colors.danger, marginBottom: spacing.md }}>
            {error}
          </Text>
        ) : null}

        {loading ? (
          <View style={{ padding: spacing.xl, alignItems: 'center' }}>
            <ActivityIndicator color={colors.primary} />
            <Text style={{ ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm }}>
              Memuat konsultasi…
            </Text>
          </View>
        ) : consultations.length ? (
          <View style={{ gap: spacing.sm }}>
            {consultations.map((item) => (
              <TouchableOpacity
                key={item.id}
                accessibilityRole="button"
                onPress={() => router.push(`/consult/${item.id}`)}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: radius.lg,
                  padding: spacing.md,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <MessageCircle size={20} color={colors.primary} />
                  <Text style={{ ...typography.h2, color: colors.textPrimary, flex: 1 }}>
                    {item.subject}
                  </Text>
                </View>
                <Text
                  numberOfLines={2}
                  style={{ ...typography.body, color: colors.textSecondary, marginTop: spacing.sm }}
                >
                  {item.description}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md }}>
                  <Text style={{ ...typography.label, color: colors.primary }}>
                    {statusLabel[item.status] ?? item.status}
                  </Text>
                  <Text style={{ ...typography.caption, color: colors.textSecondary }}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          !error && (
            <View
              style={{
                alignItems: 'center',
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: radius.lg,
                padding: spacing.xl,
              }}
            >
              <MessageCircle size={34} color={colors.primary} />
              <Text style={{ ...typography.h2, color: colors.textPrimary, marginTop: spacing.md }}>
                Belum ada konsultasi
              </Text>
              <Text style={{ ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs }}>
                Buat laporan pertama agar dokter dapat meninjau keluhanmu.
              </Text>
              <TouchableOpacity
                onPress={() => setShowForm(true)}
                style={{
                  marginTop: spacing.md,
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.sm,
                  borderRadius: radius.md,
                  backgroundColor: colors.primary,
                }}
              >
                <Text style={{ ...typography.button, color: colors.white }}>Buat konsultasi</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: -spacing.sm },
  header: { paddingHorizontal: spacing.screenPadding, paddingTop: spacing.md },
});
