let kutatokTomb = [];

async function listaMegjelenites() {
    document.getElementById('js-lista-szekcio').style.display = 'block';
    document.getElementById('js-urlap-szekcio').style.display = 'none';
    
    const tablaTest = document.getElementById('js-kutatok-test');
    tablaTest.innerHTML = '<tr><td colspan="4">Adatok betöltése...</td></tr>';

    try {
        const response = await fetch('api.php');
        const text = await response.text();
        
        try {
            kutatokTomb = JSON.parse(text);
        } catch (e) {
            console.error("Válasz hiba:", text);
            throw new Error("Érvénytelen válasz");
        }

        if (kutatokTomb.error) throw new Error(kutatokTomb.error);

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
    } catch (error) {
        tablaTest.innerHTML = '<tr><td colspan="4">Hiba történt az adatok betöltésekor.</td></tr>';
    }
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

async function uralpMentes(e) {
    e.preventDefault();
    const id = document.getElementById('js-id').value;
    const adat = {
        nev: document.getElementById('js-nev').value,
        szul: parseInt(document.getElementById('js-szul').value),
        meghal: document.getElementById('js-meghal').value ? parseInt(document.getElementById('js-meghal').value) : null
    };

    if (id) {
        adat.action = 'update';
        adat.fkod = parseInt(id);
    } else {
        adat.action = 'create';
    }

    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adat)
        });
        
        const eredmeny = await response.json();
        if (eredmeny.error) {
            alert("Hiba: " + eredmeny.error);
        }
        
        listaMegjelenites();
    } catch (error) {
        console.error('Hiba a mentés során:', error);
    }
}

async function torles(id) {
    if (confirm('Biztosan törölni szeretnéd?')) {
        try {
            const response = await fetch('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', fkod: parseInt(id) })
            });
            
            const eredmeny = await response.json();
            if (eredmeny.error) {
                alert("Hiba: " + eredmeny.error);
            }

            listaMegjelenites();
        } catch (error) {
            console.error('Hiba a törlés során:', error);
        }
    }
}

function szerkesztes(id) {
    const kutato = kutatokTomb.find(k => k.fkod == id);
    if (kutato) {
        document.getElementById('js-id').value = kutato.fkod;
        document.getElementById('js-nev').value = kutato.nev;
        document.getElementById('js-szul').value = kutato.szul;
        document.getElementById('js-meghal').value = kutato.meghal || '';
        document.getElementById('urlap-cim').innerText = 'Kutató módosítása';
        document.getElementById('js-mentes-btn').innerText = 'Módosítás';
        urlapMegjelenites(true);
    }
}

document.getElementById('js-kutato-form').addEventListener('submit', uralpMentes);
listaMegjelenites();