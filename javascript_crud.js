let kutatokTomb = [
    { fkod: 40, nev: "Kühne Ede", szul: 1839, meghal: 1903 },
    { fkod: 14, nev: "Déri Miksa", szul: 1854, meghal: 1938 },
    { fkod: 16, nev: "Fejes Jenő", szul: 1877, meghal: 1952 },
    { fkod: 56, nev: "Reich Ernő", szul: 1887, meghal: 1965 },
    { fkod: 10, nev: "Bródy Imre", szul: 1891, meghal: 1944 }
];

function listaMegjelenites() {
    document.getElementById('js-lista-szekcio').style.display = 'block';
    document.getElementById('js-urlap-szekcio').style.display = 'none';
    
    const tablaTest = document.getElementById('js-kutatok-test');
    tablaTest.innerHTML = '';

    kutatokTomb.forEach(k => {
        const sor = document.createElement('tr');
        sor.innerHTML = `
            <td>${k.nev}</td>
            <td>${k.szul}</td>
            <td>${k.meghal ? k.meghal : '-'}</td>
            <td>
                <button type="button" onclick="szerkesztes(${k.fkod})" style="background-color: #ffc107; color: black; margin-right: 5px;">Szerkesztés</button>
                <button type="button" onclick="torles(${k.fkod})">Törlés</button>
            </td>
        `;
        tablaTest.appendChild(sor);
    });
}

function urlapMegjelenites(szerkesztesMod = false) {
    document.getElementById('js-lista-szekcio').style.display = 'none';
    document.getElementById('js-urlap-szekcio').style.display = 'block';
    
    if (!szerkesztesMod) {
        document.getElementById('js-kutato-form').reset();
        document.getElementById('js-id').value = '';
        document.getElementById('urlap-cim').innerText = 'Új kutató hozzáadása';
        document.getElementById('js-mentes-btn').innerText = 'Mentés';
    }
}

function uralpMentes(e) {
    e.preventDefault();
    
    const id = document.getElementById('js-id').value;
    const nev = document.getElementById('js-nev').value;
    const szul = parseInt(document.getElementById('js-szul').value);
    const meghal = document.getElementById('js-meghal').value ? parseInt(document.getElementById('js-meghal').value) : null;

    if (id) {
        const index = kutatokTomb.findIndex(k => k.fkod == id);
        if (index !== -1) {
            kutatokTomb[index] = { fkod: parseInt(id), nev, szul, meghal };
        }
    } else {
        const ujId = kutatokTomb.length > 0 ? Math.max(...kutatokTomb.map(k => k.fkod)) + 1 : 1;
        kutatokTomb.push({ fkod: ujId, nev, szul, meghal });
    }

    listaMegjelenites();
}

function torles(id) {
    if (confirm('Biztosan törölni szeretnéd ezt a kutatót?')) {
        kutatokTomb = kutatokTomb.filter(k => k.fkod !== id);
        listaMegjelenites();
    }
}

function szerkesztes(id) {
    const kutato = kutatokTomb.find(k => k.fkod === id);
    if (kutato) {
        document.getElementById('js-id').value = kutato.fkod;
        document.getElementById('js-nev').value = kutato.nev;
        document.getElementById('js-szul').value = kutato.szul;
        document.getElementById('js-meghal').value = kutato.meghal || '';
        
        document.getElementById('urlap-cim').innerText = 'Kutató adatainak módosítása';
        document.getElementById('js-mentes-btn').innerText = 'Módosítás';
        
        urlapMegjelenites(true);
    }
}

document.getElementById('js-kutato-form').addEventListener('submit', uralpMentes);
listaMegjelenites();