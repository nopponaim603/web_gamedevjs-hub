/**
 * QuizEditor - Standalone Web UI for creating and editing Quiz question sets.
 * Supports multiple quiz sets (question bank), live preview, validation,
 * import/export of .md (compatible with QuizManager.parseMarkdown) and .json,
 * with auto-save to localStorage.
 */

const STORAGE_KEY = 'cloudword_quiz_sets_v1';
const OPTION_COLORS = ['#e21b3c', '#1368ce', '#d89e00', '#26890c', '#7c3aed', '#db2777'];

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function emptyQuestion() {
    return { text: '', options: ['', ''], correctIndex: -1 };
}

function emptySet(name = 'Untitled Quiz') {
    return { id: uid(), name, questions: [emptyQuestion()], updatedAt: Date.now() };
}

/**
 * Parse Markdown content into question objects.
 * Mirrors QuizManager.parseMarkdown so exported files are compatible.
 */
function parseMarkdown(md) {
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
            const optionText = trimmed.replace(/- \[[xX ]\]/, '').trim();
            currentQ.options.push(optionText);
            if (isCorrect) currentQ.correctIndex = currentQ.options.length - 1;
        }
    });
    if (currentQ) questions.push(currentQ);
    return questions;
}

function toMarkdown(questions) {
    return questions.map(q => {
        const lines = [`## ${q.text}`];
        q.options.forEach((opt, i) => {
            lines.push(`- [${i === q.correctIndex ? 'x' : ' '}] ${opt}`);
        });
        return lines.join('\n');
    }).join('\n\n') + '\n';
}

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function slugify(name) {
    return (name || 'quiz').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'quiz';
}

class QuizEditorApp {
    constructor() {
        this.ui = {
            setList: document.getElementById('quiz-set-list'),
            setNameInput: document.getElementById('set-name-input'),
            validationSummary: document.getElementById('validation-summary'),
            questionList: document.getElementById('question-list'),
            previewArea: document.getElementById('preview-area'),
            saveStatus: document.getElementById('save-status'),
            btnNewSet: document.getElementById('btn-new-set'),
            btnAddQuestion: document.getElementById('btn-add-question'),
            btnImportMd: document.getElementById('btn-import-md'),
            btnImportJson: document.getElementById('btn-import-json'),
            btnExportMd: document.getElementById('btn-export-md'),
            btnExportJson: document.getElementById('btn-export-json'),
            fileImportMd: document.getElementById('file-import-md'),
            fileImportJson: document.getElementById('file-import-json'),
        };

        this.sets = {};
        this.currentSetId = null;
        this.autosaveTimer = null;

        this.loadFromStorage();
        this.bindEvents();
        this.renderSetList();
        this.renderEditor();
    }

    // ---------------- Storage ----------------

    loadFromStorage() {
        let stored = null;
        try {
            stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        } catch (e) { stored = null; }

        if (stored && stored.sets && Object.keys(stored.sets).length > 0) {
            this.sets = stored.sets;
            this.currentSetId = stored.lastSetId && this.sets[stored.lastSetId]
                ? stored.lastSetId
                : Object.keys(this.sets)[0];
        } else {
            const initial = emptySet('My First Quiz');
            this.sets = { [initial.id]: initial };
            this.currentSetId = initial.id;
            this.persist();
        }
    }

    persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            sets: this.sets,
            lastSetId: this.currentSetId
        }));
    }

    scheduleAutosave() {
        if (this.ui.saveStatus) this.ui.saveStatus.textContent = 'Saving...';
        clearTimeout(this.autosaveTimer);
        this.autosaveTimer = setTimeout(() => {
            this.currentSet.updatedAt = Date.now();
            this.persist();
            if (this.ui.saveStatus) this.ui.saveStatus.textContent = 'Saved';
        }, 400);
    }

    get currentSet() {
        return this.sets[this.currentSetId];
    }

    // ---------------- Events ----------------

    bindEvents() {
        this.ui.btnNewSet.addEventListener('click', () => this.createSet());
        this.ui.btnAddQuestion.addEventListener('click', () => this.addQuestion());

        this.ui.setNameInput.addEventListener('input', (e) => {
            this.currentSet.name = e.target.value;
            this.renderSetList();
            this.scheduleAutosave();
        });

        this.ui.btnExportMd.addEventListener('click', () => this.exportMarkdown());
        this.ui.btnExportJson.addEventListener('click', () => this.exportJson());

        this.ui.btnImportMd.addEventListener('click', () => this.ui.fileImportMd.click());
        this.ui.btnImportJson.addEventListener('click', () => this.ui.fileImportJson.click());

        this.ui.fileImportMd.addEventListener('change', (e) => this.handleImportMd(e));
        this.ui.fileImportJson.addEventListener('change', (e) => this.handleImportJson(e));
    }

    // ---------------- Quiz Set management ----------------

    createSet() {
        const set = emptySet(`Quiz ${Object.keys(this.sets).length + 1}`);
        this.sets[set.id] = set;
        this.currentSetId = set.id;
        this.persist();
        this.renderSetList();
        this.renderEditor();
    }

    duplicateSet(id) {
        const source = this.sets[id];
        if (!source) return;
        const copy = {
            id: uid(),
            name: `${source.name} (Copy)`,
            questions: JSON.parse(JSON.stringify(source.questions)),
            updatedAt: Date.now()
        };
        this.sets[copy.id] = copy;
        this.currentSetId = copy.id;
        this.persist();
        this.renderSetList();
        this.renderEditor();
    }

    deleteSet(id) {
        if (Object.keys(this.sets).length <= 1) {
            alert('At least one quiz set must remain.');
            return;
        }
        if (!confirm(`Delete quiz set "${this.sets[id].name}"? This cannot be undone.`)) return;

        delete this.sets[id];
        if (this.currentSetId === id) {
            this.currentSetId = Object.keys(this.sets)[0];
        }
        this.persist();
        this.renderSetList();
        this.renderEditor();
    }

    selectSet(id) {
        if (id === this.currentSetId) return;
        this.currentSetId = id;
        this.persist();
        this.renderSetList();
        this.renderEditor();
    }

    // ---------------- Question / Option management ----------------

    addQuestion() {
        this.currentSet.questions.push(emptyQuestion());
        this.scheduleAutosave();
        this.renderEditor();
    }

    removeQuestion(qIndex) {
        if (this.currentSet.questions.length <= 1) {
            alert('A quiz must have at least one question.');
            return;
        }
        this.currentSet.questions.splice(qIndex, 1);
        this.scheduleAutosave();
        this.renderEditor();
    }

    moveQuestion(qIndex, dir) {
        const questions = this.currentSet.questions;
        const target = qIndex + dir;
        if (target < 0 || target >= questions.length) return;
        [questions[qIndex], questions[target]] = [questions[target], questions[qIndex]];
        this.scheduleAutosave();
        this.renderEditor();
    }

    addOption(qIndex) {
        const q = this.currentSet.questions[qIndex];
        if (q.options.length >= 6) {
            alert('Maximum 6 options per question.');
            return;
        }
        q.options.push('');
        this.scheduleAutosave();
        this.renderEditor();
    }

    removeOption(qIndex, oIndex) {
        const q = this.currentSet.questions[qIndex];
        if (q.options.length <= 2) {
            alert('A question must have at least 2 options.');
            return;
        }
        q.options.splice(oIndex, 1);
        if (q.correctIndex === oIndex) q.correctIndex = -1;
        else if (q.correctIndex > oIndex) q.correctIndex--;
        this.scheduleAutosave();
        this.renderEditor();
    }

    setCorrectOption(qIndex, oIndex) {
        this.currentSet.questions[qIndex].correctIndex = oIndex;
        this.scheduleAutosave();
        this.renderEditor();
    }

    // ---------------- Validation ----------------

    validate() {
        const issues = [];
        this.currentSet.questions.forEach((q, qIndex) => {
            const qIssues = [];
            if (!q.text.trim()) qIssues.push('Question text is empty.');
            if (q.options.length < 2) qIssues.push('At least 2 options are required.');
            if (q.options.some(o => !o.trim())) qIssues.push('Some options are empty.');
            if (q.correctIndex < 0 || q.correctIndex >= q.options.length) qIssues.push('No correct answer selected.');
            if (qIssues.length > 0) issues.push({ qIndex, messages: qIssues });
        });
        return issues;
    }

    // ---------------- Rendering ----------------

    renderSetList() {
        const ids = Object.keys(this.sets).sort((a, b) => (this.sets[b].updatedAt || 0) - (this.sets[a].updatedAt || 0));
        this.ui.setList.innerHTML = ids.map(id => {
            const set = this.sets[id];
            const isActive = id === this.currentSetId;
            return `
                <div class="quiz-set-item ${isActive ? 'active' : ''}" data-id="${id}">
                    <span class="quiz-set-name" title="${this.escape(set.name)}">${this.escape(set.name)} <span class="stat-label">(${set.questions.length})</span></span>
                    <div class="quiz-set-actions">
                        <button class="duplicate-set" title="Duplicate">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                        <button class="delete-set" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        this.ui.setList.querySelectorAll('.quiz-set-item').forEach(el => {
            const id = el.dataset.id;
            el.addEventListener('click', (e) => {
                if (e.target.closest('.duplicate-set') || e.target.closest('.delete-set')) return;
                this.selectSet(id);
            });
            el.querySelector('.duplicate-set').addEventListener('click', (e) => { e.stopPropagation(); this.duplicateSet(id); });
            el.querySelector('.delete-set').addEventListener('click', (e) => { e.stopPropagation(); this.deleteSet(id); });
        });
    }

    renderEditor() {
        this.ui.setNameInput.value = this.currentSet.name;
        this.renderQuestionList();
        this.renderValidation();
        this.renderPreview();
    }

    renderQuestionList() {
        const questions = this.currentSet.questions;
        this.ui.questionList.innerHTML = questions.map((q, qIndex) => `
            <div class="card question-card" data-qindex="${qIndex}">
                <div class="question-card-header">
                    <span class="question-number">Q${qIndex + 1}</span>
                    <div class="question-actions">
                        <button class="move-up" title="Move up" ${qIndex === 0 ? 'disabled' : ''}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                        </button>
                        <button class="move-down" title="Move down" ${qIndex === questions.length - 1 ? 'disabled' : ''}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>
                        <button class="remove-question" title="Remove question">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>
                <textarea class="question-text-input" placeholder="Type your question here..." rows="2">${this.escape(q.text)}</textarea>
                <div class="options-list">
                    ${q.options.map((opt, oIndex) => `
                        <div class="option-row" data-oindex="${oIndex}">
                            <input type="radio" class="correct-radio" name="correct-${qIndex}" ${q.correctIndex === oIndex ? 'checked' : ''} title="Mark as correct answer">
                            <input type="text" class="option-text-input" placeholder="Option ${String.fromCharCode(65 + oIndex)}" value="${this.escape(opt)}" style="border-left: 4px solid ${OPTION_COLORS[oIndex % OPTION_COLORS.length]};">
                            <button class="remove-option" title="Remove option">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <button class="secondary add-option-btn">+ Add Option</button>
                <div class="question-errors"></div>
            </div>
        `).join('');

        this.bindQuestionCardEvents();
    }

    bindQuestionCardEvents() {
        this.ui.questionList.querySelectorAll('.question-card').forEach(card => {
            const qIndex = parseInt(card.dataset.qindex);

            card.querySelector('.move-up').addEventListener('click', () => this.moveQuestion(qIndex, -1));
            card.querySelector('.move-down').addEventListener('click', () => this.moveQuestion(qIndex, 1));
            card.querySelector('.remove-question').addEventListener('click', () => this.removeQuestion(qIndex));
            card.querySelector('.add-option-btn').addEventListener('click', () => this.addOption(qIndex));

            card.querySelector('.question-text-input').addEventListener('input', (e) => {
                this.currentSet.questions[qIndex].text = e.target.value;
                this.scheduleAutosave();
                this.renderValidationFor(qIndex);
                this.renderPreview();
            });

            card.querySelectorAll('.option-row').forEach(row => {
                const oIndex = parseInt(row.dataset.oindex);

                row.querySelector('.option-text-input').addEventListener('input', (e) => {
                    this.currentSet.questions[qIndex].options[oIndex] = e.target.value;
                    this.scheduleAutosave();
                    this.renderValidationFor(qIndex);
                    this.renderPreview();
                });

                row.querySelector('.correct-radio').addEventListener('change', () => this.setCorrectOption(qIndex, oIndex));
                row.querySelector('.remove-option').addEventListener('click', () => this.removeOption(qIndex, oIndex));
            });
        });
    }

    renderValidation() {
        const issues = this.validate();
        if (issues.length === 0) {
            this.ui.validationSummary.textContent = `✓ All ${this.currentSet.questions.length} question(s) look good. Ready to export.`;
            this.ui.validationSummary.className = 'validation-summary ok';
        } else {
            this.ui.validationSummary.textContent = `⚠ ${issues.length} question(s) need attention before exporting.`;
            this.ui.validationSummary.className = 'validation-summary error';
        }

        const cards = this.ui.questionList.querySelectorAll('.question-card');
        cards.forEach((card, qIndex) => {
            const errBox = card.querySelector('.question-errors');
            const found = issues.find(i => i.qIndex === qIndex);
            errBox.innerHTML = found ? found.messages.map(m => `<div>• ${this.escape(m)}</div>`).join('') : '';
        });

        return issues;
    }

    renderValidationFor(qIndex) {
        const issues = this.validate();
        if (issues.length === 0) {
            this.ui.validationSummary.textContent = `✓ All ${this.currentSet.questions.length} question(s) look good. Ready to export.`;
            this.ui.validationSummary.className = 'validation-summary ok';
        } else {
            this.ui.validationSummary.textContent = `⚠ ${issues.length} question(s) need attention before exporting.`;
            this.ui.validationSummary.className = 'validation-summary error';
        }

        const card = this.ui.questionList.querySelector(`.question-card[data-qindex="${qIndex}"]`);
        if (!card) return;
        const errBox = card.querySelector('.question-errors');
        const found = issues.find(i => i.qIndex === qIndex);
        errBox.innerHTML = found ? found.messages.map(m => `<div>• ${this.escape(m)}</div>`).join('') : '';
    }

    renderPreview() {
        const questions = this.currentSet.questions;
        if (questions.length === 0) {
            this.ui.previewArea.innerHTML = '<div class="preview-empty">No questions yet.</div>';
            return;
        }

        this.ui.previewArea.innerHTML = questions.map((q, qIndex) => `
            <div class="preview-quiz-card" style="margin-bottom: 1rem;">
                <div class="stat-label">Question ${qIndex + 1}</div>
                <h3 class="quiz-question">${this.escape(q.text) || '<em>Untitled question</em>'}</h3>
                <div class="quiz-options-grid">
                    ${q.options.map((opt, oIndex) => `
                        <div class="quiz-option">
                            <div class="quiz-option-marker" style="background: ${OPTION_COLORS[oIndex % OPTION_COLORS.length]}; ${q.correctIndex === oIndex ? 'box-shadow: 0 0 0 2px var(--success);' : ''}">${String.fromCharCode(65 + oIndex)}</div>
                            <span>${this.escape(opt) || '<em>(empty)</em>'}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // ---------------- Import / Export ----------------

    exportMarkdown() {
        const issues = this.validate();
        if (issues.length > 0 && !confirm(`${issues.length} question(s) have validation issues. Export anyway?`)) return;
        const md = toMarkdown(this.currentSet.questions);
        downloadFile(`${slugify(this.currentSet.name)}.md`, md, 'text/markdown;charset=utf-8');
    }

    exportJson() {
        const issues = this.validate();
        if (issues.length > 0 && !confirm(`${issues.length} question(s) have validation issues. Export anyway?`)) return;
        const json = JSON.stringify({ name: this.currentSet.name, questions: this.currentSet.questions }, null, 2);
        downloadFile(`${slugify(this.currentSet.name)}.json`, json, 'application/json');
    }

    handleImportMd(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const questions = parseMarkdown(ev.target.result);
            if (questions.length === 0) {
                alert('No questions found in this Markdown file.');
                return;
            }
            const set = { id: uid(), name: file.name.replace(/\.md$/i, ''), questions, updatedAt: Date.now() };
            this.sets[set.id] = set;
            this.currentSetId = set.id;
            this.persist();
            this.renderSetList();
            this.renderEditor();
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    handleImportJson(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            let data;
            try {
                data = JSON.parse(ev.target.result);
            } catch (err) {
                alert('Invalid JSON file.');
                return;
            }
            const questions = Array.isArray(data) ? data : data.questions;
            const name = Array.isArray(data) ? file.name.replace(/\.json$/i, '') : (data.name || file.name.replace(/\.json$/i, ''));
            if (!Array.isArray(questions) || questions.length === 0) {
                alert('No questions found in this JSON file.');
                return;
            }
            const set = {
                id: uid(),
                name,
                questions: questions.map(q => ({
                    text: q.text || '',
                    options: Array.isArray(q.options) ? q.options : ['', ''],
                    correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : -1
                })),
                updatedAt: Date.now()
            };
            this.sets[set.id] = set;
            this.currentSetId = set.id;
            this.persist();
            this.renderSetList();
            this.renderEditor();
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    // ---------------- Helpers ----------------

    escape(str) {
        return String(str ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.quizEditor = new QuizEditorApp();
});
