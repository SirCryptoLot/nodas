# nodas.lt: AI įrangos ir diegimo svetainė (dizainas)

Data: 2026-11-05. Pakeičia vieno puslapio „privatus AI“ svetainę (`2026-10-26-nodas-privatus-ai-design.md`): savininkas nusprendė daryti pilną svetainę nodas.lt, „naujas dizainas, viskas nauja“.

## Kam ir kodėl

nodas.lt parduoda:

- **AI įrangą**: NVIDIA DGX (Spark ir giminingi GB10 įrenginiai, DGX Station pagal užklausą), AI kompiuterius ir darbo stotis;
- **privataus AI įdiegimo paslaugas** (kliento arba mūsų įrangoje, namams ir verslui), garantiją ir palaikymą;
- **necenzūruotus modelius** (atviri modeliai be platformų filtrų) kaip atskirą kryptį.

Tikslas (savininko žodžiais): tapti „numeriu vienu“ šių paslaugų teikėju Lietuvoje. Svetainė turi atvesti srautą iš Google ir paversti jį užklausomis.

**Pirkimas**: per „Gauti pasiūlymą“ (užklausa), be krepšelio ir mokėjimų. Savininko sprendimas: „kol kas taip bus patogiau“.

**Tiekėjas**: skytech.lt. Savininkas planuoja susikurti verslo (B2B) paskyrą; kol jos nėra, tikrų pirkimo kainų nėra.

## Rinkos tyrimas (2026-11-05)

- Artimiausias konkurentas **aicentras.lt** (MB Pataisyk Mane): lokalūs AI serveriai, automatizacija, auditas nuo 149 €, diegimas nuo 1 200 €. Neturi įrangos kainų, darbų pavyzdžių, atsiliepimų, garantijos, rekvizitų; 3 straipsniai.
- **lt.onintelligence.eu/hardware**: ilgas įrangos gidas lietuviškai, apytikslės kainos, klaidos, nieko neparduoda.
- DGX Spark Lietuvoje ~6 000–6 700 € su PVM, perkamas per kainų palyginimo svetaines, dažnai išparduotas, **niekas nesiūlo kartu su įdiegimu**.
- Lietuviško turinio apie VRAM, „kokio kompiuterio reikia AI“, necenzūruotus modelius, DGX palyginimus beveik nėra.
- Argumentai verslui: ES DI aktas (DI raštingumas nuo 2025-02-02), BDAR, lietuviškas modelis TildeOpen (Tilde, 30B), kurį galima diegti lokaliai.

**Pozicija**: vienintelis Lietuvoje, kuris parduoda AI įrangą **kartu su įdiegtu ir sukonfigūruotu AI, aiškia kaina, garantija ir palaikymu**, ir turi geriausią lietuvišką turinį šia tema.

## Tikslai, ne tikslai, anti-tikslai

**Tikslai**
- Aiški, minimali, profesionali svetainė lietuvių kalba (savininko žodžiai).
- Pilnas techninis SEO visai svetainei ir atskiri SEO puslapiai, vedantys srautą į įrangą, skaičiuoklę ar užklausą.
- Skaičiuoklė „Kokio kompiuterio reikia AI?“ (savininko idėja, žr. žemiau).
- Kiekviena užklausa žino, dėl ko klientas rašo (produktas, paslauga ar skaičiuoklės konfigūracija).

**Ne tikslai (dabar)**
- Krepšelis, mokėjimai, vartotojų paskyros, admin panelė, duomenų bazė.
- Kelios kalbos.
- Automatinis kainų sinchronizavimas su skytech.lt.

**Anti-tikslai**
- Bet kas iš senojo nodas.lt (web remontas) ar „privatus AI“ išvaizdos.
- Tipinė AI startuolio estetika: gradientai, švytėjimai, robotų iliustracijos, tuščios frazės.
- Išgalvoti atsiliepimai, klientų logotipai ar darbų pavyzdžiai. Jų nėra, todėl jų ir nerodome.
- Skaičiuoklė, kuri žada tikslius skaičius: visada žymima kaip apytikslis įvertinimas.

## Išvaizda (savininko pasirinkta: A „Švari balta“)

Maketas: `.superpowers/preview/kryptys.html`, A dalis.

- Baltas fonas, tekstas `#0a0a0a`, antrinis `#555`/`#666`, linijos `#eaeaea`, vienas akcentas mėlynas `#2563eb`, „tinka“ žalia `#15803d`.
- Šriftas **Inter** (laikomas pačioje svetainėje, `latin-ext`, be užklausų į Google). Antraštės 700, suspaustos (`letter-spacing` apie -0.035em), pagrindinė antraštė ~64px kompiuteryje.
- Pagrindinis mygtukas juodas, apvalus (pill); antrinis su plona rėmeline linija.
- Kortelės: 1px `#eaeaea` rėmelis, 16px kampų spindulys, beveik be šešėlio.
- Daug tuščios erdvės. Pritaikyta telefonui.

## Svetainės struktūra (patvirtinta)

Viršuje meniu: Įranga · Diegimas · Skaičiuoklė · Necenzūruoti · DUK · Kontaktai, ir mygtukas „Gauti pasiūlymą“.

1. **Pagrindinis** `/`: žinutė („Jūsų AI. Jūsų serveryje.“ iš maketo), du mygtukai (Gauti pasiūlymą, Kokio kompiuterio reikia?), skaičiuoklės sutrumpinta versija dešinėje, trys keliai (Įranga, Diegimas, Necenzūruoti), populiariausi produktai, kaip vyksta darbas, kodėl mes (įranga + diegimas + garantija + palaikymas vienoje vietoje), DUK ištrauka.
2. **Įranga** `/iranga`: produktų kortelės. Kiekviena: pavadinimas, pagrindiniai parametrai (atmintis, GPU, CPU, diskas), kokio dydžio modelius traukia, kaina arba „Kaina pagal užklausą“, kas įeina į paketą, mygtukas „Gauti pasiūlymą“. Kiekvienas produktas turi savo puslapį `/iranga/<slug>`.
3. **Diegimas ir paslaugos** `/diegimas`: įdiegimas į kliento įrangą, verslo sprendimai (paieška dokumentuose, keli vartotojai), garantija, palaikymas, kaip vyksta (pokalbis → pasiūlymas → įdiegimas → apmokymas).
4. **Skaičiuoklė** `/skaiciuokle`.
5. **Necenzūruoti modeliai** `/necenzuruoti-modeliai`: kas tai, kam reikia, kaip veikia lokaliai, atsakomybė tenka naudotojui.
6. **DUK** `/duk`.
7. **Kontaktai** `/kontaktai`: užklausos forma, el. paštas, telefonas, rekvizitai.
8. **Privatumo politika** `/privatumas`.
9. **SEO puslapiai** (žr. žemiau).
10. 404 puslapis.

## Produktai ir kainos

- Visi produktai ir kainos **viename duomenų faile**, kad savininkas galėtų pakeisti kainą vienoje vietoje ir ji pasikeistų visur (kortelės, produkto puslapis, struktūrizuoti duomenys, skaičiuoklė).
- Kaina kiekvienam produktui neprivaloma: jei nenurodyta, rodoma „Kaina pagal užklausą“. Nurodyta kaina rodoma kaip „nuo X €“ su prierašu „su PVM“.
- Produktas parduodamas kaip **paketas**: įranga, įdiegtas ir sukonfigūruotas AI, 24 mėn. garantija, pradinis apmokymas.
- Pradinis sąrašas (pagal tai, ką turi skytech.lt):
  - NVIDIA DGX Spark ir giminingi GB10 įrenginiai (PNY DGX Spark, ASUS Ascent GX10, Lenovo ThinkStation PGX), 128 GB;
  - AI kompiuteris su RTX 5090 (32 GB), surenkamas mūsų;
  - AI kompiuteris su 2× RTX 5090 (64 GB);
  - AI darbo stotis su RTX PRO 6000 (96 GB);
  - DGX Station: tik pagal užklausą (skytech jo neturi).
- Kol nėra B2B kainų, visiems produktams kaina nenurodyta (pagal užklausą).

## Skaičiuoklė „Kokio kompiuterio reikia AI?“ (savininko idėja, patvirtinta)

**Lankytojas pasirenka**
- Modelio dydį: mažas (8B), vidutinis (32B), didelis (70B), labai didelis (120B+), kiekvienas su paprastu paaiškinimu.
- Norimą greitį slankikliu: tokenai per sekundę, 5–100. Šalia: apytiksliai žodžiai per sekundę ir „lėčiau nei skaitote / kaip skaitote / greičiau nei skaitote“.
- Vartotojų skaičių vienu metu: 1, 5, 20.

**Rodo**
- Kiek atminties reikia modeliui.
- Palyginimą: DGX Spark, Mac Studio (M4 Max, M3 Ultra), kompiuteris su RTX 5090, 2× RTX 5090, RTX PRO 6000, DGX Station. Prie kiekvieno: apytikslis greitis, ar modelis telpa, žalia varnelė, jei atitinka norą.
- Rekomenduojamą konfigūraciją su pilna specifikacija: vaizdo plokštė, procesorius, RAM, diskas, maitinimo blokas.
- Mygtuką „Gauti pasiūlymą šiai konfigūracijai“: atidaro užklausos formą su įrašytais pasirinkimais.
- Aiškų prierašą, kad tai apytikslis įvertinimas.

**Skaičiavimas** (Claude sprendimas): atmintis = parametrai × baitai parametrui (pagal kvantizaciją, numatytoji 4 bitai) + rezervas kontekstui; greitis ≈ efektyvumo koeficientas × atminties pralaidumas ÷ modelio dydis baitais; keli vartotojai mažina greitį vienam vartotojui. Įrangos duomenys (atmintis, pralaidumas) laikomi tame pačiame duomenų faile kaip produktai, paimti iš oficialių specifikacijų. Mac Studio rodomas tik palyginimui (neparduodamas).

Skaičiuoklė veikia naršyklėje, be serverio. Jos sutrumpinta versija yra pagrindiniame puslapyje.

## SEO

**Techninis SEO visai svetainei**
- Kiekvienas puslapis: unikalus pavadinimas ir aprašymas, canonical, Open Graph, socialinių tinklų paveikslėlis.
- Struktūrizuoti duomenys: įmonė (LocalBusiness), produktai (Product, su kaina tik kai ji nurodyta), paslaugos (Service), DUK (FAQPage), naršymo kelias (BreadcrumbList), straipsniai (Article).
- Lietuviški, trumpi adresai be lietuviškų raidžių (pvz. `/dgx-spark-lietuvoje`).
- sitemap.xml, robots.txt, greitas įkėlimas (beveik be JavaScript), vidinės nuorodos tarp SEO puslapių, produktų ir skaičiuoklės.

**SEO puslapiai** (kiekvienas veda į įrangą, skaičiuoklę arba užklausą):
1. DGX Spark Lietuvoje: kaina, pristatymas, įdiegimas kartu
2. DGX Station verslui
3. Kokio kompiuterio reikia AI (VRAM gidas)
4. DGX Spark, RTX 5090 ar Mac Studio: palyginimas
5. Privatus AI įmonei / lokalaus LLM diegimas
6. ChatGPT alternatyva be debesies (BDAR)
7. AI buhalterijai
8. AI teisininkams
9. AI klinikoms
10. AI gamybai
11. Necenzūruoti AI modeliai (gidas, atskirai nuo paslaugos puslapio)
12. Lietuviškas AI lokaliai (TildeOpen)
13. ES DI aktas ir DI raštingumas įmonei

Turinys: konkretus, sąžiningas, be išgalvotų faktų; kainos ir specifikacijos tik iš patikrinamų šaltinių arba iš duomenų failo.

## Technika (Claude sprendimai)

- **Astro**, statinė svetainė (paprasti HTML puslapiai), talpinama **Vercel**. SEO puslapiai rašomi kaip Markdown tekstas.
- Perkeliama iš esamo projekto: užklausų API `api/contact.js` (Resend, limitas, apsauga nuo botų) ir jos testai, privatumo politikos turinys, saugumo antraštės (`vercel.json`), principas „jokio sekimo, jokių slapukų, šriftai pačioje svetainėje“.
- Užklausos forma papildoma lauku, kas užklausiama (produktas / paslauga / skaičiuoklės konfigūracija).
- Senasis „privatus AI“ puslapis keičiamas naujuoju tame pačiame repozitorijoje; istorija lieka git'e.

## Savininko atsakymai po peržiūros

- **Paslaugų kainos paliekamos** iš „privatus AI“ versijos ir rodomos svetainėje (su PVM): AI įdiegimas į kliento kompiuterį nuo 149 €; verslo AI serveris (įranga + diegimas) nuo 4 000 €; palaikymas nuo 29 €/mėn. namams, nuo 99 €/mėn. verslui. Jos laikomos tame pačiame duomenų faile kaip produktai ir turi Service struktūrizuotus duomenis su kaina. Įrangai kol kas „Kaina pagal užklausą“.
- **Garantija: tiekėjo (skytech.lt).** Svetainėje rašoma „įrangai taikoma tiekėjo garantija; garantinius reikalus sutvarkome už jus“. Garantijos trukmė nurodoma pagal tiekėjo sąlygas (dažniausiai 24 mėn.); svetainė nežada daugiau, nei suteikia tiekėjas.
- **Necenzūruoti modeliai:** diegiame bet kokius reikalingus modelius. Tai dalis diegimo paslaugos (atskiros kainos nėra). Formoje yra pasirinkimas „Necenzūruotas modelis“. Puslapyje prierašas, kad už naudojimą atsako naudotojas.

## Claude sprendimai po peržiūros (savininkas gali keisti)

- **Palaikymas perkamas atskirai** (mėnesinis), į paketą neįeina. Paketą sudaro: įranga, įdiegtas ir sukonfigūruotas AI, pradinis apmokymas, pagalba su tiekėjo garantija.
- **Surenkamų kompiuterių dalys** (procesorius, RAM, diskas, maitinimo blokas) parenkamos kaip pavyzdinės ir žymimos „pavyzdinė konfigūracija, galutinė pasiūlyme“.
- **Skaičiuoklė:** jei geriausiai tinka Mac Studio, rekomenduojama artimiausia mūsų įranga su prierašu, kad Mac Studio irgi tiktų, bet jo neparduodame. DGX Station žymimas „pagal užklausą“.
- **Indeksavimas:** kol nėra kontaktų ir rekvizitų, svetainė turi `noindex` ir neįtraukiama į paiešką. Įjungiama vienu nustatymu prieš paleidimą.
- **Pristatymas:** terminų nežadame; „terminas nurodomas pasiūlyme, priklauso nuo tiekėjo sandėlio“.
- **Struktūrizuoti duomenys:** Organization su `areaServed: Lietuva`. Kai bus adresas, keičiama į LocalBusiness.

## Laukia savininko (svetainė kuriama su laikinais užrašais)

- Telefonas, el. paštas, įmonės rekvizitai.
- skytech.lt B2B kainos (iki tol „Kaina pagal užklausą“).
- Resend raktas ir užklausų gavėjo el. paštas.
- Vercel prisijungimas, domeno nodas.lt nukreipimas.

## Palikta kūrėjui

- Tikslūs tekstai (trumpi, aiškūs), DUK atsakymai, SEO straipsnių turinys.
- Ikonos, tarpai, išdėstymas telefone.
- Skaičiuoklės koeficientai ir įrangos specifikacijų reikšmės (iš oficialių šaltinių).
