# Quincaillerie, fournitures industrielles, fers, métaux et équipement de la maison — IDCC 3243

Le fichier [2026.1](3243-quincaillerie.2026.1.publicodes) entre en vigueur le **1er mai 2026** pour le champ général, après l'arrêté d'extension du 8 avril 2026 publié au Journal officiel du 17 avril 2026. Il modélise l'avenant n° 3 du 22 janvier 2026 relatif aux salaires minima hiérarchiques (annexe 2). La valeur Publicodes est `quincaillerie fournitures industrielles fers métaux équipement maison` ; les règles sont sous `salarié . convention collective . quincaillerie fournitures industrielles fers métaux équipement maison`.

## Grille salariale implémentée

| Niveau et échelon | Minimum mensuel brut |
|---:|---:|
| I.1 | 1 840 € |
| I.2 | 1 845 € |
| I.3 | 1 850 € |
| II.1 | 1 855 € |
| II.2 | 1 865 € |
| II.3 | 1 875 € |
| III.1 | 1 886 € |
| III.2 | 1 896 € |
| III.3 | 1 906 € |
| IV.1 | 1 916 € |
| IV.2 | 1 936 € |
| IV.3 | 1 956 € |
| V.1 | 1 987 € |
| V.2 | 2 067 € |
| V.3 | 2 138 € |
| VI.1 | 2 169 € |
| VI.2 | 2 249 € |
| VI.3 | 2 351 € |
| VII.1 | 2 922 € |
| VII.2 | 3 134 € |
| VII.3 | 3 402 € |
| VIII.1 | 3 579 € |
| VIII.2 | 3 763 € |
| VIII.3 | 3 979 € |
| IX.1 | 4 753 € |

Le minimum est proratisé une seule fois par la quotité de travail. Un niveau ou échelon absent de la grille, notamment IX.2 ou IX.3, est signalé par `niveau et échelon hors grille` et retourne zéro afin que l'appelant puisse traiter l'anomalie. Les montants sont des minima conventionnels : le montant légal plus favorable doit continuer à être appliqué par l'appelant lorsqu'il excède la grille.

## Audit explicite du référentiel de paie

L'avenant n° 3 porte sur les salaires minima hiérarchiques. L'arrêté d'extension ne modifie pas, dans le périmètre modélisé, l'assiette générale, les taux ou plafonds des cotisations, les tranches, forfaits, exonérations, avantages en nature, prévoyance, santé, formation professionnelle ou AT/MP. Aucun endpoint payroll-wide n'est donc redéfini sous ce namespace : le test dédié vérifie l'absence de collision avec `modele-social` et l'isolation hors convention.

Les primes, indemnités, ancienneté, intéressement, épargne salariale et dispositions de temps de travail ne sont pas calculés ici : ils nécessitent des entrées et des règles dédiées et restent explicitement hors périmètre plutôt que d'être assimilés au salaire minimum.

## Sources officielles

- Avenant n° 3 du 22 janvier 2026 relatif aux salaires minima hiérarchiques (annexe 2), Légifrance, KALIARTI000054066782.
- Arrêté du 8 avril 2026 portant extension d'un avenant à la convention collective nationale des commerces de quincaillerie, fournitures industrielles, fers, métaux et équipement de la maison (IDCC 3243), Légifrance, JORFTEXT000053907795, JORF du 17 avril 2026.
