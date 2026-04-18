class Alakzat {
    constructor(x, y, meret) {
        this.x = x;
        this.y = y;
        this.meret = meret;
        this.szin = this.veletlenSzin();
        this.elem = document.createElement('div');
    }

    veletlenSzin() {
        const betuk = '0123456789ABCDEF';
        let szin = '#';
        for (let i = 0; i < 6; i++) {
            szin += betuk[Math.floor(Math.random() * 16)];
        }
        return szin;
    }

    rajzol() {
        this.elem.style.position = 'absolute';
        this.elem.style.left = `${this.x - this.meret / 2}px`;
        this.elem.style.top = `${this.y - this.meret / 2}px`;
        this.elem.style.width = `${this.meret}px`;
        this.elem.style.height = `${this.meret}px`;
        this.elem.style.backgroundColor = this.szin;
        this.elem.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.3)";
        
        document.getElementById('vaszon').appendChild(this.elem);
    }
}

class Kor extends Alakzat {
    constructor(x, y, meret) {
        super(x, y, meret);
        this.elem.style.borderRadius = '50%';
    }
}

class Negyzet extends Alakzat {
    constructor(x, y, meret) {
        super(x, y, meret);
    }
}

document.getElementById('vaszon').addEventListener('click', function(e) {
    const bound = this.getBoundingClientRect();
    const x = e.clientX - bound.left;
    const y = e.clientY - bound.top;
    const meret = Math.floor(Math.random() * 60) + 30;

    let ujAlakzat;
    if (Math.random() > 0.5) {
        ujAlakzat = new Kor(x, y, meret);
    } else {
        ujAlakzat = new Negyzet(x, y, meret);
    }

    ujAlakzat.rajzol();
});

function vaszonTorles() {
    document.getElementById('vaszon').innerHTML = '';
}