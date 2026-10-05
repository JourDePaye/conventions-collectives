# Commerce de détail alimentaire non spécialisé — IDCC 1505

Le fichier [2026.1](1505-commerce-detail-alimentaire-non-specialise.2026.1.publicodes) entre en vigueur le 1er août 2026. Il est fondé sur l’accord du 10 février 2026 relatif à la grille des minima salariaux, étendu par arrêté du 6 juillet 2026 (JORF n° 0160 du 10 juillet 2026, NOR TRST2616917A), cités dans ses métadonnées. La valeur Publicodes est `commerce de détail alimentaire non spécialisé` ; les règles sont sous `salarié . convention collective . commerce de détail alimentaire non spécialisé`.

La convention collective nationale du commerce de détail alimentaire non spécialisé (brochure 3244) est l’ancienne convention du commerce de détail de fruits et légumes, épicerie et produits laitiers. Elle ne doit pas être confondue avec la convention [2216](../2216-commerce-detail-gros-predominance-alimentaire/README.md), celle du commerce de détail et de gros à prédominance alimentaire.

## Règles implémentées

- `niveau` reçoit `E1` à `E7` pour les employés, `AM1` et `AM2` pour les agents de maîtrise, `C1` et `C2` pour les cadres (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille` donne le salaire mensuel minimum des 11 niveaux, pour 35 heures par semaine, de 1 851,55 € (`E1`) à 3 388,60 € (`C2`).
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, `E5` vaut 1 916,48 €/mois à temps complet et 958,24 €/mois à mi-temps.
- `niveau hors grille` signale un niveau absent des 11 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.
- `salaire minimum annuel forfait jours` donne, pour les cadres `C1` et `C2` sur un contrat de 217 jours par an (journée de solidarité incluse), le minimum annuel de l’article 2 de l’accord : 38 176 € (`C1`) ou 42 085 € (`C2`) pendant les 36 premiers mois dans le niveau, puis 39 320 € ou 43 348 € au-delà. L’ancienneté dans le niveau se renseigne avec `mois dans le niveau` (défaut : 0). Cette règle vaut `0 €/an` pour les autres niveaux.

Les niveaux `E1`, `E2` et `E3` (de 1 851,55 € à 1 864,44 €) sont inférieurs au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’arrêté d’extension réserve l’application des dispositions légales sur le SMIC, et l’application doit retenir le plus élevé des deux montants.

## Limites

- L’accord donne aussi un taux horaire à trois décimales, mais il n’est pas toujours cohérent avec le salaire mensuel de l’accord : par exemple, `E6` donne 12,938 € × 151,67 h = 1 962,26 € alors que le mensuel est de 1 962,37 €, soit au plus 0,11 € d’écart. Le salaire mensuel, valeur explicite de l’accord, est retenu et proratisé selon la quotité pour un temps partiel.
- Le minimum mensuel des cadres est celui d’un contrat de 35 heures. Pour un cadre au forfait jours, le minimum applicable est le minimum annuel, dont un douzième est supérieur au mensuel : ce minimum annuel n’est pas calculé par l’application de paie.
- Les primes, majorations, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
- L’accord du 12 février 2025, que celui-ci remplace, n’est pas modélisé : la première version couvre les périodes à partir du 1er août 2026.
