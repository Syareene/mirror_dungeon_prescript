// 1. データの定義
// 要件に基づくデータ構造。テスト用にいくつかのダミーデータを入れています。

// これisactive保存しちゃってるけどセッションとかクッキーに保存して取得する形になるかもねぇ

console.log("JSファイルが読み込まれました"); // 読み込み確認ログ

const packData = [
    { text: "忘れられた者たち", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/a.jpg" },
    { text: "属せない", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "カジノプアー", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "工場自動化", locations: [1,2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "愛することのできない", locations: [1,2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "釘と金槌", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "信仰と侵蝕", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "向き合わない", locations: [2,3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "巣、工房、技術", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "落花", locations: [2,3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "流す者たち", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "変わらない", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "レイクワールド", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "這い寄る深淵", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "悪に規定される", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "邸宅の副産物", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "とある世界", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "心のすれ違う", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "再び開かれたラ・マンチャランド", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "終わらぬ行列", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "夢の終わる", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "四大家門と欲望", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "眺めることしかできない", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "幻惑・彷徨・不信", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "教本", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "剣と作品", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "断ち切れない", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "ヘルズチキン", locations: [2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "う・み・ダ", locations: [2,3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "20番区の奇跡", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "肉切骨断", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "時間殺人時間", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "ワープ特急殺人事件", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "紫の白昼", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "鏡屈折鉄道1号線 -MADNESS-", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "鏡屈折鉄道2号線 -MÖBIUS", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "鏡屈折鉄道3号線 -MirrorclockOrangeroad-", locations: [5], appear6to10: true, appear11to15: true, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "鏡屈折鉄道4号線 -Masquerade- 第3区間", locations: [5], appear6to10: true, appear11to15: true, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "鏡屈折鉄道4号線 -Masquerade- 第4区間", locations: [5], appear6to10: true, appear11to15: true, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "20番区の奇跡 BokGak", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "弾丸が撃った終止符", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "LCB定期診断", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "肉切骨断 BokGak", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "深夜清掃", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "鏡屈折鉄道5号線 -MerryGoRound-", locations: [5], appear6to10: true, appear11to15: true, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "憎悪と絶望", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "時間殺人時間 BokGak", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "切磋琢春", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "ワープ特急殺人事件 BokGak", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "琥珀の夕暮", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "LCB定期診断 BokGak", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "切り裂く者たち", locations: [4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "斬るべきもの", locations: [1,2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "刺し貫く者たち", locations: [4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "貫くべきもの", locations: [1,2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "壊し砕く者たち", locations: [4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "壊れるもの", locations: [1,2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "抑圧された怒り", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "解放された怒り", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "感情に押し潰されるもの", locations: [2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "のめり込む色欲", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "縛り付ける色欲", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "感情に惑わされるもの", locations: [2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "空回りする怠惰", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "止まってしまった怠惰", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "感情の前に怠けたもの", locations: [2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "食い尽くした暴食", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "溢れかえった暴食", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "感情に飢えたもの", locations: [2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "戦略する憂鬱", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "沈んだ憂鬱", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "感情に沈水したもの", locations: [2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "虚勢の傲慢", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "独善的な傲慢", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "感情に服従したもの", locations: [2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "見窄らしい嫉妬", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "哀れな嫉妬", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "感情で評価されたもの", locations: [2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "燃え上がる揺らめき", locations: [3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "火旺の節", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "漏れ出した赤血", locations: [3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "屍山血海", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "ぐらつく波動", locations: [3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "異常震域", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "壊す外力", locations: [3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "破竹の勢い", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "沈む疼き", locations: [3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "沈潜殺到", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "吐かれた一息", locations: [3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "循環呼吸", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "満ちゆく動力", locations: [3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "霹靂閃電", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "N社 新九人会", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "開花する緑林", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "3号線 - 終着駅", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "永劫のくびき", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "う・み・ダ・かに・バル", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "終わりなき袋小路", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "血鬼になれなかった者たち", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "美しい声", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "緑の黎明", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "とある図書館の、ある本の中へ", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "path/to/b.jpg" },
];

// 2. ボタンクリック時のイベントリスナー
document.getElementById('generateBtn').addEventListener('click', () => {
    const inputText = document.getElementById('inputNumbers').value;
    const targetNumbers = parseInput(inputText);
    const outputArea = document.getElementById('outputArea');

    outputArea.innerHTML = ''; // 前回の結果をクリア

    if (targetNumbers.length === 0) {
        outputArea.innerHTML = '<p>有効な数字（1〜15）が認識できませんでした。</p>';
        return;
    }

    // 抽選用のプールを作成（isActiveがtrueのものだけをコピー）
    let availablePool = packData.filter(item => item.isActive);
    const results = [];

    // パースされた数字ごとに抽選処理を実行
    for (const num of targetNumbers) {
        // 現在のプールから条件に合致する候補を絞り込む
        let candidates = [];

        if (num >= 1 && num <= 5) {
            candidates = availablePool.filter(item => item.locations.includes(num));
        } else if (num >= 6 && num <= 10) {
            candidates = availablePool.filter(item => item.appear6to10 === true);
        } else if (num >= 11 && num <= 15) {
            candidates = availablePool.filter(item => item.appear11to15 === true);
        }

        if (candidates.length > 0) {
            // 候補の中からランダムに1つ選択
            const randomIndex = Math.floor(Math.random() * candidates.length);
            const selectedItem = candidates[randomIndex];

            // 結果に保存
            results.push(`…へ。${num}階層目に「${selectedItem.text}」のパックを選ぶ。`);

            // 【重要】一度抽出されたものはプールから削除し、重複を防ぐ
            availablePool = availablePool.filter(item => item !== selectedItem);
        } else {
            results.push(`${num}階層目: 該当する文字列、または残りの候補がありません`);
        }
    }

    // 3. 結果の描画
    results.forEach(resultText => {
        const p = document.createElement('p');
        p.textContent = resultText;
        outputArea.appendChild(p);
    });
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