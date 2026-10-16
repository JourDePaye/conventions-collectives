import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3017-ports-manutention";
const value = "ports et manutention";
const namespace = `salarié . convention collective . ${value}`;
const STEPS = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33];

// Hard-coded from the annexes of the avenants n° 17 (2024), 19 (2025) and 21 (2026): monthly SBMH
// by grid, classification and seniority step (0, 3, ..., 33 years). "Cadres 4" has a single amount.
const GRIDS: Record<string, { validFrom: string; ids: string[]; grids: Record<string, Record<string, number[]>> }> = {
  "2024.2": {
    validFrom: "2024-01-01",
    ids: ["KALITEXT000049508746", "13 mai 2024"],
    grids: {
      "établissements portuaires": {
        "B": [1914, 1975, 2036, 2097, 2157, 2218, 2280, 2340, 2400, 2462, 2522, 2583],
        "C1": [1933, 2004, 2076, 2147, 2218, 2291, 2363, 2435, 2505, 2576, 2647, 2718],
        "C2": [1961, 2036, 2111, 2185, 2262, 2334, 2409, 2484, 2559, 2634, 2710, 2785],
        "C3": [2010, 2086, 2162, 2236, 2312, 2388, 2464, 2549, 2641, 2723, 2802, 2882],
        "D1": [2057, 2140, 2223, 2307, 2391, 2474, 2557, 2641, 2723, 2807, 2890, 2974],
        "D2": [2106, 2191, 2274, 2359, 2444, 2528, 2611, 2696, 2780, 2864, 2948, 3032],
        "AM1": [2201, 2319, 2439, 2557, 2674, 2818, 2940, 3071, 3148, 3266, 3384, 3502],
        "AM2": [2586, 2731, 2878, 3024, 3170, 3317, 3461, 3608, 3755, 3899, 4045, 4191],
        "AM3": [2645, 2814, 2987, 3158, 3329, 3500, 3672, 3842, 4014, 4183, 4354, 4524],
        "Cadres 1": [3306, 3598, 3891, 4189, 4481, 4774, 5069, 5363, 5655, 5949, 6243, 6537],
        "Cadres 2": [3856, 4155, 4456, 4756, 5054, 5358, 5657, 5958, 6258, 6556, 6856, 7156],
        "Cadres 3": [4293, 4623, 4954, 5287, 5617, 5947, 6278, 6610, 6940, 7272, 7603, 7934],
        "Cadres 4": [5949],
      },
      "autres salariés": {
        "B": [1828, 1856, 1893, 1930, 1970, 2005, 2046, 2083, 2121, 2158, 2194, 2230],
        "C1": [1862, 1927, 1992, 2058, 2122, 2188, 2254, 2320, 2384, 2449, 2514, 2579],
        "C2": [1940, 2008, 2076, 2144, 2211, 2281, 2348, 2417, 2486, 2552, 2621, 2689],
        "C3": [2064, 2139, 2211, 2285, 2358, 2429, 2503, 2575, 2648, 2722, 2793, 2866],
        "D1": [2179, 2257, 2332, 2409, 2486, 2563, 2640, 2716, 2792, 2870, 2946, 3022],
        "D2": [2306, 2386, 2469, 2548, 2629, 2712, 2792, 2873, 2954, 3036, 3117, 3198],
        "AM1": [2597, 2688, 2779, 2872, 2964, 3055, 3146, 3238, 3328, 3421, 3512, 3603],
        "AM2": [2756, 2854, 2952, 3049, 3145, 3243, 3341, 3441, 3536, 3634, 3732, 3830],
        "Cadres 1": [2796, 2895, 2995, 3093, 3191, 3290, 3390, 3490, 3587, 3687, 3786, 3885],
        "Cadres 2": [3029, 3135, 3243, 3348, 3455, 3562, 3669, 3775, 3883, 3990, 4096, 4203],
        "Cadres 3": [3634, 3762, 3891, 4020, 4148, 4276, 4402, 4533, 4661, 4787, 4916, 5044],
      },
      "ouvriers dockers CQP": {
        "B": [1845, 1903, 1961, 2018, 2077, 2135, 2194, 2251, 2309, 2368, 2425, 2483],
        "C1": [1920, 1988, 2056, 2124, 2194, 2263, 2330, 2399, 2469, 2537, 2606, 2675],
        "C2": [2045, 2117, 2192, 2264, 2336, 2407, 2482, 2554, 2627, 2700, 2773, 2846],
        "C3": [2173, 2250, 2325, 2401, 2480, 2556, 2631, 2710, 2786, 2863, 2938, 3015],
        "D1": [2311, 2387, 2464, 2540, 2617, 2693, 2769, 2846, 2922, 2999, 3075, 3151],
        "D2": [2439, 2517, 2599, 2678, 2759, 2840, 2920, 3000, 3081, 3161, 3242, 3322],
        "AM1": [2767, 2855, 2941, 3029, 3116, 3202, 3289, 3374, 3461, 3548, 3635, 3721],
        "AM2": [2936, 3029, 3120, 3212, 3305, 3396, 3490, 3582, 3673, 3766, 3857, 3949],
      },
    },
  },
  "2025.1": {
    validFrom: "2025-01-01",
    ids: ["KALITEXT000052455596", "21 octobre 2025"],
    grids: {
      "établissements portuaires": {
        "B": [1952, 2015, 2077, 2139, 2200, 2263, 2325, 2387, 2448, 2511, 2572, 2634],
        "C1": [1972, 2044, 2118, 2190, 2263, 2336, 2410, 2484, 2555, 2628, 2700, 2773],
        "C2": [2000, 2077, 2153, 2228, 2307, 2381, 2457, 2534, 2610, 2686, 2764, 2840],
        "C3": [2050, 2128, 2205, 2281, 2358, 2436, 2513, 2600, 2694, 2777, 2858, 2939],
        "D1": [2098, 2183, 2268, 2354, 2438, 2523, 2608, 2694, 2777, 2863, 2948, 3033],
        "D2": [2148, 2234, 2319, 2406, 2492, 2578, 2663, 2750, 2835, 2921, 3007, 3093],
        "AM1": [2245, 2366, 2487, 2608, 2727, 2874, 2998, 3132, 3211, 3331, 3452, 3572],
        "AM2": [2637, 2786, 2936, 3084, 3233, 3383, 3530, 3680, 3830, 3977, 4126, 4275],
        "AM3": [2698, 2871, 3046, 3221, 3395, 3570, 3745, 3919, 4094, 4266, 4441, 4615],
        "Cadres 1": [3372, 3670, 3969, 4272, 4571, 4869, 5170, 5470, 5768, 6068, 6368, 6668],
        "Cadres 2": [3933, 4238, 4545, 4851, 5156, 5465, 5770, 6077, 6383, 6687, 6993, 7299],
        "Cadres 3": [4379, 4716, 5054, 5393, 5729, 6066, 6404, 6743, 7079, 7417, 7755, 8092],
        "Cadres 4": [6068],
      },
      "autres salariés": {
        "B": [1865, 1893, 1931, 1969, 2009, 2045, 2087, 2125, 2163, 2201, 2237, 2275],
        "C1": [1900, 1965, 2032, 2099, 2164, 2231, 2299, 2366, 2432, 2497, 2564, 2631],
        "C2": [1979, 2048, 2118, 2187, 2255, 2327, 2395, 2465, 2535, 2603, 2673, 2742],
        "C3": [2105, 2182, 2255, 2330, 2405, 2478, 2553, 2626, 2701, 2776, 2849, 2923],
        "D1": [2222, 2302, 2378, 2457, 2535, 2614, 2693, 2770, 2847, 2927, 3005, 3083],
        "D2": [2352, 2433, 2518, 2599, 2682, 2766, 2847, 2931, 3013, 3097, 3179, 3262],
        "AM1": [2649, 2742, 2835, 2929, 3023, 3116, 3209, 3303, 3395, 3489, 3582, 3675],
        "AM2": [2811, 2911, 3011, 3110, 3208, 3308, 3408, 3509, 3607, 3707, 3807, 3906],
        "Cadres 1": [2852, 2953, 3054, 3155, 3255, 3356, 3458, 3560, 3659, 3761, 3862, 3963],
        "Cadres 2": [3089, 3198, 3308, 3415, 3524, 3634, 3742, 3851, 3961, 4069, 4178, 4287],
        "Cadres 3": [3707, 3837, 3969, 4100, 4231, 4362, 4490, 4624, 4755, 4883, 5014, 5145],
      },
      "ouvriers dockers CQP": {
        "B": [1882, 1941, 2000, 2059, 2119, 2178, 2238, 2296, 2355, 2415, 2474, 2533],
        "C1": [1958, 2028, 2097, 2167, 2238, 2308, 2377, 2447, 2518, 2588, 2658, 2728],
        "C2": [2086, 2159, 2236, 2309, 2383, 2456, 2532, 2605, 2679, 2754, 2829, 2903],
        "C3": [2216, 2295, 2372, 2449, 2529, 2607, 2684, 2764, 2841, 2920, 2997, 3075],
        "D1": [2357, 2435, 2513, 2591, 2669, 2747, 2824, 2903, 2980, 3059, 3136, 3214],
        "D2": [2487, 2567, 2651, 2732, 2814, 2897, 2979, 3060, 3142, 3224, 3307, 3389],
        "AM1": [2823, 2912, 3000, 3089, 3178, 3266, 3355, 3442, 3530, 3619, 3707, 3796],
        "AM2": [2995, 3089, 3183, 3276, 3371, 3464, 3560, 3653, 3747, 3841, 3934, 4028],
      },
    },
  },
  "2026.1": {
    validFrom: "2026-01-01",
    ids: ["KALITEXT000054034055", "23 février 2026"],
    grids: {
      "établissements portuaires": {
        "B": [1977, 2041, 2104, 2166, 2229, 2292, 2356, 2418, 2480, 2543, 2606, 2669],
        "C1": [1997, 2071, 2145, 2219, 2292, 2367, 2441, 2516, 2588, 2662, 2735, 2809],
        "C2": [2026, 2104, 2181, 2257, 2337, 2412, 2489, 2567, 2644, 2721, 2800, 2877],
        "C3": [2077, 2155, 2234, 2311, 2389, 2468, 2546, 2634, 2729, 2813, 2896, 2977],
        "D1": [2125, 2211, 2297, 2384, 2470, 2556, 2642, 2729, 2813, 2901, 2986, 3073],
        "D2": [2176, 2263, 2349, 2438, 2525, 2612, 2698, 2786, 2872, 2959, 3046, 3133],
        "AM1": [2275, 2397, 2520, 2642, 2762, 2912, 3037, 3173, 3253, 3375, 3497, 3619],
        "AM2": [2672, 2822, 2974, 3125, 3275, 3427, 3576, 3728, 3880, 4029, 4180, 4331],
        "AM3": [2733, 2908, 3086, 3263, 3439, 3616, 3794, 3969, 4147, 4322, 4498, 4675],
        "Cadres 1": [3416, 3718, 4020, 4328, 4630, 4933, 5237, 5541, 5843, 6147, 6451, 6754],
        "Cadres 2": [3984, 4293, 4604, 4914, 5223, 5536, 5845, 6156, 6466, 6774, 7084, 7394],
        "Cadres 3": [4436, 4777, 5119, 5463, 5804, 6145, 6487, 6830, 7171, 7513, 7856, 8198],
        "Cadres 4": [6147],
      },
      "autres salariés": {
        "B": [1889, 1918, 1956, 1995, 2035, 2072, 2114, 2152, 2192, 2230, 2267, 2304],
        "C1": [1924, 1991, 2058, 2126, 2193, 2260, 2329, 2397, 2464, 2530, 2598, 2665],
        "C2": [2005, 2074, 2145, 2215, 2285, 2357, 2426, 2497, 2568, 2637, 2708, 2778],
        "C3": [2133, 2210, 2285, 2361, 2436, 2510, 2586, 2660, 2736, 2812, 2886, 2961],
        "D1": [2251, 2332, 2409, 2489, 2568, 2648, 2728, 2806, 2884, 2965, 3044, 3123],
        "D2": [2383, 2465, 2551, 2633, 2716, 2802, 2884, 2969, 3052, 3137, 3220, 3304],
        "AM1": [2684, 2778, 2872, 2967, 3063, 3157, 3251, 3346, 3439, 3534, 3628, 3723],
        "AM2": [2847, 2949, 3050, 3150, 3250, 3351, 3453, 3555, 3654, 3755, 3856, 3957],
        "Cadres 1": [2889, 2991, 3094, 3196, 3297, 3400, 3503, 3607, 3707, 3809, 3912, 4015],
        "Cadres 2": [3129, 3239, 3351, 3460, 3570, 3681, 3791, 3901, 4012, 4122, 4232, 4343],
        "Cadres 3": [3755, 3887, 4021, 4153, 4286, 4419, 4549, 4684, 4817, 4947, 5079, 5212],
      },
      "ouvriers dockers CQP": {
        "B": [1906, 1966, 2026, 2086, 2146, 2206, 2267, 2326, 2385, 2446, 2506, 2566],
        "C1": [1983, 2054, 2124, 2195, 2267, 2338, 2408, 2479, 2551, 2622, 2693, 2764],
        "C2": [2113, 2188, 2265, 2339, 2414, 2487, 2565, 2639, 2714, 2790, 2866, 2941],
        "C3": [2245, 2324, 2403, 2481, 2562, 2641, 2719, 2800, 2878, 2958, 3036, 3115],
        "D1": [2388, 2466, 2546, 2624, 2704, 2782, 2861, 2940, 3019, 3098, 3177, 3256],
        "D2": [2520, 2601, 2685, 2767, 2851, 2934, 3018, 3100, 3183, 3266, 3350, 3433],
        "AM1": [2860, 2950, 3039, 3130, 3219, 3309, 3398, 3487, 3576, 3666, 3755, 3845],
        "AM2": [3034, 3130, 3224, 3319, 3414, 3509, 3606, 3701, 3795, 3891, 3986, 4081],
      },
    },
  },
};

function makeEngine(version: string) {
  const entry = COMPILED_VERSIONS[agreement]?.find((item: { version: string }) => item.version === version);
  assert.ok(entry, version);
  return entry.loadRules().then((extension: Record<string, Rule>) => {
    const rules: Record<string, Rule> = { ...modeleSocial };
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
    Object.assign(rules, extension);
    return { entry, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
  });
}

function situation(engine: Engine, grid: string | undefined, classification: string, seniority: number, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(grid === undefined ? {} : { [`${namespace} . grille de salaires`]: `'${grid}'` }),
    [`${namespace} . classification`]: `'${classification}'`,
    [`${namespace} . ancienneté dans la classification`]: `${seniority} années`,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

const minimum = (engine: Engine) => engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
const outOfGrid = (engine: Engine) => engine.evaluate(`${namespace} . classification hors grille`).nodeValue;

for (const [version, spec] of Object.entries(GRIDS)) {
  describe(`IDCC 3017 — ${version} SBMH`, async () => {
    const { entry, engine } = await makeEngine(version);

    it("has the right date and cites the extended avenant", () => {
      assert.equal(entry.validFrom, spec.validFrom);
      assert.ok(entry.sources.some((source: string) => source.includes(spec.ids[0]!)));
      assert.ok(entry.sources.some((source: string) => source.includes("KALICONT000029142476")));
    });

    it("has 13 + 11 + 8 classification rows", () => {
      assert.deepEqual(Object.values(spec.grids).map((rows) => Object.keys(rows).length), [13, 11, 8]);
    });

    for (const [grid, rows] of Object.entries(spec.grids)) {
      for (const [classification, amounts] of Object.entries(rows)) {
        it(`${grid} / ${classification}: every seniority step`, () => {
          const steps = amounts.length === 1 ? [0, 12, 33, 40] : STEPS;
          for (const years of steps) {
            const step = amounts.length === 1 ? 0 : years;
            const expected = amounts[step / 3]!;
            // Between two steps the lower one applies; beyond 33 years the last one applies.
            situation(engine, grid, classification, years);
            assert.equal(minimum(engine), expected, `${years} years`);
            assert.equal(outOfGrid(engine), false);
            if (amounts.length > 1 && years < 33) {
              situation(engine, grid, classification, years + 2);
              assert.equal(minimum(engine), expected, `${years + 2} years`);
            }
          }
          situation(engine, grid, classification, 40);
          assert.equal(minimum(engine), amounts[amounts.length === 1 ? 0 : 11]!, "40 years");
        });
      }
    }

    it("defaults to the établissements portuaires grid", () => {
      situation(engine, undefined, "B", 0);
      assert.equal(minimum(engine), spec.grids["établissements portuaires"]!.B![0]);
    });

    it("prorates once for part-time work", () => {
      situation(engine, "autres salariés", "Cadres 3", 33, "80%");
      const full = spec.grids["autres salariés"]!["Cadres 3"]![11]!;
      assert.equal(Math.round((minimum(engine) as number) * 100) / 100, Math.round(full * 0.8 * 100) / 100);
      situation(engine, "établissements portuaires", "B", 0, "50%");
      assert.equal(minimum(engine), spec.grids["établissements portuaires"]!.B![0]! / 2);
    });

    it("reports positions absent from the grid", () => {
      const cases: [string, string][] = [
        ["autres salariés", "AM3"],
        ["autres salariés", "Cadres 4"],
        ["ouvriers dockers CQP", "Cadres 1"],
        ["ouvriers dockers CQP", "AM3"],
        ["établissements portuaires", "Z9"],
        ["établissements portuaires", "non renseigné"],
        ["établissements portuaires", "A"],
      ];
      for (const [grid, classification] of cases) {
        situation(engine, grid, classification, 5);
        assert.equal(outOfGrid(engine), true, `${grid} / ${classification}`);
        assert.equal(minimum(engine), 0);
      }
    });

    it("is inapplicable for another agreement", () => {
      situation(engine, "autres salariés", "B", 0);
      engine.setSituation({ "salarié . convention collective": "'droit commun'" });
      assert.equal(minimum(engine), null);
    });
  });
}

describe("IDCC 3017 — version selection", () => {
  it("keeps one version per date with the full grids", () => {
    const versions = (COMPILED_VERSIONS[agreement] ?? []).map((entry: { version: string; validFrom: string }) => `${entry.version}@${entry.validFrom}`);
    assert.ok(versions.includes("2024.1@2024-01-01"));
    assert.ok(versions.includes("2024.2@2024-01-01"));
    assert.ok(versions.includes("2025.1@2025-01-01"));
    assert.ok(versions.includes("2026.1@2026-01-01"));
  });
});
