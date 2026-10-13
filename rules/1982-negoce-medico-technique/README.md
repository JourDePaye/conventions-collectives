# Négoce de matériel médico-technique — IDCC 1982

La version `2026.1` modélise la grille des salaires minima conventionnels mensuels applicable au **1er juin 2026**. Elle reprend l'avenant n° 2 du 20 février 2026, étendu par arrêté du 18 mai 2026 publié au Journal officiel le 28 mai 2026.

La valeur Publicodes est `négoce médico-technique` et les règles sont sous `salarié . convention collective . négoce médico-technique`.

## Règles implémentées

- `niveau` reçoit l'un des niveaux de la grille modélisée : `E1` à `E4`, `TAM5` à `TAM8`, `C9` à `C13` ou `D14`.
- `salaire minimum conventionnel` expose le minimum mensuel à temps plein, proratisé selon `salarié . contrat . temps de travail . quotité`.
- `niveau hors grille` vaut `vrai` lorsque le niveau est absent de la grille ou manquant.

## Audit paie et limites

L'avenant modélisé porte sur les salaires minima. Le modèle ne déduit pas le niveau du poste et ne calcule pas les primes, majorations, indemnités, frais, prévoyance ou autres obligations conventionnelles ; ces éléments nécessitent des données contractuelles ou des règles distinctes. Les cadres sont représentés par les niveaux `C9` à `D14` tels que publiés dans la grille salariale.

## Sources officielles

- [Avenant n° 2 du 20 février 2026 relatif aux salaires minima conventionnels](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054177346)
- [Article salarial de l'avenant](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000054177348)
- [Arrêté d'extension du 18 mai 2026](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054149339)
- [Convention collective et classification](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635723)

## Tests

`test/1982-negoce-medico-technique.test.ts` vérifie la date et les sources, les quatorze niveaux de la grille, la proratisation, les niveaux hors grille et l'inapplicabilité pour une autre convention.
