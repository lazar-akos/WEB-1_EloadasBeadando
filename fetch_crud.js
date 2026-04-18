document.addEventListener('DOMContentLoaded', listaKutatok);

async function listaKutatok() {
    document.getElementById('lista-szekcio').style.display = 'block';
    document.getElementById('urlap-szekcio').style.display = 'none';

    const response = await fetch('api.php');
    const adatok = await response.json();
    
    const tablaTest = document.getElementById('kutatok-test');
    tablaTest.innerHTML = '';

    adatok.forEach(k => {
        const sor = document.createElement('tr');
        sor.innerHTML = `
            <td>${k.nev}</td>
            <td>${k.szul}</td>
            <td>${k.meghal ? k.meghal : '-'}</td>
            <td>
                <button onclick="szerkesztKutato(${k.fkod}, '${k.nev}', ${k.szul}, ${k.meghal || "''"})" style="background-color: #ffc107; color: black;">Szerkeszt</button>
                <button onclick="torolKutato(${k.fkod})">Törlés</button>
            </td>
        `;
        tablaTest.appendChild(sor);
    });
}

function mutatUrlap() {
    document.getElementById('lista-szekcio').style.display = 'none';
    document.getElementById('urlap-szekcio').style.display = 'block';
    document.getElementById('kutato-form').reset();
    document.getElementById('fkod').value = '';
    document.getElementById('urlap-cim').innerText = 'Új kutató hozzáadása';
}

function szerkesztKutato(fkod, nev, szul, meghal) {
    document.getElementById('lista-szekcio').style.display = 'none';
    document.getElementById('urlap-szekcio').style.display = 'block';
    
    document.getElementById('fkod').value = fkod;
    document.getElementById('nev').value = nev;
    document.getElementById('szul').value = szul;
    document.getElementById('meghal').value = meghal;
    
    document.getElementById('urlap-cim').innerText = 'Kutató adatainak módosítása';
}

document.getElementById('kutato-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('fkod').value;
    const adatok = {
        nev: document.getElementById('nev').value,
        szul: document.getElementById('szul').value,
        meghal: document.getElementById('meghal').value || null
    };

    if (id) {
        adatok.fkod = id;
        await fetch('api.php', {
            method: 'PUT',
            body: JSON.stringify(adatok)
        });
    } else {
        await fetch('api.php', {
            method: 'POST',
            body: JSON.stringify(adatok)
        });
    }

    listaKutatok();
});

async function torolKutato(id) {
    if(confirm('Biztosan törölni szeretnéd?')) {
        await fetch(`api.php?id=${id}`, { method: 'DELETE' });
        listaKutatok();
    }
}