# Distribution, logistique et services des énergies de proximité (IDCC 1408)

Les fichiers [2025.1](1408-distribution-logistique-energies.2025.1.publicodes) et [2025.2](1408-distribution-logistique-energies.2025.2.publicodes) entrent en vigueur le **1er mai 2025** pour l'accord du **13 mars 2025** relatif à la revalorisation des salaires minima conventionnels au 1er mai 2025 (+ 2 %), étendu par arrêté du 27 mai 2025 (JORF du 31 mai 2025). La version `2025.2` remplace `2025.1` (même date d'effet) : la grille est identique, la prime d'ancienneté est corrigée. La valeur Publicodes est `distribution logistique énergies`.

La version [2025.3](1408-distribution-logistique-energies.2025.3.publicodes) reprend les règles de `2025.2` et déclare la publication de l'arrêté d'extension (`extension: 2025-05-31`), à partir de laquelle l'accord de 2025 lie aussi les entreprises non adhérentes aux organisations signataires.

La version [2026.1](1408-distribution-logistique-energies.2026.1.publicodes) entre en vigueur le **1er mai 2026** pour l'accord du **3 avril 2026** (+ 1 % sur l'ensemble des coefficients, KALITEXT000054801796). Il n'est pas étendu au 18 octobre 2026 : selon son article 6, il s'applique aux entreprises adhérentes aux organisations signataires à compter du 1er mai 2026, et aux autres au plus tard à la date d'extension. Les entreprises non adhérentes restent donc soumises à l'accord de 2025 (`2025.3`). Les règles et les taux de prime d'ancienneté sont ceux de `2025.2`.

## Grille salariale implémentée

| Coefficient | 1er mai 2025 | 1er mai 2026 |
|---:|---:|---:|
| 200 | 1 852,12 € | 1 870,64 € |
| 210 | 1 858,37 € | 1 876,95 € |
| 220 | 1 867,80 € | 1 886,48 € |
| 230 | 1 882,42 € | 1 901,24 € |
| 240 | 1 911,42 € | 1 930,53 € |
| 250 | 1 989,36 € | 2 009,25 € |
| 300 | 2 145,22 € | 2 166,67 € |
| 310 | 2 456,96 € | 2 481,53 € |
| 320 | 2 768,68 € | 2 796,37 € |
| 400 | 2 846,62 € | 2 875,09 € |
| 410 | 3 158,36 € | 3 189,94 € |
| 420 | 3 781,82 € | 3 819,64 € |
| 430 | 4 405,29 € | 4 449,34 € |
| 440 | 5 184,63 € | 5 236,48 € |
| 450 | 6 119,83 € | 6 181,03 € |
| 460 | 7 522,62 € | 7 597,85 € |

Le minimum est proratisé une seule fois par `contrat . temps de travail . quotité`. Un coefficient absent est signalé par `coefficient hors grille` et retourne zéro.

## Prime d'ancienneté

À partir de la version `2025.2`, la prime d'ancienneté suit l'annexe de l'accord, qui ne la publie que pour les **coefficients 200 à 320** : 3 % après 3 ans, 6 % après 6 ans, 9 % après 9 ans, 10 % après 10 ans, 11 % après 11 ans, 12 % après 12 ans, 13 % après 13 ans, 14 % après 14 ans et 15 % après 15 ans. Les coefficients 400 à 460 n'ouvrent pas droit à la prime (règle `coefficient ouvrant droit à la prime`, taux nul). La prime est calculée sur le minimum conventionnel du coefficient, après proratisation du temps de travail, et ne remplace pas le salaire minimum. Entre deux paliers, le dernier palier atteint est retenu (lecture du modèle, non précisée par le texte). Deux montants de l'annexe (coefficient 310 à 12 ans : 294,83 € ; coefficient 320 à 14 ans : 387,61 €) sont inférieurs d'un centime au taux appliqué au minimum publié (294,84 € et 387,62 €).

La version `2025.1` ne connaissait que les paliers 3, 6, 9, 12 et 15 % et appliquait la prime à tous les coefficients ; elle est conservée pour les calculs passés mais remplacée par `2025.2`.

## Audit des rubriques de paie

Le texte salarial fixe les minima et la prime d'ancienneté. Il ne fixe pas une assiette conventionnelle générale, de taux ou plafonds de cotisations, de forfait, d'avantage en nature, de santé/prévoyance, de formation professionnelle ou d'AT/MP calculable sans paramètres supplémentaires. Aucun endpoint global de `modele-social` n'est donc redéfini dans ce namespace. Les tests vérifient l'absence de collision et l'inapplicabilité hors convention.

Les autres primes, indemnités, frais, classifications détaillées et dispositifs de protection sociale restent hors périmètre lorsqu'ils nécessitent des faits ou des bases non définis par l'accord salarial.

## Sources officielles

- Accord du 13 mars 2025 relatif à la revalorisation des salaires minima conventionnels au 1er mai 2025, Légifrance, KALITEXT000051787046 (conteneur KALICONT000005635427, BO 2025-16).
- Étendu par arrêté du 27 mai 2025, JORF du 31 mai 2025.
- Accord du 3 avril 2026 relatif à la revalorisation des salaires minima conventionnels et à la création de certains avantages conventionnels supplémentaires au 1er mai 2026, Légifrance, KALITEXT000054801796 (non étendu).
- Convention collective nationale et accords de branche des entreprises de la distribution, logistique et services des énergies de proximité du 20 décembre 1985, IDCC 1408, Légifrance.
