export type FaqItem = { q: string; a: string };

export const faq: FaqItem[] = [
  {
    q: 'Ar tikrai mano duomenys niekur neišeina?',
    a: 'Taip. Modelis veikia jūsų kompiuteryje ar serveryje, užklausos ir dokumentai į debesį nesiunčiami. Sistema gali veikti ir visiškai be interneto.',
  },
  {
    q: 'Ar AI supras ir rašys lietuviškai?',
    a: 'Taip, bet atvirai: atviri modeliai lietuviškai rašo silpniau nei angliškai. Klausimus ir dokumentus supranta gerai, o svarbius tekstus verta peržiūrėti. Lietuviškam darbui galime įdiegti ir lietuvių kalbai pritaikytus modelius, pvz. TildeOpen.',
  },
  {
    q: 'Kuo privatus AI skiriasi nuo ChatGPT?',
    a: 'ChatGPT veikia svetimuose serveriuose ir kainuoja kas mėnesį kiekvienam vartotojui. Privatus AI veikia pas jus, be mėnesio mokesčio už modelį. Didžiausi debesų modeliai kai kuriose užduotyse vis dar stipresni, todėl padedame parinkti, kas tinka jūsų darbui.',
  },
  {
    q: 'Kokio kompiuterio man reikia?',
    a: 'Svarbiausia yra vaizdo plokštės arba bendros atminties kiekis: nuo jo priklauso, kokio dydžio modelis tilps. Pasinaudokite skaičiuokle arba parašykite mums: patarsime nemokamai.',
  },
  {
    q: 'Kokia garantija įrangai?',
    a: 'Įrangai taikoma tiekėjo garantija pagal tiekėjo sąlygas (dažniausiai 24 mėn.). Jei kas nutiktų, garantinius reikalus sutvarkome už jus.',
  },
  {
    q: 'Per kiek laiko gausiu įrangą?',
    a: 'Terminas nurodomas pasiūlyme ir priklauso nuo tiekėjo sandėlio. Kai įranga atvyksta, AI įdiegiame ir sukonfigūruojame prieš perduodant.',
  },
  {
    q: 'Ar įdiegiate necenzūruotus modelius?',
    a: 'Taip, įdiegiame tokius atvirus modelius, kokių reikia jūsų darbui, ir be platformų filtrų. Už modelio naudojimą atsako naudotojas.',
  },
  {
    q: 'Kas įeina į palaikymą?',
    a: 'Sistemos ir modelių atnaujinimai, naujų modelių įdiegimas, pagalba, kai kas nors neveikia. Palaikymas namams nuo 29 €/mėn., verslui nuo 99 €/mėn.',
  },
  {
    q: 'Kaip vyksta darbas?',
    a: 'Nemokamas pokalbis apie jūsų poreikius, tada pasiūlymas su kaina ir terminu. Patvirtinus, paruošiame įrangą, įdiegiame AI ir parodome, kaip juo naudotis.',
  },
  {
    q: 'Ar galite įdiegti AI mano jau turimame kompiuteryje?',
    a: 'Taip, jei kompiuteris turi pakankamai galingą vaizdo plokštę. Įdiegimas nuo 149 €. Prieš tai nemokamai patikriname, ar jūsų kompiuterio užteks.',
  },
];
