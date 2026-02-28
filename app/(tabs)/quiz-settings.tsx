import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Question, useQuiz } from '@/context/QuizContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#0a7ea4',
    buttonBackground: '#0a7ea4',
    buttonText: '#fff',
    deleteButton: '#DC143C',
    editButton: '#4CAF50',
    textInput: '#f0f0f0',
    border: '#ddd',
  },
  dark: {
    text: '#fff',
    background: '#151718',
    tint: '#1EC7DC',
    buttonBackground: '#1EC7DC',
    buttonText: '#000',
    deleteButton: '#FF6B6B',
    editButton: '#66BB6A',
    textInput: '#333',
    border: '#555',
  },
};

export default function QuizSettingsScreen() {
  const { questions, addQuestion, updateQuestion, deleteQuestion, quizTimer, setQuizTimer } =
    useQuiz();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Question>>({
    type: 'multiple',
    question: '',
    choices: { A: '', B: '', C: '', D: '' },
    answer: 'A',
  });
  const [timerMinutes, setTimerMinutes] = useState(Math.floor(quizTimer / 60));

  const resetForm = () => {
    setFormData({
      type: 'multiple',
      question: '',
      choices: { A: '', B: '', C: '', D: '' },
      answer: 'A',
    });
    setEditingId(null);
  };

  const openEditModal = (question: Question) => {
    setFormData(question);
    setEditingId(question.id);
    setModalVisible(true);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const handleSaveQuestion = () => {
    if (!formData.question?.trim()) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }

    if (editingId) {
      updateQuestion(editingId, formData as Question);
      Alert.alert('Success', 'Question updated successfully');
    } else {
      addQuestion(formData as Question);
      Alert.alert('Success', 'Question added successfully');
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDeleteQuestion = (id: number) => {
    Alert.alert('Delete Question', 'Are you sure you want to delete this question?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteQuestion(id);
          Alert.alert('Success', 'Question deleted successfully');
        },
      },
    ]);
  };

  const handleUpdateTimer = () => {
    const minutes = parseInt(timerMinutes.toString());
    if (minutes > 0) {
      setQuizTimer(minutes * 60);
      Alert.alert('Success', `Quiz timer set to ${minutes} minute(s)`);
    } else {
      Alert.alert('Error', 'Timer must be greater than 0');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const QuestionItem = ({ item }: { item: Question }) => (
    <View style={[styles.questionCard, { borderColor: colors.border }]}>
      <View style={styles.questionHeader}>
        <ThemedText style={styles.questionText}>{item.question}</ThemedText>
        <ThemedText style={styles.questionType}>{item.type}</ThemedText>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.editButton }]}
          onPress={() => openEditModal(item)}
        >
          <ThemedText style={styles.actionButtonText}>Edit</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.deleteButton }]}
          onPress={() => handleDeleteQuestion(item.id)}
        >
          <ThemedText style={styles.actionButtonText}>Delete</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Timer Settings */}
        <View style={[styles.section, { borderColor: colors.border }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quiz Timer Settings
          </ThemedText>
          <View style={styles.timerContainer}>
            <View style={styles.timerInfo}>
              <ThemedText style={styles.timerLabel}>Current Timer: {formatTime(quizTimer)}</ThemedText>
              <View style={styles.timerInputContainer}>
                <ThemedText style={styles.label}>Set Timer (minutes):</ThemedText>
                <TextInput
                  style={[
                    styles.timerInput,
                    {
                      color: colors.text,
                      backgroundColor: colors.textInput,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="5"
                  placeholderTextColor={colors.text}
                  keyboardType="number-pad"
                  value={timerMinutes.toString()}
                  onChangeText={(text) => setTimerMinutes(parseInt(text) || 0)}
                />
              </View>
              <TouchableOpacity
                style={[styles.updateButton, { backgroundColor: colors.buttonBackground }]}
                onPress={handleUpdateTimer}
              >
                <ThemedText style={[styles.updateButtonText, { color: colors.buttonText }]}>
                  Update Timer
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Questions List */}
        <View style={[styles.section, { borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Quiz Questions ({questions.length})
            </ThemedText>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.buttonBackground }]}
              onPress={openAddModal}
            >
              <ThemedText style={[styles.addButtonText, { color: colors.buttonText }]}>
                + Add
              </ThemedText>
            </TouchableOpacity>
          </View>

          <FlatList
            data={questions}
            renderItem={QuestionItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <ThemedView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <ThemedText type="title" style={styles.modalTitle}>
              {editingId ? 'Edit Question' : 'Add New Question'}
            </ThemedText>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Question Type:</ThemedText>
              <View style={styles.typeButtons}>
                {['multiple', 'truefalse', 'checkbox'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      {
                        backgroundColor:
                          formData.type === type ? colors.buttonBackground : colors.textInput,
                      },
                    ]}
                    onPress={() => setFormData({ ...formData, type: type as any })}
                  >
                    <ThemedText
                      style={{
                        color: formData.type === type ? colors.buttonText : colors.text,
                      }}
                    >
                      {type === 'truefalse' ? 'True/False' : type}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Question:</ThemedText>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.textInput,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Enter question"
                placeholderTextColor={colors.text}
                value={formData.question}
                onChangeText={text => setFormData({ ...formData, question: text })}
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Choices:</ThemedText>
              {Object.entries(formData.choices || {}).map(([key, value]) => (
                <View key={key} style={styles.choiceInput}>
                  <ThemedText style={styles.choiceLabel}>{key}:</ThemedText>
                  <TextInput
                    style={[
                      styles.choiceTextInput,
                      {
                        color: colors.text,
                        backgroundColor: colors.textInput,
                        borderColor: colors.border,
                      },
                    ]}
                    placeholder={`Choice ${key}`}
                    placeholderTextColor={colors.text}
                    value={value}
                    onChangeText={text => {
                      const newChoices = { ...formData.choices, [key]: text };
                      setFormData({ ...formData, choices: newChoices });
                    }}
                  />
                </View>
              ))}
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Correct Answer:</ThemedText>
              <View style={styles.answerButtons}>
                {Object.keys(formData.choices || {}).map(key => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.answerButton,
                      {
                        backgroundColor:
                          formData.answer === key ? colors.buttonBackground : colors.textInput,
                      },
                    ]}
                    onPress={() => setFormData({ ...formData, answer: key })}
                  >
                    <ThemedText
                      style={{
                        color: formData.answer === key ? colors.buttonText : colors.text,
                      }}
                    >
                      {key}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.buttonBackground }]}
              onPress={handleSaveQuestion}
            >
              <ThemedText style={[styles.buttonText, { color: colors.buttonText }]}>Save</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.deleteButton }]}
              onPress={() => {
                setModalVisible(false);
                resetForm();
              }}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  timerContainer: {
    gap: 12,
  },
  timerInfo: {
    gap: 12,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerInputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  timerInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  updateButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontWeight: '600',
  },
  questionCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  questionHeader: {
    marginBottom: 12,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  questionType: {
    fontSize: 12,
    opacity: 0.6,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    padding: 16,
    paddingBottom: 100,
  },
  modalTitle: {
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  choiceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  choiceLabel: {
    fontWeight: '600',
    minWidth: 30,
  },
  choiceTextInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
  },
  answerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  answerButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    color: 'white',
  },
});
