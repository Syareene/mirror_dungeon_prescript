// 1. データの定義
// 要件に基づくデータ構造。テスト用にいくつかのダミーデータを入れています。

// これisactive保存しちゃってるけどセッションとかクッキーに保存して取得する形になるかもねぇ

console.log("JSファイルが読み込まれました"); // 読み込み確認ログ

const packData = [
    { text: "忘れられた者たち", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/main_story/1-1.png" },
    { text: "属せない", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/main_story/1-2.png" },
    { text: "カジノプアー", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/main_story/2-1.png" },
    { text: "工場自動化", locations: [1, 2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/main_story/2-2.png" },
    { text: "愛することのできない", locations: [1, 2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/main_story/2-3.png" },
    { text: "釘と金槌", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/main_story/3-1.png" },
    { text: "信仰と侵蝕", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/main_story/3-2.png" },
    { text: "向き合わない", locations: [2, 3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/main_story/3-3.png" },
    { text: "巣、工房、技術", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/main_story/4-1.png" },
    { text: "落花", locations: [2, 3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/main_story/4-2.png" },
    { text: "流す者たち", locations: [3, 4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/main_story/4-3.png" },
    { text: "変わらない", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/main_story/4-4.png" },
    { text: "レイクワールド", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/main_story/5-1.png" },
    { text: "這い寄る深淵", locations: [3, 4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/main_story/5-2.png" },
    { text: "悪に規定される", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/main_story/5-3.png" },
    { text: "邸宅の副産物", locations: [1], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/main_story/6-1.png" },
    { text: "とある世界", locations: [3, 4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/main_story/6-2.png" },
    { text: "心のすれ違う", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/main_story/6-3.png" },
    { text: "再び開かれたラ・マンチャランド", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/main_story/7-1.png" },
    { text: "終わらぬ行列", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/main_story/7-2.png" },
    { text: "夢の終わる", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/main_story/7-3.png" },
    { text: "四大家門と欲望", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/main_story/8-1.png" },
    { text: "眺めることしかできない", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/main_story/8-2.png" },
    { text: "幻惑・彷徨・不信", locations: [3,4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/main_story/9-1.png" },
    { text: "教本", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/main_story/9-2.png" },
    { text: "剣と作品", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/main_story/9-3.png" },
    { text: "断ち切れない", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/main_story/9-4.png" },
    { text: "ヘルズチキン", locations: [2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/event/hells_chicken.png" },
    { text: "う・み・ダ", locations: [2, 3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/event/sea.png" },
    { text: "20番区の奇跡", locations: [3, 4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/event/miracle_in20.png" },
    { text: "肉切骨断", locations: [3, 4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/event/claim_bone.png" },
    { text: "時間殺人時間", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/event/tkt.png" },
    { text: "ワープ特急殺人事件", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/event/murder_warp.png" },
    { text: "紫の白昼", locations: [3, 4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/event/violet_noon.png" },
    { text: "鏡屈折鉄道1号線 -MADNESS-", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/reflection_railway/rr1.png" },
    { text: "鏡屈折鉄道2号線 -MÖBIUS", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/reflection_railway/rr2.png" },
    { text: "鏡屈折鉄道3号線 -MirrorclockOrangeroad-", locations: [5], appear6to10: true, appear11to15: true, isActive: true, imagePath: "images/reflection_railway/rr3.png" },
    { text: "鏡屈折鉄道4号線 -Masquerade- 第3区間", locations: [5], appear6to10: true, appear11to15: true, isActive: true, imagePath: "images/reflection_railway/rr4_sector3.png" },
    { text: "鏡屈折鉄道4号線 -Masquerade- 第4区間", locations: [5], appear6to10: true, appear11to15: true, isActive: true, imagePath: "images/reflection_railway/rr4_sector4.png" },
    { text: "20番区の奇跡 BokGak", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/event/miracle_in20_bokgak.png" },
    { text: "弾丸が撃った終止符", locations: [3, 4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/event/fullstopped_bullet.png" },
    { text: "LCB定期診断", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/event/lcb_check.png" },
    { text: "肉切骨断 BokGak", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/event/claim_bone_bokgak.png" },
    { text: "深夜清掃", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/event/sweeping.png" },
    { text: "鏡屈折鉄道5号線 -MerryGoRound-", locations: [5], appear6to10: true, appear11to15: true, isActive: true, imagePath: "images/reflection_railway/rr5.png" },
    { text: "憎悪と絶望", locations: [3, 4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/event/hatred_despair.png" },
    { text: "時間殺人時間 BokGak", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/event/tkt_bokgak.png" },
    { text: "切磋琢春", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/event/spring_cultivation.png" },
    { text: "ワープ特急殺人事件 BokGak", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/event/murder_warp_bokgak.png" },
    { text: "琥珀の夕暮", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/event/dusk_amber.png" },
    { text: "LCB定期診断 BokGak", locations: [4,5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/event/lcb_check_bokgak.png" },
    { text: "斬るべきもの", locations: [1, 2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/slash-1.png" },
    { text: "切り裂く者たち", locations: [4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/slash-2.png" },
    { text: "貫くべきもの", locations: [1, 2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/piece-1.png" },
    { text: "刺し貫く者たち", locations: [4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/piece-2.png" },
    { text: "壊れるもの", locations: [1, 2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/blunt-1.png" },
    { text: "壊し砕く者たち", locations: [4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/blunt-2.png" },
    { text: "感情に押し潰されるもの", locations: [2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/wraith-1.png" },
    { text: "抑圧された怒り", locations: [3, 4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/wraith-2.png" },
    { text: "解放された怒り", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/affinity/wraith-3.png" },
    { text: "感情に惑わされるもの", locations: [2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/lust-1.png" },
    { text: "のめり込む色欲", locations: [3, 4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/lust-2.png" },
    { text: "縛り付ける色欲", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/affinity/lust-3.png" },
    { text: "感情の前に怠けたもの", locations: [2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/sloth-1.png" },
    { text: "空回りする怠惰", locations: [3, 4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/sloth-2.png" },
    { text: "止まってしまった怠惰", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/affinity/sloth-3.png" },
    { text: "感情に飢えたもの", locations: [2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/gluttony-1.png" },
    { text: "食い尽くした暴食", locations: [3, 4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/gluttony-2.png" },
    { text: "溢れかえった暴食", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/affinity/gluttony-3.png" },
    { text: "感情に沈水したもの", locations: [2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/gloom-1.png" },
    { text: "戦略する憂鬱", locations: [3, 4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/gloom-2.png" },
    { text: "沈んだ憂鬱", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/affinity/gloom-3.png" },
    { text: "感情に服従したもの", locations: [2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/pride-1.png" },
    { text: "虚勢の傲慢", locations: [3, 4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/pride-2.png" },
    { text: "独善的な傲慢", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/affinity/pride-3.png" },
    { text: "感情で評価されたもの", locations: [2], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/envy-1.png" },
    { text: "見窄らしい嫉妬", locations: [3, 4], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/affinity/envy-2.png" },
    { text: "哀れな嫉妬", locations: [5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/affinity/envy-3.png" },
    { text: "燃え上がる揺らめき", locations: [3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/keyword/burn-1.png" },
    { text: "火旺の節", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/keyword/burn-2.png" },
    { text: "漏れ出した赤血", locations: [3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/keyword/blood-1.png" },
    { text: "屍山血海", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/keyword/blood-2.png" },
    { text: "ぐらつく波動", locations: [3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/keyword/tremor-1.png" },
    { text: "異常震域", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/keyword/tremor-2.png" },
    { text: "壊す外力", locations: [3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/keyword/rupture-1.png" },
    { text: "破竹の勢い", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/keyword/rupture-2.png" },
    { text: "沈む疼き", locations: [3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/keyword/sinking-1.png" },
    { text: "沈潜殺到", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/keyword/sinking-2.png" },
    { text: "吐かれた一息", locations: [3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/keyword/poise-1.png" },
    { text: "循環呼吸", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/keyword/poise-2.png" },
    { text: "満ちゆく動力", locations: [3], appear6to10: false, appear11to15: false, isActive: true, imagePath: "images/keyword/charge-1.png" },
    { text: "霹靂閃電", locations: [4, 5], appear6to10: true, appear11to15: false, isActive: true, imagePath: "images/keyword/charge-2.png" },
    { text: "N社 新九人会", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "images/extreme/ncorp_newnine.png" },
    { text: "開花する緑林", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "images/extreme/greenery.png" },
    { text: "3号線 - 終着駅", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "images/extreme/rr3_terminius.png" },
    { text: "永劫のくびき", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "images/extreme/infinity.png" },
    { text: "う・み・ダ・かに・バル", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "images/extreme/sea_cr.png" },
    { text: "終わりなき袋小路", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "images/extreme/impenetrable_path.png" },
    { text: "血鬼になれなかった者たち", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "images/extreme/bloodfiend.png" },
    { text: "美しい声", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "images/extreme/beautiful_voice.png" },
    { text: "緑の黎明", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "images/extreme/dawn_green.png" },
    { text: "とある図書館の、ある本の中へ", locations: [], appear6to10: false, appear11to15: true, isActive: true, imagePath: "images/extreme/certain_book.png" },
];

document.getElementById('generateBtn').addEventListener('click', () => {
    const inputText = document.getElementById('inputNumbers').value;
    const targetNumbers = parseInput(inputText);

    // 各グループの表示エリアをクリア
    const groups = {
        '1to5': document.querySelector('#group1to5 .slots'),
        '6to10': document.querySelector('#group6to10 .slots'),
        '11to15': document.querySelector('#group11to15 .slots')
    };
    Object.values(groups).forEach(el => el.innerHTML = '');

    let availablePool = packData.filter(item => item.isActive);

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
});


// 2. ボタンクリック時のイベントリスナー
// document.getElementById('generateBtn').addEventListener('click', () => {
//     const inputText = document.getElementById('inputNumbers').value;
//     const targetNumbers = parseInput(inputText);
//     const outputArea = document.getElementById('outputArea');

//     outputArea.innerHTML = ''; // 前回の結果をクリア

//     if (targetNumbers.length === 0) {
//         outputArea.innerHTML = '<p>有効な数字（1〜15）が認識できませんでした。</p>';
//         return;
//     }

//     // 抽選用のプールを作成（isActiveがtrueのものだけをコピー）
//     let availablePool = packData.filter(item => item.isActive);
//     const results = []; // オブジェクトを保存する

//     // パースされた数字ごとに抽選処理を実行
//     for (const num of targetNumbers) {
//         // 現在のプールから条件に合致する候補を絞り込む
//         let candidates = [];

//         if (num >= 1 && num <= 5) {
//             candidates = availablePool.filter(item => item.locations.includes(num));
//         } else if (num >= 6 && num <= 10) {
//             candidates = availablePool.filter(item => item.appear6to10 === true);
//         } else if (num >= 11 && num <= 15) {
//             candidates = availablePool.filter(item => item.appear11to15 === true);
//         }

//         if (candidates.length > 0) {
//             // 候補の中からランダムに1つ選択
//             const randomIndex = Math.floor(Math.random() * candidates.length);
//             const selectedItem = candidates[randomIndex];

//             // 結果にテキストと画像パスの両方を結果に保存
//             results.push({
//                 num: num,
//                 text: selectedItem.text,
//                 imagePath: selectedItem.imagePath,
//                 found: true
//             });


//             //results.push(`…へ。${num}階層目に「${selectedItem.text}」のパックを選ぶ。`);

//             // 【重要】一度抽出されたものはプールから削除し、重複を防ぐ
//             availablePool = availablePool.filter(item => item !== selectedItem);
//         } else {
//             // 見つからなかった場合
//             results.push({
//                 num: num,
//                 text: "該当する文字列、または残りの候補がありません",
//                 imagePath: "",
//                 found: false
//             });
//         }
//     }

//     // 3. 結果の描画
//     results.forEach(result => {
//         // 画像とテキストをまとめるためのdivコンテナを作成
//         const resultContainer = document.createElement('div');
//         // 後でCSSで装飾しやすいようにクラス名を付けておく
//         resultContainer.className = 'result-item';
//         resultContainer.style.marginBottom = '15px'; // 暫定の余白

//         if (result.found && result.imagePath) {
//             // 画像要素の作成
//             const img = document.createElement('img');
//             img.src = result.imagePath;
//             img.alt = result.text;
//             img.style.width = '150px'; // 暫定のサイズ（後でCSSで制御します）
//             img.style.display = 'block';
//             resultContainer.appendChild(img);
//         }

//         // テキスト要素の作成
//         const p = document.createElement('p');
//         p.textContent = `[入力値 ${result.num}] -> ${result.text}`;
//         resultContainer.appendChild(p);

//         // 出力エリアに追加
//         outputArea.appendChild(resultContainer);
//     });
// });

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