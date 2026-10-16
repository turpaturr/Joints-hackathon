import { colors, radius, spacing, typography } from '@/theme';
import {
  AlertCircle,
  Check,
  Edit2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  User,
} from 'lucide-react-native';
import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { cardStyle } from './CardStyle';
import {
  PatientProfileData,
  savePatientEditableProfile,
} from '@/services/patient-profile.service';

interface PersonalInfoCardProps {
  userId: string;
  profile: PatientProfileData;
  onProfileUpdated?: (updated: PatientProfileData) => void;
}

const DANGER = '#b91c1c';
const DANGER_BG = '#fef2f2';
const DANGER_BORDER = '#fecaca';

/* ---------- Small building blocks ---------- */

function SectionHeader({
  title,
  hint,
  locked,
}: {
  title: string;
  hint?: string;
  locked?: boolean;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {hint ? (
        <View style={styles.sectionHint}>
          {locked ? <Lock size={11} color={colors.textSecondary} /> : null}
          <Text style={styles.sectionHintText}>{hint}</Text>
        </View>
      ) : null}
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  placeholder,
  accent,
  multiline,
  isLast,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
  placeholder?: string;
  accent?: boolean;
  multiline?: boolean;
  isLast?: boolean;
}) {
  const isEmpty = !value;
  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <View
        style={[
          styles.rowIcon,
          accent && { backgroundColor: colors.primary + '12' },
        ]}
      >
        {icon}
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text
          style={[styles.rowValue, isEmpty && styles.rowValueEmpty]}
          numberOfLines={multiline ? undefined : 2}
        >
          {isEmpty ? placeholder : value}
        </Text>
      </View>
    </View>
  );
}

function InputField({
  icon,
  label,
  multiline,
  ...inputProps
}: {
  icon: ReactNode;
  label: string;
  multiline?: boolean;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: 'phone-pad';
  editable?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.inputBox,
          multiline && styles.inputBoxMultiline,
          focused && styles.inputBoxFocused,
        ]}
      >
        <View style={multiline ? styles.inputIconTop : undefined}>{icon}</View>
        <TextInput
          {...inputProps}
          style={[styles.textInput, multiline && styles.textInputMultiline]}
          placeholderTextColor={colors.textSecondary}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
        />
      </View>
    </View>
  );
}

/* ---------- Main component ---------- */

export function PersonalInfoCard({
  userId,
  profile,
  onProfileUpdated,
}: PersonalInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(profile.nomorTelepon);
  const [address, setAddress] = useState(profile.alamat);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep local fields in sync if the profile changes while not editing
  useEffect(() => {
    if (!isEditing) {
      setPhone(profile.nomorTelepon);
      setAddress(profile.alamat);
    }
  }, [profile.nomorTelepon, profile.alamat, isEditing]);

  // Clear pending timer on unmount
  useEffect(() => {
    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, []);

  const hasChanges =
    phone.trim() !== (profile.nomorTelepon ?? '').trim() ||
    address.trim() !== (profile.alamat ?? '').trim();

  const handleSave = async () => {
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }
    setSaving(true);
    setNotice('');
    setError('');
    try {
      await savePatientEditableProfile(userId, {
        nomorTelepon: phone.trim(),
        alamat: address.trim(),
      });
      setIsEditing(false);
      setNotice('Nomor telepon dan alamat berhasil diperbarui.');
      onProfileUpdated?.({
        ...profile,
        nomorTelepon: phone.trim(),
        alamat: address.trim(),
      });
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
      noticeTimer.current = setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      console.warn('Failed to save profile:', err);
      setError('Gagal menyimpan perubahan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setPhone(profile.nomorTelepon);
    setAddress(profile.alamat);
    setIsEditing(false);
    setNotice('');
    setError('');
  };

  const nakesValue = profile.dokterPendamping
    ? `${profile.dokterPendamping}${profile.faskes ? ` · ${profile.faskes}` : ''}`
    : '';

  return (
    <View style={[cardStyle, styles.card]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleContainer}>
          <View style={styles.iconContainer}>
            <User size={20} color={colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={{ ...typography.h2, color: colors.textPrimary }}>
              Informasi Pribadi
            </Text>
            <Text style={{ ...typography.caption, color: colors.textSecondary }}>
              Data akun & kontak Anda
            </Text>
          </View>
        </View>

        {!isEditing ? (
          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.7}
            onPress={() => setIsEditing(true)}
            accessibilityRole="button"
            accessibilityLabel="Ubah kontak"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Edit2 size={13} color={colors.primary} />
            <Text style={styles.editBtnText}>Ubah</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Feedback banners */}
      {notice ? (
        <View style={styles.noticeBanner}>
          <Check size={14} color="#166534" />
          <Text style={styles.noticeText}>{notice}</Text>
        </View>
      ) : null}
      {error ? (
        <View style={styles.errorBanner}>
          <AlertCircle size={14} color={DANGER} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Account section – read only */}
      <SectionHeader title="Akun" hint="Disinkronkan dari web" locked />
      <View style={styles.group}>
        <InfoRow
          icon={<User size={16} color={colors.textSecondary} />}
          label="Nama Lengkap"
          value={profile.namaLengkap}
        />
        <InfoRow
          icon={<Mail size={16} color={colors.textSecondary} />}
          label="Alamat Email"
          value={profile.email}
        />
        <InfoRow
          icon={<Stethoscope size={16} color={colors.textSecondary} />}
          label="Faskes & Nakes Pendamping"
          value={nakesValue}
          placeholder="Belum terhubung ke Nakes"
          isLast
        />
      </View>

      {/* Contact section – editable */}
      <SectionHeader title="Kontak" hint={isEditing ? 'Sedang diubah' : 'Dapat diubah'} />
      {isEditing ? (
        <View style={styles.editGroup}>
          <InputField
            icon={<Phone size={16} color={colors.primary} />}
            label="Nomor Telepon"
            value={phone}
            onChangeText={setPhone}
            placeholder="Contoh: 08123456789"
            keyboardType="phone-pad"
            editable={!saving}
          />
          <InputField
            icon={<MapPin size={16} color={colors.primary} />}
            label="Alamat Domisili"
            value={address}
            onChangeText={setAddress}
            placeholder="Masukkan alamat lengkap tempat tinggal Anda..."
            multiline
            editable={!saving}
          />
        </View>
      ) : (
        <View style={styles.group}>
          <InfoRow
            icon={<Phone size={16} color={colors.primary} />}
            label="Nomor Telepon"
            value={profile.nomorTelepon}
            placeholder="Belum diisi"
            accent
          />
          <InfoRow
            icon={<MapPin size={16} color={colors.primary} />}
            label="Alamat Domisili"
            value={profile.alamat}
            placeholder="Belum diisi"
            accent
            multiline
            isLast
          />
        </View>
      )}

      {/* Actions */}
      {isEditing ? (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.cancelBtn, saving && styles.btnDisabled]}
            activeOpacity={0.7}
            disabled={saving}
            onPress={handleCancel}
            accessibilityRole="button"
          >
            <Text style={styles.cancelBtnText}>Batal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveBtn, (saving || !hasChanges) && styles.btnDisabled]}
            activeOpacity={0.8}
            disabled={saving || !hasChanges}
            onPress={handleSave}
            accessibilityRole="button"
          >
            {saving ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.saveBtnText}>Simpan</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    flex: 1,
  },
  headerText: {
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minHeight: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    backgroundColor: colors.primary + '08',
  },
  editBtnText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },

  /* Banners */
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  noticeText: {
    ...typography.caption,
    color: '#166534',
    fontWeight: '500',
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: DANGER_BG,
    borderWidth: 1,
    borderColor: DANGER_BORDER,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.caption,
    color: DANGER,
    fontWeight: '500',
    flex: 1,
  },

  /* Sections */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs + 2,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
  sectionHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionHintText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
  },
  group: {
    backgroundColor: colors.bgBase,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  editGroup: {
    gap: spacing.md,
    marginBottom: spacing.xs,
  },

  /* Read-only rows */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm + 2,
    minHeight: 56,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
    gap: 1,
  },
  rowLabel: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
  },
  rowValue: {
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  rowValueEmpty: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },

  /* Inputs */
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm + 4,
    minHeight: 48,
  },
  inputBoxMultiline: {
    alignItems: 'flex-start',
    paddingVertical: spacing.sm + 2,
  },
  inputBoxFocused: {
    borderColor: colors.primary,
  },
  inputIconTop: {
    marginTop: 2,
  },
  textInput: {
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  textInputMultiline: {
    minHeight: 72,
    paddingVertical: 0,
  },

  /* Actions */
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  cancelBtn: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  saveBtn: {
    flex: 1.4,
    minHeight: 46,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    ...typography.label,
    color: colors.white,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.5,
  },
});