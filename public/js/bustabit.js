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


function hmaczzz(key, v) {
    var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
    return hmacHasher.finalize(v).toString();
}

function crashPointFromHash(seed) {
    const nBits = 52; // number of most significant bits to use

    // 1. HMAC_SHA256(message=seed, key=salt)  
    console.log('----------- ' + seed + ' -----------');
    const hmac = CryptoJS.HmacSHA256(CryptoJS.enc.Hex.parse(seed), '0000000000000000004d6ec16dafe9d8370958664c1dc422f452892264c59526');
    seed = hmac.toString(CryptoJS.enc.Hex);
    console.log(seed);


    // 2. r = 52 most significant bits
    seed = seed.slice(0, nBits / 4);
    const r = parseInt(seed, 16);

    // 3. X = r / 2^52
    let X = r / Math.pow(2, nBits); // uniformly distributed in [0; 1)

    // 4. X = 99 / (1-X)
    X = 99 / (1 - X);

    // 5. return max(trunc(X), 100)
    const result = Math.floor(X);
    return Math.max(1, result / 100);
};