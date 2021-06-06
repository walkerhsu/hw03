/* create album.db under shell (sqlite3 album.db), then create following table
CREATE TABLE Albums (
    ID int,
    AlbumID varchar(8),
    Caption varchar(255),
    Path varchar(255)
);
*/
var sqlite3 = require('sqlite3').verbose()
let db = null

function openDB() {
    let domain_home = __dirname.replace('src/api','')
    const dbPath = domain_home + 'database/album.db'

    db = new sqlite3.Database(dbPath , sqlite3.OPEN_READWRITE , err => {
        if(err) console.error(err.message)
        else console.log('successfully open the DB')
    })
}

function closeDB() {
    if(db) {
        db.close((err) => {
            if(err) console.error(err.message)
            else console.log('successfully close the DB')
        })
    }
}

function run(sql) {
    openDB()
    db.run(sql, err => {
        if(err) console.error(err.message)
        else console.log('successfully run the statement')
    })
}
function run_select(sql, callback) {
    openDB()

    let response = []
    db.all(sql, [], (err, rec) => {
        if(err) console.error(err.message)
        else {
            for(let i = 0; i<rec.length; i++) {
                console.log(rec[i])
                rec[i].Path = '/database/photos/' + rec[i].Path
                response.push(rec[i])
            }
        }
        callback(response)
        closeDB()
    })
}

exports.insertPhoto = function insertPhoto(rec) {
    console.log(rec)
    let statement = `INSERT INTO Albums VALUES(${rec.no}, '${rec.albumid}', '${rec.caption}', '${rec.path}');`
    console.log(statement)
    run (statement)
}

exports.queryAlbumIds = function queryAlbumIds(rec,callback) {
    console.log(rec)
    let statement = 'SELECT * FROM Albums'
    if(rec.column) {
        statement = `SELECT ${rec.column} FROM Albums`
    }
    if(rec.albumid){
        statement += ` WHERE AlbumID = '${rec.albumid}'` 
    }
    statement += ' ORDER BY AlbumID;'
    
    console.log(statement)
    run_select(statement, (response) => {
        callback(response)
    })
}