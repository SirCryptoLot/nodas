// Konfigūratoriaus duomenys: dalys, apytikslės kainos, matavimai ir programinė įranga.
// Kainos su PVM (skytech.lt, 2026-11-05). priceEur: null = šiuo metu naujos nėra, „pagal užklausą“.
// tg7b: llama.cpp CUDA lentelė (github.com/ggml-org/llama.cpp/discussions/15013),
//       Llama 2 7B Q4_0, tg128, tokenai/s. null = matavimo nėra, skaičiuojama pagal pralaidumą.
// Modelių dydžiai: Hugging Face GGUF Q4_K_M (gpt-oss: MXFP4) failai.

export type Gpu = {
  id: string;
  name: string;
  series: string;
  vramGB: number;
  bandwidthGBs: number;
  tg7b: number | null;
  priceEur: number | null;
  usedOnly?: boolean;
};

export const gpus: Gpu[] = [
  { id: 'rtx2060s', name: 'RTX 2060 SUPER 8 GB', series: 'RTX 20', vramGB: 8, bandwidthGBs: 448, tg7b: 60.04, priceEur: null, usedOnly: true },
  { id: 'rtx2080ti', name: 'RTX 2080 Ti 11 GB', series: 'RTX 20', vramGB: 11, bandwidthGBs: 616, tg7b: 107.51, priceEur: null, usedOnly: true },
  { id: 'rtx3060', name: 'RTX 3060 12 GB', series: 'RTX 30', vramGB: 12, bandwidthGBs: 360, tg7b: 75.57, priceEur: 503 },
  { id: 'rtx3080', name: 'RTX 3080 10 GB', series: 'RTX 30', vramGB: 10, bandwidthGBs: 760, tg7b: 139.65, priceEur: null, usedOnly: true },
  { id: 'rtx3090', name: 'RTX 3090 24 GB', series: 'RTX 30', vramGB: 24, bandwidthGBs: 936, tg7b: 158.16, priceEur: null, usedOnly: true },
  { id: 'rtx4060ti', name: 'RTX 4060 Ti 16 GB', series: 'RTX 40', vramGB: 16, bandwidthGBs: 288, tg7b: 63.86, priceEur: null , usedOnly: true },
  { id: 'rtx4070tis', name: 'RTX 4070 Ti SUPER 16 GB', series: 'RTX 40', vramGB: 16, bandwidthGBs: 672, tg7b: 132.26, priceEur: null , usedOnly: true },
  { id: 'rtx4080', name: 'RTX 4080 16 GB', series: 'RTX 40', vramGB: 16, bandwidthGBs: 717, tg7b: 142.49, priceEur: null , usedOnly: true },
  { id: 'rtx4090', name: 'RTX 4090 24 GB', series: 'RTX 40', vramGB: 24, bandwidthGBs: 1008, tg7b: 186.21, priceEur: null, usedOnly: true },
  { id: 'rtx5060ti', name: 'RTX 5060 Ti 16 GB', series: 'RTX 50', vramGB: 16, bandwidthGBs: 448, tg7b: 90.94, priceEur: 795 },
  { id: 'rtx5070', name: 'RTX 5070 12 GB', series: 'RTX 50', vramGB: 12, bandwidthGBs: 672, tg7b: 127.54, priceEur: 929 },
  { id: 'rtx5070ti', name: 'RTX 5070 Ti 16 GB', series: 'RTX 50', vramGB: 16, bandwidthGBs: 896, tg7b: 176.85, priceEur: 1291 },
  { id: 'rtx5080', name: 'RTX 5080 16 GB', series: 'RTX 50', vramGB: 16, bandwidthGBs: 960, tg7b: 181.99, priceEur: 1426 },
  { id: 'rtx5090', name: 'RTX 5090 32 GB', series: 'RTX 50', vramGB: 32, bandwidthGBs: 1792, tg7b: 290.02, priceEur: 6990 },
  { id: 'rtxpro6000', name: 'RTX PRO 6000 Blackwell 96 GB', series: 'Profesionali', vramGB: 96, bandwidthGBs: 1792, tg7b: 274.2, priceEur: 17076 },
];

export type Cpu = {
  id: string;
  name: string;
  platform: 'desktop' | 'workstation';
  ramType: 'DDR4' | 'DDR5';
  ramBwGBs: number; // realus sistemos atminties pralaidumas
  priceEur: number;
};

export const cpus: Cpu[] = [
  { id: 'r5-5600', name: 'AMD Ryzen 5 5600', platform: 'desktop', ramType: 'DDR4', ramBwGBs: 51, priceEur: 106.99 },
  { id: 'i5-12400f', name: 'Intel Core i5-12400F', platform: 'desktop', ramType: 'DDR4', ramBwGBs: 51, priceEur: 139.29 },
  { id: 'r5-7600', name: 'AMD Ryzen 5 7600', platform: 'desktop', ramType: 'DDR5', ramBwGBs: 80, priceEur: 173.19 },
  { id: 'r7-9700x', name: 'AMD Ryzen 7 9700X', platform: 'desktop', ramType: 'DDR5', ramBwGBs: 80, priceEur: 239.19 },
  { id: 'u7-265k', name: 'Intel Core Ultra 7 265K', platform: 'desktop', ramType: 'DDR5', ramBwGBs: 85, priceEur: 350.69 },
  { id: 'r9-9950x', name: 'AMD Ryzen 9 9950X', platform: 'desktop', ramType: 'DDR5', ramBwGBs: 80, priceEur: 464 },
  { id: 'tr-9960x', name: 'AMD Threadripper 9960X', platform: 'workstation', ramType: 'DDR5', ramBwGBs: 170, priceEur: 1531 },
];

// RAM rinkinių kainos. Pažymėtos „įvert.“ apskaičiuotos iš rastų rinkinių (pvz. 16 GB = pusė 32 GB).
export const RAM_SIZES = [16, 32, 64, 128, 192];
export const ramPrices: Record<'DDR4' | 'DDR5', Record<number, number>> = {
  DDR4: { 16: 109, 32: 218.29, 64: 436.58, 128: 873.16 }, // 16, 64, 128 įvert.
  DDR5: { 16: 237, 32: 474.9, 64: 826, 128: 2696, 192: 3522 }, // 16, 192 įvert.
};

// Bazė: pagrindinė plokštė, 2 TB NVMe, maitinimas, korpusas ir aušinimas.
// desktop: B650 81.19 + NVMe 260.59 + 1200 W 132.99 + korpusas ir aušinimas ~150 (įvert.).
// workstation (Threadripper, 2 plokštės): TRX50 plokštė ~850, 1600 W ~300, korpusas ~250 (įvert.).
export const BASE_PRICES: Record<'desktop' | 'workstation', number> = { desktop: 625, workstation: 1661 };

export type UnifiedDevice = { id: string; name: string; usableGB: number; tg7b: number | null; bandwidthGBs: number; priceEur: number | null };
export const DGX_SPARK: UnifiedDevice = {
  id: 'dgx-spark', name: 'NVIDIA DGX Spark (GB10, 128 GB)', usableGB: 115, bandwidthGBs: 273,
  tg7b: 57.21, // llama.cpp diskusija #16578
  priceEur: 5193, // Lenovo ThinkStation PGX 1 TB, skytech.lt
};

// calib: papildomas koeficientas, kai turime šio modelio matavimą (llama.cpp #17621).
export type Model = { id: string; name: string; sizeGB: number; totalB: number; activeB: number; uncensored: boolean; calib?: number };
export const models: Model[] = [
  { id: 'llama3.1-8b', name: 'Llama 3.1 8B', sizeGB: 4.92, totalB: 8, activeB: 8, uncensored: false },
  { id: 'qwen3-8b', name: 'Qwen3 8B', sizeGB: 5.03, totalB: 8, activeB: 8, uncensored: false },
  { id: 'gemma3-12b', name: 'Gemma 3 12B', sizeGB: 7.3, totalB: 12, activeB: 12, uncensored: false },
  { id: 'qwen3-14b', name: 'Qwen3 14B', sizeGB: 9.0, totalB: 14, activeB: 14, uncensored: false },
  { id: 'deepseek-r1-14b', name: 'DeepSeek R1 Distill 14B', sizeGB: 8.99, totalB: 14, activeB: 14, uncensored: false },
  { id: 'gpt-oss-20b', name: 'gpt-oss-20b', sizeGB: 12.1, totalB: 21, activeB: 3.6, uncensored: false },
  { id: 'mistral-small-24b', name: 'Mistral Small 3.2 24B', sizeGB: 14.3, totalB: 24, activeB: 24, uncensored: false },
  { id: 'gemma3-27b', name: 'Gemma 3 27B', sizeGB: 16.5, totalB: 27, activeB: 27, uncensored: false },
  { id: 'qwen3-30b-a3b', name: 'Qwen3 30B-A3B (MoE)', sizeGB: 18.6, totalB: 30, activeB: 3.3, uncensored: false, calib: 0.82 },
  { id: 'qwen3-32b', name: 'Qwen3 32B', sizeGB: 19.8, totalB: 32, activeB: 32, uncensored: false },
  { id: 'llama3.3-70b', name: 'Llama 3.3 70B', sizeGB: 42.5, totalB: 70, activeB: 70, uncensored: false },
  { id: 'gpt-oss-120b', name: 'gpt-oss-120b', sizeGB: 63.4, totalB: 117, activeB: 5.1, uncensored: false },
  // Necenzūruotos versijos: ta pati architektūra, todėl ir tas pats dydis kaip bazinio modelio.
  { id: 'dolphin3-8b', name: 'Dolphin 3.0 Llama 3.1 8B (necenzūruotas)', sizeGB: 4.92, totalB: 8, activeB: 8, uncensored: true },
  { id: 'qwen3-14b-abl', name: 'Qwen3 14B abliterated (necenzūruotas)', sizeGB: 9.0, totalB: 14, activeB: 14, uncensored: true },
];

export type EngineId = 'ollama' | 'llamacpp' | 'lmstudio' | 'vllm';
export const engines: { id: EngineId; name: string; factor: number; note: string }[] = [
  { id: 'ollama', name: 'Ollama', factor: 0.95, note: 'paprasčiausias paleidimas' },
  { id: 'llamacpp', name: 'llama.cpp', factor: 1, note: 'greičiausias, daugiausia nustatymų' },
  { id: 'lmstudio', name: 'LM Studio', factor: 0.95, note: 'programa su grafine sąsaja' },
  { id: 'vllm', name: 'vLLM', factor: 1, note: 'keliems vartotojams, tik vaizdo plokštėje' },
];

export const operatingSystems = [
  { id: 'windows11', name: 'Windows 11' },
  { id: 'ubuntu', name: 'Ubuntu LTS (Linux)' },
];

export const interfaces = [
  { id: 'open-webui', name: 'Open WebUI', note: 'pilnas ChatGPT tipo vaizdas' },
  { id: 'llamacpp-webui', name: 'llama.cpp sąsaja', note: 'paprasta, integruota į llama.cpp' },
  { id: 'librechat', name: 'LibreChat', note: 'ChatGPT tipo, keli vartotojai' },
];

export type Level = 'paprasciausias' | 'programuotojui' | 'agentas';
export const agents: { id: string; name: string; note: string; level: Level }[] = [
  { id: 'pi', name: 'Pi', note: 'lengviausias programavimo agentas', level: 'programuotojui' },
  { id: 'codex', name: 'Codex CLI', note: 'programavimo agentas terminale', level: 'programuotojui' },
  { id: 'opencode', name: 'OpenCode', note: 'atviro kodo programavimo agentas', level: 'programuotojui' },
  { id: 'aider', name: 'Aider', note: 'programavimas kartu su git', level: 'programuotojui' },
  { id: 'hermes', name: 'Hermes Agent', note: 'asmeninis agentas su atmintimi', level: 'agentas' },
];

export const INSTALL_PRICES: Record<Level, number> = { paprasciausias: 149, programuotojui: 249, agentas: 349 };
export const ASSEMBLY_PRICE = 99;

export type Preset = { id: Level; name: string; engine: EngineId; ui: string; agents: string[] };
export const presets: Preset[] = [
  { id: 'paprasciausias', name: 'Paprasčiausias', engine: 'ollama', ui: 'open-webui', agents: [] },
  { id: 'programuotojui', name: 'Programuotojui', engine: 'ollama', ui: 'open-webui', agents: ['codex', 'pi'] },
  { id: 'agentas', name: 'Agentas', engine: 'ollama', ui: 'open-webui', agents: ['hermes'] },
];

export type Goal = { id: string; name: string; preset: Level; models: string[] };
export const goals: Goal[] = [
  { id: 'pokalbiai', name: 'Pokalbiai ir tekstai', preset: 'paprasciausias', models: ['qwen3-8b', 'gemma3-12b'] },
  { id: 'programavimas', name: 'Programavimas', preset: 'programuotojui', models: ['qwen3-30b-a3b', 'gpt-oss-20b'] },
  { id: 'dokumentai', name: 'Darbas su dokumentais', preset: 'paprasciausias', models: ['qwen3-14b', 'mistral-small-24b'] },
  { id: 'necenzuruoti', name: 'Necenzūruoti modeliai', preset: 'paprasciausias', models: ['dolphin3-8b', 'qwen3-14b-abl'] },
];
