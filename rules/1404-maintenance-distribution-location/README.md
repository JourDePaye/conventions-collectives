# Maintenance, distribution et location de matériels — IDCC 1404

La version `2026.1` modélise la grille des salaires minima conventionnels mensuels applicable au **1er mars 2026** pour 151,67 heures mensuelles. Elle reprend l’avenant n° 16 du 18 février 2026 et son champ étendu par l’arrêté publié au Journal officiel le 29 mai 2026.

La valeur Publicodes est `maintenance distribution location` et les règles sont sous `salarié . convention collective . maintenance distribution location`.

## Règles implémentées

- `niveau` reçoit l’un des 22 niveaux de la grille : `A10` à `A80`, `B10` à `B80` et `C10` à `C60`.
- `salaire minimum conventionnel` expose le minimum mensuel correspondant, pour 151,67 heures, proratisé selon `salarié . contrat . temps de travail . quotité`.
- Les niveaux absents de la grille rendent le minimum nul et exposent `niveau hors grille` à `vrai`.

## Sources officielles

- Avenant n° 16 du 18 février 2026 relatif aux salaires minima conventionnels, texte KALI `KALITEXT000054177276`, article `KALIARTI000054177280`, BOCC 2026-14.
- Arrêté du 18 mai 2026 portant extension de l’avenant n° 16, publié au Journal officiel le 29 mai 2026, texte n° 46, NOR `TRST2612649A`, `JORFTEXT000054149369`.

## Limites

Le modèle ne déduit pas le niveau du poste et ne modélise pas les primes, majorations, ancienneté ou autres dispositions de la convention.

## Tests

`test/maintenance-distribution-location.test.ts` vérifie la date et les sources, les 22 niveaux de la grille, la proratisation à temps partiel, les niveaux hors grille et l’inapplicabilité pour une autre convention.
