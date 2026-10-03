# Conventions collectives françaises en publicodes

L’objectif de ce projet est de mettre à disposition **l’ensemble des conventions collectives françaises en langage [publicodes](https://publi.codes)**, sous une forme lisible, versionnée et réutilisable dans des outils de calcul.

Le dépôt contient les modèles de conventions collectives, leurs références juridiques, leur compilateur et leurs tests. Il produit le package `@jourdepaye/conventions-collectives`, utilisé notamment par JourDePaye pour compléter les règles de `modele-social`.

**Les contributions sont les bienvenues !** Vous pouvez proposer une nouvelle convention, enrichir une convention existante, ajouter des tests, améliorer les références aux textes ou la documentation.

## Conventions déjà présentes

Quatre conventions sont actuellement représentées, avec six versions de modèles. Leur couverture porte sur les salaires minima et la classification nécessaire à leur calcul ; la présence d’une convention ne signifie pas que toutes ses dispositions sont déjà modélisées.

| Convention | IDCC | Versions et dates d’effet | Règles présentes |
|---|---|---|---|
| Bureaux d’études techniques, cabinets d’ingénieurs-conseils et sociétés de conseils (Syntec) | 1486 | `2025.1` : 1er janvier 2025 | Minima mensuels des ETAM et des ingénieurs et cadres selon leur coefficient ; détection des coefficients hors grille |
| Hôtels, cafés, restaurants (HCR) | 1979 | `2024.1` : 1er décembre 2024 | Minima horaires par niveau et échelon, conversion en minimum mensuel selon la durée du contrat ; détection des niveaux hors grille |
| Pharmacie d’officine | 1996 | `2025.1` : 24 mai 2025 ; `2026.1` : 17 avril 2026 | Minima selon le coefficient, la valeur du point et le salaire garanti au coefficient 100 ; proratisation selon la quotité de travail |
| Commerce de détail et de gros à prédominance alimentaire | 2216 | `2025.1` : 1er août 2025 ; `2026.1` : 1er août 2026 | Salaire minimum mensuel garanti par niveau, pauses rémunérées comprises ; proratisation selon la quotité de travail |

Les références des accords et de leurs arrêtés d’extension figurent dans les métadonnées de chaque fichier source.

## Organisation du dépôt

```text
rules/
  1486-syntec/
    1486-syntec.2025.1.publicodes
  1979-hotels-cafes-restaurants/
    1979-hotels-cafes-restaurants.2024.1.publicodes
  1996-pharmacie-officine/
    1996-pharmacie-officine.2025.1.publicodes
    1996-pharmacie-officine.2026.1.publicodes
  2216-commerce-detail-gros-predominance-alimentaire/
    2216-commerce-detail-gros-predominance-alimentaire.2025.1.publicodes
    2216-commerce-detail-gros-predominance-alimentaire.2026.1.publicodes
  versions.lock.json
scripts/
  compile-collective-agreements.ts
src/
  index.ts
  compiled/                            # Generated files
test/
  compile-collective-agreements.test.ts
  models.test.ts
```

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
import { COMPILED_VERSIONS } from "@jourdepaye/conventions-collectives";

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

Deux ensembles de tests sont présents :

- `test/compile-collective-agreements.test.ts` teste le compilateur avec des fichiers temporaires : nommage, métadonnées, dates, ajout d’une version, modification ou suppression d’une version verrouillée.
- `test/models.test.ts` vérifie les versions exportées et leurs empreintes, la présence des références juridiques, les espaces de noms, l’absence de collisions avec `modele-social` et des calculs de minima pour chacune des six versions.

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

## Contribuer

Les contributions sont les bienvenues, qu’il s’agisse d’une nouvelle convention, d’une nouvelle grille, de dispositions encore absentes ou d’une amélioration des tests et de la documentation. Vous pouvez ouvrir une issue pour discuter d’un sujet ou proposer directement une pull request.

Pour ajouter ou enrichir un modèle :

1. Identifiez la convention, son IDCC, les textes applicables et leur date d’effet. Renseignez les accords et arrêtés d’extension dans `sources`.
2. Créez le répertoire et le fichier correspondant au nommage du dépôt. Pour une convention existante, ajoutez une nouvelle version sans modifier les versions publiées.
3. Écrivez les règles dans l’espace de noms de la convention, avec les conditions d’applicabilité nécessaires.
4. Ajoutez des cas de test dont les montants attendus viennent des textes de référence, indépendamment du fichier YAML. Étendez `test/models.test.ts` pour couvrir la nouvelle version.
5. Exécutez les tests et les vérifications ci-dessus, puis incluez le verrou mis à jour dans votre pull request.

Une nouvelle convention est automatiquement ajoutée à l’index lors de la compilation. Son intégration à une application de paie peut demander des adaptations supplémentaires dans cette application.
