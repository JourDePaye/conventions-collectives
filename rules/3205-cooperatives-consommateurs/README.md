# Coopératives de consommateurs — IDCC 3205

Le fichier [2026.1](3205-cooperatives-consommateurs.2026.1.publicodes) entre en vigueur le **1er mai 2026**, conformément à l'avenant n° 932 relatif aux salaires minima conventionnels et à son extension publiée au Journal officiel. La valeur Publicodes est `coopératives de consommateurs` ; les règles sont sous `salarié . convention collective . coopératives de consommateurs`.

Le fichier [2026.2](3205-cooperatives-consommateurs.2026.2.publicodes), en vigueur à la même date, corrige `niveau hors grille` : dans la version 2026.1, la règle comparait `grille` à zéro, une référence que publicodes résout vers la règle elle-même, si bien qu’elle ne valait jamais vrai. Elle compare désormais `salaire minimum conventionnel . grille`.

## Grille salariale implémentée

| Niveau | Minimum mensuel brut |
|---:|---:|
| 1 | 1 823,07 € |
| 2 | 1 840,70 € |
| 3 | 1 862,28 € |
| 4 | 1 883,78 € |
| 5 | 1 907,54 € |
| 6 | 1 943,77 € |
| 7 | 2 008,22 € |
| 8 | 2 134,86 € |
| 9 | 2 335,64 € |
| 10 | 2 611,78 € |
| 11 | 2 972,05 € |
| 12 | 3 360,78 € |

Le minimum est proratisé une seule fois par la quotité de travail. Un niveau absent de la grille est signalé par `niveau hors grille` et retourne zéro afin que l'appelant puisse traiter l'anomalie.

## Audit explicite du référentiel de paie

L'avenant n° 932 porte sur les salaires minima conventionnels. L'accord et son extension ne modifient pas, dans le périmètre modélisé, l'assiette générale, les taux ou plafonds des cotisations, les tranches, forfaits, exonérations, avantages en nature, prévoyance, santé, formation professionnelle ou AT. Aucun endpoint payroll-wide n'est donc redéfini sous ce namespace : le test dédié vérifie l'absence de collision avec `modele-social` et l'isolation hors convention.

Les primes, indemnités, ancienneté, intéressement, épargne salariale et dispositions de temps de travail ne sont pas calculés ici : ils nécessitent des entrées et des règles dédiées et restent explicitement hors périmètre plutôt que d'être assimilés au salaire minimum.

## Sources officielles

- Avenant n° 932 du 27 janvier 2026 relatif aux salaires minima conventionnels, Légifrance, KALITEXT000054303994.
- Arrêté d'extension du 23 avril 2026, Journal officiel du 30 avril 2026, Légifrance.
