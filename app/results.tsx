import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useQuiz } from '@/context/QuizContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#0a7ea4',
    buttonBackground: '#0a7ea4',
    buttonText: '#fff',
    successColor: '#4CAF50',
  },
  dark: {
    text: '#fff',
    background: '#151718',
    tint: '#1EC7DC',
    buttonBackground: '#1EC7DC',
    buttonText: '#000',
    successColor: '#66BB6A',
  },
};

export default function ResultsScreen() {
  const router = useRouter();
  const { score, highestScore, resetQuiz } = useQuiz();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleRetakeQuiz = () => {
    resetQuiz();
    router.replace('/quiz');
  };

  const handleBackHome = () => {
    resetQuiz();
    router.replace('/home');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText style={[styles.headerText, { color: colors.successColor }]}>
            ✓
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            Quiz Complete!
          </ThemedText>
        </View>

        <View style={styles.resultsContainer}>
          <View style={styles.scoreCard}>
            <View style={styles.scoreRow}>
              <ThemedText style={styles.scoreLabel}>Current Score</ThemedText>
              <ThemedText style={[styles.scoreNumber, { color: colors.tint }]}>
                {score} / 13
              </ThemedText>
            </View>

            <View style={styles.divider} />

            <View style={styles.scoreRow}>
              <ThemedText style={styles.scoreLabel}>Highest Score</ThemedText>
              <ThemedText style={[styles.scoreNumber, { color: colors.successColor }]}>
                {highestScore} / 13
              </ThemedText>
            </View>
          </View>

          <View style={styles.feedbackContainer}>
            {score === 13 ? (
              <>
                <ThemedText style={styles.feedbackTitle}>Perfect Score! 🎉</ThemedText>
                <ThemedText style={styles.feedbackText}>
                  Excellent! You've mastered all the questions. Keep up your knowledge!
                </ThemedText>
              </>
            ) : score >= 10 ? (
              <>
                <ThemedText style={styles.feedbackTitle}>Great Job! 🌟</ThemedText>
                <ThemedText style={styles.feedbackText}>
                  You've answered most questions correctly. Keep practicing!
                </ThemedText>
              </>
            ) : score >= 7 ? (
              <>
                <ThemedText style={styles.feedbackTitle}>Good Effort! 👍</ThemedText>
                <ThemedText style={styles.feedbackText}>
                  You've got a good understanding. Try again to improve your score.
                </ThemedText>
              </>
            ) : (
              <>
                <ThemedText style={styles.feedbackTitle}>Keep Learning! 📚</ThemedText>
                <ThemedText style={styles.feedbackText}>
                  This is a good start. Review the topics and try again to improve.
                </ThemedText>
              </>
            )}
          </View>

          <View style={styles.statsContainer}>
            <ThemedText style={styles.statsTitle}>Performance</ThemedText>
            <View style={styles.statBar}>
              <View style={styles.statLabel}>
                <ThemedText>Accuracy</ThemedText>
              </View>
              <ThemedText style={[styles.statValue, { color: colors.tint }]}>
                {Math.round((score / 13) * 100)}%
              </ThemedText>
            </View>
            <View style={styles.statBar}>
              <View style={styles.statLabel}>
                <ThemedText>Correct Answers</ThemedText>
              </View>
              <ThemedText style={[styles.statValue, { color: colors.tint }]}>
                {score} / 13
              </ThemedText>
            </View>
            <View style={styles.statBar}>
              <View style={styles.statLabel}>
                <ThemedText>Personal Record</ThemedText>
              </View>
              <ThemedText style={[styles.statValue, { color: colors.successColor }]}>
                {highestScore} / 13
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.buttonBackground }]}
          onPress={handleRetakeQuiz}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.buttonText, { color: colors.buttonText }]}>
            Retake Quiz
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleBackHome}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.secondaryButtonText}>Back to Home</ThemedText>
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
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  resultsContainer: {
    gap: 20,
  },
  scoreCard: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  scoreLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 10,
  },
  feedbackContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  statsContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  statLabel: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
