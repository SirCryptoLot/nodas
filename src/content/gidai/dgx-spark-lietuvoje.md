---
title: "NVIDIA DGX Spark Lietuvoje: kaina, specifikacijos ir įdiegimas"
h1: "NVIDIA DGX Spark Lietuvoje"
description: "Kiek kainuoja NVIDIA DGX Spark Lietuvoje, kam jis tinka, kokius AI modelius traukia ir kodėl verta pirkti kartu su įdiegtu privačiu AI."
date: "2026-11-05"
short: "Kaina, specifikacijos ir kam tinka mažasis NVIDIA AI superkompiuteris."
order: 1
related: ["/dgx-spark-vs-rtx-5090-vs-mac-studio", "/kokio-kompiuterio-reikia-ai", "/dgx-station"]
---

NVIDIA DGX Spark yra mažas kompiuteris, kurį galima pastatyti ant stalo, bet viduje jis turi tą pačią NVIDIA programinę įrangą kaip dideli duomenų centrų serveriai. Jį perka įmonės, programuotojai ir tyrėjai, kurie nori leisti didelius AI modelius savo patalpose, o ne debesyje. Šiame gide paaiškiname, kiek jis kainuoja Lietuvoje, kam jis tinka ir kam geriau rinktis ką nors kita.

## Kas yra DGX Spark

DGX Spark viduje yra **NVIDIA GB10 Grace Blackwell** lustas. Jame sujungtas 20 branduolių Arm procesorius ir Blackwell kartos vaizdo procesorius. Svarbiausia savybė yra **128 GB bendros atminties**: ją vienu metu naudoja ir procesorius, ir vaizdo procesorius. Įprastame kompiuteryje AI modelis turi tilpti į vaizdo plokštės atmintį, kurios net brangiausiose žaidimų plokštėse yra 32 GB. DGX Spark šią ribą pakelia keturis kartus.

Pagrindiniai parametrai:

- **Lustas:** NVIDIA GB10 Grace Blackwell
- **Atmintis:** 128 GB bendra LPDDR5x, pralaidumas apie 273 GB/s
- **Diskas:** 1–4 TB NVMe, priklauso nuo modelio
- **Tinklas:** 10 GbE ir ConnectX-7, du įrenginius galima sujungti tarpusavyje
- **Dydis:** telpa ant delno, tylus, naudoja nedaug elektros

Tą patį GB10 lustą naudoja ir kiti gamintojai: **ASUS Ascent GX10**, **Lenovo ThinkStation PGX** ir PNY parduodamas NVIDIA DGX Spark. Viduje jie labai panašūs, skiriasi korpusu, disko dydžiu, garantijos sąlygomis ir kaina.

## Kiek kainuoja DGX Spark Lietuvoje

2026 m. lapkritį Lietuvos parduotuvėse DGX Spark su 128 GB atminties ir 4 TB disku kainavo **maždaug 6 000–6 700 € su PVM**. Versijos su mažesniu disku ir kitų gamintojų variantai kartais būna pigesni. Kaina 2026 m. keitėsi kelis kartus, nes pabrango atmintis, todėl prieš perkant visada verta pasitikrinti dabartinę kainą.

Dažna problema yra tai, kad įrenginys **būna išparduotas**. Kainų palyginimo svetainėse rasite pasiūlymų, bet dalis jų yra be prekės sandėlyje. Mes užsakome per tiekėją ir pasiūlyme nurodome realų terminą.

Svarbu ir tai, ką gaunate už šiuos pinigus. Parduotuvėje perkate dėžę. Pas mus perkate **paketą**: įrenginį, įdiegtą ir sukonfigūruotą privatų AI, pradinį apmokymą ir pagalbą su tiekėjo garantija. Kainą mūsų paketui pateikiame [pasiūlyme](/kontaktai?plan=dgx-spark).

## Kokius modelius DGX Spark traukia

Dėl 128 GB atminties DGX Spark gali įkelti modelius, kurie į žaidimų kompiuterį tiesiog netilptų:

- **Maži ir vidutiniai modeliai (8B–32B)** veikia be problemų, bet greitis nebus rekordinis.
- **Dideli modeliai (70B)** telpa, tačiau generuoja lėtai, apie kelis tokenus per sekundę. Tai tinka dokumentų analizei fone, bet pokalbiui gali būti per lėta.
- **MoE modeliai**, pavyzdžiui gpt-oss-120b, kuriuose vienu metu dirba tik dalis parametrų, veikia gerai: telpa į atmintį ir atsako greitai.

Čia slypi pagrindinė DGX Spark savybė: jis turi **daug atminties, bet ne itin greitą**. 273 GB/s yra keletą kartų mažiau nei RTX 5090 vaizdo plokštės pralaidumas. Todėl DGX Spark laimi, kai modelis didelis, o greitis ne pats svarbiausias. Jei reikia maksimalaus greičio mažesniam modeliui, geriau tinka kompiuteris su RTX 5090. Abu variantus galite palyginti mūsų [skaičiuoklėje](/skaiciuokle).

## Kam DGX Spark tinka

- **Įmonėms, kurios nori privataus AI darbui su dokumentais.** Sutartys, instrukcijos, klientų laiškai lieka biure, o modelis gali būti didelis ir protingas.
- **Programuotojams ir AI kūrėjams.** Ta pati NVIDIA programinė įranga kaip serveriuose, todėl tai, kas išbandyta ant stalo, vėliau veiks ir dideliame serveryje.
- **Tyrėjams ir studentams**, kuriems reikia leisti ir derinti modelius be debesų sąskaitų.
- **Mažiems biurams**, kur svarbu tylus ir mažai vietos užimantis įrenginys.

## Kam geriau rinktis ką nors kita

- Jei svarbiausias **greitis** ir užtenka 32B modelio, rinkitės [AI kompiuterį su RTX 5090](/iranga/ai-kompiuteris-rtx-5090).
- Jei reikia ir didelio modelio, ir greičio keliems žmonėms vienu metu, žiūrėkite [darbo stotį su RTX PRO 6000](/iranga/ai-darbo-stotis-rtx-pro-6000).
- Jei reikia aptarnauti dešimtis vartotojų arba leisti didžiausius atvirus modelius, svarstykite [DGX Station](/dgx-station).

## Ką įdiegiame į DGX Spark

Perduodame įrenginį jau paruoštą darbui:

1. Atnaujiname sistemą ir NVIDIA programinę įrangą.
2. Įdiegiame modelių paleidimo aplinką ir pokalbių sąsają, kuria naudojatės kaip ChatGPT, tik savo tinkle.
3. Parenkame ir įdiegiame modelius pagal jūsų darbą: bendram darbui, lietuvių kalbai, programavimui, prireikus ir necenzūruotus.
4. Jei reikia, sukonfigūruojame paiešką jūsų dokumentuose ir kelių vartotojų prieigą.
5. Parodome, kaip naudotis, ir paliekame trumpą instrukciją.

## Dažnos klaidos perkant

- **Pirkti tik pagal kainą.** Pigesnis variantas gali turėti mažesnį diską ar trumpesnę garantiją.
- **Tikėtis žaidimų kompiuterio greičio.** DGX Spark skirtas dideliems modeliams, ne rekordiniam greičiui.
- **Nepasiruošti programinei daliai.** Įrenginys be sukonfigūruotos aplinkos dar nėra privatus AI. Diegimas užtrunka, jei darote pirmą kartą.

## Kaip užsisakyti

Parašykite mums, kam norite naudoti AI ir kiek žmonių juo naudosis. Patarsime, ar DGX Spark jums tinka, ir atsiųsime pasiūlymą su kaina, terminu ir įdiegimu. [Gauti pasiūlymą DGX Spark](/kontaktai?plan=dgx-spark) arba peržiūrėkite visą [AI įrangą](/iranga).
