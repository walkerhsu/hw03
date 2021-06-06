function uploadLoaded() {
    console.log('uploadLoaded')
}

function loadFile(event) {
    document.getElementById('imgSrc').src = URL.createObjectURL(event.target.files[0])

    const now = new Date()
    let yy = now.getFullYear() %100
    let mm = now.getMonth() + 1
    let dd = now.getDate()

    mm = mm<10? '0' + mm.toString() : mm.toString()
    dd = dd<10? '0' + dd.toString(): dd.toString()

    document.getElementById('albumid').value = yy.toString() + '-' + mm.toString() + '-' + dd.toString()
}