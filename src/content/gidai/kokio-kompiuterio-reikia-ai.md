---
title: "Kokio kompiuterio reikia AI? VRAM gidas lokaliems modeliams"
h1: "Kokio kompiuterio reikia AI?"
description: "Kiek vaizdo plokštės atminties (VRAM) reikia lokaliam AI modeliui: paprastas gidas su lentele 8B, 32B, 70B ir 120B modeliams ir įrangos patarimais."
date: "2026-11-05"
short: "VRAM gidas: kiek atminties reikia 8B, 32B, 70B ir 120B modeliams."
order: 3
related: ["/dgx-spark-vs-rtx-5090-vs-mac-studio", "/dgx-spark-lietuvoje", "/privatus-ai-imonei"]
---

Norint leisti AI savo kompiuteryje, svarbiausias klausimas yra ne procesorius ir ne disko dydis, o **atmintis**, tiksliau vaizdo plokštės atmintis, vadinama VRAM. Šiame gide paprastai paaiškiname, kodėl taip yra, kiek atminties reikia skirtingo dydžio modeliams ir kokią įrangą rinktis.

## Kodėl svarbiausia atmintis

AI kalbos modelis yra didžiulis skaičių rinkinys. Kad modelis veiktų greitai, **visas jis turi tilpti į vaizdo plokštės atmintį**. Jei netelpa, dalis modelio perkeliama į įprastą kompiuterio atmintį, ir darbas sulėtėja **5–20 kartų**. Modelis vis dar veiks, bet atsakymo teks laukti.

Antras svarbus dalykas yra **atminties greitis** (pralaidumas). Generuodamas kiekvieną žodį, modelis perskaito didelę dalį savo atminties. Kuo greitesnė atmintis, tuo daugiau žodžių per sekundę. Todėl dvi plokštės su tiek pat atminties gali veikti labai skirtingu greičiu.

## Kas yra 8B, 32B, 70B

Skaičius su raide B rodo, kiek modelis turi parametrų: **8B yra 8 milijardai**, 70B yra 70 milijardų. Didesnis modelis paprastai protingesnis, bet jam reikia daugiau atminties.

Modeliai dažniausiai naudojami **suspausti** (kvantuoti). 4 bitų suspaudimas sumažina modelį maždaug keturis kartus, o kokybė nukenčia nedaug. Apytiksliai, su 4 bitų suspaudimu ir rezervu kontekstui:

| Modelis | Pavyzdys | Reikia atminties | Kam tinka |
| --- | --- | --- | --- |
| 8B | Llama 3.1 8B | ~6 GB | paprasti tekstai, santraukos |
| 32B | Qwen3 32B | ~22 GB | rimtas darbas su dokumentais |
| 70B | Llama 3.3 70B | ~48 GB | arti ChatGPT lygio |
| 120B (MoE) | gpt-oss-120b | ~80 GB | didžiausi atviri modeliai |

Tai apytiksliai skaičiai. Ilgas kontekstas, pavyzdžiui labai ilgi dokumentai, ir keli vartotojai vienu metu reikalauja papildomos atminties.

## MoE modeliai: didelis, bet greitas

Kai kurie nauji modeliai yra **MoE** (mixture of experts) tipo. Jie turi daug parametrų, bet kiekvienam žodžiui naudoja tik mažą jų dalį. Pavyzdžiui, gpt-oss-120b turi 120 milijardų parametrų, bet vienu metu dirba tik apie 5 milijardai. Tokiam modeliui reikia daug atminties, kad jis tilptų, bet jis atsako beveik taip greitai kaip mažas modelis. Būtent todėl tokie modeliai puikiai tinka įrangai su daug atminties, pavyzdžiui DGX Spark.

## Kiek atminties turi populiari įranga

- **RTX 5090:** 32 GB, labai greita atmintis. Puikiai tinka iki 32B modelių.
- **2× RTX 5090:** 64 GB iš viso. Telpa 70B modelis.
- **RTX PRO 6000:** 96 GB vienoje profesionalioje plokštėje. 70B modelis greitai, 120B MoE labai greitai.
- **NVIDIA DGX Spark:** 128 GB bendros atminties, bet lėtesnės. Telpa dideli modeliai, greitis vidutinis.
- **Mac Studio:** iki 512 GB bendros atminties. Telpa labai dideli modeliai, bet tai Apple sistema, ne NVIDIA.
- **NVIDIA DGX Station:** 288 GB itin greitos atminties. Didžiausi modeliai ir daug vartotojų.

Visus šiuos variantus palyginti pagal jūsų norimą modelį ir greitį galite [skaičiuoklėje](/skaiciuokle).

## Kiek greičio reikia

Greitis matuojamas **tokenais per sekundę**. Tokenas yra žodžio dalis: lietuviškai vienas tokenas vidutiniškai atitinka daugiau nei pusę žodžio. Žmogus skaito apie 3–6 žodžius per sekundę, todėl:

- **iki 5 tok/s:** lėčiau nei skaitote, tinka darbams fone.
- **5–10 tok/s:** maždaug skaitymo greitis, patogu pokalbiui.
- **daugiau nei 10 tok/s:** atsakymas atsiranda greičiau nei spėjate perskaityti.

Jei AI naudosis keli žmonės vienu metu, greitis vienam žmogui sumažėja, todėl verslui reikia rezervo.

## Kiti komponentai

Nors svarbiausia yra vaizdo plokštė, kiti komponentai irgi turi atitikti:

- **Procesorius:** užtenka šiuolaikinio 8–16 branduolių. Kelioms plokštėms reikia platformos, kuri turi pakankamai jungčių.
- **RAM:** bent tiek pat, kiek VRAM, geriau daugiau.
- **Diskas:** greitas NVMe, bent 2 TB, nes modeliai užima dešimtis gigabaitų.
- **Maitinimas ir vėsinimas:** galingoms plokštėms reikia kokybiško 1200–1600 W maitinimo bloko ir gero korpuso.

## Ar galima naudoti turimą kompiuterį

Taip, jei jame yra NVIDIA vaizdo plokštė su bent 12–16 GB atminties. Tokiame kompiuteryje veiks maži ir vidutiniai modeliai. AI [įdiegimą į jūsų kompiuterį](/diegimas) atliekame {{kaina:idiegimas}}, o prieš tai nemokamai patikriname, ar jo užteks.

## Santrauka

1. Pirmiausia nuspręskite, kokio dydžio modelio reikia.
2. Pasirinkite įrangą, į kurios atmintį jis tilps su rezervu.
3. Patikrinkite, ar atminties greičio užteks norimam atsakymų greičiui.
4. Verslui pridėkite rezervą keliems vartotojams.

Jei norite, kad parinktume įrangą už jus, [parašykite mums](/kontaktai) arba peržiūrėkite mūsų [AI įrangą](/iranga).
