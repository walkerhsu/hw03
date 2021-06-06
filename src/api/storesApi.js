//  database columns definition
//  0: store (餐廳名字)
//  1: place (區域, 公館、118、學餐、溫州街...)
//  2: address (詳細地址)
//  3: price (價位: 平均數)
//  4: budget(預算, $:0-100 $$:101-200 $$$:201-300 $$$$:301-500 $$$$$:501+)
//  5: type (菜色類別: 中式、日式、韓式...)
//  6: staple (主食, 飯、麵、水餃)
//  7: dishes (菜色： 米食、麵食、鍋物、排餐、輕食...)
//  8: meat (葷/有提供素食/全素)  
//  9: seat (有無內用座位: 有/無) 
// 10: capacity (可容納人數數字，很多的話就寫10+))
// 11: time (營業時間)
// 12: image (示意圖檔)
// 13: suggestion (天氣冷熱)

const fs = require('fs')
const csv = require('csv')

const allStores = []
let filterStores = []
const fsPromises = fs.promises

async function readDataBase() {
    try {
        const inputfile = './database/ntufoods.csv'
        const input = await fsPromises.readFile(inputfile)

        const parser = csv.parse({
            delimiter: ','
        })

        parser.on('readable', function () {
            while (record = parser.read()) allStores.push(record)
        })

        parser.on('error', (err) => console.error(err.message))

        parser.on('end', () => console.log('total stores from database:', allStores.length))

        parser.write(input)

        parser.end()
    } catch (error) {
        console.log('error', error)
    }
}
readDataBase()

const place_list = ["水源市場到師大分部", "水源市場到正門", "正門到台電大樓", "溫州街", "118", "台大學餐", "台科大學餐", "長興"]
const types_list = ["中式", "西式", "台式", "美式", "港式", "韓式", "日式", "東南亞料理", "南洋料理", "中東料理", "雲南料理"]
const budgets_list = ["$", "$$", "$$$", "$$$$", "$$$$$"]

function filterPlaces(value) {
    let condition = place_list[parseInt(value)]
    return filterStores.filter(store => store[1] === condition)
}
function filterTypes(value) {
    let condition = types_list[parseInt(value)]

    return filterStores.filter(store => {
        let separateArray = store[5].split(' ')
        //console.log(separateArray)
        var bool = false
        for (var i = 0; i < separateArray.length; i++) {
            if (separateArray[i] === condition) {
                bool = true
                break
            }
        }
        return bool
    })
}
function filterBudgets(value) {
    let condition = budgets_list[parseInt(value)]

    return filterStores.filter(store => {
        let separateArray = store[4].split(' ')
        console.log(separateArray)
        var bool = false
        for (var i = 0; i < separateArray.length; i++) {
            if (separateArray[i] === condition) {
                bool = true
                break
            }
        }
        return bool
    })

}

exports.queryStores =  function queryStores(opts) {
    filterStores = [...allStores]
    if (opts.place && opts.place >= 0) {
        filterStores = filterPlaces(opts.place)
    }
    console.log(filterStores.length)
    if (opts.type && opts.type >= 0) {
        filterStores = filterTypes(opts.type)
    }
    
    if (opts.budget && opts.budget >= 0) {
        filterStores = filterBudgets(opts.budget)
    }
    console.log(filterStores.length)
    return filterStores
}