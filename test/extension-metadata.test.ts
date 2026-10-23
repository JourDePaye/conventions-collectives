import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Date from which each version also binds the employers outside a signatory organisation: the
// publication in the Journal officiel of its extension order (effect from publication, unless
// the note says otherwise). A version that is not listed has no extension order published after
// its effective date: its accord was extended by then, or is not extended at all.
const EXTENSIONS: Record<string, Record<string, string>> = {
  "0018-industries-textiles": {
    // accord du 15 janvier 2026, JORFTEXT000053907664 (the accord of the artificial textiles
    // sector, JORF du 19 mars 2026, is extended earlier)
    "2026.2": "2026-04-17",
    "2026.3": "2026-09-04", // accord du 17 juin 2026, JORFTEXT000054794573
  },
  "0158-industries-bois": {
    "2025.1": "2025-05-02", // avenant n° 6, arrêté du 25 avril 2025, JORFTEXT000051540518
    "2026.2": "2026-07-11", // avenant n° 7, arrêté du 7 juillet 2026, JORFTEXT000054415943
  },
  "0275-transport-aerien-personnel-sol": {
    // arrêté du 2 juin 2025, JORF du 27 juin 2025; article 7: a clear day after the publication
    "2025.2": "2025-06-29",
    "2025.3": "2025-06-29",
    "2025.4": "2025-06-29",
  },
  // avenant n° 31, arrêté du 4 mai 2026, JORFTEXT000054048652 (JORF du 8 mai 2026); article 3: first day
  // of the following month
  "0493-vins-cidres-spiritueux": { "2026.2": "2026-06-01" },
  // Arrêtés of 11 December 2023 (JORF 14 December 2023) and 5 February 2026 (JORF 10 February 2026).
  "0787-experts-comptables": { "2024.1": "2023-12-14", "2026.2": "2026-02-10" },
  "1405-expedition-exportation-fruits-legumes": { "2026.2": "2026-05-29" }, // JORFTEXT000054149405
  // accord du 13 mars 2025, arrêté du 27 mai 2025, JORF du 31 mai 2025; the accord of 3 April 2026 (2026.1) is not extended
  "1408-distribution-logistique-energies": { "2025.3": "2025-05-31" },
  "1555-produits-pharmaceutiques": { "2026.1": "2026-05-08" }, // JORF du 8 mai 2026
  "2336-habitat-logement-accompagnes": {
    "2026.2": "2025-12-20", // avenant n° 67, arrêté du 10 décembre 2025
    "2026.3": "2026-07-10", // avenant n° 70, arrêté du 6 juillet 2026
  },
  // avenant n° 4 (journalistes d'agences de presse), arrêté du 12 septembre 2025, JORFTEXT000052260481
  "1480-journalistes": { "2025.2": "2025-09-19" },
  // avenant du 25 février 2026 (paritarisme), arrêté du 3 juillet 2026, JORF du 11 juillet 2026
  "1431-optique-lunetterie-detail": { "2026.1": "2026-07-11" },
  // avenant n° 33, arrêté du 5 novembre 2024, JORF du 9 novembre 2024 (applicable from 1 December 2024)
  "1979-hotels-cafes-restaurants": { "2024.2": "2024-11-09", "2026.1": "2026-10-15" },
  // avenant du 21 juillet 2025, arrêté du 17 février 2026, JORF du 24 février 2026
  "3090-spectacle-vivant-prive": { "2025.3": "2026-02-24", "2025.4": "2026-02-24" },
  // The shared building version: each regional grid applies from the publication of its own
  // extension order (in its rules), and it has no grid of the cadres, whose accord of 2026 is not
  // extended.
  "1596-batiment-ouvriers-petites-entreprises": { "2026.4": "2020-01-01", "2026.5": "2020-01-01", "2026.6": "2020-01-01", "2026.7": "2020-01-01" },
  "1597-batiment-ouvriers-plus-de-10": { "2026.4": "2020-01-01", "2026.5": "2020-01-01", "2026.6": "2020-01-01", "2026.7": "2020-01-01" },
  "2420-batiment-cadres": { "2026.4": "2020-01-01", "2026.5": "2020-01-01", "2026.6": "2020-01-01", "2026.7": "2020-01-01" },
  "2609-batiment-etam": { "2026.4": "2020-01-01", "2026.5": "2020-01-01", "2026.6": "2020-01-01", "2026.7": "2020-01-01" },
  // 2332: every territorial accord applies from the month after the publication of its own
  // extension order, in its rules.
  "2332-entreprises-architecture": { "2026.2": "2026-01-01" },
  // 3241: the accord of 15 December 2023, extended in 2024, then the accord of 11 May 2026, from
  // 1 June 2026 for a member and from its extension order (JORF of 24 July 2026) for the others.
  "3241-telediffusion": { "2026.3": "2026-01-01", "2026.4": "2026-07-24" },
  // 3213: the version starts in 2026 and the grid applies from the effective date of its
  // extended accord (11 July 2026), in its rules.
  "3213-economistes-construction": { "2026.2": "2026-01-01" },
  // The shared public works version: each regional grid applies from the publication of its own
  // extension order (in its rules).
  "1702-travaux-publics-ouvriers": { "2026.4": "2026-01-01", "2026.5": "2026-01-01", "2026.6": "2026-01-01" },
  "2614-travaux-publics-etam": { "2026.4": "2026-01-01", "2026.5": "2026-01-01", "2026.6": "2026-01-01" },
  "3212-travaux-publics-cadres": { "2026.4": "2026-01-01", "2026.5": "2026-01-01", "2026.6": "2026-01-01" },
  "1671-maisons-etudiants": {
    "2025.1": "2025-04-09", // avenant n° 73, JORF du 9 avril 2025
    "2026.2": "2026-07-11", // avenants n° 74 and 75, JORF du 11 juillet 2026
    "2026.3": "2026-10-03", // avenant n° 76, JORF du 3 octobre 2026
  },
  "1987-pates-alimentaires-seches": {
    "2024.3": "2024-06-01", // arrêté du 21 mai 2024, JORFTEXT000049630689
    "2026.3": "2026-05-29", // arrêté du 20 mai 2026, JORFTEXT000054149468
  },
  "2335-agences-generales-assurances": {
    "2025.1": "2025-05-10", // avenant n° 5, JORFTEXT000051576272
    "2026.1": "2026-03-19", // avenant n° 6, JORF du 19 mars 2026
    "2026.2": "2026-09-19", // avenant n° 7, JORFTEXT000054860951
  },
  "2728-sucreries": { "2026.2": "2026-06-27" },
  "3221-agences-presse": { "2026.2": "2026-09-04" },
  // accords du 2 et du 30 juin 2023, arrêté du 22 septembre 2025, JORFTEXT000052353580 (JORF du
  // 4 octobre 2025); articles 8 and 9: first day of the following month
  "3242-presse-regions": { "2023.3": "2025-11-01", "2023.4": "2025-11-01", "2023.5": "2025-11-01" },
  // Declared on 23 October 2026: versions effective before the publication of their accord's
  // extension order (the text holding their grid, cited in their sources), which bind the
  // employers outside a signatory organisation from that publication only.
  "0043-import-export": { "2026.1": "2026-05-10" },
  "0044-industries-chimiques": { "2025.1": "2025-03-18", "2026.1": "2026-02-24", "2026.2": "2026-02-24", "2026.4": "2026-02-24" },
  "0112-industrie-laitiere": { "2026.1": "2026-05-10", "2026.2": "2026-05-10" },
  "0176-industrie-pharmaceutique": { "2026.1": "2026-02-24", "2026.2": "2026-02-24" },
  "0200-exploitations-frigorifiques": { "2026.1": "2026-07-09" },
  "0247-industries-habillement": { "2026.1": "2026-05-08", "2026.2": "2026-05-08" },
  "0292-plasturgie": { "2026.1": "2026-10-03" },
  "0454-remontees-mecaniques-domaines-skiables": { "2026.1": "2026-02-18" },
  "0468-commerce-succursaliste-chaussure": { "2025.1": "2025-03-14", "2026.1": "2026-09-19" },
  "0489-industries-cartonnage": { "2025.3": "2025-05-31", "2025.4": "2025-05-31" },
  "0500-commerces-gros-habillement": { "2024.1": "2025-02-14", "2024.2": "2025-02-14" },
  "0669-industries-fabrication-mecanique-verre": { "2025.1": "2025-07-03" },
  "0675-succursales-habillement": { "2026.1": "2026-07-10", "2026.2": "2026-07-10", "2026.3": "2026-07-10" },
  "0759-pompes-funebres": { "2020.4": "2021-02-03", "2020.5": "2021-02-03", "2021.1": "2021-06-04", "2023.1": "2023-04-13", "2024.1": "2024-04-26", "2025.1": "2025-03-29", "2026.1": "2026-04-10" },
  "0897-services-prevention-sante-travail-interentreprises": { "2026.1": "2026-05-10", "2026.2": "2026-05-10" },
  "0959-laboratoires-biologie-medicale": { "2024.1": "2024-04-18", "2026.1": "2026-09-19" },
  "1000-cabinets-avocats": { "2025.1": "2025-04-26" },
  "1077-negoce-produits-du-sol-engrais": { "2025.1": "2025-06-12" },
  "1147-cabinets-medicaux": { "2024.1": "2024-06-01", "2024.2": "2024-06-01" },
  "1182-ports-plaisance": { "2025.1": "2025-10-15" },
  "1267-patisserie": { "2025.1": "2025-04-26", "2026.1": "2026-04-17" },
  "1307-exploitation-cinematographique": { "2025.1": "2025-06-07" },
  "1316-tourisme-social-familial": { "2026.1": "2026-02-24" },
  "1388-industrie-petrole": { "2026.1": "2026-02-05", "2026.2": "2026-02-05" },
  "1396-industries-produits-alimentaires-elabores": { "2026.1": "2026-04-17" },
  "1404-maintenance-distribution-location": { "2026.1": "2026-05-29" },
  "1411-fabrication-ameublement": { "2026.1": "2026-09-04", "2026.2": "2026-09-04" },
  "1412-installation-aeraulique-thermique-frigorifique": { "2026.1": "2026-06-27", "2026.2": "2026-06-27" },
  "1413-travail-temporaire": { "2026.1": "2026-05-10" },
  "1487-commerce-detail-horlogerie-bijouterie": { "2026.1": "2026-02-24" },
  "1499-miroiterie": { "2025.1": "2025-06-19", "2025.2": "2025-06-19", "2026.1": "2026-05-29" },
  "1501-restauration-rapide": { "2025.1": "2025-08-07", "2026.2": "2026-06-03" },
  "1513-eaux-embouteillees-boissons-bieres": { "2026.1": "2026-04-17" },
  "1527-immobilier": { "2026.1": "2026-09-19", "2026.2": "2026-09-19" },
  "1534-industrie-commerces-gros-viandes": { "2026.1": "2026-06-06" },
  "1536-distributeurs-conseils-hors-domicile": { "2026.1": "2026-05-29" },
  "1543-boyauderie": { "2026.1": "2026-04-17" },
  "1557-commerce-articles-sports-loisirs": { "2025.1": "2025-05-24", "2025.2": "2025-05-24" },
  "1558-industries-ceramiques": { "2025.1": "2025-04-26", "2025.2": "2025-04-26", "2026.1": "2026-05-29" },
  "1561-cordonnerie-multiservice": { "2026.1": "2026-05-10" },
  "1580-industrie-chaussure": { "2026.1": "2026-06-27", "2026.2": "2026-06-27" },
  "1586-industries-charcutieres": { "2026.1": "2026-04-17", "2026.2": "2026-04-17" },
  "1607-jeux-jouets": { "2026.1": "2026-05-29", "2026.3": "2026-05-29" },
  "1619-cabinets-dentaires": { "2026.1": "2026-07-23" },
  "1621-repartition-pharmaceutique": { "2025.1": "2025-07-05", "2025.2": "2025-07-05" },
  // avenant n° 51, arrêté du 20 mai 2026, JORFTEXT000054219138 (JORF du 9 juin 2026)
  "1512-promotion-immobiliere": { "2026.1": "2026-06-09", "2026.2": "2026-06-09", "2026.3": "2026-06-09", "2026.4": "2026-06-09", "2026.5": "2026-06-09" },
  "1659-rouissage-teillage-lin": { "2024.1": "2024-07-17", "2025.1": "2025-07-16" },
  "1790-espaces-loisirs": { "2026.1": "2026-07-10", "2026.2": "2026-07-10", "2026.3": "2026-07-10" },
  "1821-cristal-verre-vitrail": { "2026.1": "2026-06-27", "2026.2": "2026-06-27", "2026.3": "2026-06-27" },
  "1875-cabinets-cliniques-veterinaires": { "2026.1": "2026-04-17" },
  "1880-commerce-ameublement": { "2026.1": "2026-06-27" },
  "1909-organismes-tourisme": { "2026.1": "2026-04-17", "2026.2": "2026-04-17", "2026.3": "2026-04-17" },
  "1930-transformation-grains": { "2026.1": "2026-05-10" },
  "1938-industries-transformation-volailles": { "2025.1": "2025-04-26", "2026.1": "2026-04-17" },
  "1951-expertises-automobile": { "2025.1": "2025-09-10" },
  "2002-blanchisserie-teinturerie": { "2025.1": "2025-05-24", "2026.1": "2026-05-10" },
  "2021-golf": { "2026.1": "2026-04-17", "2026.2": "2026-04-17" },
  "2120-banque": { "2026.1": "2026-06-27" },
  "2121-edition": { "2026.1": "2026-09-19", "2026.2": "2026-09-19" },
  "2147-services-eau-assainissement": { "2025.1": "2025-09-10" },
  "2150-personnels-hlm": { "2026.1": "2026-04-17" },
  "2156-grands-magasins": { "2024.1": "2024-07-06", "2026.1": "2024-07-06" },
  "2198-commerce-distance": { "2026.1": "2026-05-10" },
  "2219-taxis": { "2025.1": "2025-10-15", "2025.2": "2025-10-15" },
  "2247-courtage-assurances": { "2025.1": "2025-09-04", "2026.2": "2025-09-04" },
  "2264-hospitalisation-privee": { "2023.1": "2023-02-21", "2023.3": "2023-02-21" },
  "2272-assainissement-maintenance-industrielle": { "2026.1": "2026-05-16", "2026.2": "2026-05-16" },
  "2528-maroquinerie": { "2026.1": "2026-05-08" },
  "2583-societes-autoroutes": { "2024.2": "2024-09-12", "2025.1": "2026-01-17" },
  "2941-aide-soins-domicile": { "2026.1": "2026-07-23" },
  "2972-navigation-personnel-sedentaire": { "2026.1": "2026-07-23" },
  "3017-ports-manutention": { "2024.1": "2024-05-31", "2024.2": "2024-05-31", "2025.1": "2025-10-30", "2026.1": "2026-03-05" },
  "3109-industries-alimentaires-diverses": { "2026.1": "2026-04-17" },
  "3205-cooperatives-consommateurs": { "2026.1": "2026-05-10", "2026.2": "2026-07-10", "2026.3": "2026-09-19" },
  "3216-negoce-materiaux-construction": { "2026.1": "2026-05-10" },
  "3217-branche-ferroviaire": { "2025.1": "2025-06-11", "2026.1": "2026-03-20" },
  "3220-offices-publics-habitat": { "2026.1": "2026-04-17" },
  "3222-menuiseries-charpentes-portes-planes": { "2026.1": "2026-07-10" },
  "3223-personnels-navigants-officiers": { "2025.1": "2026-04-17" },
  "3224-distribution-commerce-gros-papiers-cartons": { "2025.1": "2025-08-01" },
  "3228-groupement-armateurs-passages-eau": { "2022.1": "2022-08-03", "2022.2": "2022-08-03", "2024.1": "2025-04-16", "2025.1": "2025-12-18", "2026.1": "2026-10-13" },
  "3229-navigation-interieure": { "2026.1": "2026-05-29", "2026.2": "2026-05-29" },
  "3230-presse-information-specialisee": { "2024.1": "2024-01-24", "2025.1": "2026-01-17" },
  "3233-industrie-fabrication-ciments": { "2026.2": "2026-07-09" },
  "3236-industrie-services-nautiques": { "2025.1": "2025-07-02", "2025.2": "2025-07-02" },
  "3238-production-transformation-papiers-cartons": { "2026.1": "2026-05-08", "2026.2": "2026-05-08" },
  "3245-operateurs-voyages-guides": { "2025.1": "2025-04-24" },
  "3248-metallurgie": { "2026.1": "2026-06-05", "2026.2": "2026-06-05", "2026.3": "2026-06-05" },
  "3251-bijouterie-joaillerie-horlogerie": { "2025.1": "2025-09-19" },
  "3255-boulangerie-industrielle": { "2026.1": "2026-04-17" },
  "3256-etablissements-soins-veterinaires": { "2026.1": "2026-04-17" },
};

// Agreements whose latest accord is in force but not extended (as of October 2026).
const NOT_EXTENDED = [
  "0478-societes-financieres",
  "1672-societes-assurances",
  "2205-notariat",
  "2931-activites-marches-financiers",
  "3203-structures-associatives-peche",
];

describe("extension of the accords to the employers outside a signatory organisation", () => {
  for (const [model, versions] of Object.entries(EXTENSIONS)) {
    for (const [version, extension] of Object.entries(versions)) {
      it(`${model}.${version} binds non-members from ${extension}`, () => {
        const found = COMPILED_VERSIONS[model]?.find((entry) => entry.version === version);
        assert.ok(found, `${model}.${version}`);
        assert.equal(found.extension, extension);
      });
    }
  }

  for (const model of NOT_EXTENDED) {
    it(`${model} has no extension order`, () => {
      const versions = COMPILED_VERSIONS[model];
      assert.ok(versions && versions.length > 0, model);
      for (const version of versions) assert.equal(version.extension, undefined, version.version);
    });
  }

  it("only the versions above declare an extension", () => {
    const declared = Object.entries(COMPILED_VERSIONS).flatMap(([model, versions]) =>
      versions.filter((v) => v.extension !== undefined).map((v) => `${model}.${v.version}`),
    );
    const expected = Object.entries(EXTENSIONS).flatMap(([model, versions]) =>
      Object.keys(versions).map((version) => `${model}.${version}`),
    );
    assert.deepEqual(declared.sort(), expected.sort());
  });
});
