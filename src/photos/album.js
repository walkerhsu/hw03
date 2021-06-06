let selectedIndex = -1

function albumLoaded() {
    console.log("Album page body loaded")
    queryAlbumIDs(() => {
        if (selectedIndex >= 0) {
            // query and show all photos
            var selAlbum = document.getElementById("select_albumid");
            setTimeout(displayPhotos(selAlbum.options[selectedIndex].text), 100)
        }
    })

    // listen selAlbum event
    var selAlbum = document.getElementById("select_albumid")
    selAlbum.addEventListener("change", function () {
        selectedIndex = selAlbum.selectedIndex
        displayPhotos(selAlbum.options[selectedIndex].text)
    })
}

function queryAlbumIDs(callback) {
    let xmlhttp = new XMLHttpRequest()
    let method= 'Get'
    let url = `/photos/album/api?column=AlbumID`

    xmlhttp.open(method, url)
    xmlhttp.onerror = () => {
        console.log("** An error occurred during queryAlbumIDs")
    }
    xmlhttp.onreadystatechange = () => {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200)  {
            let albumids = []
            let rows = JSON.parse(xmlhttp.responseText)
            for (let i = 0; i < rows.length; i++) {
                if (!albumids.includes(rows[i].AlbumID)) {
                    albumids.push(rows[i].AlbumID)
                }
            }
            console.log(albumids)

            if (albumids.length > 0) {
                let text = ""
                for (let i = 0; i < albumids.length; i++) {
                    text += "<option value='" + albumids[i] + "'>" + albumids[i] + "</option>"
                }

                // update album page selection
                var selAlbum = document.getElementById("select_albumid")
                selAlbum.innerHTML = text
                selectedIndex = 0   // set current selection as first option             
            }
            callback()  // notify completed
        }
        
    }
    
    xmlhttp.send()
}

function displayPhotos(albumid) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onerror = () => {
        console.log("** An error occurred during displayPhotos()")
    }
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let photoinfos = JSON.parse(xmlhttp.responseText)
            console.log(photoinfos)
            refreshPhotos(photoinfos)
        }
    }

    var queryStmt = "/photos/album/api?albumid=" + albumid;
    const method = 'GET'
    xmlhttp.open(method, queryStmt);
    xmlhttp.send();
}
function refreshPhotos(photoinfos) {
    console.log(photoinfos)
    let text = ""
    let i = 0
    for (i = 0; i < photoinfos.length; i++) {
        if (i % 5 === 0) {
            text += '<div class="row">'
        }
        text += '<div class="column">'
        text += '<a target="_blank" href="' + photoinfos[i].Path + '">'
        text += '<img class="imgsrc" src="' + photoinfos[i].Path + '">'
        text += '</a>'
        text += '<div class="caption">' + photoinfos[i].Caption + '</div>'
        text += '</div>'

        if (i % 5 === 4) {
            text += '</div>'
        }
    }

    // if not yet add the close tag, add it
    if (i % 5 != 4) {
        text += '</div>'
    }

    let imgContainer = document.getElementById("imgContainer")
    removeAllChildNodes(imgContainer)

    //add new elements
    imgContainer.innerHTML = text;
}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
