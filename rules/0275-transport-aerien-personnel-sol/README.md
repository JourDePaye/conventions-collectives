# Personnel au sol des entreprises de transport aérien — IDCC 0275

Les modèles `2025.2`, `2025.3` et `2025.4` transposent l'avenant n° 100 du **2 avril 2025** relatif aux salaires de la convention collective nationale du personnel au sol des entreprises de transport aérien (brochure 3177). Cet avenant a été **étendu par arrêté du 2 juin 2025** (JORF du 27 juin 2025) : la grille s'applique à tous les employeurs du champ, signataires ou non.

| Version | Date d'effet | Grille |
|---|---|---|
| `2025.2` | 1er avril 2025 | grille du 1er avril 2025 (160 : 1 836 € … 750 : 5 906 €) |
| `2025.3` | 1er septembre 2025 | grille du 1er septembre 2025 (245 : 2 096 €, 360 : 2 976 €, 750 : 5 916 €) |
| `2025.4` | 1er novembre 2025 | grille du 1er novembre 2025 (160 : 1 845 € … 750 : 5 925 €) |

La version `2025.1` (même date d'effet que `2025.2`) était erronée : elle appliquait dès le 1er avril 2025 les montants du 1er novembre 2025 aux coefficients 160 à 235 et 360 à 750, et ne s'appliquait qu'aux employeurs signataires ou adhérents. Elle est remplacée par `2025.2`.

## Règles calculées

- `coefficient` est le coefficient de classification fourni par l'application (160, 165, 175, 185, 190, 195, 200, 220, 235, 245, 260, 270, 290, 295, 300, 360, 420, 510, 600, 750).
- `date de calcul` est conservée pour compatibilité ; le palier est choisi par la version en vigueur à la date de paie, la règle n'est plus lue.
- `grille` donne le minimum hiérarchique mensuel brut à temps plein ; `salaire minimum conventionnel` applique une seule fois `salarié . contrat . temps de travail . quotité`.
- `coefficient hors grille` vaut `oui` lorsque le coefficient n'est pas dans la grille ; le minimum est alors non applicable.
- `indemnité de panier` expose séparément `7,40 €/jour` (article 2, au lieu de 7,10 €, à compter du 1er avril 2025) ; elle n'est pas ajoutée au salaire minimum.
- Les règles `champ juridique` et `accord applicable` de `2025.1` n'existent plus : l'avenant étant étendu, aucune condition d'adhésion n'est posée.

## Limites

- Le palier du 1er novembre est écrit « au 1er novembre 2025 ou à la date d'application du prochain arrêté relatif au relèvement du Smic » ; le modèle retient le 1er novembre 2025.
- L'article 7 prévoit l'application aux non-adhérents un jour franc après la publication de l'arrêté d'extension (27 juin 2025) ; les dates d'effet retenues sont celles de l'avenant, ce qui pour les employeurs non adhérents ne diffère que sur la période antérieure à cette application.
- Aucune base, taux de cotisation, plafond, forfait, santé, prévoyance, formation ou AT/MP générique n'est créé par cet avenant : ces rubriques restent héritées de `modele-social`. Une nouvelle version devra être ajoutée pour tout accord salarial ultérieur (aucun texte plus récent dans Légifrance).

## Sources

- Avenant n° 100 du 2 avril 2025, KALITEXT000051909575 : https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051909575
- Convention collective nationale, conteneur KALICONT000005635872 : https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635872
