import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const models = [
  { name: "0016-transports-routiers", value: "transports routiers", classification: "niveau", input: "'V-O-110'", minimums: { "2026.1": 1884.8 } },
  { name: "0018-industries-textiles", value: "industries textiles", classification: "niveau", input: "'4.2'", minimums: { "2026.1": 1996 } },
  { name: "0029-etablissements-prives-non-lucratifs", value: "établissements privés non lucratifs", classification: "coefficient", input: 477, minimums: { "2026.1": 2178.94 } },
  { name: "0044-industries-chimiques", value: "industries chimiques", classification: "coefficient", input: 250, minimums: { "2026.1": 2244.51 } },
  { name: "0112-industrie-laitiere", value: "industrie laitière", classification: "niveau", input: "'7.2'", minimums: { "2026.1": 2235.92 } },
  { name: "0675-succursales-habillement", value: "succursales habillement", classification: "niveau", input: "'E4'", minimums: { "2026.1": 1900 } },
  { name: "0843-boulangerie-patisserie-artisanale", value: "boulangerie-pâtisserie artisanale", classification: "niveau", input: "'170'", minimums: { "2026.1": 1938.3 } },
  { name: "1147-cabinets-medicaux", value: "cabinets médicaux", classification: "niveau", input: "'8'", minimums: { "2024.1": 2050.62 } },
  { name: "1261-acteurs-lien-social-familial", value: "acteurs du lien social et familial", classification: "points de pesée", input: 100, minimums: { "2026.1": 2375 } },
  { name: "1351-prevention-securite", value: "prévention et sécurité", classification: "coefficient", input: 120, minimums: { "2026.1": 1883.85 } },
  { name: "3242-presse-regions", value: "presse en régions", classification: "niveau", input: "'E5'", minimums: { "2023.1": 1878.55 } },
  { name: "3248-metallurgie", value: "métallurgie", classification: "niveau", input: "'C5'", minimums: { "2026.1": 2042.5 } },
  { name: "3239-particuliers-employeurs-emploi-domicile", value: "particuliers employeurs et emploi à domicile", classification: "niveau", input: "'I'", minimums: { "2026.1": 2194.14 } },
  { name: "2247-courtage-assurances", value: "courtage assurances", classification: "niveau", input: "'D'", minimums: { "2025.1": 2208 } },
  { name: "2264-hospitalisation-privee", value: "hospitalisation privée", classification: "coefficient", input: 300, minimums: { "2023.1": 2178 } },
  { name: "2941-aide-soins-domicile", value: "aide et soins à domicile", classification: "niveau", input: "'TAM.1.1'", minimums: { "2026.1": 2157.98 } },
  { name: "1388-industrie-petrole", value: "industrie pétrole", classification: "coefficient", input: 200, minimums: { "2026.1": 2213.92 } },
  { name: "1411-fabrication-ameublement", value: "fabrication ameublement", classification: "niveau", input: "'AP52'", minimums: { "2026.1": 2117 } },
  { name: "1483-commerce-detail-habillement-textiles", value: "commerce de détail habillement", classification: "niveau", input: "'3'", minimums: { "2026.1": 1843 } },
  { name: "1517-commerce-detail-non-alimentaire", value: "commerce de détail non alimentaire", classification: "niveau", input: "'5'", minimums: { "2026.1": 1967 } },
  { name: "1619-cabinets-dentaires", value: "cabinets dentaires", classification: "niveau", input: "'assistant-dentaire'", minimums: { "2026.1": 2112.76 } },
  { name: "1672-societes-assurances", value: "sociétés assurances", classification: "niveau", input: "'3'", minimums: { "2026.1": 1928.46 } },
  { name: "1686-commerces-services-audiovisuel", value: "audiovisuel électronique équipement ménager", classification: "niveau", input: "'III.2'", minimums: { "2026.1": 2060.98 } },
  { name: "1486-syntec", value: "syntec", classification: "coefficient", input: 355, minimums: { "2025.1": 2045 } },
  { name: "1979-hotels-cafes-restaurants", value: "HCR", classification: "niveau", input: "'II.3'", minimums: { "2024.1": 1997.45 } },
  { name: "1996-pharmacie-officine", value: "pharmacie", classification: "coefficient", input: 470, minimums: { "2025.1": 3717.51, "2026.1": 3762.42 } },
  { name: "2120-banque", value: "banque", classification: "niveau", input: "'E'", minimums: { "2026.1": 1864.62 } },
  { name: "2149-activites-dechet", value: "activités du déchet", classification: "coefficient", input: 125, minimums: { "2026.1": 2362.5 } },
  { name: "2156-grands-magasins", value: "grands magasins", classification: "niveau", input: "'IV.2'", minimums: { "2024.1": 1895 } },
  { name: "2216-commerce-detail-gros-predominance-alimentaire", value: "commerce alimentaire", classification: "niveau", input: "'4B'", minimums: { "2025.1": 2032.03, "2026.1": 2054.33 } },
  { name: "0292-plasturgie", value: "plasturgie", classification: "coefficient", input: 800, minimums: { "2026.1": 2266 } },
  { name: "0413-personnes-handicapees", value: "personnes handicapées et inadaptées", classification: "coefficient", input: 434, minimums: { "2022.1": 1657.88 } },
  { name: "0573-commerces-de-gros", value: "commerces de gros", classification: "niveau", input: "'IV.2'", minimums: { "2026.1": 1953.23 } },
  { name: "1090-services-automobile", value: "services automobile", classification: "niveau", input: "'7'", minimums: { "2026.1": 1999 } },
  { name: "1516-organismes-formation", value: "organismes de formation", classification: "coefficient", input: 240, minimums: { "2025.1": 2463.73, "2027.1": 2513 } },
  { name: "1501-restauration-rapide", value: "restauration rapide", classification: "niveau", input: "'III.B'", minimums: { "2025.1": 1961.05 } },
  { name: "1505-commerce-detail-alimentaire-non-specialise", value: "commerce de détail alimentaire non spécialisé", classification: "niveau", input: "'E4'", minimums: { "2026.1": 1903.28 } },
  { name: "1534-industrie-commerces-gros-viandes", value: "industrie et commerces en gros des viandes", classification: "niveau", input: "'IV.2'", minimums: { "2026.1": 2050 } },
  { name: "1539-bureau-numerique", value: "bureau et numérique", classification: "niveau", input: "'A3'", minimums: { "2025.1": 1875 } },
  { name: "1586-industries-charcutieres", value: "industries charcutières", classification: "coefficient", input: 200, minimums: { "2026.1": 2130.2 } },
] as const;

const lock = JSON.parse(readFileSync(new URL("../rules/versions.lock.json", import.meta.url), "utf8")) as Record<string, string>;

describe("compiled collective agreement models", () => {
  it("exports all released versions with their original hashes and legal references", async () => {
    const keys: string[] = [];
    for (const [name, versions] of Object.entries(COMPILED_VERSIONS)) {
      for (const version of versions) {
        const key = `${name}.${version.version}`;
        keys.push(key);
        const hash = createHash("sha256")
          .update(JSON.stringify({ validFrom: version.validFrom, rules: await version.loadRules() }))
          .digest("hex").slice(0, 16);
        assert.equal(hash, lock[key], key);
        assert.equal(version.contentHash, lock[key], key);
        assert.ok(version.sources.length > 0, key);
      }
    }
    assert.deepEqual(keys.sort(), Object.keys(lock).sort());
  });

  for (const model of models) {
    for (const [versionNumber, minimum] of Object.entries(model.minimums)) {
      it(`${model.name} ${versionNumber} evaluates the sourced minimum with modele-social`, async () => {
        const version = COMPILED_VERSIONS[model.name]?.find((v) => v.version === versionNumber);
        assert.ok(version);
        const extension = await version.loadRules();
        const rules: Record<string, Rule> = { ...modeleSocial };
        const namespace = `salarié . convention collective . ${model.value}`;
        for (const name of Object.keys(extension)) {
          assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
          assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
        }
        const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
        rules["salarié . convention collective"] = {
          ...choice,
          "une possibilité": [...new Set([...choice["une possibilité"], model.value])],
        } as Rule;
        Object.assign(rules, extension);
        const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
        engine.setSituation({
          "salarié . convention collective": `'${model.value}'`,
          [`${namespace} . ${model.classification}`]: model.input,
          "salarié . contrat . statut cadre": "non",
        });
        const amount = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
        assert.equal(typeof amount, "number");
        assert.equal(Math.round((amount as number) * 100) / 100, minimum);
      });
    }
  }
});
