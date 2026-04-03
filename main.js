// 1. データの定義
// 要件に基づくデータ構造。テスト用にいくつかのダミーデータを入れています。

// これisactive保存しちゃってるけどセッションとかクッキーに保存して取得する形になるかもねぇ

const sourceData = [
    { text: "忘れられた者たち", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/a.jpg" },
    { text: "属せない", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "カジノプアー", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "工場自動化", locations: [1, 2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
    { text: "愛することのできない", locations: [1, 2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "path/to/b.jpg" },
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
    { text: "テキストC", locations: [], appear6to10: true, appear11to15: true, isActive: true, imagePath: "path/to/c.jpg" },
    { text: "テキストD", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "path/to/d.jpg" },
    { text: "テキストE", locations: [], appear6to10: true, appear11to15: true, isActive: false, imagePath: "path/to/e.jpg" }, // isActiveがfalseなので選ばれない
    { text: "テキストF", locations: [], appear6to10: true, appear11to15: false, isActive: true, imagePath: "path/to/f.jpg" },
    { text: "テキストG", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "path/to/g.jpg" }
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
    let availablePool = sourceData.filter(item => item.isActive);
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
            results.push(`[入力値 ${num}] -> ${selectedItem.text}`);

            // 【重要】一度抽出されたものはプールから削除し、重複を防ぐ
            availablePool = availablePool.filter(item => item !== selectedItem);
        } else {
            results.push(`[入力値 ${num}] -> 該当する文字列、または残りの候補がありません`);
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