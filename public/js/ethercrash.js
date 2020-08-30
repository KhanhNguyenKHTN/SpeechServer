function refreshTable(){
    var hash = document.getElementById("gameHash").value;
    var lastHash = "";
    var amount = document.getElementById("gameAmount").value;
    
    var tableBody = document.getElementById("tbody");
    tableBody.innerHTML = "";
    for(var i=0; i<amount; i++){
        var gameHash = (lastHash!=""?genGameHash(lastHash):hash);
        var gameCrash = crashPointFromHash((lastHash!=""?genGameHash(lastHash):hash));
        var clr = gameCrash > 1.97 ? 'green': (gameCrash < 1.97 ? 'red' : 'blue');
        tableBody.innerHTML += "<tr><td>"+gameHash+"</td><td style='background:" + clr + "'>"+gameCrash+"</td></tr>";
        
        lastHash = gameHash;
    }
}


function divisible(hash, mod) {
    // So ABCDEFGHIJ should be chunked like  AB CDEF GHIJ
    var val = 0;

    var o = hash.length % 4;
    for (var i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
        var temp = hash.substring(i, i+4);
        console.log(temp);
        val = ((val << 16) + parseInt(temp, 16)) % mod;
    }

    return val === 0;
}

function genGameHash(serverSeed) {
    return CryptoJS.SHA256(serverSeed).toString()
};


function hmac(key, v) {
    var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
    return hmacHasher.finalize(v).toString();
}

function crashPointFromHash(serverSeed) {
    // see: provably fair seeding event https://bitcointalk.org/index.php?topic=4959619
    //Block 6217364 0xd8b8a187d5865a733680b4bf4d612afec9c6829285d77f438cd70695fb946801
    var hash = hmac(serverSeed, '0xd8b8a187d5865a733680b4bf4d612afec9c6829285d77f438cd70695fb946801');

    // In 1 of 101 games the game crashes instantly.
    if (divisible(hash, 101))
        return 0;

    // Use the most significant 52-bit from the hash to calculate the crash point
    var h = parseInt(hash.slice(0,52/4),16);
    var e = Math.pow(2,52);

    return (Math.floor((100 * e - h) / (e - h))/100).toFixed(2);
};