# Industries du bois et de l'importation des bois — IDCC 158

La version `2026.1` modélise l'**avenant n° 7 du 19 février 2026** à l'accord du 10 septembre 2019 relatif aux classifications et aux salaires minimaux, avec effet au **1er avril 2026**.

## Périmètre modélisé

- grilles mensuelles pour 151,67 heures des ouvriers, du personnel administratif, commercial et technique (ACT), des agents de maîtrise (AM) et des cadres ;
- classification saisie sous la forme `catégorie niveau[.échelon]`, par exemple `ACT 6.1`, `AM 2.2` ou `C 4` ;
- proratisation selon `salarié . contrat . temps de travail . quotité` ;
- valeur du point d'ancienneté de 6,70 € exposée dans la source juridique mais non calculée automatiquement, faute de base d'ancienneté dans le modèle générique.

L'avenant est modélisé pour les **employeurs signataires ou adhérents**. Son extension étant demandée par l'avenant, elle n'est pas présumée dans cette version : un autre employeur reste bloqué et doit être validé par l'application consommatrice.

Les primes, frais de santé, prévoyance, formation, AT/MP, forfaits et exonérations ne sont pas calculés automatiquement : l'avenant salarial ne fournit pas de règle générique supplémentaire nécessaire aux endpoints standards de paie.

## Sources officielles

- [Avenant n° 7 du 19 février 2026 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054825946).
- [Convention collective nationale des industries du bois et de l'importation des bois, IDCC 158 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635186).

Les montants sont des minima mensuels bruts pour 151,67 heures. Ils ne préjugent pas des règles individuelles plus favorables, du SMIC ou des éléments de rémunération non modélisés.
