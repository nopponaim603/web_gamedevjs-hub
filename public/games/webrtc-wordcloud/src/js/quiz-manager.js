/**
 * QuizManager - Handles all logic for the Quick Quiz mode.
 * Parses Markdown questions and manages the quiz lifecycle.
 */
export class QuizManager {
    constructor(network) {
        this.network = network;
        this.questions = [];
        this.currentQuestionIndex = -1;
        this.state = 'LOBBY'; // LOBBY, COUNTDOWN, QUESTION, RESULT, FINAL
        this.scores = new Map(); // peerId -> score
        this.timer = 0;
        this.timerInterval = null;
        this.responses = new Map(); // peerId -> answerIndex
        this.streaks = new Map(); // peerId -> consecutive correct answers
        this.questionStartTime = 0;
        this.activePeerCount = 0; // total connected participants (including host)

        // Configuration
        this.COUNTDOWN_SECONDS = 5;
        this.QUESTION_SECONDS = 20;
        this.BASE_POINTS = 1000; // points for an instant correct answer
        this.MIN_POINTS = 500; // points for a correct answer at the last moment
        this.STREAK_BONUS = 50; // extra points per consecutive correct answer

        this.onStateChange = null;
        this.onTimerTick = null;
    }

    /**
     * Parse Markdown content into question objects
     * Format:
     * ## Question?
     * - [ ] Wrong
     * - [x] Correct
     */
    parseMarkdown(md) {
        const lines = md.split('\n');
        const questions = [];
        let currentQ = null;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('##')) {
                if (currentQ) questions.push(currentQ);
                currentQ = {
                    text: trimmed.replace('##', '').trim(),
                    options: [],
                    correctIndex: -1
                };
            } else if (trimmed.startsWith('- [') && currentQ) {
                const isCorrect = trimmed.toLowerCase().includes('[x]');
                // Robustly remove the - [ ] or - [x] prefix
                const optionText = trimmed.replace(/- \[[xX ]\]/, '').trim();
                currentQ.options.push(optionText);
                if (isCorrect) currentQ.correctIndex = currentQ.options.length - 1;
            }
        });
        if (currentQ) questions.push(currentQ);
        this.questions = questions;
        return questions;
    }

    startQuiz() {
        if (this.questions.length === 0) return;
        this.setState('COUNTDOWN');
        this.startCountdown();
    }

    startCountdown() {
        this.timer = this.COUNTDOWN_SECONDS;
        this.timerInterval = setInterval(() => {
            this.timer--;
            if (this.onTimerTick) this.onTimerTick(this.timer);
            
            if (this.timer <= 0) {
                clearInterval(this.timerInterval);
                this.nextQuestion();
            }
        }, 1000);
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex >= this.questions.length) {
            this.setState('FINAL');
            return;
        }

        this.responses.clear();
        this.setState('QUESTION');
        this.startQuestionTimer();
    }

    startQuestionTimer() {
        this.timer = this.QUESTION_SECONDS;
        this.questionStartTime = Date.now();
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            this.timer--;
            if (this.onTimerTick) this.onTimerTick(this.timer);

            if (this.timer <= 0) {
                clearInterval(this.timerInterval);
                this.revealResult();
            }
        }, 1000);
    }

    revealResult() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        // Anyone who didn't answer this question loses their streak
        this.streaks.forEach((streak, peerId) => {
            if (!this.responses.has(peerId)) this.streaks.set(peerId, 0);
        });

        this.setState('RESULT');
    }

    /**
     * Set the number of currently connected participants (including host).
     * Used to trigger an early result reveal once everyone has answered.
     */
    setActivePeerCount(count) {
        this.activePeerCount = count;
    }

    submitAnswer(peerId, answerIndex) {
        if (this.state !== 'QUESTION') return;
        if (this.responses.has(peerId)) return;

        this.responses.set(peerId, answerIndex);

        const q = this.questions[this.currentQuestionIndex];
        if (answerIndex === q.correctIndex) {
            // Speed-based score: faster answers earn closer to BASE_POINTS,
            // answers near the deadline still earn at least MIN_POINTS.
            const timeTaken = (Date.now() - this.questionStartTime) / 1000;
            const timeLeft = Math.max(0, Math.min(this.QUESTION_SECONDS, this.QUESTION_SECONDS - timeTaken));
            const speedScore = Math.round(this.MIN_POINTS + (this.BASE_POINTS - this.MIN_POINTS) * (timeLeft / this.QUESTION_SECONDS));

            const streak = (this.streaks.get(peerId) || 0) + 1;
            this.streaks.set(peerId, streak);
            const streakBonus = (streak - 1) * this.STREAK_BONUS;

            const currentScore = this.scores.get(peerId) || 0;
            this.scores.set(peerId, currentScore + speedScore + streakBonus);
        } else {
            this.streaks.set(peerId, 0);
        }

        // Early reveal once every connected participant has answered
        if (this.activePeerCount > 0 && this.responses.size >= this.activePeerCount) {
            this.revealResult();
        }
    }

    setState(newState) {
        this.state = newState;
        if (this.onStateChange) {
            this.onStateChange(newState, {
                index: this.currentQuestionIndex,
                question: this.questions[this.currentQuestionIndex],
                leaderboard: this.getLeaderboard(),
                stats: this.getQuestionStats()
            });
        }
    }

    getLeaderboard() {
        return Array.from(this.scores.entries())
            .map(([id, score]) => ({ id, score }))
            .sort((a, b) => b.score - a.score);
    }

    getQuestionStats() {
        const q = this.questions[this.currentQuestionIndex];
        const numOptions = q ? q.options.length : 0;
        const stats = new Array(numOptions).fill(0);
        this.responses.forEach((ansIndex) => {
            if (ansIndex >= 0 && ansIndex < numOptions) stats[ansIndex]++;
        });
        return stats;
    }

    reset() {
        this.questions = [];
        this.currentQuestionIndex = -1;
        this.state = 'LOBBY';
        this.scores.clear();
        this.responses.clear();
        this.streaks.clear();
        this.activePeerCount = 0;
        this.questionStartTime = 0;
        if (this.timerInterval) clearInterval(this.timerInterval);
    }
}
