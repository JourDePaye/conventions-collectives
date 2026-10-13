# Librairie — IDCC 3013

Le fichier [2026.1](3013-librairie.2026.1.publicodes) entre en vigueur le **1er avril 2026**, soit le premier jour du mois suivant la publication de l'arrêté d'extension du 24 février 2026 au Journal officiel du 5 mars 2026. La valeur Publicodes est `librairie` ; les règles sont sous `salarié . convention collective . librairie`.

## Grille salariale implémentée

| Niveau | Minimum mensuel brut |
|---:|---:|
| 1 | 1 834 € |
| 2 | 1 840 € |
| 3 | 1 871 € |
| 4 | 1 900 € |
| 5 | 1 963 € |
| 6 | 2 041 € |
| 7 | 2 150 € |
| 8 | 2 426 € |
| 9 | 2 758 € |
| 10 | 3 103 € |
| 11 | 3 542 € |
| 12 | 3 993 € |

Le minimum est proratisé une seule fois par la quotité de travail. Un niveau absent de la grille est signalé par `niveau hors grille` et retourne zéro afin que l'appelant puisse traiter l'anomalie.

## Audit explicite du référentiel de paie

L'avenant n° 14 porte sur les salaires minima conventionnels. Les sources officielles inspectées pour cette livraison ne fournissent pas de modification générique et calculable de l'assiette générale, des taux ou plafonds de cotisations, des tranches, forfaits, exonérations, avantages en nature, prévoyance, santé, formation professionnelle ou AT/MP. Aucun endpoint payroll-wide n'est donc redéfini sous ce namespace ; le test dédié vérifie l'absence de collision avec `modele-social` et l'isolation hors convention.

Les primes, indemnités, ancienneté, treizième mois, intéressement, épargne salariale et dispositions de temps de travail ne sont pas calculés ici : ils nécessitent des entrées et des règles dédiées et restent explicitement hors périmètre plutôt que d'être assimilés au salaire minimum.

## Sources officielles

- Avenant n° 14 du 5 novembre 2025 relatif aux salaires minima conventionnels, Légifrance, KALITEXT000053926509.
- Arrêté d'extension du 24 février 2026, Journal officiel du 5 mars 2026, Légifrance.
- Convention collective nationale de la librairie du 24 mars 2011, IDCC 3013, Légifrance.
