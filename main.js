document.addEventListener('DOMContentLoaded', listazKutatok);

async function listazKutatok() {
    document.getElementById('lista-szekcio').style.display = 'block';
    document.getElementById('urlap-szekcio').style.display = 'none';

    const response = await fetch('api.php');
    const adatok = await response.json();
    
    const tablaTest = document.getElementById('kutatok-test');
    tablaTest.innerHTML = '';

    adatok.forEach(k => {
        const sor = `<tr>
            <td>${k.nev}</td>
            <td>${k.szul}</td>
            <td>${k.meghal ? k.meghal : '-'}</td>
            <td><button onclick="torolKutato(${k.fkod})">Törlés</button></td>
        </tr>`;
        tablaTest.innerHTML += sor;
    });
}

function mutatUrlap() {
    document.getElementById('lista-szekcio').style.display = 'none';
    document.getElementById('urlap-szekcio').style.display = 'block';
}

document.getElementById('kutato-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const adatok = {
        nev: document.getElementById('nev').value,
        szul: document.getElementById('szul').value,
        meghal: document.getElementById('meghal').value
    };

    await fetch('api.php', {
        method: 'POST',
        body: JSON.stringify(adatok)
    });

    document.getElementById('kutato-form').reset();
    listazKutatok();
});

async function torolKutato(id) {
    if(confirm('Biztosan törölni szeretnéd?')) {
        await fetch(`api.php?id=${id}`, { method: 'DELETE' });
        listazKutatok();
    }
}