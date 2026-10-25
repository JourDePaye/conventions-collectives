# Conventions collectives françaises en publicodes

L’objectif de ce projet est de mettre à disposition **l’ensemble des conventions collectives françaises en langage [publicodes](https://publi.codes)**, sous une forme lisible, versionnée et réutilisable dans des outils de calcul.

Le dépôt contient les modèles de conventions collectives, leurs références juridiques, leur compilateur et leurs tests. Il produit le package [`conventions-collectives`](https://www.npmjs.com/package/conventions-collectives), utilisé notamment par JourDePaye pour compléter les règles de [`modele-social`](https://www.npmjs.com/package/modele-social).

> **Bêta.** Le package est en cours de constitution : tant que dure la bêta, une version déjà publiée (version de modèle ou version npm) peut encore être corrigée ou réécrite. Les versions npm portent le suffixe `-beta` (par exemple `2026.10.1-beta`), où `2026.10` est l’année et le mois de publication.

**Cent quatre-vingt-dix conventions** sont actuellement représentées, avec **trois cent soixante-treize versions de modèles**. Leur couverture porte sur les salaires minima, la classification nécessaire à leur calcul et certains compléments de rémunération ; la présence d’une convention ne signifie pas que toutes ses dispositions sont déjà modélisées. Elles sont regroupées par thème, puis classées par numéro IDCC.

**Les contributions sont les bienvenues !** Vous pouvez proposer une nouvelle convention, enrichir une convention existante, ajouter des tests, améliorer les références aux textes ou la documentation.

## Conventions déjà présentes

Le détail de chaque thème (convention, IDCC, versions et dates d’effet, règles présentes) figure dans un README par thème :

| Thème | IDCC couvertes |
|---|---|
| [Services, ingénierie & numérique](themes/services-ingenierie-numerique/README.md) | 32 |
| [Hôtellerie, restauration & alimentation](themes/hotellerie-restauration-alimentation/README.md) | 21 |
| [Commerce & distribution (non alimentaire)](themes/commerce-distribution-non-alimentaire/README.md) | 24 |
| [Industrie, métallurgie & chimie](themes/industrie-metallurgie-chimie/README.md) | 25 |
| [Bâtiment & travaux publics](themes/batiment-travaux-publics/README.md) | 13 |
| [Transport & logistique](themes/transport-logistique/README.md) | 7 |
| [Santé & action sociale](themes/sante-action-sociale/README.md) | 14 |
| [Banque, assurance & finance](themes/banque-assurance-finance/README.md) | 17 |
| [Culture, médias & autres](themes/culture-medias-autres/README.md) | 35 |
| [Immobilier & habitat](themes/immobilier-habitat/README.md) | 2 |
| **Total** | **190** |

Les références des accords et de leurs arrêtés d’extension figurent dans les métadonnées de chaque fichier source.

## Organisation du dépôt

Les répertoires suivent le format `<idcc>-<nom-français-de-la-convention>` et les fichiers le format `<idcc>-<nom>.année.révision.publicodes`. Les noms de chemins utilisent des minuscules et des tirets, sans accents.

Une version commune à plusieurs conventions vit dans `rules/commun/<nom>/<nom>.année.révision.publicodes` : ses métadonnées listent les conventions qui la publient (`agreements`), et la compilation la publie sous chacune, comme si chaque répertoire avait le fichier. Une convention ne peut pas avoir à la fois son propre fichier et un fichier commun pour la même version. Exemple : le bâtiment (`rules/commun/batiment/`).

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

L’application qui l’utilise choisit la version applicable à la date souhaitée, ajoute si nécessaire la convention aux choix de `salarié . convention collective`, puis fusionne ses règles avec celles de `modele-social`. Elle doit refuser les définitions de règles en double, sauf les quatre exceptions structurelles Sport `2026.1` et `2026.2` (la `2026.3` n’en a plus) détaillées dans [son README](rules/2511-sport/README.md) et autorisées par clé/version exactes dans les tests. Pour modifier une règle de base, les modèles utilisent les mécanismes publicodes `remplace` ou `rend non applicable`.

### Maintien de salaire

Certaines versions décrivent le maintien de salaire conventionnel en cas de maladie, d’accident, de maternité, de paternité ou d’adoption, sous `<convention> . maintien de salaire` : 1486 (`2026.4`), 3248 (`2026.5`), 1979 (`2024.4`, `2026.3`), 2216 (`2026.5`), 1517 (`2026.2`), 1501 (`2026.3`, `2026.4`), 3043 (`2026.2`), 1090 (`2026.2`), 44 (`2026.5`), 2120 (`2026.3`), puis 16 (`2026.4`), 573 (`2026.3`), 787 (`2026.3`), 843 (`2026.3`), 1043 (`2026.5`), 1266 (`2025.2`), 1351 (`2026.5`), 1413 (`2026.2`), 1483 (`2026.6`), 1505 (`2026.6`), 1527 (`2026.3`), 1606 (`2025.3`), 1672 (`2026.5`), 2098 (`2026.3`), 2511 (`2026.5`) et 2941 (`2026.2`). Pour 2264, 2596, 3127 et 3239, le complément relève d’un régime de prévoyance assuré, pas d’un maintien par l’employeur : il n’est pas décrit. Le package ne calcule pas l’indemnité : il donne, pour un motif et une ancienneté, les paramètres que l’application applique jour par jour.

- Entrées : `motif` (`'maladie'`, `'accident du travail'`, maladie professionnelle comprise, `'accident de trajet'`, `'maternité'`, `'paternité'` ou `'adoption'`), `ancienneté` (en mois) et, quand la version les définit, `rang de l'arrêt` (rang de l’arrêt maladie sur 12 mois glissants : banque, bricolage) et `enfant à charge` (banque). La catégorie (cadres, maîtrise, groupe d’emplois…) se déduit de la classification de la convention et du statut cadre.
- Sorties : `éligible`, `carence` (jours non indemnisés au début de chaque arrêt), `première période . durée` et `. taux`, `seconde période . durée` et `. taux` (une durée nulle quand il n’y en a pas), facultativement `troisième période` (restauration collective), `fenêtre` (`'douze mois'` : jours déjà indemnisés dans les 12 mois précédents ; `'année civile'` ; `'anniversaire'` : l’année comptée depuis l’anniversaire de l’entrée ; `'arrêt'` : chaque arrêt ouvre ses droits), facultativement `accidents du travail à part` (les jours d’accident du travail ont leur propre décompte et ne comptent pas pour la maladie), `base` (`'brut'` : la rémunération brute qu’aurait perçue le salarié ; `'salaire de base'` : hors primes ; `'net'` : la rémunération nette qu’il aurait perçue), `plafond net` (le total, indemnités journalières comprises, ne dépasse pas le net qu’il aurait perçu) et `ancienneté en cours d'absence` (une ancienneté atteinte pendant l’absence ouvre ses droits pour les jours restants).
- Les durées en mois des textes sont comptées pour 30 jours. Les indemnités journalières sont déduites par l’application ; la déduction des prestations de prévoyance financées par l’employeur n’est pas modélisée. Les limites propres à chaque convention sont dans son README.

Dans JourDePaye, `payroll-core` conserve le catalogue métier, la sélection de la version au premier jour de la période, la correspondance avec les données du salarié et le calcul de paie. Ces choix de période ne sont pas imposés par ce package.

## Utiliser le package

Le package est publié sur le registre npm, en bêta :

```sh
npm install conventions-collectives
```

Chaque étiquette Git `v*` publie une version : `v2026.10.1-beta` publie `2026.10.1-beta` sous l’étiquette npm `latest`. Une plage comme `^2026.10.1-beta` n’inclut pas les versions bêta suivantes : épinglez une version exacte. Les versions `2026.11.0` à `2026.11.12-beta`, numérotées par erreur avec le mois de novembre, sont dépréciées : elles restent supérieures aux versions `2026.10.x-beta` dans l’ordre de npm, mais l’étiquette `latest` désigne toujours la dernière version publiée. Le package peut aussi être installé depuis le dépôt public ; pour une installation reproductible, remplacez `<commit>` par le hash complet du commit choisi :

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
6. Ajoutez la convention au tableau du README de son thème (`themes/<thème>/README.md`) et mettez à jour le nombre d’IDCC de ce thème, ici et dans le README du thème.

Une nouvelle convention est automatiquement ajoutée à l’index lors de la compilation. Son intégration à une application de paie peut demander des adaptations supplémentaires dans cette application.
