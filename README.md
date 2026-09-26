# BodytecBrno — web

Jednostránkový web EMS studia. HTML se skládá při buildu z šablon a
datových souborů pomocí [Eleventy](https://www.11ty.dev/), obsah se edituje
přes [Pages CMS](https://pagescms.org). Cesty k souborům jsou relativní,
takže web běží stejně v kořeni domény i v podsložce.

```
src/index.njk           poskládá sekce dohromady + metadata stránky
src/_data/site.json     kontakty, odkazy, banner   ← ZDE se mění odkazy
src/_data/cenik.json    ceník a poznámky pod ním
src/_includes/layouts/  kostra stránky (base.njk)
src/_includes/partials/ hlavička, patička, logo, oznámení, data pro Google
src/_includes/sections/ jedna sekce = jeden soubor
src/css/style.css       styly
src/assets/fonts/       písmo Geist (latin + latin-ext, kvůli češtině obojí)
src/js/main.js          menu, scroll-spy, rok v patičce, okno s oznámením
src/assets/img/         fotky
src/assets/favicon.svg  ikona v záložce
src/robots.txt
src/_redirects          přesměrování starých adres (funguje až na Cloudflare)
.pages.yml              co smí majitel editovat v Pages CMS
wrangler.jsonc          nasazení na Cloudflare (ukazuje na _site/)
_site/                  vygenerovaný web (do gitu nepatří)
images/                 původní fotky v PNG (na web se nenahrávají)
```

---

## 1. Jak to spustit u sebe

Potřebuješ Node.js (verze je v `.nvmrc`, aktuálně 22).

```
npm install
npm run dev
```

Otevře se `http://localhost:8080` a po každé změně se stránka sama
překreslí. Jednorázové sestavení do `_site/` je `npm run build`.

---

## 2. Co edituje majitel přes Pages CMS

Pages CMS se přihlásí přes GitHub a zapisuje rovnou do tohohle repozitáře.
Po uložení se web sám přebuildí a nasadí. Jsou tam dvě obrazovky:

**Nastavení webu** (`src/_data/site.json`)

| Pole | Co s tím |
|---|---|
| Oznámení | proužek pod menu + vyskakovací okno, ve čtyřech režimech |
| Telefon | zvlášť tvar pro zobrazení, zvlášť pro proklik z mobilu |
| E-mail, adresa, číslo účtu | kontakty |
| Odkaz na rezervace | Reservio |
| Odkaz na Facebook | patička |
| Název studia, majitel, logo, adresa webu, jazyk, barva | nastavení značky |

**Ceník** (`src/_data/cenik.json`) — řádky tabulky se dají přidávat, mazat
i přetahovat, k tomu storno poplatek, datum platnosti cen a tři poznámky
pod tabulkou.

Dlouhé texty (Proč EMS, O mně, kroky u první lekce) přes CMS editovat
**nejdou** — jsou natvrdo v šablonách v `src/_includes/sections/`.

### Oznámení: proužek a vyskakovací okno

Jedno zapnutí v CMS ovládá dvě věci najednou: **barevný proužek pod menu**
a **okno, které vyskočí při prvním otevření webu**. Okno se zavře, až ho
návštěvník potvrdí, takže se oznámení nedá jen tak přehlédnout.

V `site.json` → `banner`:

```json
"banner": {
  "zobrazit": true,
  "rezim": "varovani",
  "nadpis": "Dnes zavřeno",
  "text": "Dnes je zavřeno z technických důvodů.",
  "vyskakovaci_okno": true,
  "vyzadovat_potvrzeni": false,
  "tlacitko": "Rozumím",
  "odkaz": "",
  "odkaz_text": "Více informací"
}
```

Když je `zobrazit` vypnuté, nevygeneruje se do HTML ani proužek, ani okno.

**Čtyři režimy** (`rezim`) mění barvu, ikonu i vyznění:

| Režim | Barva | Na co |
|---|---|---|
| `varovani` | jantarová | zavřeno, změna otevírací doby |
| `akce` | zelená | sleva, novinka, akce |
| `info` | šedozelená | neutrální vzkaz |
| `urgentni` | červená | jen vážné věci |

Každý režim má vlastní ikonu, ne jen barvu — kvůli lidem, kteří barvy
nerozliší.

**Dvě věci, které tě jinak překvapí:**

1. Komu se okno jednou ukázalo a potvrdil ho, tomu se už neukazuje. Znovu
   vyskočí všem ve chvíli, kdy změníš `text`, `nadpis` nebo `rezim`.
   Prohlížeč si totiž pamatuje podpis obsahu, ne „už to viděl“.
2. Z toho plyne: vypnout a zase zapnout oznámení se **stejným** textem okno
   znovu nevyvolá. Když ho chceš ukázat znovu, změň v textu aspoň slovo.

Potvrzení se ukládá jen do prohlížeče návštěvníka (`localStorage`). Je to
způsob, jak oznámení nešlo minout, **ne důkaz**, že ho někdo konkrétní
viděl — smaže se s daty webu a v anonymním okně tam není vůbec.

`vyzadovat_potvrzeni` zapíná blokující variantu: okno se postaví přes celou
stránku a než ho člověk potvrdí, nedá se s webem nic dělat. Nech ji vypnutou,
pokud nejde o něco vážného. Zavřít okno jde vždy i klávesou Esc; brát lidem
tuhle možnost by byla past na klávesnici.

Bez JavaScriptu okno nevyskočí, ale proužek se vykreslí normálně a je v něm
celý text — žádná informace nežije jen v okně.

---

## 3. Odkazy a kontakty se mění na jednom místě

Dřív byly odkazy natvrdo v `index.html` a měnily se hledáním a nahrazováním.
**To už neplatí.** Reservio (4×), Facebook, telefon, e-mail i číslo účtu se
do HTML vypíšou při buildu z `src/_data/site.json` — stačí je opravit tam.

Ze stejných dat se generují i strukturovaná data pro Google (JSON-LD),
takže se nemůžou rozejít s tím, co je vidět na stránce. Rozsah cen
(`priceRange`) se počítá přímo z ceníku.

Odkazy jsou pořád v HTML, ne v JavaScriptu — tlačítko na rezervaci
tak funguje, i když se JS nenačte.

Pokud bys chtěl mít rezervaci rovnou na stránce (v okně, ne v nové záložce),
je v `src/_includes/sections/kontakt.njk` připravené místo označené
`<!-- SWAP: -->` pro iframe z Reservia.

---

## 4. Fotky

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

## 5. Barvy a písmo

Zelená `#A6CD3E` má výborný kontrast na černé (10,6:1), ale na bílé je
nečitelná (1,8:1). Proto je web tmavý **celý** a zelená se používá jako akcent
nebo jako výplň tlačítek s tmavým textem, nikdy jako malý zelený text na bílé.
Všechny barvy jsou nahoře v `src/css/style.css` v bloku `:root`.

Ceník byl dřív jediný světlý pruh a kvůli tomu potřeboval vlastní odstín
zelené. Teď je tmavý jako zbytek webu a ta výjimka je pryč.

Čtyři barvy oznámení (`--tone-*`) jsou schválně teplé a stejně světlé, aby
vedle sebe působily jako jedna rodina. S tmavým textem mají kontrast 7,7 až
12,1:1, takže všechny projdou i přísnějším stupněm WCAG AAA.

**Písmo je Geist**, uložené přímo u nás v `src/assets/fonts/` ve dvou
podmnožinách. `latin` nese á í é ú ó ý, `latin-ext` nese ě š č ř ž ů ď ť ň.
Obě jsou povinné, bez `latin-ext` by se rozbila polovina češtiny. Hostujeme
si ho sami, takže si prohlížeč nic netahá z Googlu a neřeší se kvůli tomu
cookies ani GDPR.

---

## 6. Mapa a formulář

Mapa v sekci Kontakt je vložený **widget Map Google** — funguje bez API klíče
a bez registrace. Adresu si bere ze `site.json` → `adresa`, stejně jako text
vedle mapy, takže se po změně v CMS nemůžou rozejít. Dřív byla v odkazu mapy
napsaná zvlášť a na tohle se zapomínalo. Pozor: widget načítá obsah z Googlu a ukládá
cookies, což je u českých webů běžné, ale pokud řešíš cookie lištu,
patří mezi „marketingové" cookies.

Kontaktní formulář web **nemá** — záměrně. Telefon, e-mail i adresa jsou přímo
v sekci Kontakt a rezervace se řeší přes Reservio.

---

## 7. Checklist před ostrým spuštěním

Web je zatím **náhled** a schválně se skrývá před vyhledávači. Než se pustí
naostro, projdi popořadě:

- [ ] **Smazat `noindex`** — v `src/_includes/layouts/base.njk` řádek
      `<meta name="robots" content="noindex, nofollow">` i komentář nad ním.
- [ ] **Uvolnit robots.txt** — v `src/robots.txt` nahradit `Disallow: /`
      za `Allow: /`.
- [ ] **Založit projekt na Cloudflare Workers** — napojit na tenhle repozitář,
      build command `npx @11ty/eleventy`, deploy command `npx wrangler deploy`.
      Název projektu musí sedět s `name` ve `wrangler.jsonc`, tedy
      `bodytecbrno`. Verzi Node si Cloudflare vezme z `.nvmrc`.
      (Cloudflare doporučuje nové projekty zakládat na Workers, ne na Pages;
      statické soubory jsou tam zdarma a bez limitu požadavků.)
- [ ] **Přepsat zpětný odkaz v Reserviu** — v administraci Reservia je
      u rezervačního formuláře odkaz zpět na `bodytecbrno.cz/kontakt/`.
      Ta adresa po spuštění nebude existovat; přepiš ji na
      `https://www.bodytecbrno.cz/#kontakt` a novou adresu vlož do
      `site.json` → `reservio_url`.
- [ ] **Zkontrolovat přesměrování** — po nasazení na Cloudflare zkusit
      `/cenik/`, `/kontakt/`, `/o-mne/` a `/prvni-lekce/`, jestli skočí
      na správnou sekci.
- [ ] **Přestěhovat DNS** — doménu `bodytecbrno.cz` převést na Cloudflare
      a nasměrovat na projekt v Pages.
- [ ] **Ověřit e-mail, teprve pak rušit Webnode** — pokud přes Webnode běží
      i e-mail, nejdřív se ujisti, že chodí odjinud. Zrušený Webnode
      s sebou e-mail vezme.
