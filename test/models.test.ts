import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const models = [
  { name: "1000-cabinets-avocats", value: "cabinets d'avocats", classification: "coefficient", input: 300, minimums: { "2025.1": 2390 } },
  { name: "3032-esthetique-cosmetique", value: "esthétique cosmétique", classification: "classification", input: "'250'", minimums: { "2026.1": 2300 }, situation: { "salarié . convention collective . esthétique cosmétique . secteur": "'instituts de beauté et services généraux'" } },
  { name: "0016-transports-routiers", value: "transports routiers", classification: "niveau", input: "'V-O-110'", minimums: { "2026.1": 1884.8 } },
  { name: "0200-exploitations-frigorifiques", value: "exploitations frigorifiques", classification: "coefficient", input: 1, minimums: { "2026.1": 1850.19 } },
  { name: "3233-industrie-fabrication-ciments", value: "industrie de la fabrication des ciments", classification: "coefficient", input: 205, minimums: { "2026.1": 1993 }, situation: { "salarié . convention collective . industrie de la fabrication des ciments . catégorie": "'ouvriers et ETAM'" } },
  { name: "3238-production-transformation-papiers-cartons", value: "production transformation papiers cartons", classification: "coefficient", input: 185, minimums: { "2026.2": 22779 }, minimumRule: "salaire minimum annuel conventionnel" },
  { name: "0018-industries-textiles", value: "industries textiles", classification: "niveau", input: "'4.2'", minimums: { "2026.1": 1996 } },
  { name: "0029-etablissements-prives-non-lucratifs", value: "établissements privés non lucratifs", classification: "coefficient", input: 477, minimums: { "2026.1": 2178.94 } },
  { name: "0043-import-export", value: "import-export", classification: "coefficient", input: "'C16'", minimums: { "2026.1": 3564 } },
  { name: "0478-societes-financieres", value: "sociétés financières", classification: "coefficient", input: 230, minimums: { "2026.1": 22381 }, minimumRule: "salaire minimum annuel conventionnel", situation: { "salarié . convention collective . sociétés financières . date de calcul": "01/06/2026", "salarié . convention collective . sociétés financières . champ juridique": "'employeur signataire ou adhérent'" } },
  { name: "0044-industries-chimiques", value: "industries chimiques", classification: "coefficient", input: 250, minimums: { "2026.2": 2244.51 } },
  { name: "0045-caoutchouc", value: "caoutchouc", classification: "coefficient", input: 225, minimums: { "2025.1": 1949.84 } },
  { name: "0158-industries-bois", value: "industries du bois", classification: "classification", input: "'ACT 6.1'", minimums: { "2026.1": 2448 }, situation: { "salarié . convention collective . industries du bois . champ juridique": "'employeur signataire ou adhérent'" } },
  { name: "0176-industrie-pharmaceutique", value: "industrie pharmaceutique", classification: "groupe", input: "'6C'", minimums: { "2026.1": 3344.51 } },
  { name: "0112-industrie-laitiere", value: "industrie laitière", classification: "niveau", input: "'7.2'", minimums: { "2026.1": 2235.92, "2026.2": 2235.92 } },
  { name: "0675-succursales-habillement", value: "succursales habillement", classification: "niveau", input: "'E4'", minimums: { "2026.1": 1900 } },
  { name: "0733-detaillants-chaussures", value: "détaillants chaussures", classification: "niveau", input: 3, minimums: { "2026.1": 1869 } },
  { name: "0759-pompes-funebres", value: "pompes funèbres", classification: "niveau", input: "'II'", minimums: { "2020.4": 1573 }, minimumRule: "salaire minimum conventionnel", situation: { "salarié . convention collective . pompes funèbres . position": 1, "salarié . convention collective . pompes funèbres . ancienneté dans l'emploi": 0 } },
  { name: "0843-boulangerie-patisserie-artisanale", value: "boulangerie-pâtisserie artisanale", classification: "niveau", input: "'170'", minimums: { "2026.1": 1938.3 } },
  { name: "1147-cabinets-medicaux", value: "cabinets médicaux", classification: "niveau", input: "'8'", minimums: { "2024.1": 2050.62 } },
  { name: "1266-restauration-collective", value: "restauration collective", classification: "niveau", input: "'III'", minimums: { "2025.1": 1835.17 } },
  { name: "1261-acteurs-lien-social-familial", value: "acteurs du lien social et familial", classification: "points de pesée", input: 100, minimums: { "2026.1": 2375 } },
  { name: "1351-prevention-securite", value: "prévention et sécurité", classification: "coefficient", input: 120, minimums: { "2026.1": 1883.85 } },
  { name: "3242-presse-regions", value: "presse en régions", classification: "niveau", input: "'E5'", minimums: { "2023.2": 1878.55 } },
  { name: "3243-quincaillerie", value: "quincaillerie fournitures industrielles fers métaux équipement maison", classification: "niveau et échelon", input: "'VI.3'", minimums: { "2026.1": 2351, "2026.2": 2351 } },
  { name: "3245-operateurs-voyages-guides", value: "opérateurs voyages et guides", classification: "groupe", input: "'E'", minimums: { "2025.1": 2162.07 } },
  { name: "3228-groupement-armateurs-passages-eau", value: "groupement armateurs passages eau", classification: "fonction", input: "'matelots matelots légers'", minimums: { "2022.1": 1606.01 } },
  { name: "3248-metallurgie", value: "métallurgie", classification: "niveau", input: "'C5'", minimums: { "2026.1": 2042.5, "2026.2": 2042.5 } },
  { name: "3231-metallurgie-jura", value: "métallurgie jura", classification: "coefficient", input: 240, minimums: { "2023.1": 22970 }, minimumRule: "salaire minimum annuel conventionnel" },
  { name: "2583-societes-autoroutes", value: "sociétés autoroutes", classification: "classe", input: "'I'", minimums: { "2024.1": 36321 }, minimumRule: "salaire minimum annuel conventionnel" },
  { name: "3239-particuliers-employeurs-emploi-domicile", value: "particuliers employeurs et emploi à domicile", classification: "niveau", input: "'I'", minimums: { "2026.2": 2206.32 }, minimumRule: "salaire minimum conventionnel" },
  { name: "3241-telediffusion", value: "télédiffusion", classification: "niveau", input: "'5-1'", minimums: { "2026.1": 180.16 }, minimumRule: "salaire minimum journalier" },
  { name: "3205-cooperatives-consommateurs", value: "coopératives de consommateurs", classification: "niveau", input: "'8'", minimums: { "2026.1": 2134.86, "2026.2": 2134.86 } },
  { name: "3216-negoce-materiaux-construction", value: "négoce des matériaux de construction", classification: "coefficient", input: 245, minimums: { "2025.1": 2105.74 } },
  { name: "3013-librairie", value: "librairie", classification: "niveau", input: "'8'", minimums: { "2026.1": 2426, "2026.2": 2426 } },
  { name: "2247-courtage-assurances", value: "courtage assurances", classification: "niveau", input: "'D'", minimums: { "2026.2": 2392 } },
  { name: "2335-agences-generales-assurances", value: "agences générales assurances", classification: "classe", input: "'1'", minimums: { "2026.1": 23194 }, minimumRule: "salaire minimum annuel conventionnel", situation: { "salarié . convention collective . agences générales assurances . date de calcul": "11/10/2026", "salarié . convention collective . agences générales assurances . champ juridique": "'tous employeurs après extension'" } },
  { name: "1747-boulangerie-industrielle", value: "boulangerie industrielle 1747", classification: "niveau", input: "'L3'", minimums: { "2025.1": 4578.52 } },
  { name: "1760-jardineries-graineteries", value: "jardineries graineteries", classification: "classification", input: "'4.2'", minimums: { "2026.1": 1980 } },
  { name: "3255-boulangerie-industrielle", value: "boulangerie industrielle", classification: "niveau", input: "'E3'", minimums: { "2025.1": 2074.18, "2026.1": 2115.22, "2026.2": 2115.22 } },
  { name: "2264-hospitalisation-privee", value: "hospitalisation privée", classification: "coefficient", input: 300, minimums: { "2023.3": 2178 } },
  { name: "2511-sport", value: "sport", classification: "groupe", input: "'3'", minimums: { "2026.1": 1997.87 } },
  { name: "1512-promotion-immobiliere", value: "promotion immobilière", classification: "coefficient", input: 100, minimums: { "2026.1": 1885, "2026.3": 1885 } },
  { name: "1513-papeterie-librairie", value: "papeterie fournitures bureau bureautique informatique librairie", classification: "coefficient", input: "'6'", minimums: { "2026.1": 1830 } },
  { name: "1536-distributeurs-conseils-hors-domicile", value: "distributeurs conseils hors domicile", classification: "classification", input: "'III.2'", minimums: { "2026.1": 2024 } },
  { name: "2728-sucreries", value: "sucreries", classification: "classe", input: "'1A'", minimums: { "2026.1": 23005.08 }, minimumRule: "salaire minimum annuel conventionnel", situation: { "salarié . convention collective . sucreries . date de calcul": "11/10/2026", "salarié . convention collective . sucreries . champ juridique": "'tous employeurs après extension'" } },
  { name: "1607-jeux-jouets", value: "jeux jouets articles fêtes ornements noël puériculture voitures enfants modélisme", classification: "coefficient", input: 200, minimums: { "2026.1": 2154 } },
  { name: "1605-desinfection-desinsectisation-deratisation", value: "désinfection désinsectisation dératisation", classification: "niveau", input: 1, minimums: { "2026.1": 1837.13 } },
  { name: "1606-bricolage", value: "bricolage", classification: "coefficient", input: 250, minimums: { "2025.1": 2111, "2025.2": 2111 } },
  { name: "2596-coiffure", value: "coiffure", classification: "niveau", input: "'T2.1'", minimums: { "2026.1": 1869, "2026.2": 1869 } },
  { name: "2941-aide-soins-domicile", value: "aide et soins à domicile", classification: "niveau", input: "'TAM.1.1'", minimums: { "2026.1": 2157.98 } },
  { name: "3043-entreprises-proprete", value: "propreté", classification: "niveau", input: "'ASP-A'", minimums: { "2026.1": 1898.91 } },
  { name: "3127-services-personne", value: "services à la personne", classification: "emploi-repère", input: "'jardinage'", minimums: { "2024.1": 1771.51 } },
  { name: "2098-prestataires-tertiaire", value: "prestataires tertiaires", classification: "coefficient", input: 120, minimums: { "2026.1": 1823.03, "2026.2": 1867.02 } },
  { name: "1388-industrie-petrole", value: "industrie pétrole", classification: "coefficient", input: 200, minimums: { "2026.1": 2213.92, "2026.2": 2213.92 } },
  { name: "1411-fabrication-ameublement", value: "fabrication ameublement", classification: "niveau", input: "'AP52'", minimums: { "2026.1": 2117 } },
  { name: "1404-maintenance-distribution-location", value: "maintenance distribution location", classification: "niveau", input: "'B40'", minimums: { "2026.1": 2509.2 } },
  { name: "1405-expedition-exportation-fruits-legumes", value: "expédition exportation fruits légumes", classification: "niveau", input: "'III'", minimums: { "2026.1": 1876.24 }, situation: { "salarié . convention collective . expédition exportation fruits légumes . secteur": "'fruits et légumes'" } },
  { name: "1483-commerce-detail-habillement-textiles", value: "commerce de détail habillement", classification: "niveau", input: "'3'", minimums: { "2026.1": 1843 } },
  { name: "1517-commerce-detail-non-alimentaire", value: "commerce de détail non alimentaire", classification: "niveau", input: "'5'", minimums: { "2026.1": 1967 } },
  { name: "1619-cabinets-dentaires", value: "cabinets dentaires", classification: "niveau", input: "'assistant-dentaire'", minimums: { "2026.1": 2112.76 } },
  { name: "0993-prothesistes-dentaires", value: "prothésistes dentaires", classification: "niveau", input: "'PHQ1'", minimums: { "2026.1": 2293, "2026.2": 2293 } },
  { name: "1671-maisons-etudiants", value: "maisons d'étudiants", classification: "classe", input: 10, minimums: { "2026.2": 28208 }, minimumRule: "salaire minimum annuel conventionnel", situation: { "salarié . convention collective . maisons d'étudiants . date de calcul": "01/07/2026" } },
  { name: "1679-inspection-assurance", value: "inspection assurance", classification: "classe", input: "'6'", minimums: { "2007.2": 35800 }, minimumRule: "salaire minimum annuel conventionnel", situation: { "salarié . convention collective . inspection assurance . date de calcul": "01/01/2007" } },
  { name: "1951-expertises-automobile", value: "expertises automobile", classification: "niveau", input: "'5'", minimums: { "2025.1": 34776 }, minimumRule: "salaire minimum annuel conventionnel" },
  { name: "1672-societes-assurances", value: "sociétés assurances", classification: "niveau", input: "'3'", minimums: { "2026.3": 2089.17 } },
  { name: "1686-commerces-services-audiovisuel", value: "audiovisuel électronique équipement ménager", classification: "niveau", input: "'III.2'", minimums: { "2026.2": 2060.98 } },
  { name: "1702-travaux-publics-ouvriers", value: "travaux publics ouvriers", classification: "coefficient", input: 100, minimums: { "2026.3": 23863 }, minimumRule: "minimum annuel", situation: { "salarié . convention collective . travaux publics ouvriers . catégorie": "'ouvrier'", "salarié . convention collective . travaux publics ouvriers . région": "'Bretagne'", "salarié . convention collective . travaux publics ouvriers . date de calcul": "11/10/2026" } },
  { name: "1486-syntec", value: "syntec", classification: "coefficient", input: 355, minimums: { "2025.1": 2045, "2026.1": 2045, "2026.2": 2045 } },
  { name: "1979-hotels-cafes-restaurants", value: "HCR", classification: "niveau", input: "'II.3'", minimums: { "2024.1": 1997.45 } },
  { name: "2060-chaines-cafeterias", value: "chaînes de cafétérias et assimilés", classification: "niveau et échelon", input: "'III.2'", minimums: { "2024.1": 1880.67 } },
  { name: "3017-ports-manutention", value: "ports et manutention", classification: "classification", input: "'B'", minimums: { "2024.1": 1914 } },
  { name: "1978-fleuristes-animaux", value: "fleuristes animaux", classification: "niveau", input: "'V.2'", minimums: { "2026.1": 2274.30, "2026.2": 2274.30 } },
  { name: "1996-pharmacie-officine", value: "pharmacie", classification: "coefficient", input: 470, minimums: { "2025.1": 3717.51, "2026.1": 3762.42 } },
  { name: "2021-golf", value: "golf", classification: "groupe", input: "'3'", minimums: { "2026.1": 1975.06, "2026.2": 1975.06 } },
  { name: "2120-banque", value: "banque", classification: "niveau", input: "'E'", minimums: { "2026.1": 1864.62 } },
  { name: "1077-cooperatives-agricoles-cereales", value: "coopératives agricoles céréales", classification: "niveau", input: 6, minimums: { "2025.1": 2039.05 } },
  { name: "2205-notariat", value: "notariat", classification: "niveau", input: "'E'", minimums: { "2026.1": 1928 }, situation: { "salarié . convention collective . notariat . champ juridique": "'employeur signataire ou adhérent'" } },
  { name: "2121-edition", value: "édition", classification: "niveau", input: "'C3A'", minimums: { "2026.1": 2964 } },
  { name: "2148-telecommunications", value: "télécommunications", classification: "niveau", input: "'A.1'", minimums: { "2026.1": 22757 }, minimumRule: "minimum annuel", situation: { "salarié . convention collective . télécommunications . date de calcul": "11/10/2026" } },
  { name: "2149-activites-dechet", value: "activités du déchet", classification: "coefficient", input: 125, minimums: { "2026.1": 2362.5, "2026.2": 2333.75 } },
  { name: "2156-grands-magasins", value: "grands magasins", classification: "niveau", input: "'IV.2'", minimums: { "2026.1": 1895 } },
  { name: "2216-commerce-detail-gros-predominance-alimentaire", value: "commerce alimentaire", classification: "niveau", input: "'4B'", minimums: { "2025.1": 2032.03, "2026.1": 2054.33, "2026.2": 2054.33 } },
  { name: "3237-commerce-detail-alimentaire-specialise", value: "commerce de détail alimentaire spécialisé", classification: "niveau", input: "'E4'", minimums: { "2026.1": 1906.35, "2026.2": 1940.81 } },
  { name: "3109-industries-alimentaires-diverses", value: "industries alimentaires diverses", classification: "position", input: "'N8-E2'", minimums: { "2026.1": 4248.03 } },
  { name: "0292-plasturgie", value: "plasturgie", classification: "coefficient", input: 800, minimums: { "2026.1": 2266 } },
  { name: "0413-personnes-handicapees", value: "personnes handicapées et inadaptées", classification: "coefficient", input: 434, minimums: { "2026.1": 1810.57 } },
  { name: "0573-commerces-de-gros", value: "commerces de gros", classification: "niveau", input: "'IV.2'", minimums: { "2026.1": 1953.23 } },
  { name: "1396-industries-produits-alimentaires-elabores", value: "industries de produits alimentaires élaborés", classification: "coefficient", input: 225, minimums: { "2026.1": 2206.80 } },
  { name: "1412-installation-aeraulique-thermique-frigorifique", value: "installation aeraulique thermique frigorifique", classification: "coefficient", input: 300, minimums: { "2026.1": 2471.98 } },
  { name: "1413-travail-temporaire", value: "travail temporaire", classification: "niveau", input: "'H'", minimums: { "2026.1": 2948 } },
  { name: "1043-gardiens-concierges-employes-immeubles", value: "gardiens concierges et employés d'immeubles", classification: "catégorie", input: "'A'", minimums: { "2025.1": 1887 }, situation: { "salarié . convention collective . gardiens concierges et employés d'immeubles . coefficient hiérarchique": 600, "salarié . convention collective . gardiens concierges et employés d'immeubles . heures contractuelles": "151.67 heures/mois" } },
  { name: "1090-services-automobile", value: "services automobile", classification: "niveau", input: "'7'", minimums: { "2026.1": 1999 } },
  { name: "1516-organismes-formation", value: "organismes de formation", classification: "coefficient", input: 240, minimums: { "2025.1": 2463.73, "2027.1": 2513 } },
  { name: "1518-eclat", value: "éclat", classification: "groupe", input: "'B'", minimums: { "2026.1": 1912.59, "2026.2": 1912.59 } },
  { name: "1501-restauration-rapide", value: "restauration rapide", classification: "niveau", input: "'III.B'", minimums: { "2025.1": 1961.05 } },
  { name: "1505-commerce-detail-alimentaire-non-specialise", value: "commerce de détail alimentaire non spécialisé", classification: "niveau", input: "'E4'", minimums: { "2026.1": 1903.28 } },
  { name: "0247-industries-habillement", value: "industries habillement", classification: "niveau", input: "'I.1'", minimums: { "2026.2": 1833 }, situation: { "salarié . convention collective . industries habillement . annexe": "'ouvriers'" } },
  { name: "1534-industrie-commerces-gros-viandes", value: "industrie et commerces en gros des viandes", classification: "niveau", input: "'IV.2'", minimums: { "2026.1": 2050 } },
  { name: "1930-transformation-grains", value: "métiers de la transformation des grains", classification: "niveau", input: "'VI.1'", minimums: { "2026.1": 2608.23, "2026.3": 2608.23 } },
  { name: "1938-industries-transformation-volailles", value: "industries de la transformation des volailles", classification: "coefficient", input: 400, minimums: { "2025.1": 3268.01 } },
  { name: "1539-bureau-numerique", value: "bureau et numérique", classification: "niveau", input: "'A3'", minimums: { "2025.1": 1875, "2025.2": 1875 } },
  { name: "1555-produits-pharmaceutiques", value: "produits pharmaceutiques", classification: "niveau", input: "'II.1'", minimums: { "2026.1": 2121.77 }, situation: { "salarié . convention collective . produits pharmaceutiques . date de calcul": "11/10/2026", "salarié . convention collective . produits pharmaceutiques . champ juridique": "'tous employeurs après extension'" } },
  { name: "1586-industries-charcutieres", value: "industries charcutières", classification: "coefficient", input: 200, minimums: { "2026.1": 2130.2 } },
  { name: "1543-boyauderie", value: "boyauderie", classification: "coefficient", input: 200, minimums: { "2026.1": 2130.2 } },
  { name: "1821-cristal-verre-vitrail", value: "cristal verre vitrail", classification: "coefficient", input: 245, minimums: { "2026.2": 2185.59 } },
  { name: "1558-industries-ceramiques", value: "industries céramiques", classification: "classification", input: "'NC-E4'", minimums: { "2025.1": 1978.4 } },
  { name: "1580-industrie-chaussure", value: "industrie chaussure", classification: "classification", input: "'2.2'", minimums: { "2026.1": 1886 } },
  { name: "1596-batiment-ouvriers-petites-entreprises", value: "bâtiment ouvriers petites entreprises", classification: "coefficient", input: 150, minimums: { "2026.1": 1823 }, minimumRule: "salaire minimum conventionnel", situation: { "salarié . convention collective . bâtiment ouvriers petites entreprises . catégorie": "'ouvrier'", "salarié . convention collective . bâtiment ouvriers petites entreprises . région": "'Centre-Val de Loire'", "salarié . convention collective . bâtiment ouvriers petites entreprises . date de calcul": "01/05/2026" } },
  { name: "1597-batiment-ouvriers-plus-de-10", value: "bâtiment ouvriers plus de 10 salariés", classification: "coefficient", input: 150, minimums: { "2026.1": 1838.24 }, minimumRule: "salaire minimum conventionnel", situation: { "salarié . convention collective . bâtiment ouvriers plus de 10 salariés . catégorie": "'ouvrier'", "salarié . convention collective . bâtiment ouvriers plus de 10 salariés . région": "'Nouvelle-Aquitaine'", "salarié . convention collective . bâtiment ouvriers plus de 10 salariés . date de calcul": "01/01/2026" } },
  { name: "2609-batiment-etam", value: "bâtiment ETAM", classification: "niveau", input: "'A'", minimums: { "2026.1": 1827.10 }, minimumRule: "salaire minimum conventionnel", situation: { "salarié . convention collective . bâtiment ETAM . catégorie": "'ETAM'", "salarié . convention collective . bâtiment ETAM . région": "'Corse'", "salarié . convention collective . bâtiment ETAM . date de calcul": "01/04/2026" } },
  { name: "2609-batiment-etam", value: "bâtiment ETAM", classification: "niveau", input: "'A'", minimums: { "2026.2": 1847.16 }, minimumRule: "salaire minimum conventionnel", situation: { "salarié . convention collective . bâtiment ETAM . catégorie": "'ETAM'", "salarié . convention collective . bâtiment ETAM . région": "'Occitanie'", "salarié . convention collective . bâtiment ETAM . date de calcul": "01/05/2026" } },
  { name: "2420-batiment-cadres", value: "bâtiment cadres", classification: "coefficient", input: 60, minimums: { "2026.1": 2356 }, minimumRule: "salaire minimum conventionnel", situation: { "salarié . convention collective . bâtiment cadres . date de calcul": "01/02/2026", "salarié . convention collective . bâtiment cadres . champ juridique": "'employeur signataire ou adhérent'", "salarié . contrat . statut cadre": "oui" } },
  { name: "3212-travaux-publics-cadres", value: "travaux publics cadres", classification: "position", input: "'A1'", minimums: { "2024.1": 33257 }, minimumRule: "salaire minimum annuel conventionnel", situation: { "salarié . convention collective . travaux publics cadres . date de calcul": "01/01/2024" } },
  { name: "0787-experts-comptables", value: "experts-comptables", classification: "coefficient", input: 180, minimums: { "2026.1": 22850.16 }, minimumRule: "minimum annuel", situation: { "salarié . convention collective . experts-comptables . indice 40 ordre validé": "non" } },
  { name: "0086-publicite", value: "publicité", classification: "niveau", input: "'4'", minimums: { "2025.3": 1957 }, situation: { "salarié . convention collective . publicité . catégorie": "'employés'" } },
  { name: "0184-imprimeries", value: "imprimeries de labeur et industries graphiques", classification: "groupe et échelon", input: "'IIIA'", minimums: { "2026.1": 2369 } },
  { name: "1431-optique-lunetterie-detail", value: "optique-lunetterie de détail", classification: "coefficient", input: "'K'", minimums: { "2024.1": 3700 }, situation: { "salarié . convention collective . optique-lunetterie de détail . classification": "'nouvelle'" } },
  { name: "3090-spectacle-vivant-prive", value: "spectacle vivant privé", classification: "catégorie administrative", input: "'cadres groupe 1'", minimums: { "2025.2": 3578.18 }, situation: { "salarié . convention collective . spectacle vivant privé . échelon": "'1'" } },
  { name: "3221-agences-presse", value: "agences de presse", classification: "groupe", input: "'1'", minimums: { "2026.2": 1873.86 }, minimumRule: "salaire minimum conventionnel", situation: { "salarié . convention collective . agences de presse . date de calcul": "11/10/2026", "salarié . convention collective . agences de presse . champ juridique": "'tous employeurs après extension'" } },
  { name: "3230-presse-information-specialisee", value: "presse information spécialisée", classification: "niveau", input: 1, minimums: { "2024.1": 1800 } },
  { name: "1909-organismes-tourisme", value: "organismes de tourisme", classification: "niveau", input: "'3.3'", minimums: { "2026.1": 4281.53, "2026.2": 4281.53 }, minimumRule: "salaire minimum conventionnel", situation: { "salarié . convention collective . organismes de tourisme . date de calcul": "11/10/2026" } },
  { name: "1316-tourisme-social-familial", value: "tourisme social et familial", classification: "niveau", input: "'G'", minimums: { "2026.1": 3294.5 }, situation: { "salarié . convention collective . tourisme social et familial . date de calcul": "01/05/2026" } },
  { name: "1611-logistique-communication-ecrite-directe", value: "logistique communication écrite directe", classification: "groupe", input: "'III-A'", minimums: { "2026.1": 2501.05 } },
  { name: "0493-vins-cidres-spiritueux", value: "vins cidres spiritueux", classification: "position", input: "'5A'", minimums: { "2026.1": 2233 } },
  { name: "1631-hotellerie-plein-air", value: "hôtellerie de plein air", classification: "coefficient", input: 300, minimums: { "2024.1": 2203.92 } },
  { name: "3213-economistes-construction", value: "économistes de la construction et métreurs-vérificateurs", classification: "niveau", input: "'I'", minimums: { "2026.1": 4738.91 }, situation: { "salarié . convention collective . économistes de la construction et métreurs-vérificateurs . zone": "'national'" } },
  { name: "1480-journalistes", value: "journalistes", classification: "groupe", input: "'4'", minimums: { "2025.1": 2506.54 } },
  { name: "0275-transport-aerien-personnel-sol", value: "transport aérien personnel au sol", classification: "coefficient", input: 245, minimums: { "2025.1": 2105 }, situation: { "salarié . convention collective . transport aérien personnel au sol . date de calcul": "01/11/2025", "salarié . convention collective . transport aérien personnel au sol . champ juridique": "'employeur signataire ou adhérent'" } },
  { name: "2931-activites-marches-financiers", value: "activités de marchés financiers", classification: "catégorie", input: "'III.B'", minimums: { "2026.1": 3575 }, situation: { "salarié . convention collective . activités de marchés financiers . date de calcul": "11/10/2026", "salarié . convention collective . activités de marchés financiers . champ juridique": "'employeur signataire ou adhérent'" } },
  { name: "3250-commissaires-justice", value: "commissaires de justice et sociétés de ventes volontaires", classification: "catégorie et coefficient", input: "'II.2-283'", minimums: { "2026.1": 2463.29 }, situation: { "salarié . convention collective . commissaires de justice et sociétés de ventes volontaires . champ juridique": "'employeur signataire ou adhérent'" } },
  { name: "1408-distribution-logistique-energies", value: "distribution logistique énergies", classification: "coefficient", input: 320, minimums: { "2025.1": 2768.68 } },
  { name: "2717-creation-evenement", value: "création événement", classification: "prestation", input: "'1 à 6 lignes — demi-journée — 1 rôle'", minimums: { "2024.1": 112.40 }, minimumRule: "salaire minimum conventionnel" },
  { name: "1880-commerce-ameublement", value: "commerce de l'ameublement", classification: "niveau", input: "'5'", minimums: { "2026.1": 1871 } },
  { name: "2494-cooperation-maritime", value: "coopération maritime", classification: "niveau et échelon", input: "'3.2'", minimums: { "2026.1": 26273 }, minimumRule: "salaire minimum annuel conventionnel" },
  { name: "0915-societes-expertises-evaluations", value: "sociétés d'expertises et d'évaluations", classification: "niveau", input: "'N 5'", minimums: { "2026.1": 27039 }, minimumRule: "salaire minimum annuel conventionnel" },
  { name: "0500-commerces-gros-habillement", value: "commerces de gros habillement", classification: "classification", input: "'employés IV B'", minimums: { "2024.1": 1900 } },
  { name: "2272-assainissement-maintenance-industrielle", value: "assainissement et maintenance industrielle", classification: "coefficient", input: 430, minimums: { "2026.1": 3044.24 } },
  { name: "1982-negoce-medico-technique", value: "négoce médico-technique", classification: "niveau", input: "'TAM7'", minimums: { "2026.1": 2174 } },
  { name: "1267-patisserie", value: "pâtisserie", classification: "niveau", input: "'VII'", minimums: { "2026.1": 2071 } },
  { name: "2075-professionnels-oeuf", value: "professionnels de l'œuf", classification: "niveau", input: "'E3'", minimums: { "2025.1": 2074.18 } },
  { name: "2972-navigation-personnel-sedentaire", value: "personnel sédentaire entreprises navigation", classification: "niveau", input: "'I'", minimums: { "2026.1": 22604.30 }, minimumRule: "salaire minimum annuel conventionnel" },
  { name: "1557-commerce-articles-sports-loisirs", value: "commerce articles sports loisirs", classification: "classification", input: "'250'", minimums: { "2025.1": 2089 } },
  { name: "3236-industrie-services-nautiques", value: "industrie services nautiques", classification: "niveau et échelon", input: "'VI.2'", minimums: { "2025.1": 2477.87 } },
  { name: "2528-maroquinerie", value: "maroquinerie", classification: "classification", input: "'TAM III'", minimums: { "2026.1": 1953 } },
  { name: "3249-carrieres-materiaux", value: "carrières et matériaux de construction", classification: "niveau et échelon", input: "'5.2'", minimums: { "2026.1": 2409 }, situation: { "salarié . convention collective . carrières et matériaux de construction . région": "'Île-de-France'" } },
  { name: "3222-menuiseries-charpentes-portes-planes", value: "menuiseries charpentes constructions industrialisées portes planes", classification: "classification", input: "'N8 E2'", minimums: { "2026.1": 3564 } },
  { name: "0897-services-prevention-sante-travail-interentreprises", value: "services prévention santé travail interentreprises", classification: "classe", input: "'G'", minimums: { "2026.1": 32493 }, minimumRule: "salaire minimum annuel conventionnel" },
  { name: "2147-services-eau-assainissement", value: "services eau assainissement", classification: "groupe", input: "'VI'", minimums: { "2025.1": 40289 }, minimumRule: "salaire minimum annuel conventionnel" },
  { name: "1875-cabinets-cliniques-veterinaires", value: "cabinets et cliniques vétérinaires", classification: "coefficient", input: 120, minimums: { "2026.1": 2155.2 } },
  { name: "3251-bijouterie-joaillerie-horlogerie", value: "bijouterie joaillerie orfèvrerie horlogerie", classification: "classification", input: "'3.2'", minimums: { "2025.1": 2227 } },
  { name: "3256-etablissements-soins-veterinaires", value: "établissements de soins vétérinaires", classification: "coefficient", input: 120, minimums: { "2026.1": 2155.2 } },
  { name: "1621-repartition-pharmaceutique", value: "répartition pharmaceutique", classification: "coefficient", input: 300, minimums: { "2025.1": 2844.38, "2025.2": 2872.82 } },
  { name: "3097-production-cinematographique", value: "production cinématographique", classification: "niveau", input: 4, minimums: { "2026.1": 2113.53 } },
  { name: "1307-exploitation-cinematographique", value: "exploitation cinématographique", classification: "coefficient", input: 300, minimums: { "2025.1": 2203.92 } },
  { name: "2198-commerce-distance", value: "commerce à distance", classification: "niveau", input: "'G référent'", minimums: { "2026.1": 3627 } },
  { name: "3203-structures-associatives-peche", value: "structures associatives de pêche de loisir et de protection du milieu aquatique", classification: "niveau et échelon", input: "'VI.3'", minimums: { "2026.1": 3355 } },
  { name: "2332-entreprises-architecture", value: "entreprises d'architecture", classification: "coefficient", input: 300, minimums: { "2025.1": 2739 }, situation: { "salarié . convention collective . entreprises d'architecture . zone": "'zone 1'" } },
  { name: "3224-distribution-commerce-gros-papiers-cartons", value: "distribution commerce gros papiers cartons", classification: "niveau et échelon", input: "'III.2'", minimums: { "2025.1": 1961.8 } },
  { name: "3252-mannequins", value: "mannequins", classification: "catégorie", input: 3, minimums: { "2025.1": 716.18 }, minimumRule: "salaire minimum conventionnel" },
  { name: "3223-personnels-navigants-officiers", value: "personnels navigants officiers transport maritime", classification: "fonction et zone", input: "'capitaine ≥15000 UMS — long cours'", minimums: { "2025.1": 63049.92 }, minimumRule: "salaire minimum annuel conventionnel" },
  { name: "1499-miroiterie", value: "miroiterie transformation négoce verre", classification: "coefficient", input: 300, minimums: { "2025.1": 2157.51 } },
  { name: "1589-industries-recuperation", value: "industries récupération", classification: "niveau", input: 10, minimums: { "2026.1": 2280 } },
  { name: "1790-espaces-loisirs", value: "espaces loisirs", classification: "niveau", input: "'IV'", minimums: { "2026.1": 2441.1 }, situation: { "salarié . convention collective . espaces loisirs . coefficient": 280 } },
  { name: "2150-personnels-hlm", value: "personnels hlm", classification: "coefficient", input: "'G7'", minimums: { "2026.1": 46776.54 }, minimumRule: "salaire minimum annuel conventionnel" },
  { name: "0959-laboratoires-biologie-medicale", value: "laboratoires biologie médicale", classification: "coefficient", input: 800, minimums: { "2024.1": 5608.31 } },
  { name: "3254-boucherie-poissonnerie", value: "boucherie poissonnerie", classification: "niveau", input: "'IV-D'", minimums: { "2026.1": 2525 } },
  { name: "3253-cabinets-avocats-salaries", value: "cabinets d'avocats salariés", classification: "coefficient", input: 300, minimums: { "2025.1": 2390 }, minimumRule: "salaire minimum conventionnel", situation: { "salarié . convention collective . cabinets d'avocats salariés . date de calcul": "01/10/2025" } },
  { name: "1391-manutention-nettoyage-aeroports", value: "manutention nettoyage aéroports", classification: "catégorie", input: "'C'", minimums: { "2026.1": 2602 } },
  { name: "0454-remontees-mecaniques-domaines-skiables", value: "remontées mécaniques domaines skiables", classification: "niveau de rémunération", input: 200, minimums: { "2026.1": 12.06 }, minimumRule: "salaire minimum horaire conventionnel" },
  { name: "1182-ports-plaisance", value: "ports de plaisance", classification: "coefficient", input: 225, minimums: { "2025.1": 2673 } },
  { name: "3244-branche-ferroviaire", value: "branche ferroviaire", classification: "coefficient", input: 246, minimums: { "2023.1": 4013.49 } },
  { name: "0669-industries-fabrication-mecanique-verre", value: "industries fabrication mecanique verre", classification: "coefficient", input: 250, minimums: { "2025.1": 2252.23 } },
  { name: "3016-ateliers-chantiers-insertion", value: "ateliers et chantiers d'insertion", classification: "coefficient", input: 240, minimums: { "2026.1": 1897.6 } },
  { name: "3016-ateliers-chantiers-insertion", value: "ateliers et chantiers d'insertion", classification: "coefficient", input: 313, minimums: { "2026.1": 2192.52 } },
  { name: "1612-transport-aerien-personnel-navigant", value: "personnel navigant technique hélicoptères", classification: "classification", input: "'FTR3-2'", minimums: { "2024.1": 5757 } },
  { name: "3220-offices-publics-habitat", value: "offices publics habitat", classification: "classe", input: 13, minimums: { "2026.1": 5359.23 } },
  { name: "3229-navigation-interieure", value: "navigation intérieure", classification: "classification", input: "'matelot — 0 à 3 ans'", minimums: { "2026.1": 22889 }, minimumRule: "salaire minimum annuel conventionnel" },
  { name: "2219-taxis", value: "taxis", classification: "classification", input: "'niveau 1 — conducteur débutant — titulaire carte professionnelle'", minimums: { "2025.1": 1837.86 } },
  { name: "7024-production-agricole-cuma", value: "production agricole et cuma", classification: "coefficient", input: 200, minimums: { "2025.1": 2784.6 } },
  { name: "2543-geometres-experts", value: "géomètres-experts géomètres-topographes photogrammètres experts fonciers", classification: "classification", input: "'II.2'", minimums: { "2024.1": 1950.53 } },
  { name: "1659-rouissage-teillage-lin", value: "rouissage teillage lin", classification: "coefficient", input: 300, minimums: { "2024.1": 2558.05 } },
  { name: "0489-industries-cartonnage", value: "industries du cartonnage", classification: "coefficient", input: 240, minimums: { "2025.3": 2105.18 } },
  { name: "3227-industries-fabrication-chaux", value: "industries de la fabrication de la chaux", classification: "coefficient", input: 185, minimums: { "2024.1": 2182.2 }, situation: { "salarié . convention collective . industries de la fabrication de la chaux . catégorie": "'ouvriers'" } },
  { name: "2707-batiment-etam-ile-de-france", value: "bâtiment ETAM Île-de-France", classification: "niveau", input: "'G'", minimums: { "2018.1": 2915 } },
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

  it("3219-portage-salarial exposes sourced remuneration rates and remains isolated", async () => {
    const version = COMPILED_VERSIONS["3219-portage-salarial"]?.find((v) => v.version === "2024.3");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const namespace = "salarié . convention collective . portage salarial";
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
    }
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = {
      ...choice,
      "une possibilité": [...new Set([...choice["une possibilité"], "portage salarial"])],
    } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'portage salarial'",
      [`${namespace} . classification`]: "'senior'",
      [`${namespace} . salaire de base de la dernière mission`]: "2000 €/mois",
      [`${namespace} . masse salariale annuelle de référence formation`]: "100000 €/an",
      [`${namespace} . effectif entreprise pour formation`]: "10 salarié",
      "salarié . contrat . statut cadre": "non",
    });
    const rate = engine.evaluate(`${namespace} . taux de rémunération minimale`).nodeValue;
    assert.equal(rate, 75);
    const minimum = engine.evaluate(`${namespace} . rémunération minimale mensuelle`).nodeValue;
    const pmss = engine.evaluate(`${namespace} . plafond sécurité sociale base 2017`).nodeValue;
    assert.equal(pmss, 3269);
    assert.equal(minimum, (pmss as number) * 0.75);
    assert.equal(engine.evaluate(`${namespace} . réserve financière`).nodeValue, 200);
    assert.equal(engine.evaluate(`${namespace} . taux contribution formation`).nodeValue, 1.05);
    assert.equal(engine.evaluate(`${namespace} . contribution conventionnelle formation professionnelle`).nodeValue, 1050);
    assert.equal(engine.evaluate(`${namespace} . indemnité de précarité`).nodeValue, 0);
  });
  it("2543-geometres-experts exposes the sourced minimum, audit marker, and remains isolated", async () => {
    const version = COMPILED_VERSIONS["2543-geometres-experts"]?.find((v) => v.version === "2024.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const namespace = "salarié . convention collective . géomètres-experts géomètres-topographes photogrammètres experts fonciers";
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
    }
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = {
      ...choice,
      "une possibilité": [...new Set([...choice["une possibilité"], "géomètres-experts géomètres-topographes photogrammètres experts fonciers"])],
    } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'géomètres-experts géomètres-topographes photogrammètres experts fonciers'",
      [`${namespace} . classification`]: "'II.2'",
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1950.53);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, false);
  });
  it("7024-production-agricole-cuma exposes the sourced hourly minimum, audit marker, and remains isolated", async () => {
    const version = COMPILED_VERSIONS["7024-production-agricole-cuma"]?.find((v) => v.version === "2025.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const namespace = "salarié . convention collective . production agricole et cuma";
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
    }
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = {
      ...choice,
      "une possibilité": [...new Set([...choice["une possibilité"], "production agricole et cuma"])],
    } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'production agricole et cuma'",
      [`${namespace} . coefficient`]: 200,
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2784.6);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, false);
  });
  it("1987-pates-alimentaires-seches exposes hourly minimums, premiums, scope, audit, and isolation", async () => {
    const version = COMPILED_VERSIONS["1987-pates-alimentaires-seches"]?.find((v) => v.version === "2024.2");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const namespace = "salarié . convention collective . pâtes alimentaires sèches et couscous non préparé";
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
    }
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = { ...choice, "une possibilité": [...new Set([...choice["une possibilité"], "pâtes alimentaires sèches et couscous non préparé"])] } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'pâtes alimentaires sèches et couscous non préparé'",
      [`${namespace} . coefficient`]: 200,
      [`${namespace} . ancienneté en années`]: 6,
      [`${namespace} . champ juridique`]: "'employeur signataire ou adhérent'",
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum horaire`).nodeValue, 12.7);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1926.2089999999998);
    assert.equal(engine.evaluate(`${namespace} . prime ancienneté`).nodeValue, 0.7619999999999999);
    assert.equal(engine.evaluate(`${namespace} . prime vacances`).nodeValue, 575);
    assert.equal(engine.evaluate(`${namespace} . indemnité journalière de poste`).nodeValue, 5.2);
    assert.equal(engine.evaluate(`${namespace} . panier de nuit`).nodeValue, 11);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, false);
    engine.setSituation({
      "salarié . convention collective": "'pâtes alimentaires sèches et couscous non préparé'",
      [`${namespace} . coefficient`]: 999,
      [`${namespace} . champ juridique`]: "'employeur signataire ou adhérent'",
    });
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
  });
  it("3227-industries-fabrication-chaux exposes sourced minima, holiday bonus, audit, and isolation", async () => {
    const version = COMPILED_VERSIONS["3227-industries-fabrication-chaux"]?.find((v) => v.version === "2024.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const namespace = "salarié . convention collective . industries de la fabrication de la chaux";
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
    }
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = { ...choice, "une possibilité": [...new Set([...choice["une possibilité"], "industries de la fabrication de la chaux"])] } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'industries de la fabrication de la chaux'",
      [`${namespace} . catégorie`]: "'ouvriers'",
      [`${namespace} . coefficient`]: 185,
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2182.2);
    assert.equal(engine.evaluate(`${namespace} . prime de vacances`).nodeValue, 2200);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, false);
    engine.setSituation({
      "salarié . convention collective": "'industries de la fabrication de la chaux'",
      [`${namespace} . catégorie`]: "'ouvriers'",
      [`${namespace} . coefficient`]: 999,
    });
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
  });
});
