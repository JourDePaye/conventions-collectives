# Métiers de la transformation des grains — IDCC 1930

Le fichier [2026.1](1930-transformation-grains.2026.1.publicodes) est applicable au 1er février 2026. Le fichier [2026.3](1930-transformation-grains.2026.3.publicodes) est applicable au 1er juin 2026 et ajoute la prime d’ancienneté de l’avenant n° 31 du 9 février 2026. Les avenants n° 30 et n° 31 ont été étendus par arrêté du 4 mai 2026 publié au Journal officiel du 10 mai 2026.

La convention collective nationale des métiers de la transformation des grains du 9 novembre 2016 (brochure 3060) couvre les entreprises relevant de l’IDCC 1930.

## Règles implémentées

- `niveau` reçoit `I` à `V`, `VI.1`, `VI.2`, `VII`, `VIII` ou `IX`.
- `salaire minimum conventionnel` donne la rémunération mensuelle minimum pour 35 heures (151,67 heures), proratisée selon la quotité de travail.
- `niveau hors grille` vaut vrai pour une combinaison absente de la grille ; le salaire retourné est alors `0 €/mois`.
- `prime d'ancienneté` calcule 1 %, 2 %, 3 % ou 4 % de la REMM selon 3, 6, 9 ou 12 ans d’ancienneté, proratisée selon la quotité. Elle nécessite l’entrée `bénéficie de la prime d'ancienneté` à `oui` car l’avenant prévoit des cas où la prime peut ne pas être attribuée.

## Grille 2026.1

| Niveau | Échelon | Minimum mensuel |
|---|---:|---:|
| I | — | 1 871,06 € |
| II | — | 1 955,58 € |
| III | — | 2 047,84 € |
| IV | — | 2 157,51 € |
| V | — | 2 426,26 € |
| VI | 1 | 2 608,23 € |
| VI | 2 | 2 801,77 € |
| VII | — | 3 399,33 € |
| VIII | — | 4 063,66 € |
| IX | — | 5 055,07 € |

## Sources officielles

- [Avenant n° 30 du 9 février 2026 relatif à la rémunération mensuelle minimum (REMM) au 1er février 2026 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054262186)
- Arrêté du 4 mai 2026 portant extension d’avenants à la convention collective nationale des métiers de la transformation des grains (IDCC 1930), publié au Journal officiel du 10 mai 2026, NOR TRST2610625A.
- [Avenant n° 31 du 9 février 2026 relatif à la prime d’ancienneté — Légifrance](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000054262205)

## Limites

- Les autres dispositions de la convention (congés, primes et classifications détaillées) ne sont pas modélisées.
- La REMM est modélisée comme un minimum mensuel sur une base de 151,67 heures ; aucune conversion en minimum annuel n’est inventée.
- Les versions antérieures au 1er février 2026 ne sont pas incluses.
