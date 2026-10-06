import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Activity, ClipboardList, MessageSquare, ChevronRight, Clock, Award } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '@/theme';

export default function HomeScreen() {
  const patientName = "Budi";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgBase }}>
      <ScrollView 
        contentContainerStyle={{ 
          paddingHorizontal: spacing.screenPadding, 
          paddingTop: spacing.xl, 
          paddingBottom: spacing.xl 
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header Greeting */}
        <View style={{ marginBottom: spacing.md }}>
          <Text style={{ ...typography.display, color: colors.primaryDark }}>
            Halo, {patientName}
          </Text>
          <Text style={{ ...typography.body, color: colors.textSecondary, marginTop: 4 }}>
            Semangat melakukan terapi hari ini!
          </Text>
        </View>

        {/* 2. Banner Progres Ringkas (Tambahan) */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: spacing.sm,
          shadowColor: colors.primaryDark,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 2,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Award size={18} color={colors.primary} />
              <Text style={{ ...typography.bodyMedium, color: colors.textPrimary }}>
                Target Mingguan
              </Text>
            </View>
            <Text style={{ ...typography.caption, color: colors.primary, fontFamily: 'Poppins_600SemiBold' }}>
              3/5 Sesi
            </Text>
          </View>

          {/* Progress Bar pakai Aksen Teal & Lime */}
          <View style={{
            height: 8,
            backgroundColor: '#E2EEF5',
            borderRadius: radius.full,
            overflow: 'hidden',
            marginVertical: 4
          }}>
            <View style={{
              width: '60%', // 3 dari 5 = 60%
              height: '100%',
              backgroundColor: colors.accentTeal,
              borderRadius: radius.full,
            }} />
          </View>
        </View>

        {/* 3. Pengingat Sesi (Tambahan) */}
        <View style={{
          backgroundColor: '#EBF6FC',
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          marginBottom: spacing.lg,
        }}>
          <Clock size={18} color={colors.primary} />
          <Text style={{ ...typography.caption, color: colors.primaryDark, flex: 1 }}>
            Jadwal sesi berikutnya: <Text style={{ fontFamily: 'Poppins_600SemiBold' }}>Hari ini, 16.00 WITA</Text>
          </Text>
        </View>

        {/* Section Label */}
        <Text style={{ ...typography.label, color: colors.textSecondary, marginBottom: spacing.sm, letterSpacing: 0.5 }}>
          MENU UTAMA
        </Text>

        {/* 4. LIST 3 FITUR UTAMA */}
        <View style={{ gap: 12 }}>
          
          {/* TERAPI SEKARANG (Main Action Card) */}
          <TouchableOpacity 
            activeOpacity={0.85}
            // onPress={() => router.push('/therapy/current')}
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              padding: spacing.md,
              borderWidth: 1.5,
              borderColor: colors.primary,
              shadowColor: colors.primaryDark,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <View style={{
                  padding: 8,
                  borderRadius: radius.md,
                  backgroundColor: '#E6F3FA',
                }}>
                  <Activity size={24} color={colors.primary} />
                </View>
                <Text style={{ ...typography.h2, color: colors.textPrimary }}>
                  Terapi Sekarang
                </Text>
              </View>
              
              <View style={{
                backgroundColor: colors.accentLime,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: radius.full,
              }}>
                <Text style={{ ...typography.caption, color: colors.primaryDark, fontFamily: 'Poppins_600SemiBold' }}>
                  Sesi Siap
                </Text>
              </View>
            </View>

            <Text style={{ ...typography.body, color: colors.textSecondary, marginBottom: spacing.md }}>
              Latihan gerakan fisik harian untuk mempercepat pemulihan Anda.
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Text style={{ ...typography.button, color: colors.primary, marginRight: 4 }}>
                Mulai Sesi
              </Text>
              <ChevronRight size={20} color={colors.primary} />
            </View>
          </TouchableOpacity>

          {/* RIWAYAT TERAPI */}
          <TouchableOpacity 
            activeOpacity={0.85}
            // onPress={() => router.push('/therapy/history')}
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              padding: spacing.md,
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: colors.primaryDark,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 2,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 }}>
              <View style={{
                padding: 8,
                borderRadius: radius.md,
                backgroundColor: colors.bgBase,
              }}>
                <ClipboardList size={24} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...typography.h2, color: colors.textPrimary }}>
                  Riwayat Terapi
                </Text>
                <Text style={{ ...typography.caption, color: colors.textSecondary, marginTop: 2 }}>
                  Lihat rekam catatan & progres pemulihan
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* KELUHAN KE DOKTER */}
          <TouchableOpacity 
            activeOpacity={0.85}
            // onPress={() => router.push('/consultation')}
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              padding: spacing.md,
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: colors.primaryDark,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 2,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 }}>
              <View style={{
                padding: 8,
                borderRadius: radius.md,
                backgroundColor: colors.bgBase,
              }}>
                <MessageSquare size={24} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...typography.h2, color: colors.textPrimary }}>
                  Keluhan ke Dokter
                </Text>
                <Text style={{ ...typography.caption, color: colors.textSecondary, marginTop: 2 }}>
                  Sampaikan kendala atau rasa sakit
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}