// Dashboard: counters, filter tabs, list of tasks and the Add Task button.
import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator,
  RefreshControl, Alert, StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getTasks, updateTask, completeTask, deleteTask } from '../api/taskApi';
import StatsBar from '../components/StatsBar';
import TaskCard from '../components/TaskCard';
import { colors } from '../theme';

const FILTERS = ['All', 'Pending', 'Completed'];

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  // Load tasks from the API.
  const loadTasks = async () => {
    try {
      setError('');
      setTasks(await getTasks());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Reload every time this screen comes into view (e.g. after adding a task).
  useFocusEffect(useCallback(() => { loadTasks(); }, []));

  // Counters are calculated from the task list.
  const counts = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    return { total: tasks.length, completed, pending: tasks.length - completed };
  }, [tasks]);

  const visibleTasks = filter === 'All' ? tasks : tasks.filter((t) => t.status === filter);

  // Replace one task in the list with its updated version from the server.
  const replaceTask = (updated) => setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));

  // Checkbox: Pending -> Completed (PATCH), Completed -> Pending (PUT).
  const handleToggle = async (task) => {
    try {
      const updated =
        task.status === 'Pending'
          ? await completeTask(task._id)
          : await updateTask(task._id, { status: 'Pending' });
      replaceTask(updated);
    } catch (e) {
      Alert.alert('Could not update task', e.message);
    }
  };

  const handleDelete = (task) => {
    Alert.alert('Delete task', `Delete "${task.title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTask(task._id);
            setTasks((prev) => prev.filter((t) => t._id !== task._id));
          } catch (e) {
            Alert.alert('Could not delete task', e.message);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); loadTasks(); }}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View>
            <StatsBar {...counts} />

            {/* Filter tabs */}
            <View style={styles.filters}>
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFilter(f)}
                  style={[styles.filter, filter === f && styles.filterActive]}
                >
                  <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={loadTasks}>
                  <Text style={styles.retry}>Try again</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={handleToggle}
            onEdit={(task) => navigation.navigate('TaskForm', { task })}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={
          !error && (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                {filter === 'All' ? 'No tasks yet' : `No ${filter.toLowerCase()} tasks`}
              </Text>
              <Text style={styles.emptyText}>
                {filter === 'All' ? 'Tap "Add Task" to create your first one.' : 'Switch the filter to see other tasks.'}
              </Text>
            </View>
          )
        }
      />

      {/* Add Task button */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('TaskForm')}>
        <Text style={styles.fabText}>+  Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  list: { padding: 16, paddingBottom: 100 },
  filters: { flexDirection: 'row', marginVertical: 16 },
  filter: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, marginRight: 8,
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
  },
  filterActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 15, color: colors.primary, fontWeight: '600' },
  filterTextActive: { color: colors.white },
  errorBox: { backgroundColor: colors.dangerLight, padding: 14, borderRadius: 12, marginBottom: 12 },
  errorText: { color: colors.danger, fontSize: 15, lineHeight: 21 },
  retry: { color: colors.primary, fontWeight: '700', marginTop: 8, fontSize: 15 },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  emptyText: { fontSize: 15, color: colors.muted, marginTop: 6, textAlign: 'center' },
  fab: {
    position: 'absolute', bottom: 24, alignSelf: 'center',
    backgroundColor: colors.primary, paddingHorizontal: 28, paddingVertical: 15,
    borderRadius: 30, elevation: 6,
    shadowColor: colors.primaryDark, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  fabText: { color: colors.white, fontSize: 17, fontWeight: '700' },
});
