# Eaux embouteillées, boissons rafraîchissantes sans alcool et bière — IDCC 1513

Modèle `1513-eaux-embouteillees-boissons-bieres`, version `2026.1`, espace de noms
`salarié . convention collective . eaux embouteillées boissons sans alcool et bière`.

La convention collective nationale des activités de production des eaux embouteillées et boissons
rafraîchissantes sans alcool et de bière du 1er septembre 2010 (étendue par arrêté du 30 mai 2012) porte
l'IDCC 1513. Elle ne concerne pas la papeterie ni la librairie.

## Périmètre

La version `2026.1` reprend la grille de l'article 1er de l'avenant n° 46 du 3 février 2026, applicable
à compter du **1er février 2026** (revalorisation de 1,20 %) et étendu par arrêté du 10 avril 2026
(JORF du 17 avril 2026). Les montants sont les salaires minima conventionnels garantis pour un horaire de
35 heures ; la règle `salaire minimum conventionnel` est exprimée en €/mois et proratisée une seule fois
par la quotité de travail.

La classification est saisie dans `classification` au format `<niveau>-<échelon>` (texte).

## Grille au 1er février 2026

| Catégorie | Niveau | Échelon | Clé | Minimum |
|---|---:|---:|---|---:|
| Ouvriers, employés | 1 | 1 | `1-1` | 1 839,80 € |
| | 1 | 2 | `1-2` | 1 848,39 € |
| | 1 | 3 | `1-3` | 1 901,31 € |
| | 2 | 1 | `2-1` | 1 952,39 € |
| | 2 | 2 | `2-2` | 2 003,91 € |
| | 2 | 3 | `2-3` | 2 055,35 € |
| | 3 | 1 | `3-1` | 2 124,22 € |
| | 3 | 2 | `3-2` | 2 174,82 € |
| | 3 | 3 | `3-3` | 2 227,84 € |
| | 4 | 1 | `4-1` | 2 366,10 € |
| | 4 | 2 | `4-2` | 2 435,18 € |
| Techniciens et agents de maîtrise | 4 | 10 | `4-10` | 2 366,10 € |
| | 4 | 20 | `4-20` | 2 435,18 € |
| | 5 | 10 | `5-10` | 2 607,79 € |
| | 5 | 20 | `5-20` | 2 676,92 € |
| | 5 | 30 | `5-30` | 2 746,04 € |
| | 6 | 10 | `6-10` | 2 918,55 € |
| | 6 | 20 | `6-20` | 3 056,73 € |
| | 6 | 30 | `6-30` | 3 264,75 € |
| Cadres | 6 | 2 | `6-2` | 3 056,73 € |
| | 6 | 3 | `6-3` | 3 264,75 € |
| | 7 | 1 | `7-1` | 3 505,55 € |
| | 7 | 2 | `7-2` | 3 747,26 € |
| | 7 | 3 | `7-3` | 3 988,95 € |
| | 8 | 1 | `8-1` | 4 299,70 € |
| | 8 | 2 | `8-2` | 4 610,49 € |
| | 8 | 3 | `8-3` | 5 180,31 € |

Une classification absente de la grille est signalée par `classification hors grille` et donne un
minimum nul afin que l'application appelante puisse bloquer le calcul.

## Sources officielles

- [Légifrance — avenant n° 46 du 3 février 2026](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054091953)
- [Légifrance — article 1er et grille](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000054091957)
- [Légifrance — convention collective nationale du 1er septembre 2010](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635411)

## Limites

Seule la grille des salaires minima est modélisée. L'article 8 de l'avenant rend le texte applicable aux
entreprises non adhérentes un jour franc après la publication de l'arrêté d'extension ; la version retient
la date d'effet du 1er février 2026. Les primes, la prévoyance et les autres dispositions de la convention
ne sont pas modélisées, et le choix de la version applicable à la période de paie reste à la charge de
l'application consommatrice.
