import { kezdoAdatok } from './kutatoadatok.js';

const { useState } = React;
const e = React.createElement;

function ReactApp() {
    const [kutatok, setKutatok] = useState(kezdoAdatok);
    const [ujNev, setUjNev] = useState('');
    const [ujSzul, setUjSzul] = useState('');
    const [ujMeghal, setUjMeghal] = useState('');
    const [szerkesztettId, setSzerkesztettId] = useState(null);

    const hozzaadas = (ev) => {
        ev.preventDefault();
        if (szerkesztettId !== null) {
            setKutatok(kutatok.map(k => k.fkod === szerkesztettId ? 
                { ...k, nev: ujNev, szul: ujSzul, meghal: ujMeghal } : k));
            setSzerkesztettId(null);
        } else {
            const ujKutato = {
                fkod: Math.max(...kutatok.map(k => k.fkod), 0) + 1,
                nev: ujNev,
                szul: ujSzul,
                meghal: ujMeghal
            };
            setKutatok([...kutatok, ujKutato]);
        }
        formReset();
    };

    const torles = (id) => {
        if (confirm('Biztosan törlöd?')) {
            setKutatok(kutatok.filter(k => k.fkod !== id));
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
        e('h2', null, 'React CRUD Alkalmazás (Helyi tömbbel)'),
        e('form', { onSubmit: hozzaadas, style: { marginBottom: '20px' } },
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