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
