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

Seule la région Rhône-Alpes est modélisée ; les autres régions (chacune avec sa valeur de point) ne le sont pas.
