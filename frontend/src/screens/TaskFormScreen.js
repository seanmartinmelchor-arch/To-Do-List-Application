// One form used for both "Add Task" and "Edit Task".
// If a task is passed through navigation params, we are editing.
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, StyleSheet,
} from 'react-native';
import { createTask, updateTask } from '../api/taskApi';
import { colors } from '../theme';

export default function TaskFormScreen({ route, navigation }) {
  const editingTask = route.params?.task;
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [saving, setSaving] = useState(false);
  const [titleError, setTitleError] = useState('');

  const handleSave = async () => {
    // Simple validation before calling the API.
    if (!title.trim()) {
      setTitleError('Please enter a task title.');
      return;
    }
    setTitleError('');
    setSaving(true);
    try {
      const data = { title: title.trim(), description: description.trim() };
      if (editingTask) await updateTask(editingTask._id, data);
      else await createTask(data);
      navigation.goBack(); // Home screen reloads automatically.
    } catch (e) {
      Alert.alert('Could not save task', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Task title</Text>
        <TextInput
          style={[styles.input, !!titleError && styles.inputError]}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Finish ITCC 106 project"
          placeholderTextColor={colors.muted}
          maxLength={100}
        />
        {!!titleError && <Text style={styles.error}>{titleError}</Text>}

        <Text style={[styles.label, { marginTop: 20 }]}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add some details (optional)"
          placeholderTextColor={colors.muted}
          multiline
          maxLength={500}
          textAlignVertical="top"
        />

        <TouchableOpacity style={[styles.save, saving && { opacity: 0.7 }]} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveText}>{editingTask ? 'Save changes' : 'Add task'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancel} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20 },
  label: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 },
  input: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, padding: 14, fontSize: 16, color: colors.text,
  },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, marginTop: 6, fontSize: 14 },
  textArea: { height: 130 },
  save: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 28 },
  saveText: { color: colors.white, fontSize: 17, fontWeight: '700' },
  cancel: { paddingVertical: 14, alignItems: 'center', marginTop: 6 },
  cancelText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
});
