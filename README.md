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

## 1. Odkazy (Reservio, Facebook)

Odkazy jsou **natvrdo v `index.html`**, ne v JavaScriptu — tlačítko na
rezervaci tak funguje i když se JS nenačte nebo ho prohlížeč drží ve staré
verzi z cache. Je to nejdůležitější tlačítko na webu, takže nesmí záviset
na ničem navíc.

Změna odkazu = najít a nahradit v `index.html`:

| Co | Kolikrát | Najdi |
|---|---|---|
| Reservio | 4× | `bookings.reservio.com` |
| Facebook | 1× | `facebook.com/bodytecbrno` |

Pokud bys chtěl mít rezervaci rovnou na stránce (v okně, ne v nové záložce),
je v sekci Kontakt připravené místo označené `<!-- SWAP: -->` pro iframe
z Reservia.

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
