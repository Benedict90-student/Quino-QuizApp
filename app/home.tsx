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
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
    buttonText: '#fff',
    buttonBackground: '#0a7ea4',
  },
  dark: {
    text: '#fff',
    background: '#151718',
    tint: '#fff',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
    buttonText: '#000',
    buttonBackground: '#1EC7DC',
  },
};

export default function HomeScreen() {
  const router = useRouter();
  const { startQuiz, highestScore } = useQuiz();
  const colorScheme = useColorScheme();

  const colors = Colors[colorScheme ?? 'light'];

  const handleStartQuiz = () => {
    startQuiz();
    router.push('/quiz');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Quiz Master
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Test your knowledge with our interactive quiz
          </ThemedText>
        </View>

        <View style={styles.content}>
          <View style={styles.scoreSection}>
            <ThemedText type="subtitle" style={styles.scoreLabel}>
              Highest Score
            </ThemedText>
            <ThemedText style={[styles.scoreValue, { color: colors.tint }]}>
              {highestScore} / 13
            </ThemedText>
          </View>

          <View style={styles.infoSection}>
            <ThemedText style={styles.infoTitle}>Quiz Features:</ThemedText>
            <ThemedText style={styles.infoItem}>• 13 questions covering programming basics</ThemedText>
            <ThemedText style={styles.infoItem}>• Multiple choice and true/false questions</ThemedText>
            <ThemedText style={styles.infoItem}>• Navigate between questions freely</ThemedText>
            <ThemedText style={styles.infoItem}>• Track your score and best attempt</ThemedText>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: colors.buttonBackground }]}
          onPress={handleStartQuiz}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.startButtonText, { color: colors.buttonText }]}>
            Start Quiz
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
    paddingTop: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  scoreSection: {
    marginBottom: 30,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoSection: {
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 14,
    marginVertical: 6,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  startButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
