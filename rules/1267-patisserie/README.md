# Pâtisserie — IDCC 1267

La version `2026.1` modélise la grille des salaires minima conventionnels mensuels applicable au **1er janvier 2026**. Elle reprend l'avenant n° 98 du 12 novembre 2025, étendu par arrêté du 9 février 2026 publié au Journal officiel le 18 février 2026.

La valeur Publicodes est `pâtisserie` et les règles sont sous `salarié . convention collective . pâtisserie`.

## Règles implémentées

- `niveau` reçoit l'un des niveaux de la grille modélisée : `I` à `IX`.
- `salaire minimum conventionnel` expose le minimum mensuel à temps plein, proratisé selon la quotité de travail.
- `niveau hors grille` vaut `vrai` lorsque le niveau est absent de la grille ou manquant.

## Audit paie et limites

L'avenant modélisé porte sur les salaires minima. Le modèle ne déduit pas le niveau du poste et ne calcule pas les primes, majorations, indemnités, frais, prévoyance ou autres obligations conventionnelles ; ces éléments nécessitent des données contractuelles ou des règles distinctes.

## Sources officielles

- [Avenant n° 98 du 12 novembre 2025 relatif aux salaires minima conventionnels](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000053970120)
- [Article salarial de l'avenant](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000053970122)
- [Arrêté d'extension du 9 février 2026](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053593452)
- [Convention collective et classification](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635883)

## Tests

`test/patisserie.test.ts` vérifie la date et les sources, les neuf niveaux de la grille, la proratisation, les niveaux hors grille et l'inapplicabilité pour une autre convention.
