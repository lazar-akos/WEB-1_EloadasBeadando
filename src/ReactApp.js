const { useState, useEffect } = React;
const e = React.createElement;

function ReactApp() {
    const [kutatok, setKutatok] = useState([]);
    const [ujNev, setUjNev] = useState('');
    const [ujSzul, setUjSzul] = useState('');
    const [ujMeghal, setUjMeghal] = useState('');
    const [szerkesztettId, setSzerkesztettId] = useState(null);

    useEffect(() => {
        listazas();
    }, []);

    const listazas = async () => {
        try {
            const response = await fetch('api.php');
            const adatok = await response.json();
            setKutatok(adatok);
        } catch (error) {
            console.error('Hiba a listázáskor:', error);
        }
    };

    const mentes = async (ev) => {
        ev.preventDefault();
        const adat = {
            nev: ujNev,
            szul: parseInt(ujSzul),
            meghal: ujMeghal ? parseInt(ujMeghal) : null
        };

        if (szerkesztettId !== null) {
            adat.action = 'update';
            adat.fkod = szerkesztettId;
        } else {
            adat.action = 'create';
        }

        try {
            await fetch('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adat)
            });
            formReset();
            listazas();
        } catch (error) {
            console.error('Hiba a mentés során:', error);
        }
    };

    const torles = async (id) => {
        if (confirm('Biztosan törölni szeretné ezt a kutatót?')) {
            try {
                await fetch('api.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'delete', fkod: id })
                });
                listazas();
            } catch (error) {
                console.error('Hiba a törlés során:', error);
            }
        }
    };

    const szerkesztes = (k) => {
        setSzerkesztettId(k.fkod);
        setUjNev(k.nev);
        setUjSzul(k.szul);
        setUjMeghal(k.meghal || '');
    };

    const formReset = () => {
        setUjNev('');
        setUjSzul('');
        setUjMeghal('');
        setSzerkesztettId(null);
    };

    return e('div', null,
        e('h2', null, 'React CRUD Alkalmazás - Adatbázis kapcsolattal'),
        e('form', { onSubmit: mentes, style: { marginBottom: '20px' } },
            e('input', { type: 'text', placeholder: 'Név', value: ujNev, onChange: ev => setUjNev(ev.target.value), required: true }),
            e('input', { type: 'number', placeholder: 'Születés', value: ujSzul, onChange: ev => setUjSzul(ev.target.value), min: '0', required: true }),
            e('input', { type: 'number', placeholder: 'Halálozás', value: ujMeghal, onChange: ev => setUjMeghal(ev.target.value), min: '0' }),
            e('button', { type: 'submit' }, szerkesztettId !== null ? 'Módosítás' : 'Hozzáadás'),
            szerkesztettId !== null ? e('button', { type: 'button', onClick: formReset, style: { backgroundColor: '#6c757d', marginLeft: '5px' } }, 'Mégse') : null
        ),
        e('table', null,
            e('thead', null,
                e('tr', null,
                    e('th', null, 'Név'),
                    e('th', null, 'Születés'),
                    e('th', null, 'Halálozás'),
                    e('th', null, 'Műveletek')
                )
            ),
            e('tbody', null,
                kutatok.map(k => e('tr', { key: k.fkod },
                    e('td', null, k.nev),
                    e('td', null, k.szul),
                    e('td', null, k.meghal ? k.meghal : '-'),
                    e('td', null,
                        e('button', { onClick: () => szerkesztes(k), style: { backgroundColor: '#ffc107', color: 'black', marginRight: '5px' } }, 'Szerkeszt'),
                        e('button', { onClick: () => torles(k.fkod) }, 'Törlés')
                    )
                ))
            )
        )
    );
}

export default ReactApp;