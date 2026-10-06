import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0016-transports-routiers";
const value = "transports routiers";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...choice["une possibilité"], value],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

/**
 * Sourced grids by code SUB-SECTOR-CATEGORY-COEFFICIENT: the seniority (in years) at which each
 * step starts, and its values, either an hourly rate (multiplied here by 151.67 hours) or a
 * monthly minimum. Marchandises (M) is the accord of 11 October 2023, voyageurs (V) the avenants
 * of 27 November 2025, logistique (L) the avenant n° 17 of 12 March 2026 and déménagement (D)
 * the avenant n° 24 of 21 January 2026.
 */
const GRIDS: readonly { code: string; kind: "hourly" | "monthly"; steps: number[]; values: number[] }[] = [
  { code: "M-O-110", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.09, 12.33, 12.5736, 12.8154, 13.0572] },
  { code: "M-O-115", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.09, 12.33, 12.5736, 12.8154, 13.0572] },
  { code: "M-O-118", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.09, 12.33, 12.5736, 12.8154, 13.0572] },
  { code: "M-O-120", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.09, 12.33, 12.5736, 12.8154, 13.0572] },
  { code: "M-O-128", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.12, 12.3624, 12.6048, 12.8472, 13.0896] },
  { code: "M-O-138", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.14, 12.3828, 12.6256, 12.8684, 13.1112] },
  { code: "M-O-150", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.43, 12.6786, 12.9272, 13.1758, 13.4244] },
  { code: "M-E-105", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [12.09, 12.4527, 12.8154, 13.1781, 13.5408, 13.9035] },
  { code: "M-E-110", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [12.09, 12.4527, 12.8154, 13.1781, 13.5408, 13.9035] },
  { code: "M-E-115", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [12.09, 12.4527, 12.8154, 13.1781, 13.5408, 13.9035] },
  { code: "M-E-120", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [12.09, 12.4527, 12.8154, 13.1781, 13.5408, 13.9035] },
  { code: "M-E-125", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [12.1, 12.463, 12.826, 13.189, 13.552, 13.915] },
  { code: "M-E-132.5", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [12.12, 12.4836, 12.8472, 13.2108, 13.5744, 13.938] },
  { code: "M-E-140", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [12.15, 12.5145, 12.879, 13.2435, 13.608, 13.9725] },
  { code: "M-E-148.5", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [12.43, 12.8029, 13.1758, 13.5487, 13.9216, 14.2945] },
  { code: "M-T-150", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [12.6, 12.978, 13.36, 13.734, 14.112, 14.49] },
  { code: "M-T-157.5", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [12.73, 13.1119, 13.4938, 13.8757, 14.2576, 14.6395] },
  { code: "M-T-165", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [13.34, 13.7402, 14.1404, 14.5406, 14.9408, 15.341] },
  { code: "M-T-175", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [14.17, 14.5951, 15.0202, 15.4453, 15.8704, 16.2955] },
  { code: "M-T-185", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [14.94, 15.3882, 15.8364, 16.2846, 16.7328, 17.181] },
  { code: "M-T-200", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [16.17, 16.6551, 17.1402, 17.6253, 18.1104, 18.5955] },
  { code: "M-T-215", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [17.37, 17.8911, 18.4122, 18.9333, 19.4544, 19.9755] },
  { code: "M-T-225", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [18.21, 18.7563, 19.3026, 19.8489, 20.3952, 20.9415] },
  { code: "M-C-100", kind: "monthly", steps: [0, 5, 10, 15], values: [2621.8, 2752.88, 2883.98, 3015.06] },
  { code: "M-C-106.5", kind: "monthly", steps: [0, 5, 10, 15], values: [2791.96, 2931.55, 3071.15, 3210.75] },
  { code: "M-C-113", kind: "monthly", steps: [0, 5, 10, 15], values: [2962.15, 3110.26, 3258.37, 3406.47] },
  { code: "M-C-119", kind: "monthly", steps: [0, 5, 10, 15], values: [3119.15, 3275.11, 3431.07, 3587.03] },
  { code: "M-C-132", kind: "monthly", steps: [0, 5, 10, 15], values: [3459.5, 3632.47, 3805.44, 3978.42] },
  { code: "M-C-145", kind: "monthly", steps: [0, 5, 10, 15], values: [3799.85, 3989.85, 4179.84, 4369.83] },
  { code: "V-O-110", kind: "monthly", steps: [0, 1, 5, 10, 15, 20, 25, 30], values: [1884.8, 1922.5, 1997.89, 2035.58, 2073.28, 2148.67, 2205.22, 2261.76] },
  { code: "V-O-115", kind: "monthly", steps: [0, 1, 5, 10, 15, 20, 25, 30], values: [1884.8, 1922.5, 1997.89, 2035.58, 2073.28, 2148.67, 2205.22, 2261.76] },
  { code: "V-O-120", kind: "monthly", steps: [0, 1, 5, 10, 15, 20, 25, 30], values: [1884.8, 1922.5, 1997.89, 2035.58, 2073.28, 2148.67, 2205.22, 2261.76] },
  { code: "V-O-123", kind: "monthly", steps: [0, 1, 5, 10, 15, 20, 25, 30], values: [1884.8, 1922.5, 1997.89, 2035.58, 2073.28, 2148.67, 2205.22, 2261.76] },
  { code: "V-O-128", kind: "monthly", steps: [0, 1, 5, 10, 15, 20, 25, 30], values: [1884.8, 1922.5, 1997.89, 2035.58, 2073.28, 2148.67, 2205.22, 2261.76] },
  { code: "V-O-131", kind: "monthly", steps: [0, 1, 5, 10, 15, 20, 25, 30], values: [1913.45, 1951.72, 2028.26, 2066.53, 2104.8, 2181.33, 2238.74, 2296.14] },
  { code: "V-O-136", kind: "monthly", steps: [0, 1, 5, 10, 15, 20, 25, 30], values: [1929.86, 1968.46, 2045.65, 2084.25, 2122.85, 2200.04, 2257.94, 2315.83] },
  { code: "V-O-137", kind: "monthly", steps: [0, 1, 5, 10, 15, 20, 25, 30], values: [1936.02, 1974.74, 2052.18, 2090.9, 2129.62, 2207.06, 2265.14, 2323.22] },
  { code: "V-O-138", kind: "monthly", steps: [0, 1, 5, 10, 15, 20, 25, 30], values: [1989.86, 2029.66, 2109.25, 2149.05, 2188.85, 2268.44, 2328.14, 2387.83] },
  { code: "V-O-140", kind: "monthly", steps: [0, 1, 5, 10, 15, 20, 25, 30], values: [2004.41, 2044.5, 2124.67, 2164.76, 2204.85, 2285.03, 2345.16, 2405.29] },
  { code: "V-O-142", kind: "monthly", steps: [0, 1, 5, 10, 15, 20, 25, 30], values: [2024.46, 2064.95, 2145.93, 2186.42, 2226.91, 2307.88, 2368.62, 2429.35] },
  { code: "V-O-145", kind: "monthly", steps: [0, 1, 5, 10, 15, 20, 25, 30], values: [2045.88, 2086.8, 2168.63, 2209.55, 2250.47, 2332.3, 2393.68, 2455.06] },
  { code: "V-O-150", kind: "monthly", steps: [0, 1, 5, 10, 15, 20, 25, 30], values: [2095.58, 2137.49, 2221.31, 2263.23, 2305.14, 2388.96, 2451.83, 2514.7] },
  { code: "V-O-155", kind: "monthly", steps: [0, 1, 5, 10, 15, 20, 25, 30], values: [2200.6, 2244.61, 2332.64, 2376.65, 2420.66, 2508.68, 2574.7, 2640.72] },
  { code: "V-E-105", kind: "monthly", steps: [0, 3, 6, 9, 12, 15, 20, 25, 30], values: [1920.48, 1978.09, 2035.71, 2093.32, 2150.94, 2208.55, 2246.96, 2275.77, 2304.58] },
  { code: "V-E-110", kind: "monthly", steps: [0, 3, 6, 9, 12, 15, 20, 25, 30], values: [1920.48, 1978.09, 2035.71, 2093.32, 2150.94, 2208.55, 2246.96, 2275.77, 2304.58] },
  { code: "V-E-115", kind: "monthly", steps: [0, 3, 6, 9, 12, 15, 20, 25, 30], values: [1921.02, 1978.65, 2036.28, 2093.91, 2151.54, 2209.17, 2247.59, 2276.41, 2305.22] },
  { code: "V-E-120", kind: "monthly", steps: [0, 3, 6, 9, 12, 15, 20, 25, 30], values: [1921.29, 1978.93, 2036.57, 2094.21, 2151.84, 2209.48, 2247.91, 2276.73, 2305.55] },
  { code: "V-E-125", kind: "monthly", steps: [0, 3, 6, 9, 12, 15, 20, 25, 30], values: [1921.49, 1979.13, 2036.78, 2094.42, 2152.07, 2209.71, 2248.14, 2276.97, 2305.79] },
  { code: "V-E-132.5", kind: "monthly", steps: [0, 3, 6, 9, 12, 15, 20, 25, 30], values: [1939.9, 1998.1, 2056.29, 2114.49, 2172.69, 2230.89, 2269.68, 2298.78, 2327.88] },
  { code: "V-E-140", kind: "monthly", steps: [0, 3, 6, 9, 12, 15, 20, 25, 30], values: [1957.38, 2016.1, 2074.82, 2133.54, 2192.27, 2250.99, 2290.13, 2319.5, 2348.86] },
  { code: "V-E-148.5", kind: "monthly", steps: [0, 3, 6, 9, 12, 15, 20, 25, 30], values: [2076.71, 2139.01, 2201.31, 2263.61, 2325.92, 2388.22, 2429.75, 2460.9, 2492.05] },
  { code: "V-T-150", kind: "monthly", steps: [0, 3, 6, 9, 12, 15, 20, 25, 30], values: [2098.17, 2161.12, 2224.06, 2287.01, 2349.95, 2412.9, 2454.86, 2486.33, 2517.8] },
  { code: "V-T-157.5", kind: "monthly", steps: [0, 3, 6, 9, 12, 15, 20, 25, 30], values: [2202.54, 2268.62, 2334.69, 2400.77, 2466.84, 2532.92, 2576.97, 2610.01, 2643.05] },
  { code: "V-T-165", kind: "monthly", steps: [0, 3, 6, 9, 12, 15, 20, 25, 30], values: [2308.21, 2377.46, 2446.7, 2515.95, 2585.2, 2654.44, 2700.61, 2735.23, 2769.85] },
  { code: "V-T-175", kind: "monthly", steps: [0, 3, 6, 9, 12, 15, 20, 25, 30], values: [2449.0, 2522.47, 2595.94, 2669.41, 2742.88, 2816.35, 2865.33, 2902.07, 2938.8] },
  { code: "V-T-185", kind: "monthly", steps: [0, 3, 6, 9, 12, 15, 20, 25, 30], values: [2586.73, 2664.33, 2741.93, 2819.54, 2897.14, 2974.74, 3026.47, 3065.28, 3104.08] },
  { code: "V-T-200", kind: "monthly", steps: [0, 3, 6, 9, 12, 15, 20, 25, 30], values: [2796.29, 2880.18, 2964.07, 3047.96, 3131.84, 3215.73, 3271.66, 3313.6, 3355.55] },
  { code: "V-T-215", kind: "monthly", steps: [0, 3, 6, 9, 12, 15, 20, 25, 30], values: [3005.84, 3096.02, 3186.19, 3276.37, 3366.54, 3456.72, 3516.83, 3561.92, 3607.01] },
  { code: "V-T-225", kind: "monthly", steps: [0, 3, 6, 9, 12, 15, 20, 25, 30], values: [3146.59, 3240.99, 3335.39, 3429.78, 3524.18, 3618.58, 3681.51, 3728.71, 3775.91] },
  { code: "V-C-100", kind: "monthly", steps: [0, 5, 10, 15, 20, 25, 30], values: [2916.35, 3062.16, 3207.98, 3353.8, 3412.12, 3455.87, 3499.61] },
  { code: "V-C-106.5", kind: "monthly", steps: [0, 5, 10, 15, 20, 25, 30], values: [3105.94, 3261.24, 3416.53, 3571.83, 3633.95, 3680.54, 3727.13] },
  { code: "V-C-113", kind: "monthly", steps: [0, 5, 10, 15, 20, 25, 30], values: [3295.46, 3460.23, 3625.0, 3789.78, 3855.69, 3905.12, 3954.55] },
  { code: "V-C-119", kind: "monthly", steps: [0, 5, 10, 15, 20, 25, 30], values: [3470.39, 3643.91, 3817.42, 3990.94, 4060.35, 4112.41, 4164.46] },
  { code: "V-C-132", kind: "monthly", steps: [0, 5, 10, 15, 20, 25, 30], values: [3849.53, 4042.01, 4234.49, 4426.96, 4503.95, 4561.7, 4619.44] },
  { code: "V-C-145", kind: "monthly", steps: [0, 5, 10, 15, 20, 25, 30], values: [4228.66, 4440.09, 4651.52, 4862.96, 4947.53, 5010.96, 5074.39] },
  { code: "L-O-110", kind: "hourly", steps: [0, 0.5, 2, 5, 10, 15, 20], values: [12.03, 12.08, 12.3216, 12.5632, 12.8048, 13.0464, 13.1464] },
  { code: "L-O-115", kind: "hourly", steps: [0, 0.5, 2, 5, 10, 15, 20], values: [12.03, 12.17, 12.4134, 12.6568, 12.9002, 13.1436, 13.2436] },
  { code: "L-O-120", kind: "hourly", steps: [0, 0.5, 2, 5, 10, 15, 20], values: [12.04, 12.24, 12.4848, 12.7296, 12.9744, 13.2192, 13.3192] },
  { code: "L-O-125", kind: "hourly", steps: [0, 0.5, 2, 5, 10, 15, 20], values: [12.07, 12.3, 12.546, 12.792, 13.038, 13.284, 13.384] },
  { code: "L-O-138", kind: "hourly", steps: [0, 0.5, 2, 5, 10, 15, 20], values: [12.1, 12.38, 12.6276, 12.8752, 13.1228, 13.3704, 13.4704] },
  { code: "L-E-110", kind: "hourly", steps: [0, 0.5, 3, 6, 9, 12, 15, 20], values: [12.1, 12.3, 12.669, 13.038, 13.407, 13.776, 14.145, 14.245] },
  { code: "L-E-120", kind: "hourly", steps: [0, 0.5, 3, 6, 9, 12, 15, 20], values: [12.15, 12.38, 12.7514, 13.1228, 13.4942, 13.8656, 14.237, 14.337] },
  { code: "L-T-150", kind: "hourly", steps: [0, 3, 6, 9, 12, 15, 20], values: [13.68, 14.0904, 14.5008, 14.9112, 15.3216, 15.732, 15.832] },
  { code: "L-T-157.5", kind: "hourly", steps: [0, 3, 6, 9, 12, 15, 20], values: [13.78, 14.1934, 14.6068, 15.0202, 15.4336, 15.847, 15.947] },
  { code: "L-T-165", kind: "hourly", steps: [0, 3, 6, 9, 12, 15, 20], values: [14.29, 14.7187, 15.1474, 15.5761, 16.0048, 16.4335, 16.5335] },
  { code: "L-T-200", kind: "hourly", steps: [0, 3, 6, 9, 12, 15, 20], values: [16.93, 17.4379, 17.9458, 18.4537, 18.9616, 19.4695, 19.5695] },
  { code: "L-C-100", kind: "monthly", steps: [0, 5, 10, 15, 20], values: [3071.45, 3225.02, 3378.6, 3532.17, 3545.67] },
  { code: "L-C-106.5", kind: "monthly", steps: [0, 5, 10, 15, 20], values: [3271.86, 3435.45, 3599.05, 3762.64, 3776.14] },
  { code: "L-C-113", kind: "monthly", steps: [0, 5, 10, 15, 20], values: [3470.78, 3644.32, 3817.86, 3991.4, 4004.9] },
  { code: "L-C-119", kind: "monthly", steps: [0, 5, 10, 15, 20], values: [3629.63, 3811.11, 3992.59, 4174.07, 4187.57] },
  { code: "L-C-132", kind: "monthly", steps: [0, 5, 10, 15, 20], values: [4055.95, 4258.75, 4461.55, 4664.35, 4677.85] },
  { code: "D-O-1A", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.03, 12.27, 12.51, 12.75, 12.99] },
  { code: "D-O-1B", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.21, 12.45, 12.7, 12.94, 13.19] },
  { code: "D-O-1C", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.68, 12.93, 13.19, 13.44, 13.69] },
  { code: "D-O-1D", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [13.59, 13.86, 14.13, 14.41, 14.68] },
  { code: "D-O-1A-DC0", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.15, 12.39, 12.64, 12.88, 13.12] },
  { code: "D-O-1B-DC0", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.33, 12.58, 12.82, 13.07, 13.32] },
  { code: "D-O-1C-DC0", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.81, 13.07, 13.32, 13.58, 13.83] },
  { code: "D-O-1D-DC0", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [13.73, 14.0, 14.28, 14.55, 14.83] },
  { code: "D-O-1A-DC1", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.27, 12.52, 12.76, 13.01, 13.25] },
  { code: "D-O-1B-DC1", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.45, 12.7, 12.95, 13.2, 13.45] },
  { code: "D-O-1C-DC1", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.93, 13.19, 13.45, 13.71, 13.96] },
  { code: "D-O-1D-DC1", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [13.86, 14.14, 14.41, 14.69, 14.97] },
  { code: "D-O-1A-DC2", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.39, 12.64, 12.89, 13.13, 13.38] },
  { code: "D-O-1B-DC2", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [12.58, 12.83, 13.08, 13.33, 13.59] },
  { code: "D-O-1C-DC2", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [13.06, 13.32, 13.58, 13.84, 14.1] },
  { code: "D-O-1D-DC2", kind: "hourly", steps: [0, 2, 5, 10, 15], values: [14.0, 14.28, 14.56, 14.84, 15.12] },
  { code: "D-E-2A", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [12.03, 12.39, 12.75, 13.11, 13.47, 13.83] },
  { code: "D-E-2B", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [12.11, 12.47, 12.84, 13.2, 13.56, 13.93] },
  { code: "D-E-2C", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [12.44, 12.81, 13.19, 13.56, 13.93, 14.31] },
  { code: "D-E-2D", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [12.85, 13.24, 13.62, 14.01, 14.39, 14.78] },
  { code: "D-T-3A", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [13.44, 13.84, 14.25, 14.65, 15.05, 15.46] },
  { code: "D-T-3B", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [14.19, 14.62, 15.04, 15.47, 15.89, 16.32] },
  { code: "D-T-3C", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [16.23, 16.72, 17.2, 17.69, 18.18, 18.66] },
  { code: "D-T-3D", kind: "hourly", steps: [0, 3, 6, 9, 12, 15], values: [18.29, 18.84, 19.39, 19.94, 20.48, 21.03] },
  { code: "D-C-4A", kind: "monthly", steps: [0, 5, 10, 15], values: [3118.39, 3274.31, 3430.23, 3586.15] },
  { code: "D-C-4B", kind: "monthly", steps: [0, 5, 10, 15], values: [3484.36, 3658.57, 3832.79, 4007.01] },
  { code: "D-C-4C", kind: "monthly", steps: [0, 5, 10, 15], values: [4245.67, 4457.95, 4670.24, 4882.52] },
];

const roundToCents = (amount: number) => Math.round((amount + 1e-9) * 100) / 100;
const expected = (grid: (typeof GRIDS)[number], index: number) =>
  grid.kind === "hourly" ? roundToCents(grid.values[index]! * 151.67) : grid.values[index]!;

function setSituation(level: string | undefined, years = 0, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    "salarié . ancienneté": `${years} an`,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

const amount = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return roundToCents(result as number);
};

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 16 — 2026.1 minimum salaries", () => {
  it("is in force from 1 June 2026 and cites the four sub-sectors' texts", () => {
    assert.equal(version.validFrom, "2026-06-01");
    for (const text of ["Accord du 11 octobre 2023", "Avenants du 27 novembre 2025", "Avenant n° 17 du 12 mars 2026", "Avenant n° 24 du 21 janvier 2026", "TRST2610632A", "MTRT2333106A"]) {
      assert.ok(version.sources.some((source) => source.includes(text)), text);
    }
  });

  it("has 108 classifications", () => {
    assert.equal(GRIDS.length, 108);
    assert.equal(new Set(GRIDS.map((grid) => grid.code)).size, 108);
  });

  for (const grid of GRIDS) {
    it(`${grid.code}: every seniority step`, () => {
      grid.steps.forEach((years, index) => {
        setSituation(grid.code, years);
        assert.equal(amount(), expected(grid, index), `${grid.code} from ${years} years`);
        if (index > 0) {
          setSituation(grid.code, years - 0.01);
          assert.equal(amount(), expected(grid, index - 1), `${grid.code} just before ${years} years`);
        }
      });
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    const grid = GRIDS.find((entry) => entry.code === "V-O-110")!;
    setSituation("V-O-110", 0, "50%");
    assert.equal(amount(), roundToCents(expected(grid, 0) / 2));
  });

  it("rejects classifications outside the grids", () => {
    for (const level of ["M-O-111", "M-X-110", "X-O-110", "M-C-150", "V-O-110V", "110", "D-O-1E", "m-o-110", "non renseigné"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(amount(), 0, level);
    }
  });

  it("reports a missing classification as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(amount(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("M-O-128");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
