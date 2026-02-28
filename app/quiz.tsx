import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useQuiz } from '@/context/QuizContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#0a7ea4',
    buttonBackground: '#0a7ea4',
    buttonText: '#fff',
    selectedBackground: '#0a7ea4',
    selectedText: '#fff',
    buttonDisabled: '#ccc',
  },
  dark: {
    text: '#fff',
    background: '#151718',
    tint: '#1EC7DC',
    buttonBackground: '#1EC7DC',
    buttonText: '#000',
    selectedBackground: '#1EC7DC',
    selectedText: '#000',
    buttonDisabled: '#444',
  },
};

export default function QuizScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const {
    currentQuestionIndex,
    currentQuestion,
    answers,
    questions,
    selectAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    submitQuiz,
    timeRemaining,
  } = useQuiz();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    navigation.setOptions({
      title: `Question ${currentQuestionIndex + 1} of ${questions.length}`,
      headerShown: true,
    });
  }, [currentQuestionIndex, navigation, questions.length]);

  if (!currentQuestion) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  const userAnswer = answers.find(a => a.questionId === currentQuestion.id)?.answer;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextOrSubmit = async () => {
    if (isLastQuestion) {
      // Submit quiz and go to results screen
      await submitQuiz();
      router.push('/results');
    } else {
      goToNextQuestion();
    }
  };

  const renderChoiceItem = ({ item }: { item: [string, string] }) => {
    const [key, text] = item;
    const isSelected = Array.isArray(userAnswer)
      ? userAnswer.includes(key)
      : userAnswer === key;

    return (
      <TouchableOpacity
        style={[
          styles.choiceButton,
          {
            backgroundColor: isSelected ? colors.selectedBackground : colors.buttonBackground,
            opacity: isSelected ? 1 : 0.6,
          },
        ]}
        onPress={() => {
          if (currentQuestion.type === 'checkbox') {
            const currentAnswers = Array.isArray(userAnswer) ? userAnswer : [];
            if (currentAnswers.includes(key)) {
              selectAnswer(
                currentQuestion.id,
                currentAnswers.filter(a => a !== key)
              );
            } else {
              selectAnswer(currentQuestion.id, [...currentAnswers, key]);
            }
          } else {
            selectAnswer(currentQuestion.id, key);
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.choiceContent}>
          <ThemedText
            style={[
              styles.choiceKey,
              { color: isSelected ? colors.selectedText : colors.text },
            ]}
          >
            {key}
          </ThemedText>
          <ThemedText
            style={[
              styles.choiceText,
              { color: isSelected ? colors.selectedText : colors.text },
            ]}
          >
            {text}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.questionSection}>
          <View style={styles.headerRow}>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                      backgroundColor: colors.tint,
                    },
                  ]}
                />
              </View>
            </View>
            <View style={[styles.timerBox, { borderColor: colors.tint }]}>
              <ThemedText style={[styles.timerText, { color: colors.tint }]}>
                {formatTime(timeRemaining)}
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.questionNumber}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </ThemedText>

          <ThemedText style={styles.question}>{currentQuestion.question}</ThemedText>

          <View style={styles.choicesContainer}>
            <FlatList
              data={Object.entries(currentQuestion.choices)}
              renderItem={renderChoiceItem}
              keyExtractor={item => item[0]}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor: colors.buttonBackground,
              opacity: currentQuestionIndex === 0 ? 0.5 : 1,
            },
          ]}
          onPress={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.navButtonText, { color: colors.buttonText }]}>
            Previous
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: colors.buttonBackground }]}
          onPress={handleNextOrSubmit}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.navButtonText, { color: colors.buttonText }]}>
            {isLastQuestion ? 'Submit' : 'Next'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  questionSection: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  timerBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderRadius: 6,
  },
  timerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  questionNumber: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 12,
    fontWeight: '600',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 25,
    lineHeight: 26,
  },
  choicesContainer: {
    gap: 0,
  },
  choiceButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  choiceContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  choiceKey: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 24,
  },
  choiceText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  separator: {
    height: 0,
  },
  navigationContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
