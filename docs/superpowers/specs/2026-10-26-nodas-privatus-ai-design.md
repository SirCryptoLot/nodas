# nodas.lt: privataus AI svetainė (dizainas)

Data: 2026-10-26

## Kam ir kodėl

nodas.lt pradedama iš naujo kaip verslo svetainė, kuri parduoda:

- privataus (lokalaus) AI / LLM įdiegimą kliento kompiuteryje ar serveryje,
- paruoštus AI kompiuterius,
- privačius AI sprendimus verslui,
- garantijas ir palaikymą.

Senas nodas.lt projektas (web remontas, admin panelė, parduotuvė, Supabase) **visiškai nenaudojamas**. Jokio kodo, turinio ar struktūros iš archyvo.

Auditorijos (trys keliai):

1. **Verslas**: smulkios ir vidutinės įmonės, kurios nenori siųsti duomenų į ChatGPT ir panašias paslaugas.
2. **Privatūs žmonės**: savas AI namuose, be prenumeratų ir be sekimo.
3. **Necenzūruotas LLM**: žmonės, norintys lokalaus atviro modelio be platformų filtrų.

Klientas ateina su keturiais klausimais, į kuriuos puslapis turi atsakyti greitai ir aiškiai:

- **kiek kainuoja**,
- **per kiek laiko**,
- **ką galiu nuveikti su tokiu AI**,
- **kokia nauda**.

Sėkmė: lankytojas per kelias sekundes supranta pasiūlymą ir palieka užklausą per kontaktų formą.

## Tikslai, ne tikslai, anti-tikslai

**Tikslai**

- Vienas puslapis, lietuvių kalba.
- Labai minimalistinis: didelės raidės, mažai teksto.
- Aiškūs paketai su kainomis „nuo“ ir terminais.
- Užklausa per paprastą formą, kuri atkeliauja el. paštu.

**Ne tikslai (dabar)**

- Mokėjimai svetainėje, krepšelis, parduotuvė.
- Vartotojų paskyros, prisijungimas, admin panelė, duomenų bazė.
- Blogas, kelios kalbos.

**Anti-tikslai (nesėkmė, net jei techniškai veikia)**

- Ilgi, „korporatyviniai“ tekstai; tipinė AI startuolio estetika (gradientai, švytėjimai, stock iliustracijos).
- Daugiažingsnis vedlys ar sudėtinga forma (savininkui tokios formos jau anksčiau painiojo klientus).
- Bet kas, kas primena senąjį nodas.lt.

## Vizualinis stilius (savininko pasirinkta)

- **Spalvos (C kryptis, „šilta, žurnalinė“)**: popieriaus spalvos fonas `#f4f1ea`, tekstas `#1c1a17`, antrinis tekstas `#5a544b` / `#7a746a`, vienas akcentas `#c2410c` (degintas oranžinis), plonos skiriamosios linijos `#ddd6c8`.
- **Šriftas**: **Pixelify Sans** (Google Fonts, su `latin-ext`, kad veiktų ą č ę ė į š ų ū ž) antraštėms, logotipui, kainoms, mygtukams/nuorodoms. Ilgesniam tekstui naudojamas sisteminis sans-serif, kad būtų lengva skaityti.
- **Dydžiai**: didelės raidės. Pagrindinė antraštė desktop'e apie 64–88 px, sekcijų antraštės didelės. Daug tuščios erdvės.
- **Dar labiau minimalu** nei pirmasis maketas: kiekvienoje sekcijoje tik būtinas tekstas, be kortelių šešėlių, be ikonų gausos. Sekcijas skiria plona linija ir mažas oranžinis numeruotas užrašas (pvz. `02 · KAM TAI SKIRTA`).
- Mygtukai: tekstinė nuoroda su rodykle („Gauti pasiūlymą →“) akcento spalva, ne ryškus blokas.
- Maketai: `.superpowers/brainstorm/*/content/struktura.html` (eiga) ir `8bit-fontas.html` (variantas C).

## Puslapio struktūra (patvirtinta)

Vienas puslapis, viršuje navigacija: logotipas „Nodas“ + nuorodos Paslaugos · Kainos · DUK · Kontaktai (inkarai tame pačiame puslapyje).

1. **Pagrindinė žinutė**: „Privatus AI.“ / „Duomenys lieka pas jus.“ / „Be debesų. Be prenumeratų. Be cenzūros.“ + „Gauti pasiūlymą →“ (veda į formą).
2. **Kam tai skirta**: trys stulpeliai: Verslui · Namams · Be cenzūros, po vieną sakinį.
3. **Ką galėsite nuveikti ir kokia nauda**: klausti savo dokumentų, rašyti laiškus/pasiūlymus, santraukos iš ilgų PDF, vertimai, programavimo pagalba, darbas be interneto. Plius nauda: duomenys neišeina, jokio mėnesinio mokesčio už AI, veikia be interneto.
4. **Paketai, kainos, terminai** (kainos pradinės, savininkas patikslins vėliau, todėl lengvai keičiamos vienoje vietoje):

   | Paketas | Kam | Kaina | Terminas |
   |---|---|---|---|
   | AI įdiegimas į jūsų kompiuterį | privatiems | nuo 149 € | 1 diena |
   | Privatus AI kompiuteris (paruoštas) | privatiems ir mažoms įmonėms | nuo 1 500 € | 3–5 d. |
   | Verslo AI serveris (dokumentų paieška, keli vartotojai) | įmonėms | nuo 4 000 € | 1–3 sav. |

5. **Kaip vyksta**: 1. Pokalbis (nemokamai) → 2. Pasiūlymas su kaina → 3. Įdiegimas → 4. Apmokymas.
6. **Garantijos ir palaikymas**: 24 mėn. įrangos garantija; palaikymas nuo 29 €/mėn. privatiems, nuo 99 €/mėn. verslui (atnaujinimai, nauji modeliai, pagalba).
7. **DUK** (išskleidžiami klausimai): ar tikrai niekas nemato mano duomenų; ar veiks lietuviškai; kuo skiriasi nuo ChatGPT; kokio kompiuterio reikia; kas yra necenzūruotas modelis. Atsakymus parašo kūrėjas, trumpai ir sąžiningai (pvz. lokalūs modeliai lietuviškai veikia, bet silpniau nei angliškai).
8. **Kontaktai**: viena paprasta forma: vardas, el. paštas arba telefonas, paketas (išskleidžiamas sąrašas: AI įdiegimas / AI kompiuteris / Verslo serveris / Palaikymas / Nežinau), laukas „Ką norėtumėte daryti su AI?“, mygtukas „Siųsti“. Po siuntimo, toje pačioje vietoje padėkos žinutė. Žemiau el. paštas ir telefonas tekstu.

Poraštė: rekvizitai (įmonės pavadinimas / ind. veiklos nr.; savininkas pateiks), © metai.

## Technika (Claude sprendimai, savininkas gali keisti)

- **Statinis HTML + CSS** (be framework'o), vienas `index.html`, mažas JS tik DUK išskleidimui ir formos siuntimui.
- **Talpinimas: Vercel**, domenas nodas.lt (savininkas jau naudoja Vercel).
- **Forma**: viena Vercel serverless funkcija `api/contact`, siunčianti laišką per **Resend** (nodas.lt domenas Resend'e anksčiau buvo patvirtintas; jei nebeveikia, reikia patvirtinti iš naujo). Paprasta apsauga nuo šlamšto (paslėptas „honeypot“ laukas). API raktas tik Vercel aplinkos kintamuosiuose.
- SEO minimumas: `lang="lt"`, title, description, Open Graph, favicon.
- Pritaikyta telefonui (didelės raidės turi tilpti siauruose ekranuose).

## Savininko atsakymai (po peržiūros)

- **Kainos rodomos su PVM.** Prie lentelės įrašoma „Kainos nurodytos su PVM“.
- **Paleidimas**: naujas Vercel projektas perima nodas.lt domeną; senoji svetainė gali išnykti iš karto.
- **Telefonas, el. paštas, rekvizitai**: savininkas pateiks vėliau. Iki tol aiškiai pažymėti laikini užrašai (pvz. `[TELEFONAS]`), visi vienoje vietoje, kad juos būtų lengva pakeisti prieš paleidimą.
- **Formos gavėjas**: savininkas pateiks vėliau. Gavėjas ir siuntėjas laikomi Vercel aplinkos kintamuosiuose (`CONTACT_TO`, `CONTACT_FROM`, `RESEND_API_KEY`), kad nereikėtų keisti kodo. Ar Resend paskyra ir nodas.lt domenas dar veikia, nežinoma: kūrėjas patikrina prieš paleidimą.

## Claude sprendimai (savininkas gali keisti)

- Prie formos įrašoma viena eilutė apie privatumą („Jūsų duomenis naudosime tik atsakyti į užklausą“).
- Jokios lankytojų analitikos ir slapukų, todėl nereikia slapukų juostos.

## Palikta kūrėjui

- Tikslūs tekstai (trumpi, paprasta lietuvių kalba), DUK atsakymai.
- Tikslūs dydžiai, tarpai, išdėstymas telefone.
- Favicon / mažas pikselinis logotipo ženklas.

## Pakeitimas 2026-10-27: viskas viename ekrane

Savininkas paprašė, kad svetainė tilptų į vieną langą be slinkimo. Kompiuterio ekrane: kairėje pagrindinė žinutė ir mygtukas, dešinėje paketai, kainos, garantija ir palaikymas, apačioje dvi eilutės (ką galima nuveikti, kaip vyksta). DUK ir Kontaktai (forma, kontaktai, rekvizitai) atsidaro kaip langai (`<dialog>`), poraštės nebėra. Telefone lieka trumpas slinkimas. Patikrinta: 1024×768, 1280×720, 1366×768, 1440×900, 1920×1080 telpa be slinkimo.

## Pakeitimas 2026-10-27: šriftas

Pixelify Sans savininkui „per daug pikseliuotas“. Iš keturių variantų (Space Mono, Space Grotesk, IBM Plex Mono, JetBrains Mono) savininkas pasirinko **JetBrains Mono**. Laikomas pačioje svetainėje (`fonts/`), lotyniškas ir išplėstinis rinkinys, storiai 400–800. Antraštės 700–800, šiek tiek suspaustos raidės.
