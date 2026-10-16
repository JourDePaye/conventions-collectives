# Blanchisserie, laverie, location de linge, nettoyage à sec, pressing et teinturerie — IDCC 2002

Modèle `2002-blanchisserie-teinturerie`, versions `2025.1` et `2026.1`, espace de noms
`salarié . convention collective . blanchisserie teinturerie`.

## Périmètre

Convention collective nationale de la blanchisserie, laverie, location de linge, nettoyage à sec, pressing et
teinturerie du 17 novembre 1997 (IDCC 2002). Le modèle ne couvre que les salaires minima conventionnels mensuels
(base 35 heures) de l'article 1er de deux avenants, tous deux « en vigueur étendu » sur Légifrance :

- `2025.1` : avenant du 5 mars 2025, barème au **1er janvier 2025**, étendu par arrêté du 19 mai 2025 (JORF du 24 mai 2025) ;
- `2026.1` : avenant du 11 février 2026, barème au **1er janvier 2026**, étendu par arrêté du 4 mai 2026 (JORF du 10 mai 2026).

L'avenant de 2026 ne modifie pas les classifications : il remplace les montants. Un texte étendu s'applique à tous les
employeurs du champ, la version prend donc effet à la date prévue par l'avenant lui-même.

## Règles

- `classification` : coefficient de la filière location de linge/blanchisseurs (`1-1`, `2-1`, `2-2`, `2-3`, `3-1`, `3-2`, `4-1`, `5-1`, `5-2`, `6-1`),
  catégorie de la filière pressings/laveries (`A1` à `A3`, `B1` à `B3`, `C1` à `C3`, `D1`, `D2`) ou coefficient cadre (`7-1`, `8-1`, `9-1`). Défaut : `non renseigné`.
  Les employés ETAM des deux filières (`1-1`, `2-1`, `3-1`, `4-1`) ont les mêmes montants que les ouvriers : une seule clé suffit.
- `salaire minimum conventionnel` (€/mois) : montant de la grille, proratisé une seule fois par la quotité de travail.
- `salaire minimum conventionnel . grille` : montant à temps plein, 0 €/mois pour une classification absente.
- `classification hors grille` : vrai seulement pour une classification absente de la grille.
- `audit paie` : `non`. Seuls les minima sont modélisés ; primes, cotisations et autres rubriques n'ont pas été recherchées.

## Grille mensuelle (base 35 heures)

Ouvriers, filière location de linge/blanchisseurs, et employés ETAM des deux filières (1-1, 2-1, 3-1, 4-1) :

| Coefficient | 2025 | 2026 |
|---|---:|---:|
| 1-1 | 1 801,80 € | 1 823,03 € |
| 2-1 | 1 817,62 € | 1 839,07 € |
| 2-2 | 1 833,73 € | 1 855,37 € |
| 2-3 | 1 858,93 € | 1 880,87 € |
| 3-1 | 1 864,65 € | 1 886,65 € |
| 3-2 | 1 890,40 € | 1 912,71 € |
| 4-1 | 1 944,28 € | 1 967,22 € |

Filière pressings, laveries (ouvriers) :

| Catégorie | 2025 | 2026 |
|---|---:|---:|
| A1 | 1 801,80 € | 1 823,03 € |
| A2 | 1 806,54 € | 1 827,86 € |
| A3 | 1 817,19 € | 1 838,63 € |
| B1 | 1 834,43 € | 1 856,08 € |
| B2 | 1 843,81 € | 1 865,57 € |
| B3 | 1 860,00 € | 1 881,95 € |
| C1 | 1 876,23 € | 1 898,37 € |

Techniciens et agents de maîtrise :

| Coefficient ou catégorie | 2025 | 2026 |
|---|---:|---:|
| 5-1 | 1 963,18 € | 1 986,35 € |
| 5-2 | 2 067,84 € | 2 092,24 € |
| 6-1 | 2 190,96 € | 2 216,81 € |
| C2 | 1 866,77 € | 1 888,80 € |
| C3 | 1 891,92 € | 1 914,24 € |
| D1 | 2 133,98 € | 2 159,16 € |
| D2 | 2 161,39 € | 2 186,89 € |

Cadres (les deux filières) :

| Coefficient | 2025 | 2026 |
|---|---:|---:|
| 7-1 | 2 583,79 € | 2 614,28 € |
| 8-1 | 3 414,42 € | 3 454,71 € |
| 9-1 | 3 793,09 € | 3 837,85 € |

## Sources officielles

- [Légifrance — avenant du 11 février 2026](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054303889)
- [Légifrance — avenant du 5 mars 2025](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051694901)

## Limites

Les primes (ancienneté, etc.), cotisations conventionnelles, indemnités et autres dispositions ne sont pas modélisées.
Les contrôles SMIC et le choix de la version applicable à la période de paie restent à la charge de l'application consommatrice.
Les arrêtés d'extension sont cités d'après la mention de Légifrance ; leur texte au Journal officiel n'a pas été ouvert.
