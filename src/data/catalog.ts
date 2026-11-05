// Visa įranga, paslaugos, kainos ir skaičiuoklės duomenys vienoje vietoje.
// Kainos su PVM. priceEur: null reiškia „Kaina pagal užklausą“.

export type Device = {
  id: string;
  name: string;
  memoryGB: number;
  usableGB: number; // kiek atminties realiai lieka modeliui
  bandwidthGBs: number; // atminties pralaidumas (2× RTX 5090: efektyvus)
  sold: boolean;
  onRequest?: boolean;
  tier: number;
  spec: { gpu: string; cpu: string; ram: string; disk: string; psu?: string };
  productSlug?: string;
};

export const devices: Device[] = [
  {
    id: 'rtx5090', name: 'AI kompiuteris su RTX 5090', memoryGB: 32, usableGB: 30, bandwidthGBs: 1792, sold: true, tier: 1,
    spec: { gpu: 'NVIDIA GeForce RTX 5090, 32 GB', cpu: 'AMD Ryzen 9 9950X', ram: '96 GB DDR5', disk: '2 TB NVMe', psu: '1200 W, 80+ Gold' },
    productSlug: 'ai-kompiuteris-rtx-5090',
  },
  {
    id: 'dgx-spark', name: 'NVIDIA DGX Spark (GB10)', memoryGB: 128, usableGB: 115, bandwidthGBs: 273, sold: true, tier: 2,
    spec: { gpu: 'NVIDIA GB10 Grace Blackwell', cpu: '20 branduolių Arm (10× Cortex-X925 + 10× Cortex-A725)', ram: '128 GB bendra LPDDR5x atmintis', disk: '1–4 TB NVMe' },
    productSlug: 'dgx-spark',
  },
  {
    id: 'rtx5090x2', name: 'AI kompiuteris su 2× RTX 5090', memoryGB: 64, usableGB: 60, bandwidthGBs: 2870, sold: true, tier: 3,
    spec: { gpu: '2× NVIDIA GeForce RTX 5090, iš viso 64 GB', cpu: 'AMD Ryzen Threadripper 9960X', ram: '128 GB DDR5', disk: '4 TB NVMe', psu: '1600 W, 80+ Platinum' },
    productSlug: 'ai-kompiuteris-2x-rtx-5090',
  },
  {
    id: 'rtxpro6000', name: 'AI darbo stotis su RTX PRO 6000', memoryGB: 96, usableGB: 92, bandwidthGBs: 1792, sold: true, tier: 4,
    spec: { gpu: 'NVIDIA RTX PRO 6000 Blackwell, 96 GB', cpu: 'AMD Ryzen 9 9950X', ram: '192 GB DDR5', disk: '4 TB NVMe', psu: '1200 W, 80+ Platinum' },
    productSlug: 'ai-darbo-stotis-rtx-pro-6000',
  },
  {
    id: 'dgx-station', name: 'NVIDIA DGX Station (GB300)', memoryGB: 288, usableGB: 270, bandwidthGBs: 8000, sold: true, onRequest: true, tier: 5,
    spec: { gpu: 'NVIDIA GB300 Grace Blackwell Ultra, 288 GB HBM3e', cpu: '72 branduolių NVIDIA Grace', ram: '496 GB LPDDR5X', disk: 'Pagal konfigūraciją' },
    productSlug: 'dgx-station',
  },
  {
    id: 'mac-m4max', name: 'Mac Studio M4 Max 128 GB', memoryGB: 128, usableGB: 96, bandwidthGBs: 546, sold: false, tier: 98,
    spec: { gpu: 'Apple M4 Max, 40 branduolių GPU', cpu: '16 branduolių', ram: '128 GB bendra atmintis', disk: '1 TB SSD' },
  },
  {
    id: 'mac-m3ultra', name: 'Mac Studio M3 Ultra 512 GB', memoryGB: 512, usableGB: 384, bandwidthGBs: 819, sold: false, tier: 99,
    spec: { gpu: 'Apple M3 Ultra, 80 branduolių GPU', cpu: '32 branduolių', ram: '512 GB bendra atmintis', disk: '1 TB SSD' },
  },
];

export type ModelPreset = { id: string; label: string; paramsB: number; activeB: number; example: string; hint: string };

export const models: ModelPreset[] = [
  { id: '8b', label: 'Mažas (8B)', paramsB: 8, activeB: 8, example: 'Llama 3.1 8B', hint: 'paprasti tekstai, santraukos' },
  { id: '32b', label: 'Vidutinis (32B)', paramsB: 32, activeB: 32, example: 'Qwen3 32B', hint: 'rimtas darbas su dokumentais' },
  { id: '70b', label: 'Didelis (70B)', paramsB: 70, activeB: 70, example: 'Llama 3.3 70B', hint: 'arti ChatGPT lygio' },
  { id: '120b', label: 'Labai didelis (120B)', paramsB: 120, activeB: 5.1, example: 'gpt-oss-120b (MoE)', hint: 'didžiausi atviri modeliai' },
];

export type Product = {
  slug: string;
  name: string;
  deviceId: string;
  short: string;
  specs: [string, string][];
  priceEur: number | null;
  variants?: string[];
  forModels: string;
};

export const products: Product[] = [
  {
    slug: 'dgx-spark', name: 'NVIDIA DGX Spark', deviceId: 'dgx-spark', priceEur: null,
    short: 'Mažas AI superkompiuteris ant stalo: 128 GB bendros atminties, tylus ir taupus.',
    specs: [['Lustas', 'NVIDIA GB10 Grace Blackwell'], ['Atmintis', '128 GB bendra LPDDR5x'], ['Diskas', '1–4 TB NVMe'], ['Tinklas', '10 GbE, ConnectX-7']],
    variants: ['PNY NVIDIA DGX Spark', 'ASUS Ascent GX10', 'Lenovo ThinkStation PGX'],
    forModels: 'Modeliai iki ~120B (MoE) ir 70B; geriausia, kai svarbu didelė atmintis, o ne greitis.',
  },
  {
    slug: 'ai-kompiuteris-rtx-5090', name: 'AI kompiuteris su RTX 5090', deviceId: 'rtx5090', priceEur: null,
    short: 'Greičiausias kelias į privatų AI: viena galinga vaizdo plokštė su 32 GB.',
    specs: [['Vaizdo plokštė', 'RTX 5090, 32 GB'], ['Procesorius', 'AMD Ryzen 9 9950X'], ['RAM', '96 GB DDR5'], ['Diskas', '2 TB NVMe']],
    forModels: 'Modeliai iki ~32B, labai greitai.',
  },
  {
    slug: 'ai-kompiuteris-2x-rtx-5090', name: 'AI kompiuteris su 2× RTX 5090', deviceId: 'rtx5090x2', priceEur: null,
    short: 'Dvi RTX 5090 plokštės: 64 GB ir didelis greitis keliems vartotojams.',
    specs: [['Vaizdo plokštės', '2× RTX 5090, 64 GB'], ['Procesorius', 'AMD Threadripper 9960X'], ['RAM', '128 GB DDR5'], ['Diskas', '4 TB NVMe']],
    forModels: 'Modeliai iki ~70B (suspausti), keli vartotojai vienu metu.',
  },
  {
    slug: 'ai-darbo-stotis-rtx-pro-6000', name: 'AI darbo stotis su RTX PRO 6000', deviceId: 'rtxpro6000', priceEur: null,
    short: 'Profesionali vaizdo plokštė su 96 GB: dideli modeliai be kompromisų.',
    specs: [['Vaizdo plokštė', 'RTX PRO 6000 Blackwell, 96 GB'], ['Procesorius', 'AMD Ryzen 9 9950X'], ['RAM', '192 GB DDR5'], ['Diskas', '4 TB NVMe']],
    forModels: 'Modeliai iki 70B greitai, 120B (MoE) labai greitai.',
  },
  {
    slug: 'dgx-station', name: 'NVIDIA DGX Station', deviceId: 'dgx-station', priceEur: null,
    short: 'Duomenų centro galia biure: 288 GB HBM3e atminties. Tik pagal užklausą.',
    specs: [['Lustas', 'NVIDIA GB300 Grace Blackwell Ultra'], ['GPU atmintis', '288 GB HBM3e'], ['Sistemos atmintis', '496 GB LPDDR5X'], ['Pristatymas', 'Tik pagal užklausą']],
    forModels: 'Didžiausi atviri modeliai ir daug vartotojų vienu metu.',
  },
];

export const PACKAGE_INCLUDES = ['Įranga', 'Įdiegtas ir sukonfigūruotas AI', 'Pradinis apmokymas', 'Pagalba su tiekėjo garantija'];

export type Service = { slug: string; name: string; priceFrom: number; unit?: '€/mėn.'; audience: string; short: string };

export const services: Service[] = [
  { slug: 'idiegimas', name: 'AI įdiegimas į jūsų kompiuterį', priceFrom: 149, audience: 'Namams ir mažoms įmonėms', short: 'Įdiegiame ir sukonfigūruojame privatų AI jūsų turimame kompiuteryje.' },
  { slug: 'verslo-serveris', name: 'Verslo AI serveris', priceFrom: 4000, audience: 'Įmonėms', short: 'Įranga ir diegimas: paieška įmonės dokumentuose, keli vartotojai.' },
  { slug: 'palaikymas-namams', name: 'Palaikymas namams', priceFrom: 29, unit: '€/mėn.', audience: 'Namams', short: 'Atnaujinimai, nauji modeliai ir pagalba, kai kas nors neveikia.' },
  { slug: 'palaikymas-verslui', name: 'Palaikymas verslui', priceFrom: 99, unit: '€/mėn.', audience: 'Įmonėms', short: 'Atnaujinimai, nauji modeliai, vartotojų pagalba, prioritetinis atsakymas.' },
];

export const WARRANTY_TEXT = 'Įrangai taikoma tiekėjo garantija; garantinius reikalus sutvarkome už jus.';
export const WARRANTY_TERM = 'pagal tiekėjo sąlygas (dažniausiai 24 mėn.)';
export const DELIVERY_TEXT = 'Terminas nurodomas pasiūlyme, priklauso nuo tiekėjo sandėlio.';
