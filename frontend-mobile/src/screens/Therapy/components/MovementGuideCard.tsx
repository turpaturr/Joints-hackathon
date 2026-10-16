import { colors, radius, spacing, typography } from '@/theme';
import {
  Calendar,
  ChevronRight,
  ExternalLink,
  Flame,
  Info,
  PlayCircle,
  Repeat,
  Sparkles,
} from 'lucide-react-native';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  parseInstructionSteps,
  type Movement,
  type Prescription,
} from '@/services/therapy.service';

interface MovementGuideCardProps {
  movement: Movement;
  prescription?: Prescription | null;
  onOpenVideo?: () => void;
}

export function MovementGuideCard({
  movement,
  prescription,
  onOpenVideo,
}: MovementGuideCardProps) {
  const steps = parseInstructionSteps(movement.instruksi);
  const title = movement.namaGerakan || movement.nama || 'Gerakan Terapi';
  const targetReps = prescription?.targetRepetisi ?? 10;
  const frequency = prescription?.frekuensiPerHari ? `${prescription.frekuensiPerHari}× Sehari` : 'Setiap Hari';

  const imageUri = movement.imageBase64
    ? `data:${movement.imageMimeType || 'image/jpeg'};base64,${movement.imageBase64}`
    : movement.mediaUrl && !movement.mediaUrl.includes('youtube') && !movement.mediaUrl.includes('youtu.be')
      ? movement.mediaUrl
      : null;

  const videoUrl = movement.youtubeUrl || (movement.mediaUrl?.includes('youtube') || movement.mediaUrl?.includes('youtu.be') ? movement.mediaUrl : null);

  const handleOpenVideo = () => {
    if (onOpenVideo) {
      onOpenVideo();
      return;
    }
    if (videoUrl) {
      Linking.openURL(videoUrl).catch((err) => {
        console.warn('Cannot open video URL:', err);
      });
    }
  };

  return (
    <View style={styles.card}>
      {/* ── Media Gambar di Bagian Atas ── */}
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlayBadge}>
            <Sparkles size={12} color={colors.white} />
            <Text style={styles.imageOverlayText}>Panduan Gerakan</Text>
          </View>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <View style={styles.placeholderIconBox}>
            <Flame size={28} color={colors.primary} />
          </View>
          <Text style={styles.placeholderTitle}>{title}</Text>
          <Text style={styles.placeholderSubtitle}>
            Ikuti instruksi langkah demi langkah di bawah ini.
          </Text>
        </View>
      )}

      <View style={styles.content}>
        {/* Title & Badges */}
        <View style={styles.headerRow}>
          <Text style={{ ...typography.h1, color: colors.textPrimary, flex: 1 }}>
            {title}
          </Text>
        </View>

        {/* Prescription Badges */}
        <View style={styles.badgeRow}>
          <View style={styles.badgePrimary}>
            <Repeat size={12} color={colors.primary} />
            <Text style={styles.badgePrimaryText}>{targetReps} Repetisi</Text>
          </View>

          <View style={styles.badgeTeal}>
            <Calendar size={12} color={colors.accentTeal} />
            <Text style={styles.badgeTealText}>{frequency}</Text>
          </View>
        </View>

        {/* Video Button if available */}
        {videoUrl ? (
          <TouchableOpacity
            style={styles.videoBtn}
            activeOpacity={0.8}
            onPress={handleOpenVideo}
          >
            <View style={styles.videoBtnLeft}>
              <PlayCircle size={20} color="#dc2626" />
              <Text style={styles.videoBtnText}>Tonton Video Panduan Latihan</Text>
            </View>
            <ExternalLink size={14} color="#dc2626" />
          </TouchableOpacity>
        ) : null}

        {/* Deskripsi singkat jika ada */}
        {movement.deskripsi ? (
          <View style={styles.descBox}>
            <Info size={14} color={colors.primaryDark} style={{ marginTop: 2 }} />
            <Text style={styles.descText}>{movement.deskripsi}</Text>
          </View>
        ) : null}

        {/* ── Langkah-Langkah Cara Melakukannya ── */}
        <View style={styles.stepsSection}>
          <Text style={styles.stepsSectionTitle}>
            Langkah-Langkah Cara Melakukan:
          </Text>

          <View style={styles.stepList}>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepContentText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: spacing.md,
  },
  imageContainer: {
    width: '100%',
    height: 190,
    backgroundColor: colors.bgBase,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlayBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  imageOverlayText: {
    ...typography.caption,
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  placeholderContainer: {
    width: '100%',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary + '0c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  placeholderTitle: {
    ...typography.h2,
    color: colors.primaryDark,
  },
  placeholderSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  content: {
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  badgePrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary + '12',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgePrimaryText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  badgeTeal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accentTeal + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeTealText: {
    ...typography.caption,
    color: colors.accentTeal,
    fontWeight: '600',
  },
  videoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  videoBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  videoBtnText: {
    ...typography.label,
    color: '#991b1b',
    fontSize: 12,
  },
  descBox: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: colors.bgBase,
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  descText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  stepsSection: {
    marginTop: spacing.xs,
  },
  stepsSectionTitle: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  stepList: {
    gap: spacing.sm,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.bgBase,
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
    fontSize: 11,
  },
  stepContentText: {
    ...typography.body,
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 19,
  },
});
