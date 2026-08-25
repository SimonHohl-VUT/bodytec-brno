# BodytecBrno — web

Statický web. Žádný build, žádné závislosti. Otevři `index.html` v prohlížeči
a funguje; na hosting stačí nahrát celou složku přes FTP (klidně i do
podsložky — všechny cesty jsou relativní).

```
index.html          celá stránka
css/style.css       styly
js/main.js          menu, scroll-spy, odkazy  ← ZDE se nastavují odkazy
assets/img/         fotky
assets/favicon.svg  ikona v záložce
robots.txt
images/             původní fotky ve formátu PNG (na web se nenahrávají)
```

---

## 1. Co je potřeba doplnit (2 věci)

### a) Rezervace přes Reservio — `js/main.js`, řádek 12

```js
BOOKING_URL: 'https://tvoje-adresa.reservio.com',
```

Tím se přepíšou **všechna** tlačítka „Vytvořit rezervaci“ na stránce najednou.
Dokud je pole prázdné, tlačítka jen sjedou dolů na sekci Kontakt.

Pokud máš místo odkazu **iframe embed** z Reservia, vlož ho v `index.html`
do připraveného místa:

```html
<div id="reservio-embed"><!-- sem iframe --></div>
```

### b) Facebook — `js/main.js`, řádek 13

```js
FACEBOOK_URL: 'https://www.facebook.com/...'
```

Dokud je pole prázdné, odkaz na Facebook se v patičce sám skryje.

---

## 2. Fotky

Na webu jsou čtyři fotky, převedené z `images/*.png` do JPEG
(1,7 MB → 296 kB, aby se stránka rychle načítala):

| Soubor | Kde | Co je na ní |
|---|---|---|
| `studio-marek.jpg` | úvod | Marek v EMS vestě u přístroje |
| `trenink-deti.jpg` | Proč EMS | klientka cvičí, dítě si hraje |
| `lekce-deti.jpg` | První lekce | klientka při lekci, děti s hračkami |
| `marek-portret.jpg` | O mně | portrét Marka |

Když budeš fotku měnit, uprav i text v `alt="…"` — čtou ho vyhledávače
a odečítače obrazovky.

---

## 3. Barvy

Zelená `#A6CD3E` má výborný kontrast na černé (10,6:1), ale na bílé je
nečitelná (1,8:1). Proto je web tmavý a zelená se používá jako akcent nebo
jako výplň tlačítek s černým textem — nikdy jako malý zelený text na bílé.
Všechny barvy jsou nahoře v `css/style.css` v bloku `:root`.

---

## 4. Mapa a formulář

Mapa v sekci Kontakt je vložený **widget Map Google** — funguje bez API klíče
a bez registrace. Adresa se mění přímo v `index.html` v atributu `src` iframu.
Pozor: widget načítá obsah z Googlu a ukládá cookies, což je u českých webů
běžné, ale pokud řešíš cookie lištu, patří mezi „marketingové" cookies.

Kontaktní formulář web **nemá** — záměrně. Telefon, e-mail i adresa jsou přímo
v sekci Kontakt a rezervace se řeší přes Reservio.
