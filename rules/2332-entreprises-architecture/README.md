# Entreprises d'architecture — IDCC 2332

## Version `2025.1`

La version `2025.1` modélise l'accord Rhône-Alpes du **11 février 2025** relatif à la valeur du point. Elle est limitée aux employeurs signataires ou adhérents à cet accord régional ; elle ne constitue pas une extrapolation aux autres territoires.

## Minimum conventionnel modélisé

Le minimum mensuel brut à temps plein est calculé comme le maximum entre :

- le coefficient hiérarchique multiplié par la valeur du point ;
- le plancher mensuel de **1 945 € en zone 1** ou **1 892 € en zone 2**.

L'accord fixe une valeur du point de **9,13 € en zone 1** (Ain, Isère, Rhône, Savoie et Haute-Savoie) et **9,02 € en zone 2** (Ardèche, Drôme et Loire). Le résultat est proratisé une seule fois par `salarié . contrat . temps de travail . quotité`.

La zone et le coefficient sont des données d'entrée : les intitulés d'emploi et le classement ne sont pas déduits automatiquement. Une zone absente de l'accord est signalée par `zone hors accord` et retourne zéro.

## Audit des rubriques de paie

Les sources inspectées fixent la valeur du point et les minima de salaire. Elles ne modifient pas de manière générique et calculable l'assiette générale, les taux ou plafonds de cotisations, les forfaits, exonérations, avantages en nature, santé, prévoyance, formation professionnelle ou AT/MP. Ces éléments restent fournis par l'application appelante lorsqu'ils sont dus selon leurs propres textes et conditions.

## Sources officielles

- [Accord Rhône-Alpes du 11 février 2025 relatif à la valeur du point — Légifrance](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000051580416)
- [Convention collective nationale des entreprises d'architecture du 27 février 2003 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635365)

## Corrections de date et version `2026.1`

- `2025.1` portait la date de signature de l'accord Rhône-Alpes (11 février 2025). Le texte s'applique « à compter du premier jour du mois suivant la date de publication de l'arrêté d'extension » : arrêté du 27 mai 2025, JORF du 28 mai 2025, soit le **1er juin 2025**, pour toutes les entreprises du champ de la convention (et non seulement les signataires ou adhérents).
- `2025.2` (même `validFrom` que `2025.1`, il la remplace) : du 11 février au 31 mai 2025, aucune valeur de point régionale n'est applicable ; les règles renvoient 0 et `zone hors accord` est vraie.
- `2025.3` (1er juin 2025) : mêmes valeurs que `2025.1` (9,13 € / 1 945 € en zone 1 ; 9,02 € / 1 892 € en zone 2).
- `2026.1` (1er juin 2026) : accord Rhône-Alpes du 3 février 2026 ([KALITEXT000054337579](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054337579)), étendu par arrêté du 20 mai 2026 (JORF du 29 mai 2026) : point à **9,21 €** en zone 1 et **9,10 €** en zone 2. Le texte ne reprend pas de plancher en euros (article 3 : aucun salaire inférieur au Smic) ; `plancher mensuel` vaut donc 0.

Les versions `2025.1` à `2026.1` ne modélisent que la région Rhône-Alpes.

## Version `2026.2` : tous les territoires

La version [`2026.2`](2332-entreprises-architecture.2026.2.publicodes) s'applique à compter du **1er janvier 2026**, à tous les employeurs du champ. Elle remplace la `2026.1` dès cette date. La date d'effet de la `2026.1` (1er juin 2026) étant postérieure, un consommateur qui choisit la version par date doit écarter la `2026.1`.

- **Territoire** : la valeur du point est négociée par chaque commission territoriale paritaire (article V.2.2). `territoire` se déduit de l'entrée `département` (les deux premiers chiffres du code postal, les trois premiers outre-mer, `20`, `2A` ou `2B` pour la Corse) selon le périmètre de l'article XV.5.1 de la CCN. Il y a 27 territoires, Mayotte comprise. Sans département connu, le territoire est « hors territoire ».
- **Zones** :
  - Île-de-France : zone 1 pour 75, 92, 93 et 94, zone 2 pour 77, 78, 91 et 95.
  - Rhône-Alpes : zone 1 pour 01, 38, 69, 73 et 74, zone 2 pour 07, 26 et 42. L'accord du 3 février 2026 nomme les zones sans les définir ; les départements sont ceux de l'accord du 11 février 2025.
  - Midi-Pyrénées : zone CUTM (Toulouse Métropole, entrée booléenne `Toulouse Métropole`, non par défaut) ou hors CUTM.
- **Valeur du point** : du 1er janvier 2026, celle de l'accord alors en vigueur ; puis celle de l'accord conclu pour 2026, au premier jour du mois suivant la publication de son arrêté d'extension (article 1er de chaque accord, article XV.5.2.1 de la CCN) :
  - **1er avril 2026** (JORF du 28 mars 2026) : Alsace, Aquitaine, Auvergne, Basse-Normandie, Bourgogne, Centre-Val de Loire, Champagne-Ardenne, Haute-Normandie, Île-de-France, Languedoc-Roussillon, Limousin, Lorraine, Midi-Pyrénées, Nord-Pas-de-Calais et Pays de la Loire.
  - **1er mai 2026** (JORF du 17 avril 2026) : Corse, Franche-Comté, Provence-Alpes-Côte d'Azur, Picardie et Poitou-Charentes.
  - **1er juin 2026** (JORF du 29 mai 2026) : Bretagne et Rhône-Alpes.
  - **1er août 2026** (JORF du 9 juillet 2026) : Guadeloupe, Guyane, Martinique et La Réunion.
- **Tranches** : plusieurs accords fixent une valeur par tranche de coefficients (par exemple 200 à 280, 300 à 380 et 400 à 600).
- **Plancher** : quelques accords fixent un salaire minimum mensuel (`plancher mensuel`). Le minimum est alors le plus élevé du produit coefficient × point et de ce plancher. C'est le cas en Alsace, en Champagne-Ardenne, dans le Nord-Pas-de-Calais, en Picardie, et en Rhône-Alpes jusqu'au 31 mai 2026.
- **Grille** : `coefficient hors grille` est vrai lorsqu'un accord s'applique et que le coefficient n'est pas l'un de ceux de la grille de classification (article V.1.10 : 200 à 600, de 20 en 20).
- **Sans accord** : Mayotte n'a pas d'accord, comme un établissement sans département connu. `zone hors accord` est alors vrai, le minimum vaut 0 et seul le Smic s'applique.

| Territoire | Accord en vigueur au 1er janvier 2026 | Accord 2026 |
|---|---|---|
| Alsace | 27 mars 2025 : 9,00 €, plancher 1 850 € | 24 novembre 2025 : 9,09 €, plancher 1 890 € |
| Aquitaine | 16 janvier 2025 : 9,19 € | 1er décembre 2025 : 9,28 € |
| Auvergne | 20 janvier 2025 : 9,11 € | 10 décembre 2025 : 9,20 € |
| Basse-Normandie | 21 janvier 2025 : 9,25 € (200 à 300), 9,03 € (320 et plus) | 2 décembre 2025 : 9,34 €, 9,14 € |
| Bourgogne | 29 janvier 2025 : 9,12 € | 8 décembre 2025 : 9,21 € |
| Bretagne | 27 mars 2025 : 9,13 € (200 à 280), 9,00 € (300 à 380), 8,88 € (400 à 600) | 10 février 2026 : 9,18 € (200 à 380), 8,95 € (400 à 600) |
| Centre-Val de Loire | 28 février 2025 : 9,04 € | 16 décembre 2025 : 9,13 € |
| Champagne-Ardenne | 27 février 2025 : 8,96 €, plancher 1 900 € | 28 novembre 2025 : 9,05 €, plancher 1 950 € |
| Corse | 20 janvier 2025 : 9,13 € | 14 novembre 2025 : 9,21 € |
| Franche-Comté | 28 novembre 2023 : 9,00 € | 9 décembre 2025 : 9,18 € |
| Guadeloupe | 2 janvier 2025 : 9,05 €, 8,94 €, 8,84 € (200 à 280, 300 à 380, 400 à 600) | 23 février 2026 : 9,14 €, 9,03 €, 8,93 € |
| Guyane | 30 décembre 2024 : 9,02 €, 8,90 €, 8,80 € | 19 février 2026 : 9,11 €, 8,99 €, 8,89 € |
| Haute-Normandie | 21 janvier 2025 : 9,25 € (200 à 300), 9,03 € (320 et plus) | 2 décembre 2025 : 9,34 €, 9,14 € |
| Île-de-France, zone 1 | 29 janvier 2025 : 9,82 €, 9,66 €, 9,50 € (200 à 280, 300 à 380, 400 à 600) | 26 novembre 2025 : 9,95 €, 9,77 €, 9,59 € |
| Île-de-France, zone 2 | 9,72 €, 9,57 €, 9,41 € | 9,85 €, 9,68 €, 9,49 € |
| Languedoc-Roussillon | 10 février 2025 : 9,07 € (200 à 300), 8,85 € (320 et plus) | 8 janvier 2026 : 9,18 €, 8,94 € |
| Limousin | 10 janvier 2025 : 9,39 € | 3 décembre 2025 : 9,48 € |
| Lorraine | 7 février 2025 : 9,05 € | 7 novembre 2025 : 9,15 € |
| Martinique | 31 décembre 2024 : 9,05 €, 8,94 €, 8,84 € | 20 février 2026 : 9,14 €, 9,03 €, 8,93 € |
| Midi-Pyrénées, CUTM | 28 janvier 2025 : 9,20 € (jusqu'à 320), 8,97 € (au-delà) | 25 novembre 2025 : 9,27 €, 9,04 € |
| Midi-Pyrénées, hors CUTM | 9,10 €, 8,86 € | 9,24 €, 8,99 € |
| Nord-Pas-de-Calais | 27 mars 2025 : 8,98 €, plancher 1 860 € | 20 novembre 2025 : 9,07 €, plancher 1 880 € |
| Pays de la Loire | 12 février 2025 : 9,19 € (200 à 380), 8,96 € (400 à 600) | 12 décembre 2025 : 9,28 €, 9,06 € |
| Picardie | 21 février 2025 : 8,85 €, plancher 1 900 € | 14 janvier 2026 : 8,94 €, plancher 1 923 € |
| Poitou-Charentes | 13 janvier 2025 : 9,01 € (200 à 360), 8,95 € (au-delà) | 21 janvier 2026 : 9,12 € (200 à 360), 9,10 € (380 à 600) |
| Provence-Alpes-Côte d'Azur | 10 décembre 2024 : 9,10 € | 7 janvier 2026 : 9,19 € |
| La Réunion | 14 mars 2025 : 8,76 € | 16 mars 2026 : 8,84 € |
| Rhône-Alpes, zone 1 | 11 février 2025 : 9,13 €, plancher 1 945 € | 3 février 2026 : 9,21 € |
| Rhône-Alpes, zone 2 | 9,02 €, plancher 1 892 € | 9,10 € |
| Mayotte | aucun | aucun |

Les identifiants KALITEXT des accords et leurs arrêtés d'extension sont listés dans les métadonnées du fichier.
