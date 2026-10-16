# Librairie — IDCC 3013

Le fichier [2026.1](3013-librairie.2026.1.publicodes) entre en vigueur le **1er avril 2026**, soit le premier jour du mois suivant la publication de l'arrêté d'extension du 24 février 2026 au Journal officiel du 5 mars 2026. La valeur Publicodes est `librairie` ; les règles sont sous `salarié . convention collective . librairie`.

Le fichier [2026.2](3013-librairie.2026.2.publicodes), en vigueur à la même date, corrige `niveau hors grille` : dans la version 2026.1, la règle comparait `grille` à zéro, une référence que publicodes résout vers la règle elle-même, si bien qu’elle ne valait jamais vrai. Elle compare désormais `salaire minimum conventionnel . grille`.

Le fichier [2026.3](3013-librairie.2026.3.publicodes), en vigueur à la même date et qui remplace `2026.2`, corrige la grille et la source. Les versions précédentes citaient un « avenant n° 14 du 5 novembre 2025 » (KALITEXT000053926509) sans contenu sur Légifrance et une grille inexacte aux niveaux 2 à 7 et 9 à 12 ; le texte réel est l'**accord du 25 novembre 2025 relatif aux salaires minima et à la prime d'ancienneté** (KALITEXT000054034034), étendu par arrêté du 24 février 2026 (JORF du 5 mars 2026) et applicable le 1er avril 2026 (article 7). Les clés et les noms de règles ne changent pas. La prime d'ancienneté des articles 4.1 et 4.2 n'est pas modélisée.

## Grille salariale (versions 2026.1 et 2026.2, inexactes)

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

## Grille salariale de la version 2026.3

| Niveau | Minimum mensuel brut |
|---:|---:|
| 1 | 1 834 € |
| 2 | 1 848 € |
| 3 | 1 862 € |
| 4 | 1 876 € |
| 5 | 1 952 € |
| 6 | 2 037 € |
| 7 | 2 209 € |
| 8 | 2 426 € |
| 9 | 2 635 € |
| 10 | 3 175 € |
| 11 | 3 620 € |
| 12 | 3 965 € |

Le minimum est proratisé une seule fois par la quotité de travail. Un niveau absent de la grille est signalé par `niveau hors grille` et retourne zéro afin que l'appelant puisse traiter l'anomalie.

## Audit explicite du référentiel de paie

L'accord du 25 novembre 2025 porte sur les salaires minima conventionnels. Les sources officielles inspectées pour cette livraison ne fournissent pas de modification générique et calculable de l'assiette générale, des taux ou plafonds de cotisations, des tranches, forfaits, exonérations, avantages en nature, prévoyance, santé, formation professionnelle ou AT/MP. Aucun endpoint payroll-wide n'est donc redéfini sous ce namespace ; le test dédié vérifie l'absence de collision avec `modele-social` et l'isolation hors convention.

Les primes, indemnités, ancienneté, treizième mois, intéressement, épargne salariale et dispositions de temps de travail ne sont pas calculés ici : ils nécessitent des entrées et des règles dédiées et restent explicitement hors périmètre plutôt que d'être assimilés au salaire minimum.

## Sources officielles

- Accord du 25 novembre 2025 relatif aux salaires minima et à la prime d'ancienneté, Légifrance, KALITEXT000054034034.
- Arrêté d'extension du 24 février 2026, Journal officiel du 5 mars 2026, Légifrance.
- Convention collective nationale de la librairie du 24 mars 2011, IDCC 3013, Légifrance.
