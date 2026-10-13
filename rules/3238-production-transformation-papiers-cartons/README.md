# Convention collective nationale de la production et de la transformation des papiers et cartons — IDCC 3238

Le fichier [2026.2](3238-production-transformation-papiers-cartons.2026.2.publicodes) entre en vigueur le 1er janvier 2026. Il reprend l’avenant n° 21 du 30 janvier 2026 relatif aux salaires minima conventionnels et à la garantie annuelle de rémunération des ouvriers, employés, techniciens et agents de maîtrise (OETAM), étendu par arrêté du 4 mai 2026 publié au Journal officiel du 8 mai 2026. La convention nationale est datée du 29 janvier 2021 (brochure 3250). Les références officielles figurent dans les métadonnées du fichier source.

La valeur Publicodes est `production transformation papiers cartons` ; les règles sont sous `salarié . convention collective . production transformation papiers cartons`.

## Règles implémentées

- `coefficient` reçoit l’un des 15 coefficients OETAM : 125, 130, 135, 140, 150, 160, 170, 185, 195, 215, 235, 260, 285, 315 ou 350.
- `grille mensuelle` donne le salaire mensuel minimum conventionnel brut à temps plein, de 1 843 € à 3 258 €, à compter du 1er janvier 2026.
- `salaire minimum conventionnel` applique la quotité de travail de `modele-social` une seule fois.
- `salaire minimum annuel conventionnel` expose la garantie annuelle OETAM de 22 779 €/an à temps plein, proratisée selon la quotité ; elle n’est pas convertie en minimum mensuel.
- `coefficient hors grille` signale une classification absente et retourne `0 €/mois` pour cette classification.

## Limites

- Les minima des ingénieurs et cadres de l’avenant n° 22, les primes, astreintes et autres dispositions ne sont pas modélisés.
- Le salaire minimum conventionnel est comparé par l’application au SMIC lorsqu’il est plus favorable.
- La date d’effet de la grille est le 1er janvier 2026 ; aucune grille historique antérieure n’est fournie.
