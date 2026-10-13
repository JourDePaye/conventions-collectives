# Commissaires de justice et sociétés de ventes volontaires — IDCC 3250

Le fichier [2026.1](3250-commissaires-justice.2026.1.publicodes) entre en vigueur le **1er janvier 2026**. Il modélise l’avenant n° 12 du 9 décembre 2025 relatif aux minima conventionnels 2026, sous la valeur Publicodes `commissaires de justice et sociétés de ventes volontaires`.

Le champ juridique doit être confirmé par l’appelant avec `champ juridique = 'employeur signataire ou adhérent'`. Il n’est pas déduit automatiquement d’un simple choix d’IDCC.

## Grille salariale implémentée

La grille reprend les 29 minima mensuels bruts à temps plein de l’annexe de l’avenant n° 12 :

| Catégorie et coefficient | Minimum mensuel brut |
|---|---:|
| I.1-215 | 1 801,80 € |
| I.2-230 | 1 805,50 € |
| I.3-245 | 1 816,10 € |
| I.4-260 | 1 825,78 € |
| II.1-275 | 1 831,80 € |
| II.2-283 | 2 463,29 € |
| II.3-295 | 2 548,80 € |
| II.4-305 | 2 658,13 € |
| II.5-315 | 2 768,69 € |
| II.6-325 | 2 881,32 € |
| II.7-335 | 2 997,28 € |
| II.8-345 | 3 113,55 € |
| III.1-350 | 3 227,12 € |
| III.2-360 | 3 338,92 € |
| III.3-370 | 3 451,18 € |
| III.4-380 | 3 564,34 € |
| III.5-390 | 3 677,48 € |
| III.6-400 | 3 790,60 € |
| IV.1-410 | 3 903,74 € |
| IV.2-420 | 4 016,88 € |
| IV.3-430 | 4 130,03 € |
| IV.4-440 | 4 243,18 € |
| IV.5-450 | 4 356,32 € |
| IV.6-460 | 4 469,46 € |
| IV.7-470 | 4 582,61 € |
| IV.8-480 | 4 695,75 € |
| IV.9-490 | 4 808,90 € |
| IV.10-500 | 4 922,04 € |
| IV.11-510 | 5 035,19 € |
| IV.12-520 | 5 148,33 € |

The minimum is prorated once by `contrat . temps de travail . quotité`. An unknown combination is exposed through `catégorie et coefficient hors grille` and returns zero from the grid so the caller can handle the anomaly.

## Payroll-rubric audit

The reviewed official text changes the salary minima only. It does not provide a convention-specific assiette, contribution rate, ceiling, forfait, exemption, benefit-in-kind valuation, health or prévoyance rate, formation contribution, or AT/MP rate to apply in the payroll engine. No payroll-wide rule is therefore overridden in this namespace. The focused test verifies that every exported rule remains namespaced and does not collide with `modele-social`.

Other provisions—fees, bonuses, seniority, working time, leave, training and employee-benefit arrangements—are not calculated here because their triggering facts and bases are not defined by this salary amendment. They remain outside the model rather than being silently treated as zero.

## Official sources

- Avenant n° 12 du 9 décembre 2025 relatif aux salaires minima conventionnels pour l’année 2026, Légifrance, KALIARTI000054177556.
- Convention collective nationale des commissaires de justice et sociétés de ventes volontaires du 16 novembre 2022, Légifrance, KALITEXT000046771122, article 8 of the salary amendment.
