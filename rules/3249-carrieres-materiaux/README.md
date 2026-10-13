# Industries de carrières et matériaux de construction — IDCC 3249

La version [2026.1](3249-carrieres-materiaux.2026.1.publicodes) modélise exclusivement l'accord Île-de-France du 19 mars 2026 relatif aux salaires minimaux au 1er janvier 2026, étendu le 29 mai 2026.

## Règles implémentées

- `niveau et échelon` accepte les niveaux 1 à 7 et échelons 1 à 3 de la grille ouvriers et ETAM.
- `région` doit être `'Île-de-France'` pour activer cette grille ; les autres régions sont hors périmètre.
- `salaire minimum conventionnel` expose le minimum mensuel brut de la grille 2026 et le prorata selon la quotité de travail.
- `niveau et échelon hors grille` signale les classifications absentes de la grille modélisée.

La grille publiée pour l'Île-de-France ne fournit pas de cellule 7.3 dans la source retenue ; cette cellule et les cadres ne sont donc pas inventés.

## Grille salariale Île-de-France 2026

| Niveau-échelon | Minimum mensuel |
|---|---:|
| 1.1 | 1 840 € |
| 1.2 | 1 866 € |
| 1.3 | 1 874 € |
| 2.1 | 1 903 € |
| 2.2 | 1 957 € |
| 2.3 | 1 969 € |
| 3.1 | 2 000 € |
| 3.2 | 2 060 € |
| 3.3 | 2 069 € |
| 4.1 | 2 104 € |
| 4.2 | 2 178 € |
| 4.3 | 2 187 € |
| 5.1 | 2 252 € |
| 5.2 | 2 409 € |
| 5.3 | 2 451 € |
| 6.1 | 2 546 € |
| 6.2 | 2 748 € |
| 6.3 | 2 814 € |
| 7.1 | 2 975 € |
| 7.2 | 3 240 € |

## Audit des rubriques de paie

L'accord inspecté porte sur les salaires minima. Il ne modifie pas de manière générique et calculable par ce modèle l'assiette, les taux ou plafonds de cotisations, la santé, la prévoyance, la formation professionnelle, les exonérations, les avantages en nature ou les règles AT/MP. Aucun endpoint payroll-wide n'est redéfini ; ces éléments restent hors périmètre plutôt que d'être déduits automatiquement.

## Sources officielles

- Accord Île-de-France du 19 mars 2026 relatif aux salaires minimaux au 1er janvier 2026, Légifrance, IDCC 3249.
- Arrêté du 21 mai 2026 portant extension de l'accord, publié au Journal officiel du 29 mai 2026.
- Convention collective nationale des industries de carrières et matériaux de construction du 6 juillet 2022, étendue par arrêté du 24 septembre 2024.
