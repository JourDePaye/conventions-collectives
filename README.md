# Conventions collectives françaises en publicodes

L’objectif de ce projet est de mettre à disposition **l’ensemble des conventions collectives françaises en langage [publicodes](https://publi.codes)**, sous une forme lisible, versionnée et réutilisable dans des outils de calcul.

Le dépôt contient les modèles de conventions collectives, leurs références juridiques, leur compilateur et leurs tests. Il produit le package `conventions-collectives`, utilisé notamment par JourDePaye pour compléter les règles de `modele-social`.

**Les contributions sont les bienvenues !** Vous pouvez proposer une nouvelle convention, enrichir une convention existante, ajouter des tests, améliorer les références aux textes ou la documentation.

## Conventions déjà présentes

Trente-huit conventions sont actuellement représentées, avec quarante et une versions de modèles. Leur couverture porte sur les salaires minima, la classification nécessaire à leur calcul et certains compléments de rémunération ; la présence d’une convention ne signifie pas que toutes ses dispositions sont déjà modélisées.

| Convention | IDCC | Versions et dates d’effet | Règles présentes |
|---|---|---|---|
| [Transports routiers et activités auxiliaires du transport](rules/0016-transports-routiers/README.md) | 16 | `2026.1` : 1er juin 2026 | Grilles de 108 classifications des quatre sous-secteurs (marchandises, voyageurs, logistique, déménagement) avec paliers d’ancienneté, proratisées selon la quotité de travail ; détection des classifications hors grille |
| [Industries textiles](rules/0018-industries-textiles/README.md) | 18 | `2026.1` : 1er juin 2026 | Grille mensuelle de 21 positions (niveaux 1 à 6 en échelons et positions I à IV), proratisée selon la quotité de travail ; détection des niveaux hors grille |
| [Établissements privés à but non lucratif (CCN 51)](rules/0029-etablissements-prives-non-lucratifs/README.md) | 29 | `2026.1` : 1er janvier 2026 | Salaire de base (coefficient multiplié par la valeur du point de 4,568 €), proratisé selon la quotité de travail ; détection du coefficient absent |
| [Industries chimiques](rules/0044-industries-chimiques/README.md) | 44 | `2026.1` : 1er janvier 2026 | Barème de 23 coefficients (de 130 à 880), proratisé selon la quotité de travail ; détection des coefficients hors grille |
| [Industrie laitière](rules/0112-industrie-laitiere/README.md) | 0112 | `2026.1` : 1er février 2026 | Grille mensuelle de 28 positions (ouvriers et employés, techniciens et agents de maîtrise, cadres), proratisée selon la quotité de travail ; détection des classifications hors grille |
| [Plasturgie](rules/0292-plasturgie/README.md) | 292 | `2026.1` : 1er mars 2026 | Grille mensuelle de 15 coefficients (de 700 à 940), proratisée selon la quotité de travail ; détection des coefficients hors grille |
| [Établissements et services pour personnes inadaptées et handicapées (CCN 66)](rules/0413-personnes-handicapees/README.md) | 413 | `2022.1` : 1er juillet 2022 | Salaire indiciaire (coefficient multiplié par la valeur du point de 3,82 € ou de 3,93 € pour les adhérents à Nexem), proratisé selon la quotité de travail ; détection du coefficient absent |
| [Commerces de gros](rules/0573-commerces-de-gros/README.md) | 573 | `2026.1` : 1er mars 2026 | Grille de 28 positions (niveaux I à VI en minima mensuels, niveaux VII à X en minima annuels convertis en minima mensuels), proratisée selon la quotité de travail ; détection des niveaux hors grille |
| [Maisons à succursales de vente au détail d’habillement](rules/0675-succursales-habillement/README.md) | 675 | `2026.1` : 1er mai 2026 | Grille mensuelle de 9 catégories (employés, agents de maîtrise, cadres), proratisée selon la quotité de travail ; détection des catégories hors grille |
| [Boulangerie-pâtisserie (entreprises artisanales)](rules/0843-boulangerie-patisserie-artisanale/README.md) | 843 | `2026.1` : 1er février 2026 | Taux horaires minima de 10 coefficients selon trois zones (national, Île-de-France, Bouches-du-Rhône), appliqués aux heures du contrat, et minima annuels des cadres 1 et 2 convertis en minima mensuels ; détection des niveaux hors grille |
| [Services de l’automobile (commerce, réparation, contrôle technique, écoles de conduite)](rules/1090-services-automobile/README.md) | 1090 | `2026.1` : 1er mai 2026 | Grille de 34 positions pour les ouvriers et employés (échelons 1 à 12), la maîtrise (échelons 17 à 25) et les cadres (niveaux I à V), proratisée selon la quotité de travail ; détection des échelons et niveaux hors grille |
| [Cabinets médicaux](rules/1147-cabinets-medicaux/README.md) | 1147 | `2024.1` : 1er janvier 2024 | Grille mensuelle de 13 positions (de 4 à 16), proratisée selon la quotité de travail ; détection des positions hors grille |
| [Acteurs du lien social et familial (centres sociaux)](rules/1261-acteurs-lien-social-familial/README.md) | 1261 | `2026.1` : 1er janvier 2026 | Salaire socle annuel, points de pesée et points d'expérience professionnelle, convertis en minimum hiérarchique mensuel |
| [Entreprises de prévention et de sécurité](rules/1351-prevention-securite/README.md) | 1351 | `2026.1` : 1er juillet 2026 | Grille de 25 positions pour trois catégories, prime d’ancienneté, majorations nuit et dimanche, paniers, indemnités et minimum de six heures par période |
| [Industrie du pétrole](rules/1388-industrie-petrole/README.md) | 1388 | `2026.1` : 1er janvier 2026 | Minimum hiérarchique calculé par formule (valeur du point, majoration conventionnelle et surmajoration) pour les coefficients de 130 à 880, proratisé selon la quotité de travail ; détection des coefficients hors plage |
| [Fabrication de l’ameublement](rules/1411-fabrication-ameublement/README.md) | 1411 | `2026.1` : 1er juillet 2026 | Grille mensuelle de 36 échelons (agents de production, fonctionnels, d’encadrement et cadres), proratisée selon la quotité de travail ; détection des échelons hors grille |
| [Commerce de détail de l’habillement et des articles textiles](rules/1483-commerce-detail-habillement-textiles/README.md) | 1483 | `2026.1` : 1er avril 2026 | Barème de 13 catégories (employés, agents de maîtrise, cadres), primes d’ancienneté des employés et des agents de maîtrise A1 et A2, minima des agents de maîtrise B et des cadres selon l’ancienneté, proratisés selon la quotité de travail ; détection des catégories hors grille |
| [Bureaux d’études techniques, cabinets d’ingénieurs-conseils et sociétés de conseils (Syntec)](rules/1486-syntec/README.md) | 1486 | `2025.1` : 1er janvier 2025 | Minima mensuels des ETAM et des ingénieurs et cadres selon leur coefficient ; détection des coefficients hors grille |
| [Restauration rapide](rules/1501-restauration-rapide/README.md) | 1501 | `2025.1` : 1er juin 2025 | 11 taux horaires minima des niveaux I à IV, appliqués aux heures du contrat, et 3 minima annuels du niveau V (cadres) convertis en minima mensuels ; détection des niveaux et échelons hors grille |
| [Commerce de détail alimentaire non spécialisé](rules/1505-commerce-detail-alimentaire-non-specialise/README.md) | 1505 | `2026.1` : 1er août 2026 | Grille mensuelle de 11 niveaux (employés, agents de maîtrise, cadres), proratisée selon la quotité de travail ; minima annuels des cadres au forfait jours selon l’ancienneté dans le niveau ; détection des niveaux hors grille |
| [Organismes de formation](rules/1516-organismes-formation/README.md) | 1516 | `2025.1` : 1er janvier 2025 ; `2027.1` : 1er janvier 2027 | Grille de 31 paliers par fourchette de coefficient, minima annuels bruts convertis en minima mensuels et proratisés selon la quotité de travail ; détection des coefficients hors grille |
| [Commerce de détail non alimentaire](rules/1517-commerce-detail-non-alimentaire/README.md) | 1517 | `2026.1` : 1er juin 2026 | Grille mensuelle de 9 niveaux, proratisée selon la quotité de travail ; détection des niveaux hors grille |
| [Industrie et commerces en gros des viandes](rules/1534-industrie-commerces-gros-viandes/README.md) | 1534 | `2026.1` : 1er février 2026 | Grille mensuelle de 30 positions (10 niveaux de 3 échelons : ouvriers et employés, TAM, cadres), proratisée selon la quotité de travail ; détection des niveaux hors grille |
| [Entreprises du bureau et du numérique (commerce de détail de papeterie, fournitures de bureau, bureautique, informatique et librairie)](rules/1539-bureau-numerique/README.md) | 1539 | `2025.1` : 1er septembre 2025 | Grille mensuelle de 12 niveaux (A1 à C4), minimum du niveau A2 pour le niveau A1 après un an d’ancienneté, proratisée selon la quotité de travail ; détection des niveaux hors grille |
| [Industries charcutières (salaison, charcuterie en gros, conserves de viandes)](rules/1586-industries-charcutieres/README.md) | 1586 | `2026.1` : 1er février 2026 | Grille mensuelle de 49 coefficients (de 125 à 700, ouvriers et employés, techniciens et agents de maîtrise, cadres), proratisée selon la quotité de travail ; détection des coefficients hors grille |
| [Sociétés d’assurances](rules/1672-societes-assurances/README.md) | 1672 | `2026.1` : 1er janvier 2026 | Rémunérations minimales annuelles des 7 classes, converties en minimum mensuel sur 13 mensualités et proratisées selon la quotité de travail ; détection des classes hors grille |
| [Commerces et services de l’audiovisuel, de l’électronique et de l’équipement ménager](rules/1686-commerces-services-audiovisuel/README.md) | 1686 | `2026.1` : 1er mai 2026 | Grille de 16 positions (minima mensuels des niveaux I à IV en 3 échelons, rémunérations annuelles des 4 positions de cadres converties en minima mensuels), proratisée selon la quotité de travail ; détection des classifications hors grille |
| [Cabinets dentaires](rules/1619-cabinets-dentaires/README.md) | 1619 | `2026.1` : 1er janvier 2026 | Taux horaires minima de 9 emplois (entretien, réception, secrétaire, aide et assistant dentaires, prothésistes de niveau 1 à 4) convertis en minima mensuels, proratisés selon la quotité de travail ; détection des emplois hors grille |
| [Hôtels, cafés, restaurants (HCR)](rules/1979-hotels-cafes-restaurants/README.md) | 1979 | `2024.1` : 1er décembre 2024 | Minima horaires par niveau et échelon, conversion en minimum mensuel selon la durée du contrat ; détection des niveaux hors grille |
| [Pharmacie d’officine](rules/1996-pharmacie-officine/README.md) | 1996 | `2025.1` : 24 mai 2025 ; `2026.1` : 17 avril 2026 | Minima selon le coefficient, la valeur du point et le salaire garanti au coefficient 100 ; proratisation selon la quotité de travail |
| [Grands magasins et magasins populaires](rules/2156-grands-magasins/README.md) | 2156 | `2024.1` : 1er juin 2024 | Grille mensuelle de 12 positions (employés en 8 échelons, agent de maîtrise, cadres) proratisée selon la quotité de travail, et rémunérations minimales annuelles ; détection des niveaux hors grille |
| [Banque](rules/2120-banque/README.md) | 2120 | `2026.1` : 1er avril 2026 | Salaires annuels minima des 11 niveaux (A à K) selon l’ancienneté (0, 5, 10, 15 et 20 ans), convertis en minimum mensuel sur 13 mensualités et proratisés selon la quotité de travail ; détection des niveaux hors grille |
| [Commerce de détail et de gros à prédominance alimentaire](rules/2216-commerce-detail-gros-predominance-alimentaire/README.md) | 2216 | `2025.1` : 1er août 2025 ; `2026.1` : 1er août 2026 | Salaire minimum mensuel garanti par niveau, pauses rémunérées comprises ; proratisation selon la quotité de travail |
| [Hospitalisation privée (cliniques privées à but lucratif)](rules/2264-hospitalisation-privee/README.md) | 2264 | `2023.1` : 1er janvier 2023 | Salaire de base (coefficient multiplié par la valeur du point de 7,26 €, à partir du coefficient 243), proratisé selon la quotité de travail ; détection du coefficient absent ou inférieur à 176 |
| [Entreprises de courtage d’assurances et de réassurances](rules/2247-courtage-assurances/README.md) | 2247 | `2025.1` : 1er juillet 2025 | Salaires annuels minima des 8 classes (A à H), convertis en minimum mensuel sur 13 mensualités et proratisés selon la quotité de travail ; détection des classes hors grille |
| [Aide, accompagnement, soins et services à domicile](rules/2941-aide-soins-domicile/README.md) | 2941 | `2026.1` : 1er juin 2026 (extension publiée le 23 juillet 2026) | Grilles intervention et support, base avec plancher SMIC, ECR diplôme et ancienneté ; tutorat, apprentissage et astreintes |
| [Particuliers employeurs et emploi à domicile](rules/3239-particuliers-employeurs-emploi-domicile/README.md) | 3239 | `2026.1` : 1er juin 2026 | Minima des 12 niveaux et certifications, socle assistant maternel par enfant, mensualisation, présence responsable de jour, heures additionnelles et prestations en nature |
| [Métallurgie](rules/3248-metallurgie/README.md) | 3248 | `2026.1` : 1er janvier 2026 | Barème national annuel des 18 classes d’emplois (A1 à I18), converti en minimum mensuel et proratisé selon la quotité de travail ; détection des classes hors barème |

Les références des accords et de leurs arrêtés d’extension figurent dans les métadonnées de chaque fichier source.

## Organisation du dépôt

Les répertoires suivent le format `<idcc>-<nom-français-de-la-convention>` et les fichiers le format `<idcc>-<nom>.année.révision.publicodes`. Les noms de chemins utilisent des minuscules et des tirets, sans accents.

## Fonctionnement

### Sources et métadonnées

Chaque fichier `.publicodes` contient deux documents YAML séparés par `---` :

1. Les métadonnées de la version : `validFrom`, sa date d’entrée en vigueur, et `sources`, les références juridiques utilisées.
2. Les règles publicodes : paramètres, grilles et formules de calcul.

Les règles restent en français et sont regroupées sous l’espace de noms `salarié . convention collective . <valeur>`. Elles s’appuient sur les règles de `modele-social`, par exemple pour le statut cadre ou le temps de travail du contrat.

### Compilation et chargement

La commande `npm run compile-rules` :

- Vérifie le nom et le répertoire de chaque fichier, sa date d’effet et la présence de références juridiques.
- Vérifie le verrouillage des versions déjà enregistrées.
- Convertit les règles YAML en fichiers JSON dans `src/compiled/`.
- Génère un index des versions, triées par date d’effet puis par année et révision.

La commande `npm run build` lance cette compilation, puis produit le JavaScript ESM et les déclarations TypeScript dans `dist/`. Les fichiers générés ne sont pas suivis par Git.

Le package expose `COMPILED_VERSIONS`. Chaque version fournit `version`, `validFrom`, `contentHash`, `sources` et une fonction asynchrone `loadRules()`. Les règles JSON sont chargées à la demande : aucun parseur YAML n’est nécessaire dans l’application qui les consomme.

### Versions immuables

`rules/versions.lock.json` conserve l’empreinte de chaque version. Une version publiée ne doit jamais être modifiée ou supprimée : une correction ou une nouvelle grille donne lieu à un nouveau fichier, par exemple `1486-syntec.2025.2.publicodes`.

L’empreinte est calculée à partir de la date d’effet et des règles : SHA-256 de `JSON.stringify({ validFrom, rules })`, tronqué à 16 caractères hexadécimaux. Ce format conserve les empreintes historiques de JourDePaye. Les références juridiques sont exportées, mais ne font pas partie de cette empreinte.

Une nouvelle version est ajoutée au verrou lors de sa première compilation. Pendant son développement, vous pouvez retirer son entrée du verrou pour poursuivre les modifications, **uniquement si elle n’a jamais été publiée**. La compilation refuse une modification des règles ou de la date d’effet d’une version verrouillée, ainsi que la disparition de son fichier.

La version du package, par exemple `0.1.0`, est distincte des versions des conventions, comme `2025.1` : une distribution du package contient plusieurs conventions et leurs versions historiques.

### Intégration avec un moteur de calcul

Ces modèles complètent `modele-social`. Le package ne crée pas de moteur Publicodes et ne calcule pas, à lui seul, un bulletin de paie.

L’application qui l’utilise choisit la version applicable à la date souhaitée, ajoute si nécessaire la convention aux choix de `salarié . convention collective`, puis fusionne ses règles avec celles de `modele-social`. Elle doit refuser les définitions de règles en double. Pour modifier une règle de base, les modèles utilisent les mécanismes publicodes `remplace` ou `rend non applicable`.

Dans JourDePaye, `payroll-core` conserve le catalogue métier, la sélection de la version au premier jour de la période, la correspondance avec les données du salarié et le calcul de paie. Ces choix de période ne sont pas imposés par ce package.

## Utiliser le package

Le package n’est pas encore publié sur le registre npm. Il peut être installé depuis le dépôt public ; pour une installation reproductible, remplacez `<commit>` par le hash complet du commit choisi :

```sh
npm install "git+https://github.com/JourDePaye/conventions-collectives.git#<commit>"
```

L’installation depuis Git construit le package grâce au script `prepare`. Elle nécessite Node.js 24 ou plus récent, npm et Git. Les applications consommatrices doivent également disposer de versions compatibles de `publicodes` et de `modele-social` ; les tests actuels utilisent `publicodes@1.10.3` et `modele-social@11.1.0`.

Exemple de chargement d’une version précise :

```ts
import { COMPILED_VERSIONS } from "conventions-collectives";

const version = COMPILED_VERSIONS["1486-syntec"]?.find(
  (candidate) => candidate.version === "2025.1",
);
if (!version) throw new Error("Unknown agreement version");

const rules = await version.loadRules();
```

Le package distribue les règles JSON, le JavaScript, les déclarations TypeScript et les sources `.publicodes`. `npm pack` construit une archive installable localement, sans publication sur le registre npm.

## Développer et lancer les tests

Avec Node.js 24 ou plus récent :

```sh
git clone https://github.com/JourDePaye/conventions-collectives.git
cd conventions-collectives
npm ci
npm test
```

`npm ci` installe les dépendances verrouillées et construit le package. `npm test` compile d’abord les sources, puis exécute tous les fichiers `test/**/*.test.ts` avec le moteur de tests intégré à Node.js. Une erreur de compilation ou un test en échec fait échouer la commande.

Trente-six ensembles de tests sont présents :

- `test/compile-collective-agreements.test.ts` teste le compilateur avec des fichiers temporaires : nommage, métadonnées, dates, ajout d’une version, modification ou suppression d’une version verrouillée.
- `test/models.test.ts` vérifie les versions exportées et leurs empreintes, la présence des références juridiques, les espaces de noms, l’absence de collisions avec `modele-social` et des calculs de minima pour chacune des vingt-trois versions.
- `test/acteurs-lien-social-familial.test.ts` couvre le socle 2026, les points de pesée, les points d'expérience professionnelle, le temps partiel, les valeurs invalides et l'inapplicabilité hors convention.
- `test/aide-soins-domicile.test.ts` couvre les 36 positions des deux filières IDCC 2941, les paliers d’ancienneté, les diplômes, le plancher SMIC, le reclassement, le temps partiel et les ECR ponctuels. Les coefficients et montants attendus sont fixés à partir des textes, indépendamment du YAML.
- `test/particuliers-employeurs.test.ts` couvre les 12 niveaux IDCC 3239 avec et sans certification, les taux et montants mensuels publiés, les deux socles, les planchers légaux, le temps partiel, la présence responsable, l’année incomplète, le mode réel, les heures additionnelles, les prestations en nature, les entrées invalides et l’inapplicabilité hors convention. Les valeurs attendues sont indépendantes du YAML.
- `test/services-automobile.test.ts` couvre les 34 positions IDCC 1090 (échelons 1 à 12 et 17 à 25, niveaux et degrés des cadres), la quotité, les échelons et niveaux hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’avenant n° 110, indépendamment du YAML.
- `test/boulangerie-patisserie-artisanale.test.ts` couvre les 10 coefficients IDCC 843 dans les trois zones, les cadres 1 et 2, la quotité, les formules de l’avenant national, les niveaux hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux des trois textes, indépendamment du YAML.
- `test/industrie-laitiere.test.ts` couvre les 28 positions IDCC 0112, la quotité, les classifications hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’avenant n° 57, indépendamment du YAML.
- `test/commerces-services-audiovisuel.test.ts` couvre les 16 positions IDCC 1686 (12 minima mensuels et 4 rémunérations annuelles de cadres), la quotité, les classifications hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’avenant n° 63, indépendamment du YAML.
- `test/commerce-detail-non-alimentaire.test.ts` couvre les 9 niveaux IDCC 1517, la quotité, les niveaux hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’avenant n° 15, indépendamment du YAML.
- `test/courtage-assurances.test.ts` couvre les 8 classes IDCC 2247, la conversion en treizièmes, la quotité, les classes hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’avenant du 19 juin 2025, indépendamment du YAML.
- `test/societes-assurances.test.ts` couvre les 7 classes IDCC 1672, la conversion en treizièmes, la quotité, les classes hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux du protocole du 10 juin 2026, indépendamment du YAML.
- `test/banque.test.ts` couvre les 11 niveaux IDCC 2120 (chaque palier d’ancienneté et son seuil), la conversion en treizièmes, la quotité, les niveaux hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’accord du 16 avril 2026, indépendamment du YAML.
- `test/cabinets-dentaires.test.ts` couvre les 9 emplois IDCC 1619, la quotité, les emplois hors grille et l’inapplicabilité hors convention. Les taux horaires attendus sont ceux de l’accord du 12 février 2026, multipliés par 151,67 heures indépendamment du YAML.
- `test/cabinets-medicaux.test.ts` couvre les 13 positions IDCC 1147, la quotité, les positions hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’avenant n° 90, indépendamment du YAML.
- `test/hospitalisation-privee.test.ts` couvre la formule IDCC 2264 (coefficient multiplié par la valeur du point à partir de 243), la quotité, les coefficients absents ou inférieurs à 176 et l’inapplicabilité hors convention. Les montants attendus sont calculés à la main à partir de la valeur du point citée, indépendamment du YAML.
- `test/etablissements-prives-non-lucratifs.test.ts` couvre la formule IDCC 29 (coefficient multiplié par la valeur du point), la quotité, le coefficient absent et l’inapplicabilité hors convention. Les montants attendus sont calculés à la main à partir de la valeur du point citée, indépendamment du YAML.
- `test/personnes-handicapees.test.ts` couvre la formule IDCC 413 (coefficient multiplié par la valeur du point, avec et sans adhésion à Nexem), la quotité, le coefficient absent et l’inapplicabilité hors convention. Les montants attendus sont calculés à la main à partir des valeurs du point citées, indépendamment du YAML.
- `test/transports-routiers.test.ts` couvre les classifications IDCC 16 des quatre sous-secteurs (chaque palier d’ancienneté et son seuil), la quotité, les classifications hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux des textes cités, indépendamment du YAML.
- `test/industrie-petrole.test.ts` couvre la formule IDCC 1388 (sept montants publiés, surmajoration sous le coefficient 215), la quotité, les coefficients hors plage et l’inapplicabilité hors convention. Les montants attendus sont ceux publiés pour l’accord du 27 novembre 2025, indépendamment du YAML.
- `test/industries-textiles.test.ts` couvre les 21 positions IDCC 18, la quotité, les niveaux hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’accord du 17 juin 2026, indépendamment du YAML.
- `test/plasturgie.test.ts` couvre les 15 coefficients IDCC 292, la quotité, les coefficients hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’accord du 19 février 2026, indépendamment du YAML.
- `test/fabrication-ameublement.test.ts` couvre les 36 échelons IDCC 1411, la quotité, les échelons hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’accord du 28 mai 2026, indépendamment du YAML.
- `test/industries-chimiques.test.ts` couvre les 23 coefficients IDCC 44, leur cohérence avec la formule de l’accord, la quotité, les coefficients hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’accord du 3 décembre 2025, indépendamment du YAML.
- `test/metallurgie.test.ts` couvre les 18 classes IDCC 3248, la conversion du minimum annuel en minimum mensuel, la quotité, les classes hors barème et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’avenant du 20 février 2026, indépendamment du YAML.
- `test/grands-magasins.test.ts` couvre les 12 positions IDCC 2156 (minima mensuels et annuels), la quotité, les niveaux hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’avenant du 17 avril 2024, indépendamment du YAML.
- `test/bureau-numerique.test.ts` couvre les 12 niveaux IDCC 1539, le passage du niveau A1 au minimum A2 après un an d’ancienneté, la quotité, les niveaux hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’accord du 2 avril 2025, indépendamment du YAML.
- `test/succursales-habillement.test.ts` couvre les 9 catégories IDCC 675, la quotité, les catégories hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’accord du 16 avril 2026, indépendamment du YAML.
- `test/commerce-detail-habillement-textiles.test.ts` couvre les 13 catégories IDCC 1483, les 60 paliers de prime d’ancienneté des employés et des agents de maîtrise A1 et A2, les 18 minima des catégories B, C et D selon l’ancienneté, la quotité, le calcul de l’ancienneté depuis la date d’embauche, les catégories hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’avenant n° 29, indépendamment du YAML.
- `test/commerces-de-gros.test.ts` couvre les 28 positions IDCC 573 (18 minima mensuels et 10 minima annuels), la quotité, les niveaux et échelons hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’accord du 17 mars 2026, indépendamment du YAML.
- `test/industries-charcutieres.test.ts` couvre les 49 coefficients IDCC 1586, la quotité, les coefficients hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’accord du 16 janvier 2026, indépendamment du YAML.
- `test/industrie-commerces-gros-viandes.test.ts` couvre les 30 positions IDCC 1534, la quotité, les niveaux et échelons hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’avenant n° 100, indépendamment du YAML.
- `test/commerce-detail-alimentaire-non-specialise.test.ts` couvre les 11 niveaux IDCC 1505, la quotité, les minima annuels des cadres au forfait jours (seuil de 36 mois dans le niveau), les niveaux hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’accord du 10 février 2026, indépendamment du YAML.
- `test/restauration-rapide.test.ts` couvre les 14 positions IDCC 1501 (taux horaires des niveaux I à IV, minima annuels du niveau V), l’application du taux horaire aux heures du contrat, le temps partiel, les niveaux et échelons hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux de l’avenant n° 72, indépendamment du YAML.
- `test/organismes-formation.test.ts` couvre les 31 paliers IDCC 1516 des grilles 2025 et 2027 (bornes de chaque fourchette de coefficient), la conversion en minimum mensuel, la quotité, les coefficients hors grille et l’inapplicabilité hors convention. Les montants attendus sont ceux des avenants, indépendamment du YAML.
- `test/prevention-securite.test.ts` couvre les 25 positions IDCC 1351, les coefficients présents dans plusieurs catégories, la quotité, les paliers d’ancienneté, les majorations nuit et dimanche, le repos, les indemnités et le complément de rémunération des périodes de travail.

Pour exécuter uniquement les tests IDCC 843 :

```sh
npm run compile-rules
node --test test/boulangerie-patisserie-artisanale.test.ts
```

Pour exécuter uniquement les tests IDCC 1686 :

```sh
npm run compile-rules
node --test test/commerces-services-audiovisuel.test.ts
```

Pour exécuter uniquement les tests IDCC 675 :

```sh
npm run compile-rules
node --test test/succursales-habillement.test.ts
```

Pour exécuter uniquement les tests IDCC 1539 :

```sh
npm run compile-rules
node --test test/bureau-numerique.test.ts
```

Pour exécuter uniquement les tests IDCC 2156 :

```sh
npm run compile-rules
node --test test/grands-magasins.test.ts
```

Pour exécuter uniquement les tests IDCC 3248 :

```sh
npm run compile-rules
node --test test/metallurgie.test.ts
```

Pour exécuter uniquement les tests IDCC 44 :

```sh
npm run compile-rules
node --test test/industries-chimiques.test.ts
```

Pour exécuter uniquement les tests IDCC 1411 :

```sh
npm run compile-rules
node --test test/fabrication-ameublement.test.ts
```

Pour exécuter uniquement les tests IDCC 292 :

```sh
npm run compile-rules
node --test test/plasturgie.test.ts
```

Pour exécuter uniquement les tests IDCC 18 :

```sh
npm run compile-rules
node --test test/industries-textiles.test.ts
```

Pour exécuter uniquement les tests IDCC 1388 :

```sh
npm run compile-rules
node --test test/industrie-petrole.test.ts
```

Pour exécuter uniquement les tests IDCC 16 :

```sh
npm run compile-rules
node --test test/transports-routiers.test.ts
```

Pour exécuter uniquement les tests IDCC 413 :

```sh
npm run compile-rules
node --test test/personnes-handicapees.test.ts
```

Pour exécuter uniquement les tests IDCC 29 :

```sh
npm run compile-rules
node --test test/etablissements-prives-non-lucratifs.test.ts
```

Pour exécuter uniquement les tests IDCC 2264 :

```sh
npm run compile-rules
node --test test/hospitalisation-privee.test.ts
```

Pour exécuter uniquement les tests IDCC 1147 :

```sh
npm run compile-rules
node --test test/cabinets-medicaux.test.ts
```

Pour exécuter uniquement les tests IDCC 1619 :

```sh
npm run compile-rules
node --test test/cabinets-dentaires.test.ts
```

Pour exécuter uniquement les tests IDCC 2120 :

```sh
npm run compile-rules
node --test test/banque.test.ts
```

Pour exécuter uniquement les tests IDCC 1672 :

```sh
npm run compile-rules
node --test test/societes-assurances.test.ts
```

Pour exécuter uniquement les tests IDCC 2247 :

```sh
npm run compile-rules
node --test test/courtage-assurances.test.ts
```

Pour exécuter uniquement les tests IDCC 1517 :

```sh
npm run compile-rules
node --test test/commerce-detail-non-alimentaire.test.ts
```

Pour exécuter uniquement les tests IDCC 1483 :

```sh
npm run compile-rules
node --test test/commerce-detail-habillement-textiles.test.ts
```

Pour exécuter uniquement les tests IDCC 573 :

```sh
npm run compile-rules
node --test test/commerces-de-gros.test.ts
```

Pour exécuter uniquement les tests IDCC 1586 :

```sh
npm run compile-rules
node --test test/industries-charcutieres.test.ts
```

Pour exécuter uniquement les tests IDCC 1534 :

```sh
npm run compile-rules
node --test test/industrie-commerces-gros-viandes.test.ts
```

Pour exécuter uniquement les tests IDCC 1505 :

```sh
npm run compile-rules
node --test test/commerce-detail-alimentaire-non-specialise.test.ts
```

Pour exécuter uniquement les tests IDCC 1501 :

```sh
npm run compile-rules
node --test test/restauration-rapide.test.ts
```

Pour exécuter uniquement les tests IDCC 1516 :

```sh
npm run compile-rules
node --test test/organismes-formation.test.ts
```

Pour exécuter uniquement les tests IDCC 1090 :

```sh
npm run compile-rules
node --test test/services-automobile.test.ts
```

Pour exécuter uniquement les tests IDCC 1351 :

```sh
npm run compile-rules
node --test test/prevention-securite.test.ts
```

Pour exécuter uniquement les tests IDCC 3239 :

```sh
npm run compile-rules
node --test test/particuliers-employeurs.test.ts
```

Pour exécuter uniquement les tests IDCC 2941 :

```sh
npm run compile-rules
node --test test/aide-soins-domicile.test.ts
```

Pour exécuter uniquement les tests des modèles :

```sh
npm run compile-rules
node --test test/models.test.ts
```

Pour exécuter uniquement les tests du compilateur :

```sh
node --test test/compile-collective-agreements.test.ts
```

Avant de proposer une contribution, lancez également :

```sh
npm run typecheck
npm run build
npm pack --dry-run
```

Ces commandes vérifient respectivement les types TypeScript, la construction du package et la liste des fichiers inclus dans son archive. La CI GitHub exécute les tests et ces vérifications à chaque push et pull request.

## Publier sur npm

Le workflow [Publish to npm](.github/workflows/publish.yml) construit et publie `conventions-collectives` sur le registre npm public. Il exécute les tests, vérifie les types et le verrou des versions, puis construit une archive et vérifie le chargement de toutes ses règles avant de la publier. La publication inclut une attestation de provenance.

### Configurer l’authentification

Le compte utilisé doit avoir le droit de publier dans le scope npm `@jourdepaye`.

Pour la première publication, si le package n’existe pas encore, ajoutez un token npm granulaire dans le secret GitHub **`NPM_TOKEN`** du dépôt (Settings → Secrets and variables → Actions). Le token doit autoriser la création et la publication du package dans ce scope, avec l’option permettant de contourner la 2FA pour la CI.

Une fois le package créé, configurez son **Trusted Publisher** dans les paramètres du package sur npmjs.com :

- Fournisseur : **GitHub Actions**.
- Organisation GitHub : **`JourDePaye`**.
- Dépôt : **`conventions-collectives`**.
- Nom du workflow : **`publish.yml`** (sans le chemin `.github/workflows/`).
- Environnement : laissez ce champ vide ; le workflow n’utilise pas d’environnement GitHub.

Cette configuration permet les publications suivantes par OIDC, sans token npm stocké. Après vérification d’une publication OIDC réussie, vous pouvez supprimer le secret `NPM_TOKEN` et révoquer le token de démarrage. Voir la [documentation npm du trusted publishing](https://docs.npmjs.com/trusted-publishers/).

### Déclencher une publication

Depuis la branche `main`, avec un répertoire de travail propre, mettez à jour la version du package et son lockfile, puis poussez le commit et le tag correspondant :

```sh
npm version patch
git push origin main
git push origin --tags
```

`npm version patch` crée le commit de version et un tag `vX.Y.Z`. Vous pouvez utiliser `minor` ou `major` selon la nature du changement. Pour publier la version initiale `0.1.0`, déjà renseignée dans le package :

```sh
git tag v0.1.0
git push origin v0.1.0
```

Un tag déclenche la publication seulement si son nom correspond exactement à la version de `package.json`. Les versions stables sont publiées sous le dist-tag npm `latest` ; les préversions, comme `0.2.0-beta.1`, sous `next`. Une version npm déjà publiée ne peut pas être publiée à nouveau : incrémentez la version pour une nouvelle distribution.

Vous pouvez aussi ouvrir **Actions → Publish to npm → Run workflow** sur `main` ou sur un tag `v…`. L’option **`dry_run`**, activée par défaut, vérifie le processus sans publier et sans identifiants npm. Désactivez-la pour effectuer une publication réelle de la version choisie.

## Contribuer

Les contributions sont les bienvenues, qu’il s’agisse d’une nouvelle convention, d’une nouvelle grille, de dispositions encore absentes ou d’une amélioration des tests et de la documentation. Vous pouvez ouvrir une issue pour discuter d’un sujet ou proposer directement une pull request.

Pour ajouter ou enrichir un modèle :

1. Identifiez la convention, son IDCC, les textes applicables et leur date d’effet. Renseignez les accords et arrêtés d’extension dans `sources`.
2. Créez le répertoire et le fichier correspondant au nommage du dépôt. Pour une convention existante, ajoutez une nouvelle version sans modifier les versions publiées.
3. Écrivez les règles dans l’espace de noms de la convention, avec les conditions d’applicabilité nécessaires.
4. Ajoutez des cas de test dont les montants attendus viennent des textes de référence, indépendamment du fichier YAML. Étendez `test/models.test.ts` pour couvrir la nouvelle version.
5. Exécutez les tests et les vérifications ci-dessus, puis incluez le verrou mis à jour dans votre pull request.

Une nouvelle convention est automatiquement ajoutée à l’index lors de la compilation. Son intégration à une application de paie peut demander des adaptations supplémentaires dans cette application.
