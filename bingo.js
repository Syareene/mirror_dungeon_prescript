/**
 * ビンゴシステム (bingo.js)
 */

const BINGO_STORAGE_KEY = 'lcb_bingo_board_v2';

class BingoManager {
    constructor() {
        this.missions = [];
        this.grid = [];
        this.checkedState = new Array(25).fill(false);
        this.selectedIndex = null;
    }

    async init() {
        try {
            this.missions = typeof window.fetchAllMissions === 'function'
                ? await window.fetchAllMissions()
                : await (async () => {
                    const files = [
                        'missions/theme_pack.json',
                        'missions/identity.json',
                        'missions/shop_gift.json',
                        'missions/battle.json',
                        'missions/keyword.json',
                        'missions/extreme.json'
                    ];
                    const res = await Promise.all(files.map(f => fetch(f)));
                    const data = await Promise.all(res.map(r => r.json()));
                    return data.flat();
                })();
        } catch (e) {
            console.error("Bingo: ミッションデータの取得に失敗しました:", e);
            this.loadError = true;
            this.render();
            return;
        }

        this.setupEventListeners();

        const saved = localStorage.getItem(BINGO_STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.grid = parsed.grid;
                this.checkedState = parsed.checkedState || new Array(25).fill(false);
            } catch (e) {
                this.generateNewCard();
            }
        } else {
            this.generateNewCard();
        }

        this.render();
    }

    setupEventListeners() {
        document.getElementById('newBingoBtn')?.addEventListener('click', () => {
            if (this.checkedState.some(c => c)) {
                if (!confirm("現在のビンゴ進行状態がクリアされますが、新しいカードを生成しますか？")) {
                    return;
                }
            }
            this.generateNewCard();
            this.render();
        });

        document.getElementById('completeChallengeBtn')?.addEventListener('click', () => {
            this.handleChallengeCompletion();
        });

        document.getElementById('closeDrawerBtn')?.addEventListener('click', () => {
            this.closeDrawer();
        });
    }

    generateNewCard() {
        let attempts = 0;
        const maxAttempts = 500;

        while (attempts < maxAttempts) {
            attempts++;
            const candidate = this.tryGenerateCardCandidate();
            if (candidate) {
                this.grid = candidate;
                this.checkedState = new Array(25).fill(false);
                this.selectedIndex = null;
                this.saveBoardState();
                return;
            }
        }

        console.warn("条件を満たすカード生成がリトライ上限に達したためフォールバック生成します");
        const shuffled = [...this.missions].sort(() => 0.5 - Math.random());
        this.grid = shuffled.slice(0, 25);
        this.checkedState = new Array(25).fill(false);
        this.selectedIndex = null;
        this.saveBoardState();
    }

    tryGenerateCardCandidate() {
        const shuffled = [...this.missions].sort(() => 0.5 - Math.random());
        const selected = [];
        const usedTags = new Set();
        const forbiddenTags = new Set();

        for (const m of shuffled) {
            if (selected.length === 25) break;

            const hasConflict = (m.tags || []).some(t => forbiddenTags.has(t)) ||
                (m.conflicts || []).some(c => usedTags.has(c));
            if (hasConflict) continue;

            selected.push(m);
            (m.tags || []).forEach(t => usedTags.add(t));
            (m.conflicts || []).forEach(c => forbiddenTags.add(c));
        }

        if (selected.length < 25) return null;

        for (let r = 0; r < 5; r++) {
            let rowSum = 0;
            for (let c = 0; c < 5; c++) {
                rowSum += selected[r * 5 + c].level;
            }
            if (rowSum < 10 || rowSum > 16) return null;
        }

        for (let c = 0; c < 5; c++) {
            let colSum = 0;
            for (let r = 0; r < 5; r++) {
                colSum += selected[r * 5 + c].level;
            }
            if (colSum < 10 || colSum > 16) return null;
        }

        return selected;
    }

    saveBoardState() {
        const payload = {
            grid: this.grid,
            checkedState: this.checkedState
        };
        localStorage.setItem(BINGO_STORAGE_KEY, JSON.stringify(payload));
    }

    toggleCheck(index) {
        this.checkedState[index] = !this.checkedState[index];
        this.selectedIndex = index;
        this.saveBoardState();
        this.render();
    }

    selectSquare(index) {
        this.selectedIndex = index;
        this.renderDetails();
    }

    calculateCompletedLines() {
        let lines = 0;

        for (let r = 0; r < 5; r++) {
            let full = true;
            for (let c = 0; c < 5; c++) {
                if (!this.checkedState[r * 5 + c]) { full = false; break; }
            }
            if (full) lines++;
        }

        for (let c = 0; c < 5; c++) {
            let full = true;
            for (let r = 0; r < 5; r++) {
                if (!this.checkedState[r * 5 + c]) { full = false; break; }
            }
            if (full) lines++;
        }

        if (this.checkedState[0] && this.checkedState[6] && this.checkedState[12] && this.checkedState[18] && this.checkedState[24]) {
            lines++;
        }

        if (this.checkedState[4] && this.checkedState[8] && this.checkedState[12] && this.checkedState[16] && this.checkedState[20]) {
            lines++;
        }

        return lines;
    }

    async handleChallengeCompletion() {
        const checkedIndices = this.checkedState.map((val, idx) => val ? idx : -1).filter(idx => idx !== -1);
        if (checkedIndices.length === 0) {
            alert("チェックされているミッションが1つもありません。ダンジョン攻略で達成したマスをクリックしてチェックしてください。");
            return;
        }

        const completedMissions = checkedIndices.map(i => this.grid[i].id);
        const lineCount = this.calculateCompletedLines();
        const isFullClear = checkedIndices.length === 25;

        if (window.achievementManager) {
            const newlyUnlocked = await window.achievementManager.recordChallengeCompletion(
                completedMissions,
                lineCount,
                isFullClear
            );

            let msg = `🎉 挑戦完了！ ${checkedIndices.length} 個のミッションが実績に記録されました！（成立ライン: ${lineCount}）`;
            if (newlyUnlocked && newlyUnlocked.length > 0) {
                msg += `\n\n🏆【隠し実績アンロック！】\n・` + newlyUnlocked.join('\n・');
            }

            this.showToast(msg);
        }
    }

    showToast(message) {
        let toast = document.getElementById('bingoToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'bingoToast';
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: rgba(20, 40, 20, 0.95);
                border: 2px solid #4caf50;
                color: #fff;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.8);
                z-index: 2000;
                font-weight: bold;
                white-space: pre-line;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.opacity = '1';
        toast.style.display = 'block';

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { toast.style.display = 'none'; }, 300);
        }, 4000);
    }

    closeDrawer() {
        const drawer = document.getElementById('mobileDrawer');
        if (drawer) drawer.classList.remove('open');
    }

    render() {
        const gridEl = document.getElementById('bingoGrid');
        if (!gridEl) return;

        if (this.loadError) {
            const isFile = window.location.protocol === 'file:';
            gridEl.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 25px; background: rgba(50, 20, 20, 0.9); border: 2px solid #e74c3c; border-radius: 8px; color: #fff; text-align: center;">
                    <h3 style="color: #ff6b6b; margin-top: 0;">⚠️ ミッションデータを読み込めませんでした</h3>
                    <p style="line-height: 1.6;">${isFile
                        ? '現在ローカルファイル（<code>file:///</code>）から直接開かれています。<br>ブラウザのセキュリティ仕様（CORS制限）により外部JSONの取得がブロックされています。<br><br>💡 <strong>ローカルWebサーバー（VS Codeの「Live Server」や <code>npx serve</code> など）経由</strong> または <strong>GitHub Pages</strong> 上でご確認ください。'
                        : 'ミッションJSONファイルの取得に失敗しました。'}</p>
                </div>
            `;
            return;
        }

        gridEl.innerHTML = '';

        this.grid.forEach((m, idx) => {
            const cell = document.createElement('div');
            cell.className = `bingo-cell level-${m.level}`;
            if (this.checkedState[idx]) cell.classList.add('checked');
            if (this.selectedIndex === idx) cell.classList.add('selected');

            cell.innerHTML = `
                <div class="cell-level">Lv.${m.level}</div>
                <div class="cell-title">${m.title}</div>
                <div class="cell-status">${this.checkedState[idx] ? '✓' : ''}</div>
            `;

            cell.addEventListener('click', () => {
                this.selectSquare(idx);
                if (window.innerWidth < 768) {
                    const drawer = document.getElementById('mobileDrawer');
                    if (drawer) drawer.classList.add('open');
                }
            });

            cell.addEventListener('dblclick', (e) => {
                e.preventDefault();
                this.toggleCheck(idx);
            });

            gridEl.appendChild(cell);
        });

        const lineCountEl = document.getElementById('bingoLineCount');
        if (lineCountEl) {
            lineCountEl.textContent = this.calculateCompletedLines();
        }

        this.renderDetails();
    }

    renderDetails() {
        const panel = document.getElementById('bingoDetailPanel');
        const drawerBody = document.getElementById('drawerBody');

        if (this.selectedIndex === null || !this.grid[this.selectedIndex]) {
            const emptyHtml = `<div class="detail-empty">マスを選択すると詳細が表示されます。<br><small>※ダブルクリックで達成チェックをトグルできます。</small></div>`;
            if (panel) panel.innerHTML = emptyHtml;
            if (drawerBody) drawerBody.innerHTML = emptyHtml;
            return;
        }

        const m = this.grid[this.selectedIndex];
        const isChecked = this.checkedState[this.selectedIndex];
        const displayTags = m.displayTags && m.displayTags.length > 0 ? m.displayTags : [];

        const noteHtml = m.note ? `
            <div class="note-box">
                💡 <strong>補足</strong><br>${m.note}
            </div>
        ` : '';

        const sourceHtml = m.source ? `
            <div class="card-source">${m.source}</div>
        ` : '';

        const tagsHtml = displayTags.length > 0 ? `
            <div class="detail-tags">
                ${displayTags.map(t => `<span class="tag display-tag">${t}</span>`).join(' ')}
            </div>
        ` : '';

        const detailHtml = `
            <div class="detail-content">
                <div class="detail-badge level-${m.level}">難易度 Level ${m.level}</div>
                <h3 class="detail-title">${m.title}</h3>
                <p class="detail-desc">${m.description}</p>
                ${noteHtml}
                ${tagsHtml}
                ${sourceHtml}
                <div class="detail-action" style="margin-top: 15px;">
                    <button class="btn-toggle ${isChecked ? 'btn-checked' : 'btn-unchecked'}" id="toggleSquareBtn">
                        ${isChecked ? '✓ 達成解除する' : '達成チェックを入れる'}
                    </button>
                </div>
            </div>
        `;

        if (panel) panel.innerHTML = detailHtml;
        if (drawerBody) drawerBody.innerHTML = detailHtml;

        const setupBtnListener = (btnId) => {
            document.getElementById(btnId)?.addEventListener('click', () => {
                if (this.selectedIndex !== null) {
                    this.toggleCheck(this.selectedIndex);
                }
            });
        };
        setupBtnListener('toggleSquareBtn');
    }
}

window.bingoManager = new BingoManager();
