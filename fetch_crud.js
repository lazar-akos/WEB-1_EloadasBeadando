let kutatokTomb = [];

document.addEventListener('DOMContentLoaded', listaKutatok);

async function listaKutatok() {
    document.getElementById('lista-szekcio').style.display = 'block';
    document.getElementById('urlap-szekcio').style.display = 'none';

    const tablaTest = document.getElementById('kutatok-test');
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
                    <button onclick="szerkesztKutato(${k.fkod})" style="background-color: #ffc107; color: black; margin-right: 5px;">Szerkesztés</button>
                    <button onclick="torolKutato(${k.fkod})">Törlés</button>
                </td>
            `;
            tablaTest.appendChild(sor);
        });
    } catch (error) {
        console.error('Hiba listázáskor:', error);
        tablaTest.innerHTML = '<tr><td colspan="4">Hiba történt az adatok betöltésekor.</td></tr>';
    }
}

function mutatUrlap(szerkeszt = false) {
    document.getElementById('lista-szekcio').style.display = 'none';
    document.getElementById('urlap-szekcio').style.display = 'block';
    
    if (!szerkeszt) {
        document.getElementById('kutato-form').reset();
        document.getElementById('fkod').value = '';
        document.getElementById('urlap-cim').innerText = 'Új kutató hozzáadása';
        document.getElementById('mentes-btn').innerText = 'Mentés';
    }
}

function szerkesztKutato(id) {
    const kutato = kutatokTomb.find(k => k.fkod == id);
    if (kutato) {
        document.getElementById('fkod').value = kutato.fkod;
        document.getElementById('nev').value = kutato.nev;
        document.getElementById('szul').value = kutato.szul;
        document.getElementById('meghal').value = kutato.meghal || '';

        document.getElementById('urlap-cim').innerText = 'Kutató adatainak módosítása';
        document.getElementById('mentes-btn').innerText = 'Módosítás';
        mutatUrlap(true);
    }
}

document.getElementById('kutato-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('fkod').value;
    const adatok = {
        nev: document.getElementById('nev').value,
        szul: parseInt(document.getElementById('szul').value),
        meghal: document.getElementById('meghal').value ? parseInt(document.getElementById('meghal').value) : null
    };

    if (id) {
        adatok.action = 'update';
        adatok.fkod = parseInt(id);
    } else {
        adatok.action = 'create';
    }

    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adatok)
        });

        const eredmeny = await response.json();
        if (eredmeny.error) {
            alert("Hiba: " + eredmeny.error);
        }

        listaKutatok();
    } catch (error) {
        console.error('Hiba a mentés során:', error);
    }
});

async function torolKutato(id) {
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

            listaKutatok();
        } catch (error) {
            console.error('Hiba a törlés során:', error);
        }
    }
}