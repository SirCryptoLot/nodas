# nodas.lt: AI sistemos konfigūratorius (dizainas)

Data: 2026-11-05. Papildo `2026-11-05-nodas-ai-svetaine-design.md`.

## Kam ir kodėl

Savininkas nori, kad svetainė būtų „labiau interaktyvi“: žmogus pats susidėlioja visą savo AI sistemą (įranga, operacinė sistema, variklis, pokalbių sąsaja, agentai, modeliai) ir gauna **apytikslę kainą** bei **apytikslį greitį (tokenai/s)**, o tada vienu mygtuku išsiunčia **pilną pasiūlymo užklausą**.

Vartotojas gali būti **paprastas namų vartotojas**, todėl numatytieji pasirinkimai turi būti paruošti, o techninės detalės paslėptos po „Išplėstinis“.

Kainos apytikslės, kol nėra tiekėjo (skytech.lt B2B) kainų. Savininkas: „turi gauti apytikslę kainą, kol kas, kol neturim tiekėjo“.

## Tikslai, ne tikslai, anti-tikslai

**Tikslai**
- Naujas puslapis `/konfiguratorius`; esama `/skaiciuokle` lieka (SEO).
- Pigesnės ir senesnės vaizdo plokštės: nuo RTX 20 serijos iki naujausių (savininko žodžiai).
- Procesoriai: naujausi ir „šiek tiek senesni“; RAM nuo 16 GB.
- Greitis skaičiuojamas pagal pasirinktą sistemą, remiantis realiais matavimais iš interneto (savininkas: „gali paimti duomenis iš interneto, pvz. huggingface“).
- Apytikslė bendra kaina: įranga + diegimas (+ palaikymas, jei pasirinktas).
- Užklausa, kurioje visa konfigūracija, kaina ir greičio įvertinimas.

**Ne tikslai**
- Krepšelis, mokėjimas, sandėlio likučiai, automatinis kainų atnaujinimas.
- AMD/Intel vaizdo plokštės (galima vėliau).

**Anti-tikslai**
- Painus vedlys, kuriame paprastas žmogus pasiklysta (savininkui anksčiau daugiažingsniai vedliai painiojo klientus): visas konfigūratorius viename puslapyje, rezultatas visada matomas.
- Kaina ar greitis, pateikti kaip tikslūs: visada „apytiksliai“, „preliminari kaina, galutinė pasiūlyme“.

## Puslapio eiga (savininko patvirtinta)

Vienas puslapis, kairėje pasirinkimai, dešinėje (telefone apačioje, prilipęs) rezultatas.

1. **Ką norite daryti?** Pokalbiai ir tekstai · Programavimas · Darbas su dokumentais · Necenzūruoti modeliai. Pasirinkimas užpildo tinkamą programinės įrangos rinkinį ir modelius (žmogus gali keisti).
2. **Įranga**, vienas iš trijų kelių:
   - **Surinktas kompiuteris:** vaizdo plokštė (1 arba 2 vnt.), procesorius, RAM;
   - **NVIDIA DGX Spark** (vienas pasirinkimas);
   - **„Turiu savo kompiuterį“**: įvedama jo vaizdo plokštė ir RAM, kaina tik diegimas.
3. **Programinė dalis.** Rinkiniai: „Paprasčiausias“ (Ollama + Open WebUI), „Programuotojui“ (+ Codex, Pi), „Agentas“ (+ Hermes). Mygtukas „Išplėstinis“ atveria atskirus pasirinkimus:
   - Operacinė sistema: Windows 11, Ubuntu LTS.
   - Variklis: Ollama, llama.cpp, LM Studio, vLLM.
   - Pokalbių sąsaja: Open WebUI (pilnas ChatGPT tipo vaizdas), llama.cpp integruota sąsaja, LibreChat.
   - Agentai (keli): Pi (lengviausias), Hermes Agent, Codex CLI, OpenCode, Aider.
   - Modeliai (keli): atviri modeliai (pvz. Llama, Qwen, Gemma, gpt-oss, Mistral) ir jų necenzūruotos versijos. Prie kiekvieno: dydis GB ir žymė „telpa į vaizdo plokštę / dalinai / netelpa“.
4. **Rezultatas (visada matomas):** kiekvienam pasirinktam modeliui apytikslis greitis tok/s ir „lėčiau / kaip / greičiau nei skaitote“; atminties užimtumas; apytikslė kaina (įranga, diegimas, iš viso); mygtukas „Gauti pasiūlymą“.

## Greičio skaičiavimas (Claude sprendimai)

- **Matavimais grįsta bazė:** kiekvienai vaizdo plokštei saugomas llama.cpp CUDA lentelės ([diskusija #15013](https://github.com/ggml-org/llama.cpp/discussions/15013)) `tg128` rezultatas su Llama 2 7B Q4_0 (≈3,56 GiB). Kai plokštės lentelėje nėra, naudojamas atminties pralaidumas × koeficientas, kalibruotas pagal turimus matavimus. DGX Spark: atskira llama.cpp diskusija (#16578) ir NVIDIA paskelbti gpt-oss-120b matavimai.
- **Kitam modeliui:** greitis ∝ 1 / aktyvių svorių dydis baitais (MoE modeliams tik aktyvūs parametrai).
- **Kai modelis netelpa į VRAM:** dalis sluoksnių sistemos RAM; laikas vienam tokenui = GPU dalis / GPU pralaidumas + RAM dalis / RAM pralaidumas (RAM pralaidumas pagal procesoriaus platformą: DDR4 ar DDR5, kanalų skaičius). Jei netelpa ir į VRAM + RAM: „netelpa“.
- **Modelių dydžiai:** iš Hugging Face GGUF failų (Q4_K_M) dydžių; saugomi duomenų faile su šaltinio nuoroda.
- **Variklis:** llama.cpp 1,0; Ollama ir LM Studio ~0,95; vLLM: tas pats vienam vartotojui, bet geriau keliems (jei vartotojų skaičius naudojamas).
- Visi koeficientai ir šaltiniai vienoje vietoje, rezultatas visada žymimas „apytiksliai“.

## Kainos (Claude sprendimai)

- Kiekvienai daliai: apytikslė Lietuvos rinkos kaina su PVM (pagal kainos.lt / kaina24.lt, 2026 m. lapkritis), laikoma tame pačiame kainų faile (`catalog.ts` arba šalia esančiame `parts.ts`), pakeičiama vienoje vietoje.
- Surinkto kompiuterio kaina = vaizdo plokštė(-ės) + procesorius + RAM + bazė (pagrindinė plokštė, diskas, maitinimas, korpusas, aušinimas; pagal plokštės klasę) + surinkimas + AI diegimas.
- „Turiu savo kompiuterį“: tik diegimas (nuo 149 €).
- Senos plokštės (RTX 20/30): „pagal galimybes, gali būti naudota“; kaina orientacinė.
- Rodoma: „Apytikslė kaina ~X €, preliminari, galutinė pasiūlyme“.

## Užklausa

„Gauti pasiūlymą“ atidaro užklausos formą (esamą `/kontaktai` arba tame pačiame puslapyje) su visa konfigūracija kaip tekstu temoje/žinutėje: įranga, programinė dalis, modeliai, greičio įvertinimai, apytikslė kaina. API `api/contact.js` priima ilgesnį konfigūracijos tekstą (naujas laukas, ribojamas, išvalomas kaip kiti).

## Techniniai apribojimai (iš esamos svetainės)

- Astro statinė svetainė, CSP be įterpto kodo; konfigūratorius veikia naršyklėje su išoriniu skriptu, be serverio.
- Be JavaScript: puslapis rodo numatytąją konfigūraciją ir jos rezultatą.
- Jokių užklausų į trečiąsias šalis (duomenys surinkti iš anksto į failą, ne kraunami iš Hugging Face naršyklėje).
- Telefonui pritaikytas (360 px be horizontalaus slinkimo).

## Savininko atsakymai ir Claude sprendimai po peržiūros

- **Diegimo ir surinkimo kainos (savininkas patvirtino):** rinkinys „Paprasčiausias“ 149 €, „Programuotojui“ 249 €, „Agentas“ 349 €; kompiuterio surinkimas ir išbandymas 99 € (tik kai perkama įranga). Išplėstiniame režime kaina pagal sudėtingiausią pasirinktą dalį (agentas Hermes ar vLLM → 349 €; Codex/Pi/OpenCode/Aider → 249 €; kitaip 149 €).
- **Dalių kainos** atskirame `src/data/parts.ts`, rodomos tik konfigūratoriuje; produktų puslapiai ir Product struktūrizuoti duomenys lieka „Kaina pagal užklausą“ (Claude sprendimas).
- **Vienas greičio variklis:** `/skaiciuokle`, pradžios skaičiuoklė ir konfigūratorius naudoja tą patį naują skaičiavimą (Claude sprendimas).
- **Palaikymas:** atskiras pasirinkimas (nėra / namams 29 €/mėn. / verslui 99 €/mėn.), rezultate atskira eilutė „+ X €/mėn.“ (Claude sprendimas).
- **Plokštės:** sąraše ir RTX PRO 6000; pasirinkus 2 plokštes, platforma automatiškai Threadripper (didesnė bazės kaina). DGX Station nuoroda „pagal užklausą“ (Claude sprendimas).
- **Užklausa:** naujas plano raktas `konfiguratorius` ir laukas `config` (iki 3000 simbolių) API (Claude sprendimas).

## Palikta kūrėjui

- Tikslūs dalių sąrašai (konkretūs modeliai), kainų reikšmės, matavimų reikšmės (iš nurodytų šaltinių).
- Išdėstymas, tekstai, ikonos.
