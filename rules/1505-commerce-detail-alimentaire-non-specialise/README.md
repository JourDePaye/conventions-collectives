# Commerce de détail alimentaire non spécialisé — IDCC 1505

Le fichier [2026.1](1505-commerce-detail-alimentaire-non-specialise.2026.1.publicodes) entre en vigueur le 1er août 2026. Le fichier [2026.5](1505-commerce-detail-alimentaire-non-specialise.2026.5.publicodes) conserve cette grille et ajoute les rubriques de paie de l’audit du 12 octobre 2026. Les textes et identifiants officiels sont cités dans les métadonnées. La valeur Publicodes est `commerce de détail alimentaire non spécialisé` ; les règles sont sous `salarié . convention collective . commerce de détail alimentaire non spécialisé`.

La convention collective nationale du commerce de détail alimentaire non spécialisé (brochure 3244) est l’ancienne convention du commerce de détail de fruits et légumes, épicerie et produits laitiers. Elle ne doit pas être confondue avec la convention [2216](../2216-commerce-detail-gros-predominance-alimentaire/README.md), celle du commerce de détail et de gros à prédominance alimentaire.

## Règles implémentées

- `niveau` reçoit `E1` à `E7` pour les employés, `AM1` et `AM2` pour les agents de maîtrise, `C1` et `C2` pour les cadres (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille` donne le salaire mensuel minimum des 11 niveaux, pour 35 heures par semaine, de 1 851,55 € (`E1`) à 3 388,60 € (`C2`).
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, `E5` vaut 1 916,48 €/mois à temps complet et 958,24 €/mois à mi-temps.
- `niveau hors grille` signale un niveau absent des 11 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.
- `salaire minimum annuel forfait jours` donne, pour les cadres `C1` et `C2` sur un contrat de 217 jours par an (journée de solidarité incluse), le minimum annuel de l’article 2 de l’accord : 38 176 € (`C1`) ou 42 085 € (`C2`) pendant les 36 premiers mois dans le niveau, puis 39 320 € ou 43 348 € au-delà. L’ancienneté dans le niveau se renseigne avec `mois dans le niveau` (défaut : 0). Cette règle vaut `0 €/an` pour les autres niveaux.
- `santé` remplace les endpoints santé standard par la cotisation de base de 1,51 % du PMSS, répartie à 50 % employeur et 50 % salarié. Les options, ayants droit, dispenses et gratuités restent contractuels.
- `prévoyance` remplace les endpoints conventionnels standard : non-cadres 1,03 % employeur et 0,33 % salarié jusqu’à 4 PMSS ; cadres 2,25 % employeur et 0,10 % salarié sur T1, puis 0,62 % employeur et 1,03 % salarié sur T2. Le statut cadre doit être fourni par l’application.

Les niveaux `E1`, `E2` et `E3` (de 1 851,55 € à 1 864,44 €) sont inférieurs au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’arrêté d’extension réserve l’application des dispositions légales sur le SMIC, et l’application doit retenir le plus élevé des deux montants.

## Limites

- L’accord donne aussi un taux horaire à trois décimales, mais il n’est pas toujours cohérent avec le salaire mensuel de l’accord : par exemple, `E6` donne 12,938 € × 151,67 h = 1 962,26 € alors que le mensuel est de 1 962,37 €, soit au plus 0,11 € d’écart. Le salaire mensuel, valeur explicite de l’accord, est retenu et proratisé selon la quotité pour un temps partiel.
- Le minimum mensuel des cadres est celui d’un contrat de 35 heures. Pour un cadre au forfait jours, le minimum applicable est le minimum annuel, dont un douzième est supérieur au mensuel : ce minimum annuel n’est pas calculé par l’application de paie.
- Les primes, majorations, garanties détaillées, dispenses, portabilité, maintien et autres éléments de la convention ne sont pas modélisés.
- L’accord du 12 février 2025, que celui-ci remplace, n’est pas modélisé : la première version couvre les périodes à partir du 1er août 2026.

## Maintien de salaire

La révision 2026.6 ajoute le maintien de salaire conventionnel (articles 40.1 et 40.2) sous `maintien de salaire`, lu sur Légifrance le 24 octobre 2026 : les durées, taux, carences et modalités sont dans les sources de la version et dans `test/salary-maintenance-2.test.ts`. L’interface est décrite dans le README du package. La levée de la carence en cas d’hospitalisation n’est pas reprise ; la moyenne des 3 derniers mois est prise comme le brut qu’aurait perçu le salarié.

La révision 2026.7 ajoute l'indemnité de départ à la retraite (article 23.4.1), sous `indemnité de rupture`, lus sur Légifrance le 28 octobre 2026 : les barèmes, seuils d'ancienneté et plafonds sont dans les sources de la version et dans `test/termination-indemnity.test.ts`, en mois de salaire de référence. Les indemnités de licenciement et de mise à la retraite reprennent le barème légal.
