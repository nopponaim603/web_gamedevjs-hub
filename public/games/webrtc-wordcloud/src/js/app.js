import { CloudNetwork } from './network.js';
import { CloudRenderer } from './renderer.js';
import { QuizManager } from './quiz-manager.js';

/**
 * WordCloudApp - Main application controller.
 * Implements Singleton, Mediator, and Strategy patterns.
 */
class WordCloudApp {
    static instance = null;

    constructor() {
        if (WordCloudApp.instance) {
            return WordCloudApp.instance;
        }

        // Core Components
        this.network = CloudNetwork.getInstance();
        this.renderer = new CloudRenderer('cloud-container', '#word-cloud-svg');
        this.quizManager = new QuizManager(this.network);

        // State Management
        this.mode = 'cloud'; // 'cloud' or 'quiz'
        this.words = new Map();
        this.topic = '';
        this.theme = 'light';
        this.myId = '';
        this.hostId = '';
        this.isHost = false;
        this.nickname = '';
        this.nicknames = new Map(); // peerId -> nickname

        // DOM Element Caching
        this.ui = {
            overlay: document.getElementById('overlay'),
            statusIndicator: document.getElementById('status-indicator'),
            statusText: document.getElementById('status-text'),
            peerCount: document.getElementById('count-peers'),
            wordsOrPointsVal: document.getElementById('count-words-or-points'),
            wordsOrPointsLabel: document.getElementById('label-words-or-points'),
            peerList: document.getElementById('peer-list'),
            presenceStrip: document.getElementById('presence-strip'),
            topWordsList: document.getElementById('top-words-list'),
            joinUrlDisplay: document.getElementById('join-url-display'),
            qrContainer: document.getElementById('qrcode'),
            
            // Mode Selection
            btnModeCloud: document.getElementById('mode-wordcloud'),
            btnModeQuiz: document.getElementById('mode-quiz'),
            quizSetupArea: document.getElementById('quiz-setup-area'),
            quizFileInput: document.getElementById('quiz-file'),
            quizFileName: document.getElementById('quiz-file-name'),
            
            // Interaction
            inputWord: document.getElementById('input-word'),
            btnSend: document.getElementById('btn-send'),
            btnCreate: document.getElementById('btn-create'),
            btnJoin: document.getElementById('btn-join'),
            btnLeave: document.getElementById('btn-leave'),
            inputJoinId: document.getElementById('input-join-id'),
            inputNickname: document.getElementById('input-nickname'),
            
            // Topic
            topicSection: document.getElementById('topic-section'),
            topicDisplay: document.getElementById('topic-display'),
            topicInput: document.getElementById('topic-input'),
            btnEditTopic: document.getElementById('btn-edit-topic'),
            inputSection: document.getElementById('input-section'),
            
            // Panels
            statsPanel: document.getElementById('stats-panel'),
            btnToggleStats: document.getElementById('btn-toggle-stats'),
            btnCloseStats: document.getElementById('btn-close-stats'),
            btnToggleShare: document.getElementById('btn-toggle-share'),
            shareContent: document.getElementById('share-content'),
            
            // Quiz UI
            quizView: document.getElementById('quiz-view'),
            wordCloudView: document.getElementById('word-cloud-view'),
            quizQuestionArea: document.getElementById('quiz-question-area'),
            quizResultArea: document.getElementById('quiz-result-area'),
            quizQuestionText: document.getElementById('quiz-question-text'),
            quizOptions: document.getElementById('quiz-options'),
            quizTimer: document.getElementById('quiz-question-timer'),
            quizCorrectAnswer: document.getElementById('quiz-correct-answer'),
            quizStatsDisplay: document.getElementById('quiz-stats-display'),
            quizLeaderboard: document.getElementById('quiz-leaderboard'),
            cloudStats: document.getElementById('cloud-stats'),
            quizStats: document.getElementById('quiz-stats'),
            hostQuizControls: document.getElementById('host-quiz-controls'),
            btnStartQuiz: document.getElementById('btn-start-quiz'),
            btnNextQuestion: document.getElementById('btn-next-question'),
            btnEndQuiz: document.getElementById('btn-end-quiz'),
            btnClientEndQuiz: document.getElementById('btn-client-end-quiz'),
            quizInputSection: document.getElementById('quiz-input-section'),
            quizParticipantOptions: document.getElementById('quiz-participant-options'),
            countdownOverlay: document.getElementById('countdown-overlay'),
            countdownTimer: document.querySelector('.countdown-timer'),
            allWordsList: document.getElementById('all-words-list'),
            cloudSidebarStats: document.getElementById('cloud-sidebar-stats'),
            reactionContainer: document.getElementById('reaction-container'),
            reactionBar: document.getElementById('reaction-bar'),
            btnExport: document.getElementById('btn-export'),
            contextMenu: document.getElementById('context-menu'),
            menuDeleteWord: document.getElementById('menu-delete-word'),
            settingsCard: document.getElementById('settings-card'),
            themeSelect: document.getElementById('theme-select')
        };

        this.lastReactionTime = 0;
        this.REACTION_LIMIT_MS = 200;
        this.MAX_REACTIONS = 40;

        WordCloudApp.instance = this;
        this.init();
    }

    static getInstance() {
        if (!WordCloudApp.instance) new WordCloudApp();
        return WordCloudApp.instance;
    }

    async init() {
        this.setupEventListeners();
        this.setupNetworkListeners();
        this.setupQuizListeners();
        this.setupReactionListeners();
        this.handleResize();
        
        // Upvote delegation
        this.renderer.onWordClick = (text) => this.voteWord(text);
        // Context menu delegation
        this.renderer.onWordContextMenu = (event, text) => this.showContextMenu(event, text);

        // Initialize UI state
        this.switchMode('cloud');

        if (window.innerWidth <= 1024) {
            this.ui.shareContent.classList.add('collapsed');
            this.ui.btnToggleShare.classList.add('active');
        }

        const urlParams = new URLSearchParams(window.location.search);
        const joinId = urlParams.get('join');
        if (joinId) await this.startSession(false, joinId);
    }

    setupEventListeners() {
        // Mode Toggles
        this.ui.btnModeCloud.addEventListener('click', () => this.switchMode('cloud'));
        this.ui.btnModeQuiz.addEventListener('click', () => this.switchMode('quiz'));
        
        // Quiz File Loading
        this.ui.quizFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    this.quizManager.parseMarkdown(ev.target.result);
                    this.ui.quizFileName.textContent = `Loaded: ${file.name} (${this.quizManager.questions.length} questions)`;
                };
                reader.readAsText(file);
            }
        });

        this.ui.btnCreate.addEventListener('click', () => this.startSession(true));
        this.ui.btnJoin.addEventListener('click', () => {
            const id = this.ui.inputJoinId.value.trim();
            if (id) this.startSession(false, id);
        });
        
        this.ui.btnLeave.addEventListener('click', () => this.leaveSession());
        this.ui.btnExport.addEventListener('click', () => this.exportPNG());
        this.ui.menuDeleteWord.addEventListener('click', () => {
            const word = this.ui.contextMenu.dataset.word;
            if (word) this.deleteWord(word);
            this.ui.contextMenu.classList.add('hidden');
        });
        this.ui.btnSend.addEventListener('click', () => this.sendWord());
        this.ui.inputWord.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.sendWord(); });
        
        this.ui.btnToggleStats.addEventListener('click', () => this.ui.statsPanel.classList.toggle('active'));
        this.ui.btnCloseStats.addEventListener('click', () => this.ui.statsPanel.classList.remove('active'));
        this.ui.btnToggleShare.addEventListener('click', () => {
            this.ui.shareContent.classList.toggle('collapsed');
            this.ui.btnToggleShare.classList.toggle('active');
        });

        // Topic Editing
        this.ui.btnEditTopic.addEventListener('click', () => this.toggleTopicEdit());
        this.ui.topicInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveTopic();
        });
        this.ui.topicInput.addEventListener('blur', () => this.saveTopic());

        // Host Quiz Controls
        this.ui.btnStartQuiz.addEventListener('click', () => {
            if (this.quizManager.questions.length === 0) {
                alert('Please upload a quiz file first!');
                return;
            }
            this.quizManager.setActivePeerCount(this.network.connections.size + 1);
            this.quizManager.startQuiz();
            this.network.broadcast({ type: 'QUIZ_ACTIVATE' });
        });
        this.ui.btnNextQuestion.addEventListener('click', () => this.quizManager.nextQuestion());
        this.ui.btnEndQuiz.addEventListener('click', () => this.endQuiz());
        this.ui.btnClientEndQuiz.addEventListener('click', () => this.endQuiz());

        // Quiz Participant Answer Delegation
        this.ui.quizParticipantOptions.addEventListener('click', (e) => {
            const btn = e.target.closest('.quiz-ans-btn');
            if (btn && !btn.disabled) {
                const index = parseInt(btn.dataset.index);
                this.submitMyAnswer(index);
            }
        });

        window.addEventListener('resize', () => this.handleResize());

        this.ui.themeSelect.addEventListener('change', (e) => {
            this.applyTheme(e.target.value, true);
        });
    }

    setupReactionListeners() {
        this.ui.reactionBar.addEventListener('click', (e) => {
            const btn = e.target.closest('.reaction-btn');
            if (btn) {
                const emoji = btn.dataset.emoji;
                this.sendReaction(emoji);
            }
        });
    }

    setupNetworkListeners() {
        this.network.on('message', (data) => this.handleIncomingMessage(data));
        this.network.on('peerChange', (peers) => {
            this.updatePeerUI(peers);
            // Include the host itself in the active participant count
            this.quizManager.setActivePeerCount(peers.length + 1);
            // Let everyone (incl. newly connected peers) know our nickname
            this.network.broadcast({ type: 'PLAYER_INFO', peerId: this.myId, nickname: this.nickname });
            // Drop nicknames of peers that are no longer connected
            const connected = new Set([this.myId, ...peers]);
            Array.from(this.nicknames.keys()).forEach(id => {
                if (!connected.has(id)) this.nicknames.delete(id);
            });
        });
        this.network.on('stateRequest', (peerId) => {
            const nicknames = Array.from(this.nicknames.entries());
            if (this.mode === 'cloud') {
                this.network.sendTo(peerId, {
                    type: 'STATE_SYNC',
                    words: Array.from(this.words.values()).map(w => ({ text: w.text, count: w.count })),
                    topic: this.topic,
                    theme: this.theme,
                    mode: 'cloud',
                    nicknames
                });
            } else {
                this.network.sendTo(peerId, { 
                    type: 'STATE_SYNC', 
                    theme: this.theme,
                    mode: 'quiz', 
                    nicknames 
                });
            }
        });
    }

    setupQuizListeners() {
        this.quizManager.onStateChange = (state, data) => {
            this.network.broadcast({ type: 'QUIZ_STATE', state, data });
            this.updateQuizUI(state, data);
        };
        this.quizManager.onTimerTick = (timeLeft) => {
            this.network.broadcast({ type: 'QUIZ_TIMER', timeLeft, state: this.quizManager.state });
            this.updateTimerDisplay(timeLeft, this.quizManager.state);
        };
    }

    updateTimerDisplay(time, state) {
        if (state === 'COUNTDOWN') {
            this.ui.countdownTimer.textContent = time;
        } else {
            this.ui.quizTimer.textContent = time;
        }
    }

    switchMode(mode) {
        this.mode = mode;
        this.ui.btnModeCloud.classList.toggle('active', mode === 'cloud');
        this.ui.btnModeQuiz.classList.toggle('active', mode === 'quiz');
        this.ui.quizSetupArea.classList.toggle('hidden', mode === 'cloud');
        this.ui.cloudSidebarStats.classList.toggle('hidden', mode !== 'cloud');
        
        // Update labels
        this.ui.wordsOrPointsLabel.textContent = mode === 'cloud' ? 'Unique Words' : 'Points';
    }

    handleIncomingMessage(data) {
        switch (data.type) {
            case 'NEW_WORD':
                this.addWord(data.word, true);
                break;
            case 'STATE_SYNC':
                if (data.mode) this.switchMode(data.mode);
                if (data.words) this.syncState(data.words, data.topic);
                if (data.theme) this.applyTheme(data.theme, false);
                if (data.nicknames) {
                    data.nicknames.forEach(([id, name]) => this.nicknames.set(id, String(name).slice(0, 20)));
                    this.updatePeerUI(Array.from(this.network.connections.keys()));
                }
                break;
            case 'PLAYER_INFO':
                this.nicknames.set(data.peerId, String(data.nickname).slice(0, 20));
                this.updatePeerUI(Array.from(this.network.connections.keys()));
                if (this.mode === 'quiz') this.updateLeaderboard(this.quizManager.getLeaderboard());
                break;
            case 'QUIZ_ACTIVATE':
                this.switchMode('quiz');
                this.ui.wordCloudView.classList.add('hidden');
                this.ui.quizView.classList.remove('hidden');
                this.ui.inputSection.classList.add('hidden');
                this.ui.quizInputSection.classList.remove('hidden');
                break;
            case 'QUIZ_STATE':
                this.updateQuizUI(data.state, data.data);
                break;
            case 'QUIZ_TIMER':
                this.updateTimerDisplay(data.timeLeft, data.state);
                break;
            case 'QUIZ_ANSWER':
                if (this.isHost) this.quizManager.submitAnswer(data.peerId, data.answerIndex);
                break;
            case 'QUIZ_END':
                this.switchMode('cloud');
                this.updateQuizUI('LOBBY', {});
                break;
            case 'THEME_CHANGE':
                this.applyTheme(data.theme, false);
                break;
            case 'TOPIC_CHANGE':
                this.setTopic(data.topic, false);
                break;
            case 'VOTE_WORD':
                this.addWord(data.word, true, true);
                break;
            case 'REACTION':
                this.spawnReaction(data.emoji);
                break;
            case 'DELETE_WORD':
                if (data.senderPeerId === this.hostId) {
                    this.removeWordLocal(data.word);
                } else {
                    console.warn('Unauthorized DELETE_WORD attempt from', data.senderPeerId);
                }
                break;
            default:
                console.warn('Unknown message type:', data.type);
        }
    }

    updateQuizUI(state, data) {
        // Hide/Show correct view
        this.ui.wordCloudView.classList.toggle('hidden', state !== 'LOBBY');
        this.ui.quizView.classList.toggle('hidden', state === 'LOBBY');
        this.ui.quizStats.classList.toggle('hidden', state === 'LOBBY');
        this.ui.cloudStats.classList.toggle('hidden', state !== 'LOBBY');

        const isParticipant = !this.isHost;
        this.ui.inputSection.classList.toggle('hidden', state !== 'LOBBY');
        this.ui.quizInputSection.classList.toggle('hidden', state !== 'QUESTION' || this.isHost);
        
        // Hide End buttons by default
        if (this.ui.btnEndQuiz) this.ui.btnEndQuiz.classList.add('hidden');
        if (this.ui.btnClientEndQuiz) this.ui.btnClientEndQuiz.classList.add('hidden');
        if (this.ui.btnStartQuiz && this.isHost) this.ui.btnStartQuiz.classList.toggle('hidden', state !== 'LOBBY');

        switch (state) {
            case 'LOBBY':
                this.quizManager.reset();
                if (this.isHost) {
                    this.ui.btnNextQuestion.classList.add('hidden');
                    this.ui.btnEndQuiz.classList.add('hidden');
                }
                break;
            case 'COUNTDOWN':
                this.ui.countdownOverlay.classList.remove('hidden');
                this.ui.countdownTimer.textContent = '5';
                break;
            case 'QUESTION':
                this.ui.countdownOverlay.classList.add('hidden');
                this.ui.quizQuestionArea.classList.remove('hidden');
                this.ui.quizResultArea.classList.add('hidden');
                this.ui.quizQuestionText.textContent = data.question.text;
                this.renderQuizOptions(data.question.options);
                if (this.isHost) this.ui.btnNextQuestion.classList.add('hidden');
                break;
            case 'RESULT':
                this.ui.quizQuestionArea.classList.add('hidden');
                this.ui.quizResultArea.classList.remove('hidden');
                this.renderQuizResults(data.question, data.stats);
                if (this.isHost) this.ui.btnNextQuestion.classList.remove('hidden');
                this.updateLeaderboard(data.leaderboard);
                break;
            case 'FINAL':
                this.ui.quizQuestionText.textContent = "🏆 Final Results";
                this.ui.quizOptions.innerHTML = "";
                this.ui.quizResultArea.classList.remove('hidden'); // Show leaderboard area
                this.ui.quizQuestionArea.classList.add('hidden');
                this.updateLeaderboard(data.leaderboard);
                
                // Show End buttons
                if (this.isHost) {
                    this.ui.btnEndQuiz.classList.remove('hidden');
                    this.ui.btnNextQuestion.classList.add('hidden');
                } else {
                    this.ui.btnClientEndQuiz.classList.remove('hidden');
                }
                break;
        }
    }

    endQuiz() {
        if (this.isHost) {
            this.network.broadcast({ type: 'QUIZ_END' });
        }
        this.switchMode('cloud');
        this.quizManager.reset();
        this.updateQuizUI('LOBBY', {});
    }

    renderQuizOptions(options) {
        this.ui.quizOptions.innerHTML = options.map((opt, i) => `
            <div class="quiz-option">
                <div class="quiz-option-marker opt-${i}">${String.fromCharCode(65 + i)}</div>
                <span>${opt}</span>
            </div>
        `).join('');

        if (!this.isHost) {
            this.ui.quizParticipantOptions.innerHTML = options.map((opt, i) => `
                <button class="quiz-ans-btn opt-${i}" onclick="window.app.submitMyAnswer(${i})">${String.fromCharCode(65 + i)}</button>
            `).join('');
        }
    }

    submitMyAnswer(index) {
        this.network.broadcast({ type: 'QUIZ_ANSWER', answerIndex: index, peerId: this.myId });
        // Disable buttons after answering
        const btns = this.ui.quizParticipantOptions.querySelectorAll('button');
        btns.forEach(b => b.disabled = true);
    }

    renderQuizResults(question, stats) {
        const total = stats.reduce((a, b) => a + b, 0) || 1;
        this.ui.quizStatsDisplay.innerHTML = question.options.map((opt, i) => `
            <div class="stat-bar-row">
                <div class="quiz-option-marker opt-${i}" style="width:24px; height:24px;"></div>
                <div class="stat-bar-container">
                    <div class="stat-bar opt-${i}" style="width: ${(stats[i]/total)*100}%"></div>
                </div>
                <span class="stat-value">${stats[i]}</span>
            </div>
        `).join('');
        this.ui.quizCorrectAnswer.textContent = `Correct Answer: ${question.options[question.correctIndex]}`;
    }

    updateLeaderboard(board) {
        this.ui.quizLeaderboard.innerHTML = board.map((entry, i) => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-alt); padding: 0.5rem; border-radius: 0.4rem;">
                <span style="font-weight: 600;">#${i + 1} ${this.escapeHtml(this.nicknames.get(entry.id)) || `${entry.id.substring(0, 8)}...`}</span>
                <span class="stat-value">${entry.score} pts</span>
            </div>
        `).join('');
    }

    escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    handleResize() {
        if (this.renderer && this.mode === 'cloud') this.renderer.handleResize();
    }

    async startSession(isHost, joinId = null) {
        try {
            this.isHost = isHost;
            this.network.isHost = isHost;
            this.myId = await this.network.init();
            this.hostId = isHost ? this.myId : joinId;
            this.nickname = this.ui.inputNickname.value.trim() || `Player-${this.myId.substring(0, 4)}`;
            this.nicknames.set(this.myId, this.nickname);
            
            this.ui.overlay.classList.add('hidden');
            this.ui.btnLeave.classList.remove('hidden');
            this.ui.statusIndicator.classList.add('active');
            this.ui.statusText.textContent = `Connected as ${isHost ? 'Host' : 'Participant'}`;
            
            if (isHost) {
                this.ui.topicSection.style.display = 'block';
                this.ui.btnEditTopic.classList.remove('hidden');
                this.ui.settingsCard.classList.remove('hidden');
                if (this.mode === 'quiz') this.ui.hostQuizControls.classList.remove('hidden');
            } else if (joinId) {
                this.network.connectToPeer(joinId);
            }

            this.ui.reactionBar.classList.remove('hidden');
            this.ui.btnExport.classList.remove('hidden');
            this.generateQR(isHost ? this.myId : joinId);
            this.updatePeerUI([]);
            
        } catch (err) { alert('Could not start session.'); }
    }

    leaveSession() {
        if (!confirm('Are you sure you want to leave?')) return;
        this.network.disconnect();
        location.reload(); 
    }

    updatePeerUI(peers) {
        this.ui.peerCount.textContent = peers.length + 1;
        const nameFor = (id) => this.escapeHtml(this.nicknames.get(id)) || `${id.substring(0, 8)}...`;
        
        const getAvatar = (name, isSelf) => {
            const initial = (name.trim().charAt(0) || '?').toUpperCase();
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }
            const h = Math.abs(hash % 360);
            const bg = isSelf ? `var(--primary)` : `hsl(${h}, 60%, 45%)`;
            return `<div class="hex-avatar hex-frame" style="background-color: ${bg};">${initial}</div>`;
        };

        const selfName = nameFor(this.myId);
        const selfItem = `
            <div class="peer-item self">
                ${getAvatar(selfName, true)}
                <span class="peer-name">${selfName} <span class="badge-you">(You)</span></span>
            </div>`;
        const otherItems = peers.map(id => {
            const name = nameFor(id);
            return `
                <div class="peer-item">
                    ${getAvatar(name, false)}
                    <span class="peer-name">${name}</span>
                </div>`;
        }).join('');
        this.ui.peerList.innerHTML = selfItem + otherItems;

        this.updatePresenceStrip(peers);
    }

    hashId(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    }

    updatePresenceStrip(peers) {
        if (!this.ui.presenceStrip) return;
        const palette = ['var(--primary)', 'var(--accent-color)', 'var(--accent-deep)', 'var(--secondary)', 'var(--primary-hover)'];
        const nameFor = (id) => this.escapeHtml(this.nicknames.get(id)) || `${id.substring(0, 8)}...`;
        const allIds = [this.myId, ...peers];

        // Blocky pixel-art creatures: shared body + legs, varied ears/horns, eyes, and markings per peer.
        const topperVariants = [
            '',
            '<rect x="3" y="0" width="1.5" height="1.5" fill="currentColor"/><rect x="11.5" y="0" width="1.5" height="1.5" fill="currentColor"/>',
            '<rect x="7" y="0" width="1.5" height="1.5" fill="currentColor"/><rect x="7.25" y="-0.75" width="1" height="1" fill="#fff" opacity="0.6"/>',
            '<rect x="3" y="0" width="1.5" height="1" fill="currentColor"/><rect x="11.5" y="0" width="1.5" height="1" fill="currentColor"/><rect x="3.5" y="-0.75" width="1" height="1" fill="currentColor"/><rect x="11" y="-0.75" width="1" height="1" fill="currentColor"/>'
        ];
        const eyeVariants = [
            '<rect x="4.5" y="5" width="2" height="2" fill="#3a2a20"/><rect x="9.5" y="5" width="2" height="2" fill="#3a2a20"/>',
            '<rect x="4.5" y="5" width="2" height="2" rx="1" fill="#3a2a20"/><rect x="9.5" y="5" width="2" height="2" rx="1" fill="#3a2a20"/>',
            '<rect x="4" y="5.5" width="2.5" height="1" fill="#3a2a20"/><rect x="9.5" y="5.5" width="2.5" height="1" fill="#3a2a20"/>',
            '<rect x="4" y="4.5" width="2.5" height="2.5" fill="#3a2a20"/><rect x="9.5" y="4.5" width="2.5" height="2.5" fill="#3a2a20"/>'
        ];
        const markingVariants = [
            '',
            '<rect x="6" y="7.5" width="4" height="3" fill="#fff" opacity="0.15"/>',
            '<rect x="7" y="8" width="2" height="2" fill="#fff" opacity="0.25"/>',
            '<rect x="2" y="4" width="1.5" height="6" fill="#000" opacity="0.08"/><rect x="12.5" y="4" width="1.5" height="6" fill="#000" opacity="0.08"/>'
        ];

        const buildSprite = (hash) => {
            const topper = topperVariants[hash % topperVariants.length];
            const eyes = eyeVariants[Math.floor(hash / topperVariants.length) % eyeVariants.length];
            const marking = markingVariants[Math.floor(hash / (topperVariants.length * eyeVariants.length)) % markingVariants.length];

            return '<svg viewBox="0 0 16 16" class="pixel-sprite-svg" shape-rendering="crispEdges" aria-hidden="true">'
                + topper
                + '<rect x="2" y="1" width="12" height="10" fill="currentColor"/>'
                + '<rect x="2" y="1" width="12" height="2" fill="#fff" opacity="0.2"/>'
                + '<rect x="12" y="7" width="3" height="2.5" fill="#fff" opacity="0.2"/>'
                + marking
                + eyes
                + '<g class="pixel-leg pixel-leg-a"><rect x="4" y="11" width="2.5" height="2.5" fill="currentColor"/><rect x="9.5" y="11" width="2.5" height="2.5" fill="currentColor"/></g>'
                + '<g class="pixel-leg pixel-leg-b"><rect x="3" y="11" width="2.5" height="2.5" fill="currentColor"/><rect x="10.5" y="11" width="2.5" height="2.5" fill="currentColor"/></g>'
                + '</svg>';
        };

        this.ui.presenceStrip.innerHTML = allIds.map(id => {
            const name = nameFor(id);
            const hash = this.hashId(id);
            const color = palette[hash % palette.length];
            const isHost = id === this.hostId;
            const duration = (18 + (hash % 13)).toFixed(1);
            const delay = -(hash % 17).toFixed(1);
            const legDuration = (0.4 + (hash % 5) / 20).toFixed(2);
            const faceDuration = (duration * 2).toFixed(1);

            return `<div class="presence-avatar pixel-avatar${isHost ? ' host' : ''}" style="color: ${color}; --leg-duration: ${legDuration}s; animation-duration: ${duration}s; animation-delay: ${delay}s;" title="${name}${isHost ? ' (Host)' : ''}">`
                + `<div class="pixel-sprite" style="animation-duration: ${faceDuration}s; animation-delay: ${delay}s;">${buildSprite(hash)}</div>`
                + `</div>`;
        }).join('');
    }

    generateQR(id) {
        const joinUrl = `${window.location.origin}${window.location.pathname}?join=${id}`;
        this.ui.joinUrlDisplay.textContent = joinUrl;
        this.ui.qrContainer.innerHTML = '';
        new QRCode(this.ui.qrContainer, { text: joinUrl, width: 130, height: 130, colorDark: "#282828", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H });
    }

    sendWord() {
        const word = this.ui.inputWord.value.trim();
        if (word && word.length <= 20) {
            this.addWord(word, true);
            this.network.broadcast({ type: 'NEW_WORD', word: word });
            this.ui.inputWord.value = '';
        }
    }

    addWord(text, render = true, isVote = false) {
        const key = text.toLowerCase();
        let wordObj = this.words.get(key);
        if (!wordObj) {
            wordObj = { text: text, count: 0, x: window.innerWidth / 2, y: window.innerHeight / 2 };
            this.words.set(key, wordObj);
        }
        wordObj.count++;
        this.ui.wordsOrPointsVal.textContent = this.words.size;
        if (render && this.mode === 'cloud') {
            if (isVote) {
                this.renderer.showFloatingWord(`+ ${text}`);
            } else {
                this.renderer.showFloatingWord(text);
            }
            this.renderer.update(Array.from(this.words.values()));
            this.updateStatsUI();
        }
    }

    voteWord(text) {
        this.addWord(text, true, true);
        this.network.broadcast({ type: 'VOTE_WORD', word: text });
    }

    syncState(newWords, newTopic = '') {
        newWords.forEach(w => {
            const key = w.text.toLowerCase();
            let wordObj = this.words.get(key);
            if (!wordObj) {
                wordObj = { text: w.text, count: w.count, x: window.innerWidth / 2, y: window.innerHeight / 2 };
                this.words.set(key, wordObj);
            } else wordObj.count = Math.max(wordObj.count, w.count);
        });
        if (newTopic) this.setTopic(newTopic, false);
        this.ui.wordsOrPointsVal.textContent = this.words.size;
        this.updateStatsUI(); // Ensure stats are updated after sync
        this.renderer.update(Array.from(this.words.values()));
    }

    updateStatsUI() {
        const wordsArr = Array.from(this.words.values()).sort((a, b) => b.count - a.count);
        
        // Top 5 Words (Sidebar)
        const top5 = wordsArr.slice(0, 5);
        if (top5.length === 0) {
            this.ui.topWordsList.innerHTML = '<p class="stat-label">No data yet</p>';
        } else {
            const colors = ['#B8775D', '#F48E2E', '#E86230', '#594A41', '#533527'];
            this.ui.topWordsList.innerHTML = top5.map((d, i) => `
                <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-alt); padding: 0.5rem; border-radius: 0.4rem; cursor: pointer;" onclick="window.app.voteWord('${d.text.replace(/'/g, "\\'")}')" oncontextmenu="if(window.app.isHost) { window.app.showContextMenu(event, '${d.text.replace(/'/g, "\\'")}') }" title="Click to upvote (Right-click to delete)">
                    <span style="font-weight: 600; color: ${colors[i % 5]}">#${i + 1} ${d.text}</span>
                    <span class="stat-value">${d.count}</span>
                </div>
            `).join('');
        }

        // All Words List (Panel)
        if (wordsArr.length === 0) {
            this.ui.allWordsList.innerHTML = '<p class="stat-label">No words yet</p>';
        } else {
            this.ui.allWordsList.innerHTML = wordsArr.map((d, i) => `
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.4rem 0.6rem; border-radius: 0.3rem; cursor: pointer;" onclick="window.app.voteWord('${d.text.replace(/'/g, "\\'")}')" oncontextmenu="if(window.app.isHost) { window.app.showContextMenu(event, '${d.text.replace(/'/g, "\\'")}') }" title="Click to upvote (Right-click to delete)">
                    <span>${d.text}</span>
                    <span style="opacity: 0.6; font-size: 0.75rem;">${d.count} hits</span>
                </div>
            `).join('');
        }
    }

    setTopic(text, broadcast = false) {
        this.topic = text;
        this.ui.topicSection.style.display = 'block'; // Ensure visibility
        this.ui.topicDisplay.textContent = text || 'No topic set';
        this.ui.topicInput.classList.add('hidden');
        if (broadcast && this.isHost) this.network.broadcast({ type: 'TOPIC_CHANGE', topic: this.topic });
    }

    toggleTopicEdit() {
        if (this.ui.topicInput.classList.contains('hidden')) {
            this.ui.topicInput.classList.remove('hidden');
            this.ui.topicDisplay.textContent = '';
            this.ui.topicInput.value = this.topic;
            this.ui.topicInput.focus();
        } else this.saveTopic();
    }
    saveTopic() { this.setTopic(this.ui.topicInput.value.trim(), true); }

    sendReaction(emoji) {
        const now = Date.now();
        if (now - this.lastReactionTime < this.REACTION_LIMIT_MS) return;
        
        this.lastReactionTime = now;
        this.spawnReaction(emoji);
        this.network.broadcast({ type: 'REACTION', emoji: emoji });
    }

    spawnReaction(emoji) {
        if (this.ui.reactionContainer.children.length >= this.MAX_REACTIONS) {
            this.ui.reactionContainer.removeChild(this.ui.reactionContainer.firstChild);
        }

        const el = document.createElement('div');
        el.className = 'reaction-item';
        el.textContent = emoji;
        
        // Random horizontal position (20% to 80%)
        const x = 20 + Math.random() * 60;
        el.style.left = `${x}%`;
        
        // Random horizontal drift for CSS variable
        el.style.setProperty('--rand-x', Math.random() * 2 - 1);
        
        this.ui.reactionContainer.appendChild(el);

        // Auto-cleanup after animation
        el.addEventListener('animationend', () => {
            if (el.parentNode === this.ui.reactionContainer) {
                this.ui.reactionContainer.removeChild(el);
            }
        });
    }

    exportPNG() {
        const svgEl = document.getElementById('word-cloud-svg');
        if (!svgEl) return;

        const width = svgEl.clientWidth || svgEl.getBoundingClientRect().width || 800;
        const height = svgEl.clientHeight || svgEl.getBoundingClientRect().height || 600;
        const scale = 2; // High-resolution scale factor

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');

        // Draw background matching var(--card-bg) -> #FFFFFF
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Clone SVG and set explicit width/height
        const clonedSvg = svgEl.cloneNode(true);
        clonedSvg.setAttribute('width', width);
        clonedSvg.setAttribute('height', height);

        // Serialize SVG
        const svgString = new XMLSerializer().serializeToString(clonedSvg);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
            // Draw SVG onto canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Draw topic if set
            if (this.topic) {
                ctx.save();
                ctx.fillStyle = '#533527';
                ctx.font = `800 ${18 * scale}px 'IBM Plex Sans Thai', 'Noto Sans Thai', sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(this.topic, canvas.width / 2, 20 * scale);
                ctx.restore();
            }

            // Draw premium watermark
            ctx.save();
            ctx.fillStyle = 'rgba(122, 122, 122, 0.5)';
            ctx.font = `600 ${10 * scale}px 'IBM Plex Sans Thai', 'Noto Sans Thai', sans-serif`;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillText('CloudWord • Collaborative P2P', canvas.width - (16 * scale), canvas.height - (16 * scale));
            ctx.restore();

            // Trigger download
            const dataUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `cloudword-${this.topic ? this.topic.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'cloud'}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Cleanup
            URL.revokeObjectURL(url);
        };

        img.onerror = (err) => {
            console.error('Failed to export image:', err);
            alert('Export failed. Please try again.');
            URL.revokeObjectURL(url);
        };

        img.src = url;
    }

    showContextMenu(event, text) {
        if (!this.isHost) return;
        event.preventDefault();

        this.ui.contextMenu.style.left = `${event.pageX}px`;
        this.ui.contextMenu.style.top = `${event.pageY}px`;
        this.ui.contextMenu.classList.remove('hidden');
        this.ui.contextMenu.dataset.word = text;

        const hideMenu = () => {
            this.ui.contextMenu.classList.add('hidden');
            document.removeEventListener('click', hideMenu);
        };

        setTimeout(() => {
            document.addEventListener('click', hideMenu);
        }, 10);
    }

    deleteWord(text) {
        this.removeWordLocal(text);
        this.network.broadcast({ type: 'DELETE_WORD', word: text });
    }

    removeWordLocal(text) {
        const key = text.toLowerCase();
        if (this.words.has(key)) {
            this.words.delete(key);
            this.ui.wordsOrPointsVal.textContent = this.words.size;
            if (this.mode === 'cloud') {
                this.renderer.update(Array.from(this.words.values()));
                this.updateStatsUI();
            }
        }
    }

    applyTheme(theme, broadcast = true) {
        this.theme = theme;
        document.body.setAttribute('data-theme', theme);
        if (this.ui.themeSelect) this.ui.themeSelect.value = theme;
        this.renderer.setTheme(theme);
        if (broadcast && this.isHost) {
            this.network.broadcast({ type: 'THEME_CHANGE', theme });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = WordCloudApp.getInstance();
});
