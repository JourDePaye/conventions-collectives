# Bricolage — IDCC 1606

Le fichier [2025.1](1606-bricolage.2025.1.publicodes) entre en vigueur le **1er juillet 2025** pour le champ général, conformément à l’accord du 31 mars 2025 relatif aux salaires minima conventionnels et à son extension publiée au Journal officiel le 10 juin 2025. L’accord prévoyait une application conventionnelle au 1er mai 2025 pour ses signataires ; cette version retient la date d’effet générale après extension. La valeur Publicodes est `bricolage` ; les règles sont sous `salarié . convention collective . bricolage`.

## Grille salariale implémentée

| Coefficient | Minimum mensuel brut |
|---:|---:|
| 120 | 1 810 € |
| 140 | 1 825 € |
| 150 | 1 837 € |
| 160 | 1 855 € |
| 190 | 1 885 € |
| 200 | 1 945 € |
| 220 | 2 045 € |
| 250 | 2 111 € |
| 280 | 2 250 € |
| 320 | 2 818 € |
| 400 | 2 950 € |
| 500 | 3 305 € |
| 600 | 3 560 € |

Le minimum est proratisé une seule fois par la quotité de travail. Un coefficient absent de la grille est signalé par `coefficient hors grille` et retourne zéro afin que l’appelant puisse traiter l’anomalie.

## Audit explicite du référentiel de paie

L’accord du 31 mars 2025 porte sur les salaires minima conventionnels. L’arrêté d’extension ne modifie pas, dans le périmètre modélisé, l’assiette générale, les taux ou plafonds des cotisations, les tranches, forfaits, exonérations, avantages en nature, prévoyance, santé, formation professionnelle ou AT/MP. Aucun endpoint payroll-wide n’est donc redéfini sous ce namespace : le test dédié vérifie l’absence de collision avec `modele-social` et l’isolation hors convention.

Les primes, indemnités, ancienneté, intéressement, épargne salariale et dispositions de temps de travail ne sont pas calculés ici : ils nécessitent des entrées et des règles dédiées et restent explicitement hors périmètre plutôt que d’être assimilés au salaire minimum.

## Sources officielles

- Accord du 31 mars 2025 relatif aux salaires minima conventionnels, Légifrance, KALITEXT000051909640 (application conventionnelle au 1er mai 2025).
- Arrêté d’extension du 2 juin 2025, Journal officiel du 10 juin 2025, Légifrance.
