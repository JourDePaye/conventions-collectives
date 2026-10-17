# Industries du bois et de l'importation des bois — IDCC 158

La version `2026.2` modélise l'**avenant n° 7 du 19 février 2026** à l'accord du 10 septembre 2019 relatif aux classifications et aux salaires minimaux, avec effet au **1er avril 2026**.

## Périmètre modélisé

- grilles mensuelles pour 151,67 heures des ouvriers, du personnel administratif, commercial et technique (ACT), des agents de maîtrise (AM) et des cadres ;
- classification saisie sous la forme `catégorie niveau[.échelon]`, par exemple `ACT 6.1`, `AM 2.2` ou `C 4` ;
- proratisation selon `salarié . contrat . temps de travail . quotité` ;
- valeur du point d'ancienneté de 6,70 € exposée dans la source juridique mais non calculée automatiquement, faute de base d'ancienneté dans le modèle générique.

La version `2026.2` (`extension: 2026-07-11`) : l'arrêté du 7 juillet 2026 (JORF n° 0161 du 11 juillet 2026, `JORFTEXT000054415943`) rend l'avenant n° 7 obligatoire pour tous les employeurs du champ, avec effet à la date de publication et sous réserve du SMIC. Les employeurs adhérents l'appliquent dès le 1er avril 2026, les autres à partir du 11 juillet 2026. Avant cette date, un employeur non adhérent reste à la version `2025.1`. La révision `2026.1` est supprimée.

La version `2025.1` (`extension: 2025-05-02`) modélise l'**avenant n° 6 du 28 novembre 2024** (grilles au 1er janvier 2025, mêmes classifications, point d'ancienneté à 6,60 €), étendu par arrêté du 25 avril 2025 (JORF n° 0103 du 2 mai 2025, `JORFTEXT000051540518`, effet à la date de publication). Elle s'applique aux adhérents du 1er janvier 2025 au 31 mars 2026, et aux autres employeurs du 2 mai 2025 au 10 juillet 2026.

Les primes, frais de santé, prévoyance, formation, AT/MP, forfaits et exonérations ne sont pas calculés automatiquement : l'avenant salarial ne fournit pas de règle générique supplémentaire nécessaire aux endpoints standards de paie.

## Sources officielles

- [Avenant n° 7 du 19 février 2026 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054825946).
- [Avenant n° 6 du 28 novembre 2024 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051447603).
- [Convention collective nationale des industries du bois et de l'importation des bois, IDCC 158 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635186).

Les montants sont des minima mensuels bruts pour 151,67 heures. Ils ne préjugent pas des règles individuelles plus favorables, du SMIC ou des éléments de rémunération non modélisés.
