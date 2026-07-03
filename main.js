// このプロジェクトはAIメインでコーディングしています。
// 各動作の確認や細かい箇所の修正、コードの確認は私自身の手で行っています。

// データの定義 (サーバーから動的に読み込むため、初期状態は空)
let packData = [];

let lastResultText = ""; // 最後に抽出された結果を保存する変数

// --- localStorage 用のキー ---
const STORAGE_KEY = 'lcb_pack_settings';

// --- 設定の読み込み関数 ---
function loadSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const settings = saved ? JSON.parse(saved) : {};
    
    // 保存されている設定（パック名: 有効フラグ）を packData に適用
    packData.forEach(pack => {
        if (settings.hasOwnProperty(pack.text)) {
            pack.isActive = settings[pack.text];
        } else {
            // DBに新規追加された等で localStorage にない場合はデフォルトで有効(true)とする
            pack.isActive = true;
        }
    });
}

// --- 設定の保存関数 ---
function saveSettings() {
    const settings = {};
    packData.forEach(pack => {
        settings[pack.text] = pack.isActive;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

// サーバーからデータを読み込む非同期関数
async function loadPacksFromServer() {
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) generateBtn.disabled = true; // ロード中はボタンを無効化
    
    try {
        const response = await fetch('api/get.php');
        if (!response.ok) {
            throw new Error('サーバーからのデータ取得に失敗しました。');
        }
        packData = await response.json();
        
        // 設定を適用
        loadSettings();
    } catch (error) {
        console.error(error);
        alert('パックデータの読み込み中にエラーが発生しました。接続設定等を確認してください。');
    } finally {
        if (generateBtn) generateBtn.disabled = false;
    }
}

// ページ読み込み時にデータを取得
window.addEventListener('DOMContentLoaded', () => {
    loadPacksFromServer();
});

document.getElementById('generateBtn').addEventListener('click', () => {
    const inputText = document.getElementById('inputNumbers').value;
    const targetNumbers = parseInput(inputText);

    // アニメーションエリアと出力エリアを初期化
    const animatedText = document.getElementById('animatedText');
    animatedText.textContent = ''; // 前回の文字を消す

    // 各グループの表示エリアをクリア
    const groups = {
        '1to5': document.querySelector('#group1to5 .slots'),
        '6to10': document.querySelector('#group6to10 .slots'),
        '11to15': document.querySelector('#group11to15 .slots')
    };
    Object.values(groups).forEach(el => el.innerHTML = '');

    let availablePool = packData.filter(item => item.isActive);
    let resultLog = []; // テキスト保存用

    // 1から15まで順番に処理
    for (let i = 1; i <= 15; i++) {
        // どのグループに所属するか判定
        let targetGroup;
        if (i <= 5) targetGroup = groups['1to5'];
        else if (i <= 10) targetGroup = groups['6to10'];
        else targetGroup = groups['11to15'];

        // スロット要素を作成
        const slot = document.createElement('div');
        slot.className = 'slot';

        // 入力値に含まれている場合のみ抽選・表示
        if (targetNumbers.includes(i)) {
            let candidates = [];
            if (i <= 5) {
                candidates = availablePool.filter(item => item.locations.includes(i));
            } else if (i <= 10) {
                candidates = availablePool.filter(item => item.appear6to10);
            } else {
                candidates = availablePool.filter(item => item.appear11to15);
            }

            if (candidates.length > 0) {
                const selectedItem = candidates[Math.floor(Math.random() * candidates.length)];

                // 1. 先にテキストの要素を作成して追加する
                const p = document.createElement('p');
                p.textContent = selectedItem.text;
                slot.appendChild(p);

                // 2. 次に画像の要素を作成して追加する
                if (selectedItem.imagePath) {
                    const img = document.createElement('img');
                    img.src = selectedItem.imagePath;
                    slot.appendChild(img);
                }

                // テキストログに保存
                resultLog.push(`${i}層目: ${selectedItem.text}`);

                // プールから削除（重複防止）
                availablePool = availablePool.filter(item => item !== selectedItem);
            } else {
                // 該当する候補がない場合は空欄のままにしてスペースを維持
                // slot.textContent = "候補なし"; などが必要であればここに追加
            }
        }

        // 入力値に含まれていない場合でも、空のslotがappendされるので位置がズレない
        targetGroup.appendChild(slot);
    }

    // シェア用テキストの作成
    // テキストを整形して変数に保存
    if (resultLog.length > 0) {
        lastResultText = "名と蜘蛛の鏡 パック抽出結果\n" + resultLog.join("\n");
    } else {
        lastResultText = "";
    }

    // アニメーション関数を呼び出す
    playScrambleAnimation(animatedText, "管理人へ。下記のパックを選択しクリアすること。");
});

// --- パック管理機能のロジック ---

// 表示切り替えボタンのイベント
document.getElementById('toggleListBtn').addEventListener('click', () => {
    const container = document.getElementById('packListContainer');
    if (container.style.display === 'none') {
        container.style.display = 'block';
        renderPackList(); // 表示する際に一覧を最新化
    } else {
        container.style.display = 'none';
    }
});

// パック一覧を生成して描画する関数
function renderPackList() {
    const grid = document.getElementById('packListGrid');
    grid.innerHTML = ''; // 一度リセット

    packData.forEach((pack, index) => {
        const item = document.createElement('div');
        item.className = 'pack-item-manage' + (pack.isActive ? '' : ' disabled');

        // 画像
        const img = document.createElement('img');
        img.src = pack.imagePath;
        img.alt = pack.text;

        // テキスト
        const p = document.createElement('p');
        p.textContent = pack.text;

        item.appendChild(img);
        item.appendChild(p);

        // クリック時の切り替え処理
        item.onclick = () => {
            // isActiveフラグを反転
            pack.isActive = !pack.isActive;

            // 見た目を更新
            if (pack.isActive) {
                item.classList.remove('disabled');
            } else {
                item.classList.add('disabled');
            }

            // 設定をlocalStorageに保存
            saveSettings();
        };

        grid.appendChild(item);
    });
}



// --- ボタンの動作定義 ---

// コピー機能
document.getElementById('copyBtn').addEventListener('click', () => {
    if (!lastResultText) {
        alert("先に抽出を行ってください。");
        return;
    }
    navigator.clipboard.writeText(lastResultText).then(() => {
        alert("クリップボードにコピーしました！");
    });
});

// X (Twitter) シェア機能
document.getElementById('shareBtn').addEventListener('click', () => {

    // URLエンコードしてシェア用URLを作成

    // シェア用テキストを作成
    const shareText = "名と蜘蛛の鏡 パック抽出ジェネレーター\nhttps://syareene.github.io/mirror_dungeon_prescript/ \n\n#LimbusCompany #LCBパック抽出ジェネレーター";
    const encodedText = encodeURIComponent(shareText);
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(shareUrl, '_blank');
});

// --- ユーティリティ関数 ---

// 入力された文字列を解析し、重複のない1〜15の整数の配列を返す関数
function parseInput(inputStr) {
    const resultList = new Set(); // 重複排除のためにSetを使用

    // 全角スペース、半角スペース、カンマで文字列を分割
    const tokens = inputStr.split(/[,\s　]+/).filter(Boolean);

    for (const token of tokens) {
        if (token.includes('-')) {
            // ハイフンが含まれる場合は範囲指定とみなす
            const parts = token.split('-');
            if (parts.length === 2) {
                const start = parseInt(parts[0], 10);
                const end = parseInt(parts[1], 10);

                if (!isNaN(start) && !isNaN(end)) {
                    const min = Math.min(start, end);
                    const max = Math.max(start, end);
                    // 範囲内の数字を登録（1〜15の制限付き）
                    for (let i = min; i <= max; i++) {
                        if (i >= 1 && i <= 15) resultList.add(i);
                    }
                }
            }
        } else {
            // 単体の数字として処理
            const num = parseInt(token, 10);
            if (!isNaN(num) && num >= 1 && num <= 15) {
                resultList.add(num);
            }
        }
    }

    // Setを配列に変換し、小さい順にソートして返す
    return Array.from(resultList).sort((a, b) => a - b);
}

// --- 文字列アニメーション演出関数 ---
// targetElement: テキストを表示するHTML要素 (pタグやdivなど)
// finalString: 最終的に表示させたい文字列
function playScrambleAnimation(targetElement, finalString) {
    // 演出に使うランダムな文字の候補（記号や英数字などお好みで変更可）
    const chars = "!<>-_\\/[]{}—=+*^?#@$%&1234567890";
    let frame = 0;
    const maxFrames = 20; // 演出の長さ（フレーム数）

    // setIntervalで定期的に文字を書き換えるループ処理を生成
    const intervalId = setInterval(() => {
        let currentString = "";

        for (let i = 0; i < finalString.length; i++) {
            // 文字列の前半から徐々に確定させていくロジック
            if (i < frame) {
                currentString += finalString[i];
            } else {
                currentString += chars[Math.floor(Math.random() * chars.length)];
            }
        }

        targetElement.textContent = currentString;

        if (frame >= finalString.length) {
            clearInterval(intervalId); // 全ての文字が確定したらループを停止
            targetElement.textContent = finalString; // 念のため最終的な文字列をセット
        }

        frame += 1 / 3; // 1フレームあたりの文字確定スピード（数値を上げると早くなる）
    }, 30); // 30ミリ秒ごとに更新
}

// --- パック追加 (管理者) の UI と送信ロジック ---

// トグルボタンのイベント
document.getElementById('toggleAdminBtn').addEventListener('click', () => {
    const container = document.getElementById('adminFormContainer');
    if (container.style.display === 'none') {
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth' });
    } else {
        container.style.display = 'none';
    }
});

// フォーム送信イベント
document.getElementById('adminAddPackForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData();
    
    // パック名
    const textVal = document.getElementById('adminPackText').value.trim();
    if (!textVal) {
        alert('パック名を入力してください。');
        return;
    }
    formData.append('text', textVal);
    
    // 出現階層 (locations)
    const locationCheckboxes = form.querySelectorAll('input[name="locations"]:checked');
    const locations = Array.from(locationCheckboxes).map(cb => cb.value).join(',');
    formData.append('locations', locations);
    
    // その他出現条件
    formData.append('appear6to10', document.getElementById('adminAppear6to10').checked ? 1 : 0);
    formData.append('appear11to15', document.getElementById('adminAppear11to15').checked ? 1 : 0);
    
    // 画像
    const imageFile = document.getElementById('adminPackImage').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    // 送信ボタンを一時的に無効化
    const submitBtn = document.getElementById('submitPackBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = '登録中...';
    
    try {
        const response = await fetch('api/add.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        
        if (result.success) {
            alert(result.message);
            form.reset();
            
            // データを再取得
            await loadPacksFromServer();
            
            // パック管理一覧が開いていれば再描画
            const packListContainer = document.getElementById('packListContainer');
            if (packListContainer.style.display !== 'none') {
                renderPackList();
            }
        } else {
            alert('エラー: ' + (result.error || '不明なエラーが発生しました。'));
        }
    } catch (error) {
        console.error(error);
        alert('通信エラーが発生しました。DBやサーバーの稼働状態を確認してください。');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'パックを登録する';
    }
});