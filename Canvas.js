function Canvas() {
    var iloscDruzyn;
    var iloscWorm;
    var fps = 15;
    var down = false;
    var odleglosc; //odleglosc miiedzy lormami
    var obecnyWorm = 0;
    var colors = ['red', 'yellow', 'green', 'cyan']
    var power = 0;
    var pozycje = []
    var players = []
    var button = document.getElementById('button');
    var aim = new Image();
    aim.src = "aim.png"
    var kat = 0;
    var katStrzalu = 0;
    var t = 0;
    var koniecLufy = 0;
    var kolizjaX = 0;
    var kolizjaY = 0;
    var licznikPomocniczy = 0;
    var licznikPomocniczy2 = 0;
    var a = 0
    /////////////////////////////////////////////
    button.addEventListener('click', function () {
        iloscDruzyn = parseInt(document.getElementById('selTeams').value);
        iloscWorm = iloscDruzyn * 4;
        odleglosc = Math.floor(1200 / iloscWorm)
        pozycjeLormow() // funkcja okresla poczatkowe pozycje
        document.body.innerHTML = ""//'<div id="jeden"></div><div id="dwa"></div>';
        makeCanvas();
    })
    function pozycjeLormow() {
        for (let i = 0; i < iloscDruzyn; i++) {
            pozycje[i] = [];
            let licznik = 30 + ((odleglosc) * i);
            for (let j = 0; j < 4; j++) {
                pozycje[i][j] = Math.floor(licznik);
                licznik = licznik + odleglosc * iloscDruzyn;
            }
        }
    }
    var canvas = document.createElement('canvas')
    canvas.setAttribute("id", "canvas");
    canvas.setAttribute("width", "1200");
    canvas.setAttribute("height", "600");
    var ctx = canvas.getContext("2d");//canvas z mapką    
    var canvas2 = document.createElement('canvas')
    canvas2.setAttribute("id", "canvas2");
    canvas2.setAttribute("width", "1200");
    canvas2.setAttribute("height", "600");
    var ctx2 = canvas2.getContext("2d");
    function makeCanvas() {
        document.body.appendChild(canvas)
        document.body.appendChild(canvas2)
        canvas.style.zIndex = 1
        canvas2.style.zIndex = 2
        makeMap()         
    }
    var last = 250
    var points = [];
    function makeMap() {
        for (let x = 0; x < 1200; x++) {
            ctx.fillStyle = "rgb(170, 255, 102)";
            los = Math.floor(Math.random() * 3)
            switch (los) {
                case 0:
                    y = last - 1;
                    break;
                case 1:
                    y = last;
                    break;
                case 2:
                    y = last + 1;
                    break;
            }
            points.push(y)
            last = y;
            ctx.beginPath();
            ctx.fillRect(x, y, 3, 3);
            ctx.fill();
            for (i = 0; i <= x; i++) {
                ctx.beginPath();
                ctx.moveTo(x, y + 2);
                ctx.lineTo(x, 600);
                ctx.strokeStyle = "rgb(102, 68, 0)";
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
        var imageWorm = new Image();
        imageWorm.src = "worm.png"
        for (let i = 0; i < iloscDruzyn; i++) {
            for (let j = 0; j < 4; j++) {
                let worm = {
                    x: 0,
                    y: 0,
                    img: imageWorm,
                    health: 100,
                    name: "Worm " + (j + 1),
                    team: i,
                    color: colors[i],
                    inverse: true,
                }
                worm.x = pozycje[i][j]
                worm.y = points[worm.x] - 18
                worm.x = worm.x - 15
                players.push(worm)
                worm.img.addEventListener("load", function () {
                    ctx2.drawImage(worm.img, worm.x, worm.y)
                }, false)
            }
        }
        refresh()
        window.requestAnimationFrame(animate)
    }
    function refresh() {
        for (let i = 0; i < players.length; i++) {
            if (players[i].health == 100) {
                ctx2.drawImage(players[i].img, players[i].x, players[i].y)
                ctx2.font = "15px Courier New";
                ctx2.fillStyle = players[i].color;
                ctx2.fillText(players[i].name, players[i].x - 10, players[i].y - 10);
            }
        }
    }
    function kidaln(e) {
        switch (e.which) {
            case 37://lewo
                players[obecnyWorm].inverse = true;
                var imageWorm = new Image();
                imageWorm.src = "wormS.png"
                players[obecnyWorm].img = imageWorm
                down = true
                if (down == true) {
                    players[obecnyWorm].x -= 1
                    players[obecnyWorm].y = points[players[obecnyWorm].x + 15] - 18
                    ctx2.clearRect(0, 0, 1200, 600);
                    ctx2.fillStyle = "rgba(0, 0, 200, 0.5)";
                    refresh()
                    drawPoint(180 - kat, 1);
                    zaMapa()
                }
                break;
            case 39://prawo
                players[obecnyWorm].inverse = false;
                var imageWorm = new Image();
                imageWorm.src = "wormSRight.png"
                players[obecnyWorm].img = imageWorm
                down = true
                if (down == true) {
                    players[obecnyWorm].x += 1
                    players[obecnyWorm].y = points[players[obecnyWorm].x + 15] - 18
                    ctx2.clearRect(0, 0, 1200, 600);
                    ctx2.fillStyle = "rgba(0, 0, 200, 0.5)";
                    refresh()
                    drawPoint(kat, 1);
                    zaMapa()
                }
                break;
            case 38://gora
                down = true
                if (down == true) {
                    if (kat < 90) {
                        kat += 2;
                        if (players[obecnyWorm].inverse == true) {
                            drawPoint(180 - kat, 1);
                        }
                        else {
                            drawPoint(kat, 1);
                        }
                    }
                }
                break;
            case 40://dol
                down = true
                if (down == true) {
                    if (kat > -90) {
                        kat -= 2;
                        if (players[obecnyWorm].inverse == true) {
                            drawPoint(180 - kat, 1);
                        }
                        else {
                            drawPoint(kat, 1);
                        }
                    }
                }
                break;
            case 32://spacja strzal
                down = true
                if (down == true) {
                    //tu zrobić dodawanie paska mocy
                    if (power < 35) {
                        power += 1;
                        ctx2.beginPath();
                        ctx2.moveTo(players[obecnyWorm].x, players[obecnyWorm].y - 25);
                        ctx2.lineTo(players[obecnyWorm].x + power, players[obecnyWorm].y - 25);;
                        ctx2.strokeStyle = "rgb(255, 255, 255)";
                        ctx2.lineWidth = 1;
                        ctx2.stroke();
                    }
                    else power = 35
                }
                break;
        }
    }
    function kiap(e) {
        switch (e.which) {
            case 37://lewo                        
                down = false;
                break;
            case 39://prawo                        
                down = false;
                break;
            case 38://gora 
                down = false;
                break;
            case 40://dol  
                down = false;
                break;
            case 13://enter skok             
                skok()
                break;
            case 32://spacja strzal
                power = power * 3
                if (players[obecnyWorm].inverse == true) {
                    koniecLufy = 0;
                    katStrzalu = -(90 - kat) * Math.PI / 180
                } else {
                    katStrzalu = (90 - kat) * Math.PI / 180
                    koniecLufy = 40;
                }
                lotStrzaly()
                break;
        }
    }
    function skok() {
        setTimeout(function () {
            a++
            if (players[obecnyWorm].inverse == true) players[obecnyWorm].x -= 1
            else players[obecnyWorm].x += 1;
            if (a > 20) players[obecnyWorm].y += 0.5;
            else players[obecnyWorm].y -= 0.5;
            ctx2.clearRect(0, 0, 1200, 600);
            refresh()
            if (a == 40) {
                players[obecnyWorm].y = points[players[obecnyWorm].x + 15] - 18
                a = 0;
                ctx2.clearRect(0, 0, 1200, 600);
                refresh()
            }
            else skok()
        }, 100 / fps);
    }
    function drawPoint(angle, distance) {
        let x = players[obecnyWorm].x + 15 + 50 * Math.cos(-angle * Math.PI / 180) * distance - 12;
        let y = players[obecnyWorm].y + 9 + 50 * Math.sin(-angle * Math.PI / 180) * distance - 11;
        ctx2.clearRect(0, 0, 1200, 600);
        ctx2.drawImage(aim, x, y)
        refresh()
    }
    function animate() {
        if (iloscWorm < 5) sprawdzKoniec();
        setTimeout(function () {
            document.addEventListener('keydown', kidaln)
            document.addEventListener('keyup', kiap)
        }, 1000 / fps);
    }
    function lotStrzaly() {
        document.removeEventListener('keydown', kidaln)
        document.removeEventListener('keyup', kiap)
        setTimeout(function () {
            t += 0.02
            let x = players[obecnyWorm].x + koniecLufy + Math.floor(power * t * Math.sin(katStrzalu))
            let y = players[obecnyWorm].y - Math.floor(power * t * Math.cos(katStrzalu) - ((9.8 * t * t) / 2))
            ctx2.beginPath();
            ctx2.clearRect(0, 0, 1200, 600);
            ctx2.fillStyle = "rgb(255, 255, 255)";
            ctx2.fillRect(x, y, 5, 5);
            ctx2.fill();
            kolizjaY = y;
            kolizjaX = x;
            refresh()
            if (kolizjaX < 0) {
                zeruj();
            }
            else if (kolizjaX > 1200) {
                zeruj();
            }
            else if (kolizjaY > 600) {
                zeruj();
            }
            else {
                if (points[x] == y) trafienie()
                else if (points[x] == y - 1) trafienie()
                else if (points[x] == y + 1) trafienie()
                else if (points[x - 1] == y) trafienie()
                else if (points[x + 1] == y) trafienie()
                else {
                    lotStrzaly()
                }
            }

        }, 100 / fps);
    }
    function trafienie() {
        dziuraWmapie()
        down = false;
        zeruj()
    }
    function dziuraWmapie() {
        ctx.beginPath();
        ctx.fillStyle = "rgb(163,150,255)";
        ctx.arc(kolizjaX, kolizjaY, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx2.clearRect(0, 0, 1200, 600);
        refresh()
        for (i = 0; i < 90; i++) {
            let x = Math.floor(kolizjaX + 40 * Math.cos(i * Math.PI / 180));
            let x2 = Math.floor(kolizjaX - 40 * Math.cos(i * Math.PI / 180));
            let y = Math.floor(kolizjaY + 40 * Math.sin(i * Math.PI / 180));
            if (points[x] < y) points[x] = y;
            if (points[x2] < y) points[x2] = y;
        }
        zabij()
    }
    function ustawPonownie() {
        for (let i = 0; i < players.length; i++) {
            if (players[i].health == 100) {
                players[i].y = points[players[i].x + 15] - 18;
                ctx2.clearRect(0, 0, 1200, 600);
                refresh()
            }
        }
    }
    function zabij() {
        for (let i = 0; i < players.length; i++) {
            let wartoscX = (kolizjaX - players[i].x - 15) * (kolizjaX - players[i].x - 15)
            let wartoscY = (kolizjaY - players[i].y) * (kolizjaY - players[i].y)
            let promien = Math.floor(Math.sqrt(wartoscX + wartoscY))
            if (promien < 25) {
                players[i].health = 0;
                iloscWorm -= 1;
            }
        }
        ustawPonownie()
    }
    function zaMapa() {
        if (players[obecnyWorm].x < 0) zaMapa2();
        if (players[obecnyWorm].x > 1200) zaMapa2();
        if (players[obecnyWorm].y > 600) zaMapa2();
        if (players[obecnyWorm].y < 0) zaMapa2();
    }
    function zaMapa2() {
        players[obecnyWorm].health = 0;
        nextWorm()
    }
    function nextWorm() {
        licznikPomocniczy += 1;
        if (licznikPomocniczy == iloscDruzyn) {
            licznikPomocniczy = 0
            licznikPomocniczy2++;
            obecnyWorm = licznikPomocniczy2
            if (licznikPomocniczy2 == 3) licznikPomocniczy2 = 0;
            if (obecnyWorm >= players.length) obecnyWorm = 0;
        } else {
            obecnyWorm += 4
            if (obecnyWorm >= players.length) obecnyWorm = 0;
        }
        while (players[obecnyWorm].health != 100) {
            if (obecnyWorm < players.length - 1) obecnyWorm += 1
            else obecnyWorm = 0
        }
        var strzalka = new Image();
        strzalka.src = "dir.png";
        ctx2.drawImage(strzalka, players[obecnyWorm].x, players[obecnyWorm].y - 70)
        animate()
    }
    function zeruj() {
        var imageWorm = new Image();
        if (players[obecnyWorm].inverse == true) imageWorm.src = "worm.png";
        else imageWorm.src = "wormLeft.png";
        refresh()
        players[obecnyWorm].img = imageWorm;
        ctx2.clearRect(0, 0, 1200, 600);
        refresh()
        kat = 0;
        power = 0;
        katStrzalu = 0;
        t = 0;
        kolizjaX = 0;
        kolizjaY = 0;
        nextWorm()
    }
    var rozne = true;
    function sprawdzKoniec() {
        var pozostali = [];
        for (let i = 0; i < iloscDruzyn * 4; i++) {
            if (players[i].health == 100) {
                pozostali.push(players[i].team)
            }
        }
        for (let i = 0; i < pozostali.length - 1; i++) {
            for (let j = 0; j < pozostali.length; j++) {
                if (pozostali[i] != pozostali[j]) {
                    rozne = true;
                } else rozne = false
            }
        }
        if (pozostali.length == 1) var jeszczeRaz = confirm("Wygrywa " + colors[pozostali[0]] + ", jeszcze raz?")
        if (rozne == false) var jeszczeRaz = confirm("Wygrywa " + colors[pozostali[0]] + ", jeszcze raz?")
        if (jeszczeRaz == true) {
            setTimeout(function () {
                location.reload()
            }, 1000)
        }
    }
}