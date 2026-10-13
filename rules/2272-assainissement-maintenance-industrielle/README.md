# Assainissement et maintenance industrielle — IDCC 2272

La version `2026.1` modélise la grille des salaires minima conventionnels mensuels applicable au **1er avril 2026** pour 151,67 heures. Elle reprend l'avenant n° 45 du 20 février 2026, étendu par arrêté du 5 mai 2026 publié au Journal officiel le 16 mai 2026.

La valeur Publicodes est `assainissement et maintenance industrielle` et les règles sont sous `salarié . convention collective . assainissement et maintenance industrielle`.

## Règles implémentées

- `coefficient` reçoit l'un des coefficients de la classification modélisée : `170`, `185`, `200`, `215`, `230`, `245`, `260`, `280`, `320`, `430`, `500`, `580`, `760`, `1120` ou `1470`.
- `salaire minimum conventionnel` expose le minimum mensuel pour 151,67 heures, proratisé selon `salarié . contrat . temps de travail . quotité`.
- La grille applique la formule de l'avenant : partie fixe de `1 052,484 €` + coefficient × valeur du point `4,632 €`, avec les montants exceptionnels 2026 de `1 863 €` pour le coefficient 170 et `1 913,63 €` pour le coefficient 185.
- Les coefficients absents de la grille rendent le minimum nul et exposent `coefficient hors grille` à `vrai`.

## Sources officielles

- Avenant n° 45 du 20 février 2026 relatif à la réévaluation des salaires minima conventionnels au 1er avril 2026, texte KALI `KALITEXT000054303965`, articles `KALIARTI000054303969` et `KALIARTI000054303970`.
- Arrêté du 5 mai 2026 portant extension de l'avenant, publié au Journal officiel le 16 mai 2026, `JORFTEXT000054104243`.

## Audit paie et limites

L'avenant modélisé porte sur les salaires minima. Le modèle ne déduit pas le coefficient du poste et ne calcule pas les primes, majorations, indemnités, frais, prévoyance ou autres obligations conventionnelles ; ces éléments nécessitent des données contractuelles ou des règles distinctes.

## Tests

`test/assainissement-maintenance-industrielle.test.ts` vérifie la date et les sources, les coefficients de la grille, la formule et les exceptions 2026, la proratisation, les coefficients hors grille et l'inapplicabilité pour une autre convention.
