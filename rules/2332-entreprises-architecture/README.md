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
