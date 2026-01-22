# 🌍 World Explorer — Frontend Zadatak (Junior Level)

## 📌 Opis zadatka

Cilj zadatka je da napraviš **responsivnu single-page aplikaciju** koja prikazuje države sveta koristeći **REST Countries API**.
Aplikacija mora da bude rađena u **čistom HTML-u, CSS-u i JavaScript-u**.

Korisnik treba da može da pretražuje, filtrira, sortira, lista države i vidi detalje o svakoj državi.

---

## 🔗 API

Koristi se REST Countries API:

```
https://restcountries.com/
Pogledaj dokumentaciju i istrazi
```

Za svaku državu potrebno je prikazati makar ove podatke (može i više):

- `name.common`
- `name.official`
- `region`
- `subregion`
- `capital`
- `population`
- `flags.png` / `flags.svg`
- `languages`
- `currencies`
- `borders`

---

## 🎨 UI Zahtevi

### 1. Header

- Naziv aplikacije: **World Explorer**
- Opcioni dark/light toggle (CSS klase)

### 2. Filter bar

- **Search input**: filtrira po imenu države (live search)
- **Region filter**: All / Africa / Americas / Asia / Europe / Oceania / Antarctic
- **Sortiranje**:
    - Name (A–Z)
    - Name (Z–A)
    - Population (asc)
    - Population (desc)

### 3. Info bar

- Prikazuje: `Total countries: X`

### 4. Grid kartica

Kartica treba da sadrži:

- Zastavu (slika full width)
- Naziv države
- Region
- Capital
- Population

Klik na karticu otvara modal sa detaljima.

### 5. Modal — detalji države

Prikazuje:

- Veliku zastavu
- Zvanični naziv
- Region + subregion
- Capital
- Population
- Jezike
- Valute
- Granične zemlje

### 6. Pagination

- 12 država po stranici
- Prev / Next dugmad
- „Page X of Y“

---

## 📐 Responsive Zahtevi

Aplikacija mora da bude prilagođena:

- 📱 Mobilnom (1 kolona)
- 📲 Tabletu (2–3 kolone)
- 🖥 Desktopu (3–4 kolone)

Koristi `@media` query breakpoint-e.

---

## ⚙️ Tehnički Zahtevi

- HTML, CSS, JavaScript (ES6+)
- Koristi `axios` za API pozive
- CSS organizuj BEM stilom (preporuka):
    - `.header`, `.header__title`, `.card`, `.card__flag`, ...
- JS treba da bude podeljen u logičke funkcije:
    - fetch podataka
    - render svih kartica
    - render jedne kartice
    - filtriranje
    - sortiranje
    - paginacija
    - otvaranje/zatvaranje modala

---

## 🧪 UX / Behavior

- Prilikom prvog učitavanja prikaži loader
- Ako API padne → prikaži poruku:
  `Unable to load countries. Please try again later.`
- Search + region filter + sort rade u kombinaciji
- Paginacija radi na filtriranim rezultatima

---

## ⭐ Bonus (nije obavezno ali poželjno)

- Dark / Light tema
- Animacije na hover i modal transition
- Scroll-to-top dugme
- Čuvanje filtera u `localStorage`

---

## 🏁 Kraj zadatka

Cilj je da napraviš jednostavnu, brzu i preglednu aplikaciju kojom korisnik može da istražuje države sveta.
