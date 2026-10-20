# Télédiffusion — IDCC 3241

Les fichiers [2026.1](3241-telediffusion.2026.1.publicodes) et [2026.2](3241-telediffusion.2026.2.publicodes) entrent en vigueur le **1er juin 2026**, conformément aux accords du 11 mai 2026. La version 2026.2 corrige le barème CDDU et complète la colonne M2.

La valeur Publicodes est `télédiffusion` et les règles sont sous `salarié . convention collective . télédiffusion`.

## Périmètre modélisé

La version 2026.2 couvre la **liste 1** des minima journaliers bruts pour une journée de 8 heures, avec les colonnes M1 et M2 :

| Niveau | M1 | M2 |
|---|---:|---:|
| `1` | 119,83 € | 125,82 € |
| `2` | 138,68 € | 145,63 € |
| `3` | 151,30 € | 158,85 € |
| `4-1` | 162,32 € | 170,43 € |
| `4-2` | 168,30 € | 176,71 € |
| `5-1` | 180,16 € | 189,16 € |
| `5-2` | 193,05 € | 202,70 € |
| `5-3` | 198,00 € | 207,89 € |
| `6-1` | 205,01 € | 215,27 € |
| `6-2` | 212,83 € | 223,49 € |
| `7-1` | 223,65 € | 234,82 € |
| `7-2` | 284,38 € | 298,58 € |

Le niveau `8` est rémunéré de gré à gré, avec un plancher automatique de 284,38 € (M1 du niveau 7-2). La liste 2 (fonctions artistiques et techniques) reste hors périmètre faute de paramètres métier dédiés pour distinguer ses fonctions et modalités de prestation.

## Salariés permanents (versions 2026.3 et 2026.4)

Les versions [2026.3](3241-telediffusion.2026.3.publicodes) et [2026.4](3241-telediffusion.2026.4.publicodes) ajoutent les minima mensuels bruts pour 35 heures des salariés permanents (CDI et CDD de droit commun), articles 21.2.2, 22.1 et 22.2 de la CCN :

- `classification` : niveau I à V avec échelon A, B ou C (`'I-A'` à `'V-C'`), ou niveau `'VI'`, sans échelon ;
- la grille de l'article 22.2 s'applique à partir de 50 salariés (`entreprise . salariés . effectif`), ou quand l'entreprise appartient à un groupe de plus de 50 salariés (`entreprise d'un groupe`, non par défaut) ; sinon celle de l'article 22.1 ;
- `salaire minimum conventionnel` (€/mois) est proratisé selon la quotité de travail ; `classification hors grille` est vrai pour une classification absente ;
- le minimum comprend tous les éléments de rémunération, y compris un éventuel 13e mois (article 22, note) : comparer le seul salaire de base le surestime pour un salarié qui en perçoit.

| Version | Date d'effet | Source |
|---|---|---|
| `2026.3` | 1er janvier 2026, pour tous les employeurs | Accord du 15 décembre 2023 (KALITEXT000049271441), barème au 1er février 2024, étendu par arrêté du 16 mai 2024 (JORF du 31 mai 2024) |
| `2026.4` | 1er juin 2026 pour les adhérents d'une organisation signataire ; pour les autres, à partir de la publication de l'extension (`extension: 2026-07-24`) | Accord du 11 mai 2026 (KALITEXT000054880861), annexe 1, étendu par arrêté du 15 juillet 2026 (JORF du 24 juillet 2026) ; elle reprend les minima journaliers CDDU de la 2026.2 |

La 2026.3 ne modélise pas les minima journaliers CDDU d'avant le 1er juin 2026.

## Audit explicite du référentiel de paie

Les accords audités portent sur des minima de rémunération, exprimés au jour pour 8 heures (CDDU, liste 1) et au mois/à l'année pour les salariés permanents. Cette version corrige uniquement le périmètre CDDU modélisé ; elle ne modifie pas l'assiette générale des cotisations, les taux salariés ou employeurs, plafonds et tranches, forfaits, exonérations, avantages en nature, prévoyance, santé, formation professionnelle ou AT.

Ne sont pas calculés ici : la liste 2, les primes et indemnités, les règles d'ancienneté, les indemnités de mise à la retraite, les modalités de temps de travail et les obligations de prévoyance/santé. Ces dispositions nécessitent des entrées et des périmètres contractuels distincts ; elles restent documentées comme omissions plutôt que d'être assimilées au minimum journalier.

## Sources officielles

- Accord du 11 mai 2026 relatif aux salaires minima des salariés employés sous CDDU, NOR ASET2650556M, BOCC 2026-23, pages 101 à 105.
- Accord du 11 mai 2026 relatif aux salaires minima, NOR ASET2650557M, BOCC 2026-23, pages 106 à 109.
- Convention collective nationale de la télédiffusion du 2 juillet 2021 (IDCC 3241), publiée dans la base officielle des conventions collectives.
