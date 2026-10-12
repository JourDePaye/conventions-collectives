# Industries de la transformation des volailles — IDCC 1938

Le fichier [2025.1](1938-industries-transformation-volailles.2025.1.publicodes) entre en vigueur le 1er février 2025. Il modélise l'accord du 6 février 2025 relatif aux salaires minima mensuels, étendu par arrêté du 9 avril 2025 publié au Journal officiel le 26 avril 2025. Les références officielles figurent dans les métadonnées du fichier source.

La valeur Publicodes est `industries de la transformation des volailles` ; les règles sont sous `salarié . convention collective . industries de la transformation des volailles`.

## Règles implémentées

- `coefficient` reçoit l'un des coefficients de la grille nationale : 120 à 200 par pas de 5, puis 215, 230, 245, 260, 280, 300, 320, 340, 350, 375, 400, 450, 500, 600 ou 700.
- `grille mensuelle` donne le minimum brut mensuel pour 151,67 heures, de 1 802 € à 5 345,51 €.
- `salaire minimum conventionnel` applique la quotité de travail de `modele-social` une seule fois.
- `coefficient hors grille` signale une classification absente et retourne `0 €/mois` pour cette classification.

## Audit des effets de paie et limites

L'accord officiel du 6 février 2025 et son arrêté d'extension portent sur les salaires minima mensuels et leur barème. Ils ne modifient pas l'assiette, les taux salariés ou employeurs, les plafonds, forfaits, exonérations, avantages en nature, ni les régimes de prévoyance, santé, formation ou AT. Aucun endpoint de `modele-social` n'est donc remplacé : le test ciblé vérifie que l'extension ne publie que son namespace de classification et de minima.

- Le modèle couvre uniquement les salaires minima mensuels de l'accord cité ; les primes, majorations, ancienneté et autres dispositions de la convention ne sont pas modélisées.
- Le minimum conventionnel est comparé par l'application au SMIC lorsqu'il est plus favorable.
- La grille est applicable à compter du 1er février 2025 ; les périodes antérieures ne sont pas couvertes.
