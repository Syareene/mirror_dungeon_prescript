/**
 * 実績管理 & 隠し実績判定エンジン (achievements.js)
 */

const ACHIEVEMENTS_STORAGE_KEY = 'lcb_achievements_v1';
const CHECKSUM_SALT = 'lcb_prescript_salt_key_2026';

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
    }

    async init() {
        try {
            const [mRes, sRes] = await Promise.all([
                fetch('missions.json'),
                fetch('secrets.json')
            ]);
            this.allMissions = await mRes.json();
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

        // ミッション追加 (重複排除)
        completedMissionIds.forEach(id => {
            if (!this.data.achievedMissionIds.includes(id)) {
                this.data.achievedMissionIds.push(id);
            }
        });

        // 累計ライン数 & クリア数更新
        if (lineCount > 0) {
            this.data.totalLines = (this.data.totalLines || 0) + lineCount;
        }
        this.data.totalClears = (this.data.totalClears || 0) + 1;

        // 隠し実績の評価
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

    render() {
        const container = document.getElementById('achievementsContainer');
        if (!container) return;

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

            <h2>【一般ミッション実績】</h2>
        `;

        for (let level = 1; level <= 5; level++) {
            const levelMissions = this.allMissions.filter(m => m.level === level);
            const levelAchieved = levelMissions.filter(m => (this.data.achievedMissionIds || []).includes(m.id)).length;

            html += `
                <div class="achievement-level-group">
                    <h3 class="level-header">Level ${level} <span class="level-count">(${levelAchieved}/${levelMissions.length})</span></h3>
                    <div class="achievement-grid">
            `;

            levelMissions.forEach(m => {
                const isDone = (this.data.achievedMissionIds || []).includes(m.id);
                html += `
                    <div class="achievement-card ${isDone ? 'done' : 'locked'}">
                        <div class="card-status-icon">${isDone ? '★' : '🔒'}</div>
                        <div class="card-info">
                            <div class="card-title">${m.title}</div>
                            <div class="card-desc">${m.description}</div>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        }

        html += `
            <h2 style="margin-top: 30px;">【隠し実績 (Secret Achievements)】</h2>
            <div class="achievement-grid secrets-grid">
        `;

        this.allSecrets.forEach(sec => {
            const isUnlocked = (this.data.unlockedSecretIds || []).includes(sec.id);
            html += `
                <div class="achievement-card secret-card ${isUnlocked ? 'unlocked' : 'secret-locked'}">
                    <div class="card-status-icon">${isUnlocked ? '🏆' : '❓'}</div>
                    <div class="card-info">
                        <div class="card-title">${isUnlocked ? sec.title : '??? (隠し実績)'}</div>
                        <div class="card-desc">${isUnlocked ? sec.description : '特定条件を達成することで解禁されます'}</div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }
}

window.achievementManager = new AchievementManager();
