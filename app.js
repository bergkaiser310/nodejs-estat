'use strict'

const generations = [
    {
        name: "10歳未満",
        age_id_range: { from: 1001, to: 1010 }
    },
    {
        name: "10代",
        age_id_range: { from: 1011, to: 1020 }
    },
    {
        name: "20代",
        age_id_range: { from: 1021, to: 1030 }
    },
    {
        name: "30代",
        age_id_range: { from: 1031, to: 1040 }
    },
    {
        name: "40代",
        age_id_range: { from: 1041, to: 1050 }
    },
    {
        name: "50代",
        age_id_range: { from: 1051, to: 1060 }
    },
    {
        name: "60代",
        age_id_range: { from: 1061, to: 1070 }
    },
    {
        name: "70代",
        age_id_range: { from: 1071, to: 1080 }
    },
    {
        name: "80代",
        age_id_range: { from: 1081, to: 1090 }
    },
    {
        name: "90代",
        age_id_range: { from: 1091, to: 1100 }
    },
    {
        name: "100歳以上",
        age_id_range: { from: 1101, to: 1101 }
    },
];

//csvファイルを読み込み
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu_source.csv');
const dest = fs.createWriteStream('popu_ranking.txt', 'utf8'); // 出力先
const rl = readline.createInterface({input: rs, output: {} });
const generationPopulationMap = new Map(); // key:世代　value:世代合計人口

rl.on('line', lineString => {
    lineString = lineString.replace(/\"/g,""); //ダブルコーテーションを除去
    const columns = lineString.split(",");

    const gender = columns[1]; //男女別
    const popuAggregate = columns[3];　//集計種別
    const age = columns[5];　//各年齢
    const ageId = parseInt(columns[4]); //各年齢ID
    const population = parseInt(columns[11]);　//人口数

    //男女計と総人口に絞る
    if (gender !== '男女計' || popuAggregate !== '総人口') {
        return;
    }
    // 総数を弾く
    if (age === '総数') {
        return;
    }
    
    // 年代を取得
    const generationName = getGeneration(ageId).name;
    // 現時点での年代の人口を取得
    const generationPopulation = generationPopulationMap.get(generationName) || 0;
    // 年代に加算する
    generationPopulationMap.set(generationName, generationPopulation + population);
});

rl.on('close', () => {
    // 年代が多い順にソートする
    const sortedGenerationPopulationMap = Array.from(generationPopulationMap)
    .sort((pair1, pair2) => {
        return pair2[1] - pair1[1];
    });
    
    // 結果を出力
    dest.write("2019年10月1日現在の年代別総人口ランキング [千人]\n");
    let rank = 1;
    for (let generationArray of sortedGenerationPopulationMap) {
        const generation = generationArray[0];
        const population = generationArray[1];
        dest.write(`${rank}位: ${generation} ${population}\n`);
        rank++;
    }
});

/**
 * 年代の取得
 * @param {Number} ageId 
 * @returns {Object} 年代オブジェクト
 * @throws {Error} 範囲外のageIdエラー
 */
function getGeneration(ageId) {
    for (const generation of generations) {
        if (generation.age_id_range.from <= ageId && ageId <= generation.age_id_range.to) {
            return generation;
        }
    }
    throw new Error("範囲外の年齢IDです");
}
