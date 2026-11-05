# AI sistemos konfigūratorius: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** `/konfiguratorius` page where a visitor assembles hardware + software, sees approximate tok/s per chosen model and an approximate total price, and sends a full quote request; `/skaiciuokle` switches to the same benchmark-based speed engine.

**Architecture:** Data in `src/data/parts.ts` (GPUs with llama.cpp measured tg128, CPUs with RAM bandwidth, RAM, base builds, software options, models with HF GGUF sizes, install prices). Pure logic in `src/lib/perf.ts` (speed/fit) and `src/lib/quote.ts` (price + summary text), unit-tested with `node --test`. UI `src/pages/konfiguratorius.astro` + `src/scripts/configurator.ts` (external module, CSP-safe), server-renders the default config. Contact API gains plan `konfiguratorius` and field `config`.

**Spec:** `docs/superpowers/specs/2026-11-05-konfiguratorius-design.md`

## Global Constraints

- Lithuanian copy; every speed „apytiksliai“, every price „Apytikslė kaina, preliminari, galutinė pasiūlyme“.
- Part prices only in `parts.ts` and only shown on `/konfiguratorius`; product pages stay „Kaina pagal užklausą“.
- Unknown price (`null`) → shown as „pagal užklausą“ and listed separately; total says „+ dalys pagal užklausą“.
- No third-party requests; no inline scripts/styles; 360px no horizontal scroll; works without JS (default config rendered).
- Install prices: Paprasčiausias 149 €, Programuotojui 249 €, Agentas 349 €; assembly 99 € (only when buying hardware); support none / 29 €/mėn. / 99 €/mėn. as separate line.

## Data (verified 2026-11-05)

GPU tg128 (llama.cpp #15013, Llama 2 7B Q4_0, t/s): 2060 SUPER 60.04, 2080 Ti 107.51, 3060 12GB 75.57, 3080 139.65, 3090 158.16, 4060 Ti 63.86, 4070 Ti SUPER 132.26, 4080 142.49, 4090 186.21, 5060 Ti 90.94, 5070 127.54, 5070 Ti 176.85, 5080 181.99, 5090 290.02, RTX PRO 6000 274.20, DGX Spark 57.21 (#16578; gpt-oss-120b tg32 58.72).
skytech.lt prices (€): 3060 12GB 503, 5060 Ti 795, 5070 929, 5070 Ti 1291, 5080 1426, 5090 6990, PRO 6000 17076, Lenovo PGX (GB10) 1TB 5193; R5 5600 106.99, i5-12400F 139.29, R5 7600 173.19, R7 9700X 239.19, Ultra 7 265K 350.69, R9 9950X 464, TR 9960X 1531; DDR4 32GB 218.29, DDR5 32GB 474.90, 64GB 826, 128GB 2696; B650 81.19, 1200W Gold 132.99, NVMe 2TB 260.59. Not on skytech new: 2060S, 2080 Ti, 3080, 3090, 4060 Ti, 4070 Ti S, 4080, 4090 → price null, „naudota / pagal galimybes“.
HF GGUF Q4_K_M sizes (GB): Llama 3.1 8B 4.92, Qwen3 8B 5.03, Qwen3 14B 9.0, DeepSeek-R1-Distill-Qwen-14B 8.99, Gemma 3 12B 7.3, Mistral Small 3.2 24B 14.3, Gemma 3 27B 16.5, Qwen3 32B 19.8, Qwen3 30B-A3B 18.6 (30B/3.3B active), gpt-oss-20b 12.1 MXFP4 (21B/3.6B), Llama 3.3 70B 42.5, gpt-oss-120b 63.4 MXFP4 (117B/5.1B). Uncensored variants take the base model's size (same architecture): Dolphin 3.0 Llama 3.1 8B 4.92, Qwen3 14B abliterated 9.0.

## Speed model (`perf.ts`)

- `effBw(gpu)` = `tg7b × 3.83` GB/s if measured, else `bandwidthGBs × 0.6`.
- active GB = `sizeGB × activeB / totalB`; MoE factor 0.75 when `activeB < totalB`.
- need GB = `sizeGB × 1.1 + (users − 1) × sizeGB × 0.02`; VRAM usable = `vramGB × count − 1.5` (unified memory: `usableGB`).
- fits in VRAM: tps = `effBw × multiGpu / activeGB × moe × engineFactor / (1 + k × (users − 1))`; multiGpu 1.0 (llama.cpp family) or 1.6 (vLLM with 2 GPUs); k 0.15 (llama.cpp family) or 0.05 (vLLM).
- partial: system RAM usable = `ramGB − 8`; if need ≤ VRAM usable + RAM usable and engine ≠ vLLM: `t = activeGB·f/effBw + activeGB·(1−f)/(ramBw·0.7)`, f = VRAM usable / need; tps = `1/t × moe × engineFactor / users-factor`; mode „dalinai RAM“.
- else: does not fit.
- engine factor: llama.cpp 1.0, Ollama 0.95, LM Studio 0.95, vLLM 1.0.

---

### Task 1: parts data + speed engine
Files: `src/data/parts.ts`, `src/lib/perf.ts`, test `tests/unit/perf.test.ts`.
Tests: `5090 Llama 2 7B-class 3.83GB model ≈ 290`, `DGX Spark gpt-oss-120b within 45–75 tok/s`, `5090 llama 70B partial offload with 9950X/96GB gives 1–8 tok/s mode partial`, `3060 12GB + 16GB RAM cannot run 70B`, `vLLM never offloads`, `2 GPUs pool VRAM`, `users reduce speed`, `every part with price has price>0 and every gpu has vram`, `every model size >0, activeB≤totalB`.

### Task 2: calculator uses the new engine
Files: modify `src/data/catalog.ts` (devices gain `gpuId`, `gpuCount`, `cpuId`, `ramGB` or `unified` fields; model presets map to parts models), `src/lib/calc.ts` (`tokensPerSecond`/`memoryNeededGB` delegate to perf), update `tests/unit/calc.test.ts` expected values to the engine (ledger the change).

### Task 3: quote + summary
Files: `src/lib/quote.ts`, test `tests/unit/quote.test.ts`.
`quote(cfg) → { lines: {label, eur|null}[], oneOff: number, unknown: string[], monthly: number }`; `softwareLevel(cfg)` → paprasciausias|programuotojui|agentas; `configText(cfg, results, quote) → string ≤ 3000`.
Tests: own PC = install only; built PC = parts + base + 99 + install; 2 GPUs force TR platform + workstation base; null GPU price → in unknown; Hermes or vLLM → 349; Codex → 249; support 29 separate; text contains GPU, models with tok/s, total.

### Task 4: configurator page
Files: `src/pages/konfiguratorius.astro`, `src/components/Configurator.astro`, `src/scripts/configurator.ts`, CSS, nav/home/skaiciuokle links; test `tests/site/configurator.test.js` (page exists, default result server-rendered with tok/s and €, all GPUs/CPUs/RAM/OS/engines/UIs/agents/models listed, presets, form with hidden `config`, CTA, labels apytiksliai/preliminari).
Browser check: change GPU/RAM/models/preset → results update; 360px.

### Task 5: API + form
Files: `api/contact.js` (`konfiguratorius` plan, `config` ≤ 3000, escaped, in email), `src/data/plans.ts`, `ContactForm.astro` (optional hidden `config`), tests in `tests/unit/contact.test.js`.

### Task 6: deploy
`npm test` green → commit → `git push origin main:master` → verify https://nodas.lt/konfiguratorius returns 200 with new content.
