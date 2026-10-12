# Industrie de la fabrication des ciments — IDCC 3233

Le fichier [2026.1](3233-industrie-fabrication-ciments.2026.1.publicodes) est applicable à tous les employeurs et salariés compris dans le champ de la convention à compter du 9 juillet 2026, date de publication de son arrêté d’extension. Il reprend l’avenant du 16 avril 2026 relatif aux salaires minima garantis 2026, dont les montants sont fixés pour l’année 2026.

La convention collective nationale de l’industrie de la fabrication des ciments du 2 octobre 2019 couvre les entreprises relevant de l’IDCC 3233.

## Règles implémentées

- `catégorie` distingue les ouvriers et employés, techniciens et agents de maîtrise (`ouvriers et ETAM`) des ingénieurs et cadres (`ingénieurs et cadres`).
- `coefficient` reçoit les coefficients publiés dans les sous-titres II.D et III.B.
- `salaire minimum conventionnel` donne le SMH mensuel des ouvriers et ETAM, ou le SMB mensuel des ingénieurs et cadres, proratisé selon la quotité de travail.
- `salaire minimum annuel conventionnel` donne le SMAG annuel des ouvriers et ETAM ou le SAB annuel des ingénieurs et cadres, proratisé selon la quotité de travail.
- `coefficient hors grille` vaut vrai pour un coefficient absent de la grille de la catégorie ; les minima retournent alors `0`.

## Grille 2026.1

### Ouvriers et ETAM

| Coefficient | SMH mensuel | SMAG annuel à l'embauche |
|---:|---:|---:|
| 140 | 1 851 € | 25 618,30 € |
| 150 | 1 861 € | 25 751,30 € |
| 160 | 1 873 € | 25 910,90 € |
| 170 | 1 886 € | 26 083,80 € |
| 180 | 1 900 € | 26 270,00 € |
| 190 | 1 919 € | 26 522,70 € |
| 205 | 1 993 € | 27 506,90 € |
| 215 | 2 089 € | 28 783,70 € |
| 225 | 2 185 € | 30 060,50 € |
| 235 | 2 283 € | 31 363,90 € |
| 245 | 2 387 € | 32 747,10 € |
| 255 | 2 569 € | 35 167,70 € |
| 270 | 2 626 € | 35 925,80 € |
| 290 | 2 824 € | 38 559,20 € |
| 310 | 3 029 € | 41 285,70 € |
| 335 | 3 275 € | 44 557,50 € |
| 360 | 3 539 € | 48 068,70 € |

### Ingénieurs et cadres

| Coefficient | SMB mensuel | SAB annuel |
|---:|---:|---:|
| 185 | 1 896 € | 24 648 € |
| 210 | 2 152 € | 27 976 € |
| 230 | 2 357 € | 30 641 € |
| 250 | 2 562 € | 33 306 € |
| 270 | 2 767 € | 35 971 € |
| 290 | 2 971 € | 38 623 € |
| 310 | 3 176 € | 41 288 € |
| 330 | 3 381 € | 43 953 € |
| 350 | 3 586 € | 46 618 € |
| 360 | 3 689 € | 47 957 € |
| 370 | 3 791 € | 49 283 € |
| 380 | 3 893 € | 50 609 € |
| 390 | 3 996 € | 51 948 € |
| 400 | 4 098 € | 53 274 € |
| 600 | 6 147 € | 79 911 € |

## Sources officielles

- [Avenant du 16 avril 2026 relatif aux salaires minima garantis 2026 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054872436)
- [Arrêté du 6 juillet 2026 portant extension — Journal officiel](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054400063), publié le 9 juillet 2026.

## Limites

- Seules les grilles de salaires minima de l’avenant n° 18 sont modélisées ; les autres dispositions de la convention ne le sont pas.
- Les minima des ouvriers et ETAM sont modélisés comme minima mensuels pour un temps complet ; les minima des ingénieurs et cadres restent disponibles dans leur unité annuelle et sont aussi exposés au douzième par la règle mensuelle.
- Les mécanismes de comparaison annuelle, primes, ancienneté et autres compléments conventionnels ne sont pas modélisés.
- Les classifications ou coefficients absents des annexes restent inapplicables ; aucune valeur n’est extrapolée.
