# Économistes de la construction et métreurs-vérificateurs — IDCC 3213

Le fichier [2026.1](3213-economistes-construction.2026.1.publicodes) est applicable à tous les employeurs et salariés du champ à compter du **11 juillet 2026**, lendemain de la publication au Journal officiel du 10 juillet 2026 de l'arrêté d'extension du 6 juillet 2026.

## Règles implémentées

- `niveau` accepte A1, A2, B, C, D, E et F pour les ETAM, et G, H et I pour les cadres.
- `région` distingue la grille Île-de-France de la grille nationale hors Île-de-France.
- `salaire minimum conventionnel` expose le minimum mensuel de l'accord du 8 avril 2026 et le prorata selon la quotité de travail.
- `niveau hors grille` retourne vrai pour un niveau absent ; le minimum retourne alors `0`.

## Grille salariale 2026

| Niveau | National hors Île-de-France | Île-de-France |
|---|---:|---:|
| A1 (ETAM) | 1 883,47 € | 1 964,42 € |
| A2 (ETAM) | 2 036,24 € | 2 168,50 € |
| B (ETAM) | 2 310,16 € | 2 428,17 € |
| C (ETAM) | 2 555,25 € | 2 683,47 € |
| D (ETAM) | 2 902,46 € | 3 045,42 € |
| E (ETAM) | 3 157,75 € | 3 325,68 € |
| F (ETAM) | 3 497,02 € | 3 691,04 € |
| G (cadre) | 4 005,13 € | 4 077,40 € |
| H (cadre) | 4 014,30 € | 4 280,74 € |
| I (cadre) | 4 738,91 € | 4 999,77 € |

## Audit des rubriques de paie

L'accord officiel du 8 avril 2026 porte sur les salaires minima conventionnels. Les sources officielles inspectées pour cette livraison ne modifient pas l'assiette générale, les taux ou plafonds de cotisations, les forfaits, exonérations, avantages en nature, santé, prévoyance, formation professionnelle ou AT/MP de manière générique et calculable par ce modèle. Aucun endpoint payroll-wide n'est donc redéfini sous ce namespace ; le test dédié vérifie l'absence de collision avec `modele-social` et l'isolation hors convention.

La branche relève par ailleurs du régime BTP, mais les régimes de prévoyance BTP ne sont pas des paramètres de l'accord salarial modélisé ici et leur calcul dépend d'entrées d'affiliation et de garanties distinctes. Ils restent explicitement hors périmètre plutôt que d'être assimilés au salaire minimum.

Les primes d'ancienneté, indemnités, temps de travail et autres obligations conventionnelles ne sont pas calculés ici faute d'entrées dédiées et de règle directement nécessaire au calcul du minimum salarial.

## Sources officielles

- Accord du 8 avril 2026 relatif aux salaires minimums conventionnels, Légifrance, KALITEXT000054872359.
- Arrêté du 6 juillet 2026 portant extension, NOR TRST2617121A, JORFTEXT000054408938, publié au Journal officiel du 10 juillet 2026.
- Convention collective nationale du 16 décembre 2015, IDCC 3213, Légifrance.
