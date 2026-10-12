# Commerce de détail de l'horlogerie-bijouterie — IDCC 1487

La version `2026.1` modélise la grille des salaires minima conventionnels mensuels applicable au **1er janvier 2026** pour 151,67 heures. Elle reprend l'avenant n° 33 du 21 novembre 2025, étendu par arrêté du 17 février 2026 publié au Journal officiel le 24 février 2026.

La valeur Publicodes est `commerce de détail horlogerie bijouterie` et les règles sont sous `salarié . convention collective . commerce de détail horlogerie bijouterie`.

## Règles implémentées

- `niveau` reçoit l'un des dix niveaux de la grille : `A` à `J`.
- `salaire minimum conventionnel` expose le minimum mensuel correspondant pour 151,67 heures, proratisé selon `salarié . contrat . temps de travail . quotité`.
- Les niveaux absents de la grille rendent le minimum nul et exposent `niveau hors grille` à `vrai`.

## Sources officielles

- Avenant n° 33 du 21 novembre 2025 relatif aux salaires minima conventionnels, texte KALI `KALITEXT000054033785`, article `KALIARTI000054033788`.
- Arrêté du 17 février 2026 portant extension de l'avenant n° 33, publié au Journal officiel le 24 février 2026, JORF du 24 février 2026.

## Limites

Le modèle ne déduit pas le niveau du poste et ne modélise pas les primes, majorations, ancienneté ou autres dispositions de la convention.

## Tests

`test/commerce-detail-horlogerie-bijouterie.test.ts` vérifie la date et les sources, les dix niveaux de la grille, la proratisation à temps partiel, les niveaux hors grille et l'inapplicabilité pour une autre convention.
