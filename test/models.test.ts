import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const models = [
  { name: "0016-transports-routiers", value: "transports routiers", classification: "niveau", input: "'V-O-110'", minimums: { "2026.1": 1884.8 } },
  { name: "3233-industrie-fabrication-ciments", value: "industrie de la fabrication des ciments", classification: "coefficient", input: 205, minimums: { "2026.1": 1993 }, situation: { "salarié . convention collective . industrie de la fabrication des ciments . catégorie": "'ouvriers et ETAM'" } },
  { name: "3238-production-transformation-papiers-cartons", value: "production transformation papiers cartons", classification: "coefficient", input: 185, minimums: { "2026.1": 1985 } },
  { name: "0018-industries-textiles", value: "industries textiles", classification: "niveau", input: "'4.2'", minimums: { "2026.1": 1996 } },
  { name: "0029-etablissements-prives-non-lucratifs", value: "établissements privés non lucratifs", classification: "coefficient", input: 477, minimums: { "2026.1": 2178.94 } },
  { name: "0043-import-export", value: "import-export", classification: "coefficient", input: "'C16'", minimums: { "2026.1": 3564 } },
  { name: "0478-societes-financieres", value: "sociétés financières", classification: "coefficient", input: 230, minimums: { "2026.1": 22381 }, minimumRule: "salaire minimum annuel conventionnel", situation: { "salarié . convention collective . sociétés financières . date de calcul": "01/06/2026", "salarié . convention collective . sociétés financières . champ juridique": "'employeur signataire ou adhérent'" } },
  { name: "0044-industries-chimiques", value: "industries chimiques", classification: "coefficient", input: 250, minimums: { "2026.2": 2244.51 } },
  { name: "0112-industrie-laitiere", value: "industrie laitière", classification: "niveau", input: "'7.2'", minimums: { "2026.1": 2235.92, "2026.2": 2235.92 } },
  { name: "0675-succursales-habillement", value: "succursales habillement", classification: "niveau", input: "'E4'", minimums: { "2026.1": 1900 } },
  { name: "0733-detaillants-chaussures", value: "détaillants chaussures", classification: "niveau", input: 3, minimums: { "2026.1": 1869 } },
  { name: "0843-boulangerie-patisserie-artisanale", value: "boulangerie-pâtisserie artisanale", classification: "niveau", input: "'170'", minimums: { "2026.1": 1938.3 } },
  { name: "1147-cabinets-medicaux", value: "cabinets médicaux", classification: "niveau", input: "'8'", minimums: { "2024.1": 2050.62 } },
  { name: "1266-restauration-collective", value: "restauration collective", classification: "niveau", input: "'III'", minimums: { "2025.1": 1835.17 } },
  { name: "1261-acteurs-lien-social-familial", value: "acteurs du lien social et familial", classification: "points de pesée", input: 100, minimums: { "2026.1": 2375 } },
  { name: "1351-prevention-securite", value: "prévention et sécurité", classification: "coefficient", input: 120, minimums: { "2026.1": 1883.85 } },
  { name: "3242-presse-regions", value: "presse en régions", classification: "niveau", input: "'E5'", minimums: { "2023.1": 1878.55 } },
  { name: "3248-metallurgie", value: "métallurgie", classification: "niveau", input: "'C5'", minimums: { "2026.1": 2042.5 } },
  { name: "3239-particuliers-employeurs-emploi-domicile", value: "particuliers employeurs et emploi à domicile", classification: "niveau", input: "'I'", minimums: { "2026.1": 2194.14 } },
  { name: "3241-telediffusion", value: "télédiffusion", classification: "niveau", input: "'5-1'", minimums: { "2026.1": 180.16 }, minimumRule: "salaire minimum journalier" },
  { name: "3205-cooperatives-consommateurs", value: "coopératives de consommateurs", classification: "niveau", input: "'8'", minimums: { "2026.1": 2134.86 } },
  { name: "2247-courtage-assurances", value: "courtage assurances", classification: "niveau", input: "'D'", minimums: { "2025.1": 2208 } },
  { name: "2335-agences-generales-assurances", value: "agences générales assurances", classification: "classe", input: "'1'", minimums: { "2026.1": 23194 }, minimumRule: "salaire minimum annuel conventionnel", situation: { "salarié . convention collective . agences générales assurances . date de calcul": "11/10/2026", "salarié . convention collective . agences générales assurances . champ juridique": "'tous employeurs après extension'" } },
  { name: "1747-boulangerie-industrielle", value: "boulangerie industrielle 1747", classification: "niveau", input: "'L3'", minimums: { "2025.1": 4578.52 } },
  { name: "1760-jardineries-graineteries", value: "jardineries graineteries", classification: "classification", input: "'4.2'", minimums: { "2026.1": 1980 } },
  { name: "3255-boulangerie-industrielle", value: "boulangerie industrielle", classification: "niveau", input: "'E3'", minimums: { "2025.1": 2074.18 } },
  { name: "2264-hospitalisation-privee", value: "hospitalisation privée", classification: "coefficient", input: 300, minimums: { "2023.1": 2178 } },
  { name: "2511-sport", value: "sport", classification: "groupe", input: "'3'", minimums: { "2026.1": 1997.87 } },
  { name: "1512-promotion-immobiliere", value: "promotion immobilière", classification: "coefficient", input: 100, minimums: { "2026.1": 1885 } },
  { name: "1513-papeterie-librairie", value: "papeterie fournitures bureau bureautique informatique librairie", classification: "coefficient", input: "'6'", minimums: { "2026.1": 1830 } },
  { name: "1536-distributeurs-conseils-hors-domicile", value: "distributeurs conseils hors domicile", classification: "classification", input: "'III.2'", minimums: { "2026.1": 2024 } },
  { name: "2728-sucreries", value: "sucreries", classification: "classe", input: "'1A'", minimums: { "2026.1": 23005.08 }, minimumRule: "salaire minimum annuel conventionnel", situation: { "salarié . convention collective . sucreries . date de calcul": "11/10/2026", "salarié . convention collective . sucreries . champ juridique": "'tous employeurs après extension'" } },
  { name: "1607-jeux-jouets", value: "jeux jouets articles fêtes ornements noël puériculture voitures enfants modélisme", classification: "coefficient", input: 200, minimums: { "2026.1": 2154 } },
  { name: "2596-coiffure", value: "coiffure", classification: "niveau", input: "'T2.1'", minimums: { "2026.1": 1869 } },
  { name: "2941-aide-soins-domicile", value: "aide et soins à domicile", classification: "niveau", input: "'TAM.1.1'", minimums: { "2026.1": 2157.98 } },
  { name: "3043-entreprises-proprete", value: "propreté", classification: "niveau", input: "'ASP-A'", minimums: { "2026.1": 1898.91 } },
  { name: "3127-services-personne", value: "services à la personne", classification: "emploi-repère", input: "'jardinage'", minimums: { "2024.1": 1771.51 } },
  { name: "2098-prestataires-tertiaire", value: "prestataires tertiaires", classification: "coefficient", input: 120, minimums: { "2026.1": 1823.03 } },
  { name: "1388-industrie-petrole", value: "industrie pétrole", classification: "coefficient", input: 200, minimums: { "2026.1": 2213.92, "2026.2": 2213.92 } },
  { name: "1411-fabrication-ameublement", value: "fabrication ameublement", classification: "niveau", input: "'AP52'", minimums: { "2026.1": 2117 } },
  { name: "1404-maintenance-distribution-location", value: "maintenance distribution location", classification: "niveau", input: "'B40'", minimums: { "2026.1": 2509.2 } },
  { name: "1405-expedition-exportation-fruits-legumes", value: "expédition exportation fruits légumes", classification: "niveau", input: "'III'", minimums: { "2026.1": 1876.24 }, situation: { "salarié . convention collective . expédition exportation fruits légumes . secteur": "'fruits et légumes'" } },
  { name: "1483-commerce-detail-habillement-textiles", value: "commerce de détail habillement", classification: "niveau", input: "'3'", minimums: { "2026.1": 1843 } },
  { name: "1517-commerce-detail-non-alimentaire", value: "commerce de détail non alimentaire", classification: "niveau", input: "'5'", minimums: { "2026.1": 1967 } },
  { name: "1619-cabinets-dentaires", value: "cabinets dentaires", classification: "niveau", input: "'assistant-dentaire'", minimums: { "2026.1": 2112.76 } },
  { name: "0993-prothesistes-dentaires", value: "prothésistes dentaires", classification: "niveau", input: "'PHQ1'", minimums: { "2026.1": 2293 } },
  { name: "1672-societes-assurances", value: "sociétés assurances", classification: "niveau", input: "'3'", minimums: { "2026.1": 1928.46 } },
  { name: "1686-commerces-services-audiovisuel", value: "audiovisuel électronique équipement ménager", classification: "niveau", input: "'III.2'", minimums: { "2026.1": 2060.98 } },
  { name: "1702-travaux-publics-ouvriers", value: "travaux publics ouvriers", classification: "coefficient", input: 100, minimums: { "2026.1": 23863 }, minimumRule: "minimum annuel", situation: { "salarié . convention collective . travaux publics ouvriers . catégorie": "'ouvrier'", "salarié . convention collective . travaux publics ouvriers . région": "'Bretagne'", "salarié . convention collective . travaux publics ouvriers . date de calcul": "11/10/2026" } },
  { name: "1486-syntec", value: "syntec", classification: "coefficient", input: 355, minimums: { "2025.1": 2045, "2026.1": 2045 } },
  { name: "1979-hotels-cafes-restaurants", value: "HCR", classification: "niveau", input: "'II.3'", minimums: { "2024.1": 1997.45 } },
  { name: "1978-fleuristes-animaux", value: "fleuristes animaux", classification: "niveau", input: "'V.2'", minimums: { "2026.1": 2274.30 } },
  { name: "1996-pharmacie-officine", value: "pharmacie", classification: "coefficient", input: 470, minimums: { "2025.1": 3717.51, "2026.1": 3762.42 } },
  { name: "2021-golf", value: "golf", classification: "groupe", input: "'3'", minimums: { "2026.1": 1975.06 } },
  { name: "2120-banque", value: "banque", classification: "niveau", input: "'E'", minimums: { "2026.1": 1864.62 } },
  { name: "2121-edition", value: "édition", classification: "niveau", input: "'C3A'", minimums: { "2026.1": 2964 } },
  { name: "2148-telecommunications", value: "télécommunications", classification: "niveau", input: "'A.1'", minimums: { "2026.1": 22757 }, minimumRule: "minimum annuel", situation: { "salarié . convention collective . télécommunications . date de calcul": "11/10/2026" } },
  { name: "2149-activites-dechet", value: "activités du déchet", classification: "coefficient", input: 125, minimums: { "2026.1": 2362.5 } },
  { name: "2156-grands-magasins", value: "grands magasins", classification: "niveau", input: "'IV.2'", minimums: { "2024.1": 1895 } },
  { name: "2216-commerce-detail-gros-predominance-alimentaire", value: "commerce alimentaire", classification: "niveau", input: "'4B'", minimums: { "2025.1": 2032.03, "2026.1": 2054.33 } },
  { name: "3237-commerce-detail-alimentaire-specialise", value: "commerce de détail alimentaire spécialisé", classification: "niveau", input: "'E4'", minimums: { "2026.1": 1906.35 } },
  { name: "3109-industries-alimentaires-diverses", value: "industries alimentaires diverses", classification: "position", input: "'N8-E2'", minimums: { "2026.1": 4248.03 } },
  { name: "0292-plasturgie", value: "plasturgie", classification: "coefficient", input: 800, minimums: { "2026.1": 2266 } },
  { name: "0413-personnes-handicapees", value: "personnes handicapées et inadaptées", classification: "coefficient", input: 434, minimums: { "2026.1": 1810.57 } },
  { name: "0573-commerces-de-gros", value: "commerces de gros", classification: "niveau", input: "'IV.2'", minimums: { "2026.1": 1953.23 } },
  { name: "1396-industries-produits-alimentaires-elabores", value: "industries de produits alimentaires élaborés", classification: "coefficient", input: 225, minimums: { "2026.1": 2206.80 } },
  { name: "1413-travail-temporaire", value: "travail temporaire", classification: "niveau", input: "'H'", minimums: { "2026.1": 2948 } },
  { name: "1090-services-automobile", value: "services automobile", classification: "niveau", input: "'7'", minimums: { "2026.1": 1999 } },
  { name: "1516-organismes-formation", value: "organismes de formation", classification: "coefficient", input: 240, minimums: { "2025.1": 2463.73, "2027.1": 2513 } },
  { name: "1501-restauration-rapide", value: "restauration rapide", classification: "niveau", input: "'III.B'", minimums: { "2025.1": 1961.05 } },
  { name: "1505-commerce-detail-alimentaire-non-specialise", value: "commerce de détail alimentaire non spécialisé", classification: "niveau", input: "'E4'", minimums: { "2026.1": 1903.28 } },
  { name: "0247-industries-habillement", value: "industries habillement", classification: "niveau", input: "'I.1'", minimums: { "2026.2": 1833 }, situation: { "salarié . convention collective . industries habillement . annexe": "'ouvriers'" } },
  { name: "1534-industrie-commerces-gros-viandes", value: "industrie et commerces en gros des viandes", classification: "niveau", input: "'IV.2'", minimums: { "2026.1": 2050 } },
  { name: "1930-transformation-grains", value: "métiers de la transformation des grains", classification: "niveau", input: "'VI.1'", minimums: { "2026.1": 2608.23 } },
  { name: "1938-industries-transformation-volailles", value: "industries de la transformation des volailles", classification: "coefficient", input: 400, minimums: { "2025.1": 3268.01 } },
  { name: "1539-bureau-numerique", value: "bureau et numérique", classification: "niveau", input: "'A3'", minimums: { "2025.1": 1875 } },
  { name: "1555-produits-pharmaceutiques", value: "produits pharmaceutiques", classification: "niveau", input: "'II.1'", minimums: { "2026.1": 2121.77 }, situation: { "salarié . convention collective . produits pharmaceutiques . date de calcul": "11/10/2026", "salarié . convention collective . produits pharmaceutiques . champ juridique": "'tous employeurs après extension'" } },
  { name: "1586-industries-charcutieres", value: "industries charcutières", classification: "coefficient", input: 200, minimums: { "2026.1": 2130.2 } },
  { name: "1821-cristal-verre-vitrail", value: "cristal verre vitrail", classification: "coefficient", input: 245, minimums: { "2026.1": 2185.59 } },
  { name: "1580-industrie-chaussure", value: "industrie chaussure", classification: "classification", input: "'2.2'", minimums: { "2026.1": 1886 } },
  { name: "1596-batiment-ouvriers-petites-entreprises", value: "bâtiment ouvriers petites entreprises", classification: "coefficient", input: 150, minimums: { "2026.1": 1823 }, minimumRule: "salaire minimum conventionnel", situation: { "salarié . convention collective . bâtiment ouvriers petites entreprises . catégorie": "'ouvrier'", "salarié . convention collective . bâtiment ouvriers petites entreprises . région": "'Centre-Val de Loire'", "salarié . convention collective . bâtiment ouvriers petites entreprises . date de calcul": "01/05/2026" } },
  { name: "1597-batiment-ouvriers-plus-de-10", value: "bâtiment ouvriers plus de 10 salariés", classification: "coefficient", input: 150, minimums: { "2026.1": 1838.24 }, minimumRule: "salaire minimum conventionnel", situation: { "salarié . convention collective . bâtiment ouvriers plus de 10 salariés . catégorie": "'ouvrier'", "salarié . convention collective . bâtiment ouvriers plus de 10 salariés . région": "'Nouvelle-Aquitaine'", "salarié . convention collective . bâtiment ouvriers plus de 10 salariés . date de calcul": "01/01/2026" } },
  { name: "2609-batiment-etam", value: "bâtiment ETAM", classification: "niveau", input: "'A'", minimums: { "2026.1": 1827.10 }, minimumRule: "salaire minimum conventionnel", situation: { "salarié . convention collective . bâtiment ETAM . catégorie": "'ETAM'", "salarié . convention collective . bâtiment ETAM . région": "'Corse'", "salarié . convention collective . bâtiment ETAM . date de calcul": "01/04/2026" } },
  { name: "2420-batiment-cadres", value: "bâtiment cadres", classification: "coefficient", input: 60, minimums: { "2026.1": 2356 }, minimumRule: "salaire minimum conventionnel", situation: { "salarié . convention collective . bâtiment cadres . date de calcul": "01/02/2026", "salarié . convention collective . bâtiment cadres . champ juridique": "'employeur signataire ou adhérent'", "salarié . contrat . statut cadre": "oui" } },
  { name: "3212-travaux-publics-cadres", value: "travaux publics cadres", classification: "position", input: "'A1'", minimums: { "2024.1": 33257 }, minimumRule: "salaire minimum annuel conventionnel", situation: { "salarié . convention collective . travaux publics cadres . date de calcul": "01/01/2024" } },
  { name: "0787-experts-comptables", value: "experts-comptables", classification: "coefficient", input: 180, minimums: { "2026.1": 22850.16 }, minimumRule: "minimum annuel", situation: { "salarié . convention collective . experts-comptables . indice 40 ordre validé": "non" } },
  { name: "0086-publicite", value: "publicité", classification: "niveau", input: "'4'", minimums: { "2025.3": 1957 }, situation: { "salarié . convention collective . publicité . catégorie": "'employés'" } },
  { name: "0184-imprimeries", value: "imprimeries de labeur et industries graphiques", classification: "groupe et échelon", input: "'IIIA'", minimums: { "2026.1": 2369 } },
  { name: "1431-optique-lunetterie-detail", value: "optique-lunetterie de détail", classification: "coefficient", input: "'K'", minimums: { "2024.1": 3700 }, situation: { "salarié . convention collective . optique-lunetterie de détail . classification": "'nouvelle'" } },
  { name: "3090-spectacle-vivant-prive", value: "spectacle vivant privé", classification: "catégorie administrative", input: "'cadres groupe 1'", minimums: { "2025.1": 3578.18 }, situation: { "salarié . convention collective . spectacle vivant privé . échelon": "'1'" } },
  { name: "3221-agences-presse", value: "agences de presse", classification: "groupe", input: "'1'", minimums: { "2026.1": 1873.86 }, minimumRule: "salaire minimum conventionnel", situation: { "salarié . convention collective . agences de presse . date de calcul": "11/10/2026", "salarié . convention collective . agences de presse . champ juridique": "'tous employeurs après extension'" } },
  { name: "1909-organismes-tourisme", value: "organismes de tourisme", classification: "niveau", input: "'3.3'", minimums: { "2026.1": 4281.53 }, minimumRule: "salaire minimum conventionnel", situation: { "salarié . convention collective . organismes de tourisme . date de calcul": "11/10/2026" } },
  { name: "1316-tourisme-social-familial", value: "tourisme social et familial", classification: "niveau", input: "'G'", minimums: { "2026.1": 3294.5 }, situation: { "salarié . convention collective . tourisme social et familial . date de calcul": "01/05/2026" } },
  { name: "1611-logistique-communication-ecrite-directe", value: "logistique communication écrite directe", classification: "groupe", input: "'III-A'", minimums: { "2026.1": 2501.05 } },
  { name: "0493-vins-cidres-spiritueux", value: "vins cidres spiritueux", classification: "position", input: "'5A'", minimums: { "2026.1": 2233 } },
  { name: "1631-hotellerie-plein-air", value: "hôtellerie de plein air", classification: "coefficient", input: 300, minimums: { "2024.1": 2203.92 } },
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
          const sportStructuralOverrides = new Set([
            `${namespace} . cotisations . prévoyance`,
            `${namespace} . cotisations . formation professionnelle`,
            `${namespace} . cotisations . assiette forfaitaire`,
            `${namespace} . exonération cotisation AT`,
          ]);
          // Only Sport 2026.1 may remove obsolete structural declarations.
          const allowed = model.name === "2511-sport" && versionNumber === "2026.1" && sportStructuralOverrides.has(name);
          assert.ok(!(name in rules) || allowed, `Duplicate modele-social rule: ${name}`);
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
          ...(model.name === "0112-industrie-laitiere" && versionNumber === "2026.2"
            ? { [`${namespace} . forfait annuel`]: "non" }
            : {}),
          ...("situation" in model ? model.situation : {}),
        });
        const minimumRule = "minimumRule" in model ? model.minimumRule : "salaire minimum conventionnel";
        const amount = engine.evaluate(`${namespace} . ${minimumRule}`).nodeValue;
        assert.equal(typeof amount, "number");
        assert.equal(Math.round((amount as number) * 100) / 100, minimum);
      });
    }
  }
});
