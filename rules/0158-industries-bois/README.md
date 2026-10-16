# Industries du bois et de l'importation des bois — IDCC 158

La version `2026.1` modélise l'**avenant n° 7 du 19 février 2026** à l'accord du 10 septembre 2019 relatif aux classifications et aux salaires minimaux, avec effet au **1er avril 2026**.

## Périmètre modélisé

- grilles mensuelles pour 151,67 heures des ouvriers, du personnel administratif, commercial et technique (ACT), des agents de maîtrise (AM) et des cadres ;
- classification saisie sous la forme `catégorie niveau[.échelon]`, par exemple `ACT 6.1`, `AM 2.2` ou `C 4` ;
- proratisation selon `salarié . contrat . temps de travail . quotité` ;
- valeur du point d'ancienneté de 6,70 € exposée dans la source juridique mais non calculée automatiquement, faute de base d'ancienneté dans le modèle générique.

La version `2026.1` modélise l'avenant pour les **employeurs signataires ou adhérents** seulement (`adhérent d'une organisation signataire` = oui) : un autre employeur reste bloqué.

La version `2026.2` (même date d'effet, elle remplace 2026.1) modélise l'**extension** : l'arrêté du 7 juillet 2026 (JORF n° 0161 du 11 juillet 2026, `JORFTEXT000054415943`) rend l'avenant n° 7 obligatoire pour tous les employeurs du champ, avec effet à la date de publication et sous réserve du SMIC. Pour un employeur dont `adhérent d'une organisation signataire` = non, la règle `accord applicable` n'est vraie qu'à partir de la `date de calcul` du 11 juillet 2026 (par défaut 1900, donc bloqué). Avant cette date, un employeur non adhérent n'a pas de minimum modélisé : l'ancienne grille n'est pas dans le paquet.

Les primes, frais de santé, prévoyance, formation, AT/MP, forfaits et exonérations ne sont pas calculés automatiquement : l'avenant salarial ne fournit pas de règle générique supplémentaire nécessaire aux endpoints standards de paie.

## Sources officielles

- [Avenant n° 7 du 19 février 2026 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054825946).
- [Convention collective nationale des industries du bois et de l'importation des bois, IDCC 158 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635186).

Les montants sont des minima mensuels bruts pour 151,67 heures. Ils ne préjugent pas des règles individuelles plus favorables, du SMIC ou des éléments de rémunération non modélisés.
