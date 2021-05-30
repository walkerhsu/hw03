let queryStores = {}
let iterator = 0
let options = {
    place: -1,
    type: -1,
    budget: -1
}
function bodyLoaded() {
    console.log('bodyLoaded')
    document.getElementById('queryData').addEventListener('click',function() {
        console.log('button clicked')

        let storesList = document.getElementById('storesList')
        removeAllChildNodes(storesList)

        getOptionValues()
        console.log(options.place,' ',options.type,' ',options.budget)

        queryNTUStores(options, function(queryStores) {
            console.log('this is a callback function')


            let element = document.getElementById('total') 
            element.textContent = 'Total stores corresponding with the conditions : ' + queryStores.length
            var div = document.getElementById('storesList')
            var fragment = document.createDocumentFragment()

            for(var i = 0; i < queryStores.length; i++) {
                let name = queryStores[i][0]
                let imgSrc = '/res/foods/' + queryStores[i][12]
                addChildImageNode(fragment, name, imgSrc, (i+1)%2, i)
            }
            div.appendChild(fragment)
        })
        
    })
}
function detailPageLoaded() {

}

function removeAllChildNodes(parent) {
    while(parent.firstChild) {
        //parent.pop()
        parent.removeChild(parent.firstChild)
    }
}

function getOptionValues() {
    let e = document.getElementById("places")
    
    options.place = e.value

    e = document.getElementById("types")
    options.type = e.value

    e = document.getElementById("budgets")
    options.budget = e.value
}

function queryNTUStores(opt , callback) {
    let queryString = `?place=${opt.place}&type=${opt.type}&budget=${opt.budget}`
    let url = '/stores/api' + queryString

    let xmlhttp = new XMLHttpRequest()
    xmlhttp.open('GET', url)
    xmlhttp.onerror = () => {
        console.log("** An error occurred during the transaction")
    }
    xmlhttp.onreadystatechange = () => {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let txt = xmlhttp.responseText
            callback(JSON.parse(txt))
        }
    }
    xmlhttp.send()
}

function addChildImageNode(parent, value, Img, isOdd, number) {
    let div1 = document.createElement("div")
    let img = document.createElement("img")
    let txt = document.createTextNode(value)

    div1.className = isOdd? "imageItemOdd" : "imageItem"
    img.className = "image-cropper"
    img.src = Img
    img.width = 50
    img.height = 50

    div1.onclick = function (e) {
        // todo, show detail page
        let target = e.target
        iterator = number
        console.log(iterator)
        //window.location.href = '/stores/details'
    }

    div1.appendChild(img)
    div1.appendChild(txt)
    parent.appendChild(div1)
}