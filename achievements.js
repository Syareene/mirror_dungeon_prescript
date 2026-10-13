/**
 * 実績管理 & 隠し実績判定エンジン (achievements.js)
 */

const ACHIEVEMENTS_STORAGE_KEY = 'lcb_achievements_v2';
const CHECKSUM_SALT = 'lcb_prescript_salt_key_2026';

const MISSION_FILES = [
    'missions/theme_pack.json',
    'missions/identity.json',
    'missions/shop_gift.json',
    'missions/battle.json',
    'missions/keyword.json',
    'missions/extreme.json'
];

window.fetchAllMissions = async function() {
    const responses = await Promise.all(MISSION_FILES.map(f => fetch(f)));
    const jsons = await Promise.all(responses.map(r => r.json()));
    return jsons.flat();
};

/**
 * 隠し実績の条件判定エンジン (Registry Pattern)
 */
class SecretEvaluatorRegistry {
    constructor() {
        this.evaluators = new Map();
    }

    register(type, evaluatorFn) {
        this.evaluators.set(type, evaluatorFn);
    }

    evaluate(secret, userStats) {
        const evaluator = this.evaluators.get(secret.condition.type);
        if (!evaluator) {
            console.warn(`未定義の判定タイプ: ${secret.condition.type}`);
            return false;
        }
        return evaluator(secret.condition, userStats);
    }
}

const secretEvaluator = new SecretEvaluatorRegistry();

// 1. ミッション組合せ判定
secretEvaluator.register('mission_combo', (cond, stats) => {
    if (!cond.requiredMissionIds || !Array.isArray(cond.requiredMissionIds)) return false;
    return cond.requiredMissionIds.every(id => (stats.achievedMissionIds || []).includes(id));
});

// 2. 累計ビンゴライン数判定
secretEvaluator.register('bingo_lines', (cond, stats) => {
    return (stats.totalLines || 0) >= (cond.count || 1);
});

// 3. 累計クリア回数判定
secretEvaluator.register('total_clears', (cond, stats) => {
    return (stats.totalClears || 0) >= (cond.count || 1);
});

// 4. 特定ミッション達成 + 累計クリア数判定
secretEvaluator.register('mission_and_clears', (cond, stats) => {
    const hasMission = (stats.achievedMissionIds || []).includes(cond.requiredMissionId);
    const hasClears = (stats.totalClears || 0) >= (cond.clearCount || 1);
    return hasMission && hasClears;
});


class AchievementManager {
    constructor() {
        this.allMissions = [];
        this.allSecrets = [];
        this.data = {
            achievedMissionIds: [],
            totalLines: 0,
            totalClears: 0,
            unlockedSecretIds: []
        };
        this.isCorrupted = false;
        this.isLoaded = false;

        // UI表示・ソート状態
        this.currentSort = 'level'; // 'level' | 'displayTag' | 'all'
        this.currentFilter = 'all'; // 'all' | 'unlocked' | 'locked'
    }

    async init() {
        try {
            const [missions, sRes] = await Promise.all([
                window.fetchAllMissions(),
                fetch('secrets.json')
            ]);
            this.allMissions = missions;
            this.allSecrets = await sRes.json();
            this.isLoaded = true;
        } catch (e) {
            console.error("ミッションデータの取得に失敗しました:", e);
        }

        await this.loadData();
        this.render();
    }

    async calculateChecksum(payloadObj) {
        const str = JSON.stringify(payloadObj) + CHECKSUM_SALT;
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async loadData() {
        const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
        if (!raw) return;

        try {
            const parsed = JSON.parse(raw);
            if (!parsed.data || !parsed.hash) {
                this.isCorrupted = true;
                return;
            }

            const expectedHash = await this.calculateChecksum(parsed.data);
            if (expectedHash !== parsed.hash) {
                console.warn("改ざんまたは破損が検出されました。");
                this.isCorrupted = true;
            } else {
                this.data = parsed.data;
                if (!this.data.achievedMissionIds) this.data.achievedMissionIds = [];
                if (!this.data.unlockedSecretIds) this.data.unlockedSecretIds = [];
                this.isCorrupted = false;
            }
        } catch (e) {
            console.error("実績データの読み込みエラー:", e);
            this.isCorrupted = true;
        }
    }

    async saveData() {
        try {
            const hash = await this.calculateChecksum(this.data);
            const payload = {
                data: this.data,
                hash: hash
            };
            localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
            console.error("実績データの保存エラー:", e);
        }
    }

    async recordChallengeCompletion(completedMissionIds, lineCount, isFullCardClear) {
        if (!this.isLoaded) {
            await this.init();
        }

        completedMissionIds.forEach(id => {
            if (!this.data.achievedMissionIds.includes(id)) {
                this.data.achievedMissionIds.push(id);
            }
        });

        if (lineCount > 0) {
            this.data.totalLines = (this.data.totalLines || 0) + lineCount;
        }
        this.data.totalClears = (this.data.totalClears || 0) + 1;

        const newlyUnlockedSecrets = [];
        this.allSecrets.forEach(secret => {
            if (!this.data.unlockedSecretIds.includes(secret.id)) {
                const isUnlocked = secretEvaluator.evaluate(secret, this.data);
                if (isUnlocked) {
                    this.data.unlockedSecretIds.push(secret.id);
                    newlyUnlockedSecrets.push(secret.title);
                }
            }
        });

        await this.saveData();
        this.render();

        return newlyUnlockedSecrets;
    }

    async resetData() {
        this.data = {
            achievedMissionIds: [],
            totalLines: 0,
            totalClears: 0,
            unlockedSecretIds: []
        };
        this.isCorrupted = false;
        await this.saveData();
        this.render();
    }

    /**
     * フィルター適用後のミッション配列を返す
     */
    getFilteredMissions() {
        return this.allMissions.filter(m => {
            const isDone = (this.data.achievedMissionIds || []).includes(m.id);
            if (this.currentFilter === 'unlocked') return isDone;
            if (this.currentFilter === 'locked') return !isDone;
            return true;
        });
    }

    /**
     * 単一のミッションカード HTML を生成
     */
    renderMissionCardHtml(m) {
        const isDone = (this.data.achievedMissionIds || []).includes(m.id);
        const displayTags = m.displayTags && m.displayTags.length > 0 ? m.displayTags : [];

        const tagsHtml = displayTags.length > 0 ? `
            <div class="card-tags">
                ${displayTags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
        ` : '';

        const noteHtml = m.note ? `
            <div class="note-toggle-btn" onclick="this.nextElementSibling.classList.toggle('show')">💡 補足</div>
            <div class="card-note-detail">${m.note}</div>
        ` : '';

        const sourceHtml = m.source ? `
            <div class="card-source">${m.source}</div>
        ` : '';

        return `
            <div class="achievement-card ${isDone ? 'done' : 'locked'}">
                <div class="card-top-row">
                    <div class="card-status-icon">${isDone ? '★' : '🔒'}</div>
                    <div class="card-info">
                        <div class="card-title">Lv.${m.level} - ${m.title}</div>
                        <div class="card-desc">${m.description}</div>
                        ${noteHtml}
                        ${tagsHtml}
                    </div>
                </div>
                ${sourceHtml}
            </div>
        `;
    }

    /**
     * 実績一覧タブの描画
     */
    render() {
        const container = document.getElementById('achievementsContainer');
        if (!container) return;

        if (!this.isLoaded) {
            const isFile = window.location.protocol === 'file:';
            container.innerHTML = `
                <div class="alert-box warning" style="padding: 20px; background: rgba(50, 20, 20, 0.8); border: 2px solid #e74c3c; border-radius: 8px; margin: 20px 0; color: #fff;">
                    <h3 style="color: #ff6b6b; margin-top: 0;">⚠️ ミッションデータを読み込めませんでした</h3>
                    <p style="line-height: 1.6;">${isFile
                        ? '現在ローカルファイル（<code>file:///</code>）から直接開かれています。<br>ブラウザのセキュリティ仕様（CORS制限）により外部JSONの取得がブロックされています。<br><br>💡 <strong>ローカルWebサーバー（VS Codeの「Live Server」や <code>npx serve</code> など）経由</strong> または <strong>GitHub Pages</strong> 上でご確認ください。'
                        : 'ミッションJSONファイルの取得に失敗しました。コンソールログをご確認ください。'}</p>
                </div>
            `;
            return;
        }

        if (this.isCorrupted) {
            container.innerHTML = `
                <div class="alert-box warning">
                    <h3>⚠️ データ改ざんまたは破損が検出されました</h3>
                    <p>保存されている実績データの整合性チェックに失敗しました。</p>
                    <button id="resetAchievementsBtn" class="btn-danger">実績データを初期化する</button>
                </div>
            `;
            document.getElementById('resetAchievementsBtn')?.addEventListener('click', () => {
                if (confirm("実績データを初期化しますか？この操作は取り消せません。")) {
                    this.resetData();
                }
            });
            return;
        }

        const totalMissions = this.allMissions.length;
        const achievedCount = (this.data.achievedMissionIds || []).length;
        const progressPercent = totalMissions > 0 ? Math.round((achievedCount / totalMissions) * 100) : 0;

        let html = `
            <div class="achievements-summary">
                <div class="summary-card">
                    <span class="summary-label">累計達成ミッション</span>
                    <span class="summary-val">${achievedCount} / ${totalMissions} (${progressPercent}%)</span>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
                    </div>
                </div>
                <div class="summary-card">
                    <span class="summary-label">累計達成ライン</span>
                    <span class="summary-val">${this.data.totalLines || 0}</span>
                </div>
                <div class="summary-card">
                    <span class="summary-label">累計カードクリア数</span>
                    <span class="summary-val">${this.data.totalClears || 0}</span>
                </div>
            </div>

            <!-- コントロールバー (ソート & フィルター) -->
            <div class="achievement-controls">
                <div class="control-group">
                    <label for="achieveSortSelect">グループ分け:</label>
                    <select id="achieveSortSelect">
                        <option value="level" ${this.currentSort === 'level' ? 'selected' : ''}>難易度 (Level) 別</option>
                        <option value="displayTag" ${this.currentSort === 'displayTag' ? 'selected' : ''}>表示カテゴリ (タグ) 別</option>
                        <option value="all" ${this.currentSort === 'all' ? 'selected' : ''}>全件リスト</option>
                    </select>
                </div>

                <div class="control-group">
                    <label for="achieveFilterSelect">達成状態:</label>
                    <select id="achieveFilterSelect">
                        <option value="all" ${this.currentFilter === 'all' ? 'selected' : ''}>すべて表示</option>
                        <option value="unlocked" ${this.currentFilter === 'unlocked' ? 'selected' : ''}>達成済みのみ</option>
                        <option value="locked" ${this.currentFilter === 'locked' ? 'selected' : ''}>未達成のみ</option>
                    </select>
                </div>
            </div>

            <h2>【一般ミッション実績】</h2>
        `;

        const filteredMissions = this.getFilteredMissions();

        if (this.currentSort === 'level') {
            // Level別表示
            for (let level = 1; level <= 5; level++) {
                const groupMissions = filteredMissions.filter(m => m.level === level);
                if (groupMissions.length === 0) continue;
                const totalInLevel = this.allMissions.filter(m => m.level === level).length;
                const levelAchieved = this.allMissions.filter(m => m.level === level && (this.data.achievedMissionIds || []).includes(m.id)).length;

                html += `
                    <div class="achievement-level-group">
                        <h3 class="level-header">Level ${level} <span class="level-count">(${levelAchieved}/${totalInLevel})</span></h3>
                        <div class="achievement-grid">
                            ${groupMissions.map(m => this.renderMissionCardHtml(m)).join('')}
                        </div>
                    </div>
                `;
            }
        } else if (this.currentSort === 'displayTag') {
            // 表示用タグ別グループ表示
            const tagMap = new Map();
            filteredMissions.forEach(m => {
                const tags = m.displayTags && m.displayTags.length > 0 ? m.displayTags : ['未分類'];
                tags.forEach(t => {
                    if (!tagMap.has(t)) tagMap.set(t, []);
                    tagMap.get(t).push(m);
                });
            });

            if (tagMap.size === 0) {
                html += `<p style="color: #aaa; text-align: center;">該当するミッションがありません。</p>`;
            } else {
                tagMap.forEach((gMissions, tagName) => {
                    html += `
                        <div class="achievement-level-group">
                            <h3 class="level-header">🏷️ ${tagName} <span class="level-count">(${gMissions.length}件)</span></h3>
                            <div class="achievement-grid">
                                ${gMissions.map(m => this.renderMissionCardHtml(m)).join('')}
                            </div>
                        </div>
                    `;
                });
            }
        } else {
            // フラット全件表示
            html += `
                <div class="achievement-grid">
                    ${filteredMissions.map(m => this.renderMissionCardHtml(m)).join('')}
                </div>
            `;
        }

        // 隠し実績コーナー
        html += `
            <h2 style="margin-top: 35px;">【隠し実績 (Secret Achievements)】</h2>
            <div class="achievement-grid secrets-grid">
        `;

        this.allSecrets.forEach(sec => {
            const isUnlocked = (this.data.unlockedSecretIds || []).includes(sec.id);
            if (this.currentFilter === 'unlocked' && !isUnlocked) return;
            if (this.currentFilter === 'locked' && isUnlocked) return;

            html += `
                <div class="achievement-card secret-card ${isUnlocked ? 'unlocked' : 'secret-locked'}">
                    <div class="card-top-row">
                        <div class="card-status-icon">${isUnlocked ? '🏆' : '❓'}</div>
                        <div class="card-info">
                            <div class="card-title">${isUnlocked ? sec.title : '??? (隠し実績)'}</div>
                            <div class="card-desc">${isUnlocked ? sec.description : '特定条件を達成することで解禁されます'}</div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;

        // イベントリスナーの再紐付け
        document.getElementById('achieveSortSelect')?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.render();
        });

        document.getElementById('achieveFilterSelect')?.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.render();
        });
    }
}

window.achievementManager = new AchievementManager();
