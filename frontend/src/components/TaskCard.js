// One task in the list: checkbox, title, description, status, date, edit/delete.
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Turns "2026-11-14T10:30:00.000Z" into "Nov 14, 2026, 6:30 PM"
const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const done = task.status === 'Completed';

  return (
    <View style={styles.card}>
      {/* Checkbox */}
      <TouchableOpacity
        onPress={() => onToggle(task)}
        style={[styles.checkbox, done && styles.checkboxDone]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: done }}
        accessibilityLabel={`Mark ${task.title} as ${done ? 'pending' : 'completed'}`}
      >
        {done && <Text style={styles.check}>✓</Text>}
      </TouchableOpacity>

      {/* Task details */}
      <View style={styles.body}>
        <Text style={[styles.title, done && styles.titleDone]}>{task.title}</Text>
        {!!task.description && <Text style={styles.description}>{task.description}</Text>}

        <View style={styles.metaRow}>
          <View style={[styles.badge, done ? styles.badgeDone : styles.badgePending]}>
            <Text style={[styles.badgeText, { color: done ? colors.success : colors.pending }]}>
              {task.status}
            </Text>
          </View>
          <Text style={styles.date}>Created {formatDate(task.createdAt)}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(task)} style={[styles.btn, styles.editBtn]}>
            <Text style={[styles.btnText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(task)} style={[styles.btn, styles.deleteBtn]}>
            <Text style={[styles.btnText, { color: colors.danger }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxDone: { backgroundColor: colors.primary },
  check: { color: colors.white, fontWeight: '700', fontSize: 16 },
  body: { flex: 1 },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  titleDone: { textDecorationLine: 'line-through', color: colors.muted },
  description: { fontSize: 15, color: colors.muted, marginTop: 4, lineHeight: 21 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginRight: 10 },
  badgeDone: { backgroundColor: colors.successLight },
  badgePending: { backgroundColor: colors.pendingLight },
  badgeText: { fontSize: 13, fontWeight: '600' },
  date: { fontSize: 13, color: colors.muted },
  actions: { flexDirection: 'row', marginTop: 12 },
  btn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, marginRight: 8 },
  editBtn: { backgroundColor: colors.primaryLight },
  deleteBtn: { backgroundColor: colors.dangerLight },
  btnText: { fontSize: 14, fontWeight: '600' },
});
