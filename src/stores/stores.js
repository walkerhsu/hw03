let Stores = {}
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
            Stores = [...queryStores]
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
    var currentStoreNumber = 0
    let options = {
        place: -1,
        type: -1,
        budget: -1
    }

    try{
        currentStoreNumber = parseInt(localStorage['iterator'])
        var data = localStorage['options']
        options = JSON.parse(data)
        
        console.log(options)
        console.log(currentStoreNumber)

        localStorage.clear();
    }catch{
        currentStoreNumber = 0
    }
    //console.log(currentStoreNumber)

    queryNTUStores(options , function(queryStores) {
        //console.log(queryStores[0][0])
        Stores = [...queryStores]

        changeHtml(currentStoreNumber)
    })
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
    console.log(Stores.length)
    let div1 = document.createElement("div")
    let img = document.createElement("img")
    let txt = document.createTextNode(value)

    div1.className = isOdd? "imageItemOdd" : "imageItem"
    img.className = "image-cropper"
    img.src = Img
    img.width = 50
    img.height = 50

    div1.onclick = function (e) {
        var currentNumber = 0
        //console.log(Stores.length)
        for(var i = 0; i < Stores.length; i++) {
            //console.log(Stores[i][0])
            if(e.target.textContent === Stores[i][0]) {
                currentNumber = i
                break
            }
        }
        console.log(currentNumber)
        // todo, show detail page
        localStorage.setItem('iterator',currentNumber)
        localStorage.setItem("options",JSON.stringify(options))
        window.location.href = '/stores/details'
    }

    div1.appendChild(img)
    div1.appendChild(txt)
    parent.appendChild(div1)
}

function changeHtml(number) {
    //console.log(number)
    document.getElementById('image').src = '/res/foods/' + Stores[number][12]
    document.getElementById('store').textContent = Stores[number][0]
    document.getElementById('place').textContent = 'Place : ' + Stores[number][1]
    document.getElementById('budget').textContent = 'Budget : ' + Stores[number][4]
    document.getElementById('staple').textContent = 'Staple : ' + Stores[number][6]
    document.getElementById('price').textContent = 'Price : ' + Stores[number][3]
    document.getElementById('capacity').textContent = 'Capacity : ' + Stores[number][10]
    document.getElementById('address').textContent = 'Address : ' + Stores[number][2]
    document.getElementById('time').textContent = 'Operating time : ' + Stores[number][11]
    
    let text = ''
    let span = document.getElementById('button')
    
    if(number > 0) {
        text += '<button id = previous>PREV</button>'
    }
    if(number != (Stores.length)-1) {
        text += '<button id = following>NEXT</button>'
        
    }
    span.innerHTML = text
    var previousStore = null
    var followingStore = null

    previousStore = document.getElementById('previous')
    if(previousStore !== null) {
        previousStore.onclick = function(){
            var previousStoreNumber = number - 1
            changeHtml(previousStoreNumber)
        }
    }
    
    followingStore = document.getElementById('following')
    if(followingStore !== null) {
        followingStore.onclick = function(){
            var followingStoreNumber = number + 1
            changeHtml(followingStoreNumber)
        }
    }
}