// Shows the Total / Completed / Pending counters.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

const Stat = ({ label, value }) => (
  <View style={styles.stat}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

export default function StatsBar({ total, completed, pending }) {
  return (
    <View style={styles.row}>
      <Stat label="Total" value={total} />
      <View style={styles.divider} />
      <Stat label="Completed" value={completed} />
      <View style={styles.divider} />
      <Stat label="Pending" value={pending} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    paddingVertical: 16,
  },
  stat: { flex: 1, alignItems: 'center' },
  value: { fontSize: 28, fontWeight: '700', color: colors.white },
  label: { fontSize: 14, color: colors.primaryLight, marginTop: 2 },
  divider: { width: 1, backgroundColor: '#3B5BB5', marginVertical: 4 },
});
