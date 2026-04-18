const { useState, useEffect } = React;
const e = React.createElement;

function AxiosApp() {
    const [kutatok, setKutatok] = useState([]);
    const [ujNev, setUjNev] = useState('');
    const [ujSzul, setUjSzul] = useState('');
    const [ujMeghal, setUjMeghal] = useState('');
    const [szerkesztettId, setSzerkesztettId] = useState(null);

    useEffect(() => {
        listaz();
    }, []);

    const listaz = async () => {
        try {
            const response = await window.axios.get('api.php');
            if (Array.isArray(response.data)) {
                setKutatok(response.data);
            }
        } catch (error) {
            console.error("Hiba a betöltéskor:", error);
        }
    };

    const mentes = async (ev) => {
        ev.preventDefault();
        const adatok = { 
            nev: ujNev, 
            szul: parseInt(ujSzul) || 0, 
            meghal: ujMeghal ? parseInt(ujMeghal) : null 
        };

        if (szerkesztettId !== null) {
            adatok.action = 'update';
            adatok.fkod = szerkesztettId;
        } else {
            adatok.action = 'create';
        }

        try {
            await window.axios.post('api.php', adatok);
            formReset();
            listaz();
        } catch (error) {
            console.error("Hiba a mentéskor:", error);
        }
    };

    const torles = async (id) => {
        if (confirm('Biztosan törölni szeretné?')) {
            try {
                await window.axios.post('api.php', { action: 'delete', fkod: id });
                listaz();
            } catch (error) {
                console.error("Hiba a törléskor:", error);
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
        e('h2', null, 'Axios CRUD Alkalmazás - Adatbázis kapcsolattal'),
        e('form', { onSubmit: mentes, style: { marginBottom: '20px' } },
            e('input', { type: 'text', placeholder: 'Név', value: ujNev, onChange: ev => setUjNev(ev.target.value), required: true }),
            e('input', { type: 'number', placeholder: 'Születési év', value: ujSzul, onChange: ev => setUjSzul(ev.target.value), required: true }),
            e('input', { type: 'number', placeholder: 'Halálozási év', value: ujMeghal, onChange: ev => setUjMeghal(ev.target.value) }),
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
                        e('button', { onClick: () => szerkesztes(k), style: { backgroundColor: '#ffc107', color: 'black', marginRight: '5px' } }, 'Szerkesztés'),
                        e('button', { onClick: () => torles(k.fkod) }, 'Törlés')
                    )
                ))
            )
        )
    );
}

export default AxiosApp;