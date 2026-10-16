# Industries de carrières et matériaux de construction — IDCC 3249

La version [2026.2](3249-carrieres-materiaux.2026.2.publicodes) modélise l'accord Île-de-France du 19 mars 2026 relatif aux salaires minimaux au 1er janvier 2026 (KALITEXT000054337807, étendu par arrêté du 21 mai 2026, JORF du 29 mai 2026, entrée en vigueur le 1er janvier 2026). Elle remplace la version [2026.1](3249-carrieres-materiaux.2026.1.publicodes), de même date d'effet, dont la grille inventait un échelon 1.3 et décalait toutes les clés suivantes (par exemple 2.1 à 1 903 € au lieu de 1 874 €, 7.2 à 3 240 € au lieu de 2 975 €) ; la 2026.1 reste publiée telle quelle (son empreinte est verrouillée) mais n'est plus sélectionnée.

## Règles implémentées

- `niveau et échelon` accepte les niveaux 1 à 7 de la grille ouvriers et ETAM : échelons 1 et 2 pour le niveau 1, échelons 1 à 3 pour les niveaux 2 à 7 (20 clés, de `1.1` à `7.3`).
- `région` doit être `'Île-de-France'` pour activer cette grille (départements 75, 77, 78, 91, 92, 93, 94, 95) ; les autres régions sont hors périmètre.
- `salaire minimum conventionnel` expose le minimum mensuel brut de la grille 2026 et le prorata selon la quotité de travail.
- `niveau et échelon hors grille` signale les classifications absentes de la grille modélisée (par exemple `1.3`, qui n'existe pas).

L'accord exclut les entreprises de fabrication d'éléments en béton et d'éléments préfabriqués en béton pour la construction (code 2361.Z), soumises à l'accord national d'harmonisation du 11 avril 2024. Les cadres relèvent d'un accord national distinct (accord du 18 février 2025) et ne sont pas modélisés.

## Grille salariale Île-de-France 2026 (article 3)

| Niveau-échelon | Minimum mensuel |
|---|---:|
| 1.1 | 1 840 € |
| 1.2 | 1 866 € |
| 2.1 | 1 874 € |
| 2.2 | 1 903 € |
| 2.3 | 1 957 € |
| 3.1 | 1 969 € |
| 3.2 | 2 000 € |
| 3.3 | 2 060 € |
| 4.1 | 2 069 € |
| 4.2 | 2 104 € |
| 4.3 | 2 178 € |
| 5.1 | 2 187 € |
| 5.2 | 2 252 € |
| 5.3 | 2 409 € |
| 6.1 | 2 451 € |
| 6.2 | 2 546 € |
| 6.3 | 2 748 € |
| 7.1 | 2 814 € |
| 7.2 | 2 975 € |
| 7.3 | 3 240 € |

Base de 35 heures par semaine ou 151,67 heures par mois (article 4).

## Audit des rubriques de paie

L'accord inspecté porte sur les salaires minima. Il ne modifie pas de manière générique et calculable par ce modèle l'assiette, les taux ou plafonds de cotisations, la santé, la prévoyance, la formation professionnelle, les exonérations, les avantages en nature ou les règles AT/MP. Aucun endpoint payroll-wide n'est redéfini ; ces éléments restent hors périmètre plutôt que d'être déduits automatiquement.

## Sources officielles

- Accord Île-de-France du 19 mars 2026 relatif aux salaires minimaux au 1er janvier 2026, Légifrance, KALITEXT000054337807, IDCC 3249, BO 2026-16.
- Arrêté du 21 mai 2026 portant extension de l'accord, publié au Journal officiel du 29 mai 2026.
- Convention collective nationale des industries de carrières et matériaux de construction du 6 juillet 2022, étendue par arrêté du 24 septembre 2024 (JORF du 17 novembre 2024).
