# Conventions collectives françaises en publicodes

L’objectif de ce projet est de mettre à disposition **l’ensemble des conventions collectives françaises en langage [publicodes](https://publi.codes)**, sous une forme lisible, versionnée et réutilisable dans des outils de calcul.

Le dépôt contient les modèles de conventions collectives, leurs références juridiques, leur compilateur et leurs tests. Il produit le package `@jourdepaye/conventions-collectives`, utilisé notamment par JourDePaye pour compléter les règles de `modele-social`.

**Les contributions sont les bienvenues !** Vous pouvez proposer une nouvelle convention, enrichir une convention existante, ajouter des tests, améliorer les références aux textes ou la documentation.

## Conventions déjà présentes

Cinq conventions sont actuellement représentées, avec sept versions de modèles. Leur couverture porte sur les salaires minima et la classification nécessaire à leur calcul ; la présence d’une convention ne signifie pas que toutes ses dispositions sont déjà modélisées.

| Convention | IDCC | Versions et dates d’effet | Règles présentes |
|---|---|---|---|
| Bureaux d’études techniques, cabinets d’ingénieurs-conseils et sociétés de conseils (Syntec) | 1486 | `2025.1` : 1er janvier 2025 | Minima mensuels des ETAM et des ingénieurs et cadres selon leur coefficient ; détection des coefficients hors grille |
| Hôtels, cafés, restaurants (HCR) | 1979 | `2024.1` : 1er décembre 2024 | Minima horaires par niveau et échelon, conversion en minimum mensuel selon la durée du contrat ; détection des niveaux hors grille |
| Pharmacie d’officine | 1996 | `2025.1` : 24 mai 2025 ; `2026.1` : 17 avril 2026 | Minima selon le coefficient, la valeur du point et le salaire garanti au coefficient 100 ; proratisation selon la quotité de travail |
| Commerce de détail et de gros à prédominance alimentaire | 2216 | `2025.1` : 1er août 2025 ; `2026.1` : 1er août 2026 | Salaire minimum mensuel garanti par niveau, pauses rémunérées comprises ; proratisation selon la quotité de travail |
| Aide, accompagnement, soins et services à domicile | 2941 | `2026.1` : 1er juin 2026 (extension publiée le 23 juillet 2026) | Grilles intervention et support, base avec plancher SMIC, ECR diplôme et ancienneté ; tutorat, apprentissage et astreintes |

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
  2941-aide-soins-domicile/
    2941-aide-soins-domicile.2026.1.publicodes
  versions.lock.json
scripts/
  compile-collective-agreements.ts
src/
  index.ts
  compiled/                            # Generated files
test/
  compile-collective-agreements.test.ts
  models.test.ts
  aide-soins-domicile.test.ts
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

## Modèle aide et soins à domicile — IDCC 2941

Le modèle `2941-aide-soins-domicile`, valeur Publicodes `aide et soins à domicile`, reprend les coefficients de l’[avenant 75/2026](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054880770/), avec effet au 1er juin 2026 après l’agrément publié le 29 mai. Pour les employeurs non adhérents, cette date est prévue sous réserve de l’extension, publiée le 23 juillet 2026. Cette version ne fournit pas les grilles antérieures à juin 2026.

Les deux filières, `intervention` et `support`, comprennent chacune les catégories `employé`, `TAM` et `cadre`, deux degrés et trois échelons. Renseignez `niveau` au format `employé.2.1`, `TAM.1.1` ou `cadre.2.3`. La filière vaut `intervention` par défaut. La classification et les passages d’échelon doivent être déterminés par l’application selon les missions, les diplômes et les critères conventionnels ; ils ne sont pas déduits automatiquement de l’ancienneté. L’aide-soignant relève de TAM degré 1 depuis l’[avenant 70/2025](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054040668/). Un niveau inconnu donne un minimum nul et active `niveau hors grille` : l’application doit traiter cette anomalie.

La règle `salaire minimum conventionnel` additionne la base, l’ECR diplôme, l’ECR ancienneté et les autres ECR pérennes attribués. La base à temps plein est le coefficient multiplié par 5,77 €, augmenté d’une éventuelle `indemnité différentielle de reclassement` individuelle, avec un plancher égal au `SMIC` de `modele-social`. La date du calcul doit donc être fournie au moteur. Les montants suivent la `salarié . contrat . temps de travail . quotité`, sans double proratisation.

Paramètres complémentaires sous `salarié . convention collective . aide et soins à domicile` :

- `niveau de diplôme` : 0 sans diplôme éligible, sinon niveau 3 à 8 d’un diplôme reconnu en lien avec les missions. Un seul niveau est retenu, sans cumul automatique de diplômes.
- `ancienneté dans la branche` : années avec une fraction pour les jours depuis l’anniversaire, en tenant compte de l’ancienneté reprise. Un palier s’ouvre le lendemain de l’anniversaire de 5, 10, 15, 20, 25 ou 30 ans. Son assiette comprend le différentiel SMIC, et exclut les autres ECR.
- `autres ECR pérennes en points` : les ECR spécifiques aux cadres doivent être déterminés par l’application à partir de l’article III.19.3, puis fournis ici. Le modèle ne décide pas de leur attribution.
- `personnes tutorées` et `apprentis accompagnés` : effectifs accompagnés pendant le mois au titre des missions conventionnelles. Les forfaits correspondants restent entiers à temps partiel.
- `heures astreinte ordinaire`, `heures astreinte majorée`, `heures astreinte fractionnée ordinaire`, `heures astreinte fractionnée majorée` : quatre compteurs disjoints en `heure/mois`. Les périodes majorées concernent les dimanches, jours fériés ou nuits ; les temps d’intervention sont exclus. Les indemnités sont calculées sur les heures réellement déclarées, sans prorata supplémentaire du contrat.

Les ECR de tutorat, apprentissage et astreinte sont exposés séparément, avec leur somme dans `compléments ponctuels calculés`. L’application doit les ajouter à la rémunération pour les mois concernés ; ils ne sont pas incorporés au minimum récurrent pour éviter un ajout en double. Les majorations de travail de nuit, dimanche et jours fériés, les repos compensateurs, les heures supplémentaires, les frais de déplacement, les absences et les autres dispositions de la convention restent à modéliser. Les évolutions non étendues de l’avenant 74/2026 sont exclues de ce modèle général.

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

Trois ensembles de tests sont présents :

- `test/compile-collective-agreements.test.ts` teste le compilateur avec des fichiers temporaires : nommage, métadonnées, dates, ajout d’une version, modification ou suppression d’une version verrouillée.
- `test/models.test.ts` vérifie les versions exportées et leurs empreintes, la présence des références juridiques, les espaces de noms, l’absence de collisions avec `modele-social` et des calculs de minima pour chacune des sept versions.
- `test/aide-soins-domicile.test.ts` couvre les 36 positions des deux filières IDCC 2941, les paliers d’ancienneté, les diplômes, le plancher SMIC, le reclassement, le temps partiel et les ECR ponctuels. Les coefficients et montants attendus sont fixés à partir des textes, indépendamment du YAML.

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

Le workflow [Publish to npm](.github/workflows/publish.yml) construit et publie `@jourdepaye/conventions-collectives` sur le registre npm public. Il exécute les tests, vérifie les types et le verrou des versions, puis construit une archive et vérifie le chargement de toutes ses règles avant de la publier. La publication inclut une attestation de provenance.

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
