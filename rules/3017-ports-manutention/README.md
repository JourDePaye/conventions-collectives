# Ports et manutention — IDCC 3017

La convention collective nationale unifiée ports et manutention du 15 avril 2011 (IDCC 3017, conteneur `KALICONT000029142476`) est modélisée par une version par avenant salarial étendu. Chaque version contient les **trois grilles complètes** de salaires bruts minima hiérarchiques (SBMH) de l'annexe, de 0 à 33 ans d'ancienneté :

| Version | Effet | Texte | Extension |
|---|---|---|---|
| `2024.1` | 1er janvier 2024 | avenant n° 17 du 27 octobre 2023 (`KALITEXT000049508746`) | arrêté du 13 mai 2024, JORF du 31 mai 2024 ; ne couvrait que le niveau B de la grille des établissements portuaires (remplacée par `2024.2`) |
| `2024.2` | 1er janvier 2024 | avenant n° 17, grilles complètes | idem, remplace `2024.1` |
| `2025.1` | 1er janvier 2025 | avenant n° 19 du 16 janvier 2025, NAO 2025 (`KALITEXT000052455596`, BO 2025-38), +2 % | arrêté du 21 octobre 2025, JORF du 30 octobre 2025 |
| `2026.1` | 1er janvier 2026 | avenant n° 21 du 4 décembre 2025, NAO 2026 (`KALITEXT000054034055`, BO 2026-3), +1,3 % | arrêté du 23 février 2026, JORF du 5 mars 2026 |

## Règles implémentées

- `grille de salaires` choisit la grille : `établissements portuaires` (salariés des ports de commerce et de pêche, valeur par défaut), `autres salariés` (autres salariés du compartiment manutention) ou `ouvriers dockers CQP` (ouvriers de la filière exploitation titulaires d'au moins deux CQP d'ouvrier docker).
- `classification` : `B`, `C1` à `C3`, `D1`, `D2`, `AM1` à `AM3`, `Cadres 1` à `Cadres 4`. La grille des établissements portuaires les compte toutes (13 lignes) ; `autres salariés` compte `B`, `C1` à `C3`, `D1`, `D2`, `AM1`, `AM2`, `Cadres 1` à `Cadres 3` (11 lignes) ; `ouvriers dockers CQP` compte `B`, `C1` à `C3`, `D1`, `D2`, `AM1`, `AM2` (8 lignes). `Cadres 4` n'a qu'un montant, sans palier d'ancienneté. Le niveau A est supprimé : son minimum est celui du niveau B.
- `ancienneté dans la classification` (années révolues) donne le `palier d'ancienneté` (0, 3, 6, ..., 33 ans) ; entre deux paliers, le palier inférieur s'applique, au-delà de 33 ans le dernier.
- `salaire minimum conventionnel` : SBMH mensuel à temps plein (`salaire minimum conventionnel . grille`) multiplié par `salarié . contrat . temps de travail . quotité`. Il vaut `0 €/mois` pour une combinaison absente du texte.
- `classification hors grille` est vraie pour une combinaison grille et classification absente du texte.

Changement par rapport à la version `2024.1` : la clé `B` est conservée (grille par défaut des établissements portuaires), les autres classifications sont ajoutées ; un minimum hors grille vaut désormais `0 €/mois` (et non plus une règle inapplicable).

## Audit des rubriques de paie

Les avenants salariaux fixent des SBMH et des paliers d'ancienneté ; la règle `audit paie` conserve la mention de la version `2024.1`. Aucun taux ou assiette conventionnel générique supplémentaire, calculable avec les seules entrées de ce modèle, n'est retenu. Les rubriques de cotisations, prévoyance, retraite supplémentaire, formation, primes, indemnités, avantages et frais restent externes.

## Limites

- Le texte de l'avenant n° 17 présente `4183` et `4203` sans espace des milliers (4 183 et 4 203 €) ; les montants sont repris tels quels.
- Les avenants antérieurs au n° 17 (avant 2024) ne sont pas modélisés.
