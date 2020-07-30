var mysql = require('mysql');

var con = mysql.createConnection({
    host: "35.196.95.74",
    user: "khanhnguyen",
    password: "khanhnguyen",
    database: "SoundDb"
  });
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

function AddLineToLastId(link, callback)
{
  var sql = "SELECT Id FROM SoundInfo ORDER BY id DESC LIMIT 1;";
  con.query(sql, function(err, results) {
    console.log('Result: ', results);
    if (results.length !==  1) {
        console.error('not found sound ', gameId);
        return callback('NO_GAME_HASH');
    }

    var lastId = results[0].Id;
    var updateQuery = "UPDATE SoundInfo SET Link = '" + link + "' WHERE Id = " + lastId;
    con.query(updateQuery);
  });
}

exports.UpdateLink = AddLineToLastId;

