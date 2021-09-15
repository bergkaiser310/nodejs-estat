'use strict'

//csvファイルを読み込み
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu_source.csv');
const rl = readline.createInterface({input:rs,output:{} });
const generationDataMap = new Map(); //key:世代　value:世代合計人口

//データ取り込みはダブルコーテーションをreplaceして実行
rl.on('line',lineString =>{
    lineString = lineString.replace(/\"/g,"");
    const columns = lineString.split(",");    
     
     const gender = columns[1]; //男女別
     const popuAggregate = columns[3];　//集計種別
     const age = columns[5];　//各年齢
     const ageId = parseInt(columns[4]); //各年齢ID
     const value = parseInt(columns[11]);　//人口数

     //男女計と総人口に絞る
     //世代情報フラグを追加するためにオブジェクト作成
     //データ5列目の各年齢に紐づくコード=ageIdで世代を絞ってフラグ追加
     if(gender === '男女計'　&& popuAggregate === '総人口'){
       
        let geneInfo = generationDataMap.get(ageId)
        if(!geneInfo){
           geneInfo = {
           generation: 0,
           popu: 0,
           }; 
        };
        
        if(1001 <= ageId && ageId <= 1010 ){
            geneInfo.generation = "10歳未満";
            geneInfo.popu = geneInfo.popu + value;
        }
        if(1011 <= ageId && ageId <= 1020 ){
            geneInfo.generation = "10代";
            geneInfo.popu = geneInfo.popu + value;
        }
        if(1021 <= ageId && ageId <= 1030 ){
            geneInfo.generation = "20代";
            geneInfo.popu = value;
        }
        if(1031 <= ageId && ageId <= 1040 ){
            geneInfo.generation = "30代";
            geneInfo.popu = value;
        }
        if(1041 <= ageId && ageId <= 1050 ){
            geneInfo.generation = "40代";
            geneInfo.popu = value;
        }
        if(1051 <= ageId && ageId <= 1060 ){
            geneInfo.generation = "50代";
            geneInfo.popu = value;
        }
        if(1061 <= ageId && ageId <= 1070 ){
            geneInfo.generation = "60代";
            geneInfo.popu = value;
        }
        if(1071 <= ageId && ageId <= 1080 ){
            geneInfo.generation = "70代";
            geneInfo.popu = value;
        }
        if(1081 <= ageId && ageId <= 1090 ){
            geneInfo.generation = "80代";
            geneInfo.popu = value;
        }
        if(1091 <= ageId && ageId <= 1100 ){
            geneInfo.generation = "90代";
            geneInfo.popu = value;
        }
        if(ageId === 1101 ){
            geneInfo.generation = "100代";
            geneInfo.popu = value;
        }
    generationDataMap.set(ageId, geneInfo);
    }
});

//配列にして世代の合計値の計算
//世代のフラグで対象を抽出して配列内の数値を合算していく
//geneTotalに世代と合計数を格納
rl.on('close',()=>{
    const geneInfoArray = Array.from(generationDataMap);　　
    var gene00 = geneInfoArray
      .filter(geneInfo => geneInfo[1].generation === "10歳未満")
      .map(geneInfo => geneInfo[1].popu);
        gene00 = gene00.reduce(function(a,b){
            return a + b;
        });
    var gene10 = geneInfoArray
      .filter(geneInfo => geneInfo[1].generation === "10代")
      .map(geneInfo => geneInfo[1].popu);
        gene10 = gene10.reduce(function(a,b){
            return a + b;
        });
    var gene20 = geneInfoArray
      .filter(geneInfo => geneInfo[1].generation === "20代")
      .map(geneInfo => geneInfo[1].popu);
        gene20 = gene20.reduce(function(a,b){
            return a + b;
        });
    var gene30 = geneInfoArray
      .filter(geneInfo => geneInfo[1].generation === "30代")
      .map(geneInfo => geneInfo[1].popu);
        gene30 = gene30.reduce(function(a,b){
            return a + b;
        });
    var gene40 = geneInfoArray
      .filter(geneInfo => geneInfo[1].generation === "40代")
      .map(geneInfo => geneInfo[1].popu);
        gene40 = gene40.reduce(function(a,b){
            return a + b;
        });
    var gene50 = geneInfoArray
      .filter(geneInfo => geneInfo[1].generation === "50代")
      .map(geneInfo => geneInfo[1].popu);
        gene50 = gene50.reduce(function(a,b){
            return a + b;
        });
    var gene60 = geneInfoArray
      .filter(geneInfo => geneInfo[1].generation === "60代")
      .map(geneInfo => geneInfo[1].popu);
        gene60 = gene60.reduce(function(a,b){
            return a + b;
        });
    var gene70 = geneInfoArray
      .filter(geneInfo => geneInfo[1].generation === "70代")
      .map(geneInfo => geneInfo[1].popu);
        gene70 = gene70.reduce(function(a,b){
            return a + b;
        }); 
    var gene80 = geneInfoArray
      .filter(geneInfo => geneInfo[1].generation === "80代")
      .map(geneInfo => geneInfo[1].popu);
        gene80 = gene80.reduce(function(a,b){
            return a + b;
        });
    var gene90 = geneInfoArray
      .filter(geneInfo => geneInfo[1].generation === "90代")
      .map(geneInfo => geneInfo[1].popu);
        gene90 = gene90.reduce(function(a,b){
            return a + b;
        });
    var gene100 = geneInfoArray
      .filter(geneInfo => geneInfo[1].generation === "100代")
      .map(geneInfo => geneInfo[1].popu);
        gene100 = gene100.reduce(function(a,b){
            return a + b;
        });   
    let geneTotal = new Array(["10歳未満",gene00],["10代",gene10],["20代",gene20],["30代",gene30],["40代",gene40],["50代",gene50],["60代",gene60],
    ["70代",gene70],["80代",gene80],["90代",gene90],["100歳以上",gene100]);
    
    //配列を人口数で降順にソート
    //データを成形
    //配列の先頭に表題を追加
    //改行してファイル出力
    const rankingGeneTotal = geneTotal.sort((pair1,pair2) =>{
        return pair2[1] - pair1[1];
    });
    const rankingStrings = rankingGeneTotal.map(([key,value],i)=>{
        return ( 
            (i + 1) +
            "位: " +
            key +
            " " +
            value
        );
    });
        const fileName = './popu_ranking.txt';
    rankingStrings.unshift("2019年10月1日現在の年代別総人口ランキング [千人]" );
    fs.writeFileSync(fileName, rankingStrings.join("\n"), 'utf8');
});