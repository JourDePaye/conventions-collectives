# Commerce de détail et de gros à prédominance alimentaire — IDCC 2216

Les fichiers [2025.1](2216-commerce-detail-gros-predominance-alimentaire.2025.1.publicodes), [2026.1](2216-commerce-detail-gros-predominance-alimentaire.2026.1.publicodes) et [2026.2](2216-commerce-detail-gros-predominance-alimentaire.2026.2.publicodes) entrent en vigueur respectivement les 1er août 2025 et 1er août 2026. La version 2026.2 complète la version 2026.1 avec les rubriques annuelles de l'article 2 de l'avenant n° 99. La version [2026.3](2216-commerce-detail-gros-predominance-alimentaire.2026.3.publicodes), de même date d'effet que 2026.2 (1er août 2026) et qui la remplace, corrige les minima du forfait jours de l'article 3 : niveau 7, 40 230 € pour les 36 premiers mois puis 41 790 € ; niveau 8, 54 100 € puis 56 170 € (2026.2 portait 39 800 / 41 340 et 53 515 / 55 560). Les grilles mensuelle et annuelle sont inchangées. Ils sont fondés sur les avenants salariaux cités dans leurs métadonnées. La valeur Publicodes est `commerce alimentaire` ; les règles sont sous `salarié . convention collective . commerce alimentaire`.

## Règles implémentées

- `niveau` reçoit `1A` à `4A` pendant la période d’accueil dans le niveau, `1B` à `4B` ensuite, ou `5` à `8` pour les niveaux supérieurs (défaut : `non renseigné`). Les niveaux 5 et 6 correspondent aux agents de maîtrise, 7 et 8 aux cadres. L’application détermine la classification et le passage de A à B.
- `salaire minimum conventionnel . grille` donne le salaire minimum mensuel garanti (SMMG) à temps plein pour les 12 positions. La grille comprend la rémunération des pauses, égale à 5 % du temps de travail effectif, sur une base de 35 heures effectives par semaine.
- `salaire minimum annuel conventionnel` donne le salaire annuel minimum garanti (SMAG) sur 12 mois pour les 12 positions, proratisé selon la quotité de travail.
- `salaire minimum annuel forfait jours` donne le minimum annuel des niveaux 7 et 8 pour 216 jours, avec un seuil à 36 mois dans le niveau ; il n'est pas converti en minimum mensuel.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, `4B` vaut 2 032,03 €/mois en version 2025.1 et 2 054,33 €/mois en version 2026.1 à temps plein.
- `niveau hors grille` signale une valeur absente des 12 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Les majorations, primes et autres éléments de la convention ne sont pas calculés ici. Les références juridiques détaillées, ainsi que les limites des sources consultées, figurent dans les métadonnées des fichiers Publicodes.

## Congés payés

Les révisions [2025.2](2216-commerce-detail-gros-predominance-alimentaire.2025.2.publicodes) et [2026.4](2216-commerce-detail-gros-predominance-alimentaire.2026.4.publicodes), aux mêmes dates que 2025.1 et 2026.3, ajoutent `congés payés . jours supplémentaires`, le congé supplémentaire d'ancienneté de l'article 7.1.2 : 1 jour après 10 ans d'ancienneté dans l'entreprise, 2 après 15 ans, 3 après 20 ans, d'après `congés payés . ancienneté` (l'ancienneté au 31 mai que l'application renseigne). Ces jours majorent les congés acquis au 31 mai, au prorata en cas de droits incomplets et avant l'arrondi de l'article L3141-7, ce que fait l'application. L'article ne précise pas l'unité : la durée légale de référence étant en jours ouvrables, ce sont des jours ouvrables.

## Maintien de salaire

La révision 2026.5 ajoute le maintien de salaire conventionnel (articles 7.4 et 7.6.6, annexes I à III) sous `maintien de salaire`, lu sur Légifrance le 24 octobre 2026 : les durées, taux, carences et modalités sont dans les sources de la version et dans `test/salary-maintenance.test.ts`. L’interface est décrite dans le README du package. La levée de la carence en cas d’hospitalisation ou d’arrêt de plus de 2 mois et les 2 semaines de plus pour des naissances multiples ne sont pas reprises ; l’ancienneté de la maternité est appréciée au début du congé plutôt qu’à la déclaration de grossesse.

La révision 2026.6 ajoute les indemnités de licenciement, de départ volontaire à la retraite et de mise à la retraite des annexes I, II et III (articles 7 et 8) et de rupture conventionnelle (article 3.12), sous `indemnité de rupture`, lus sur Légifrance le 28 octobre 2026 : les barèmes, seuils d'ancienneté et plafonds sont dans les sources de la version et dans `test/termination-indemnity.test.ts`, en mois de salaire de référence. La majoration de 20 % du licenciement économique après 50 ans, soumise à des exceptions de fait, n'est pas reprise.
