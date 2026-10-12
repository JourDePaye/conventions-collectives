# Import-export — IDCC 0043

Le fichier [2026.1](0043-import-export.2026.1.publicodes) entre en vigueur le 1er mars 2026. Il est fondé sur l’accord du 10 février 2026 relatif aux salaires minima conventionnels, étendu par arrêté du 4 mai 2026 publié au Journal officiel le 13 mai 2026. Les références officielles figurent dans les métadonnées du fichier source.

La valeur Publicodes est `import-export` ; les règles sont sous `salarié . convention collective . import-export`.

## Règles implémentées

- `coefficient` reçoit l'un des 20 coefficients de la grille : `E1` à `E8`, `M9` à `M12` ou `C13` à `C20`.
- `grille mensuelle` donne le minimum brut mensuel pour 151,67 heures, de 1 879 € (`E1`) à 5 668 € (`C20`).
- `salaire minimum conventionnel` applique la quotité de travail de `modele-social` une seule fois.
- `coefficient hors grille` signale une classification absente et retourne `0 €/mois` pour cette classification.

## Limites

- Le modèle couvre uniquement les minima mensuels de l'accord salarial cité ; les primes, majorations, classifications détaillées, ancienneté et autres dispositions de la convention ne sont pas modélisées.
- Le minimum conventionnel est comparé par l'application au SMIC lorsqu'il est plus favorable.
- L'accord est modélisé à compter de son entrée en vigueur étendue du 1er mars 2026 ; les périodes antérieures ne sont pas couvertes.
