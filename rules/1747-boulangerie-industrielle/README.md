# Activités industrielles de boulangerie et pâtisserie — IDCC 1747

La version `2025.1` modélise la grille de salaires minima conventionnels mensuels applicable au **1er février 2025** pour 151,67 heures mensuelles. Elle reprend la grille de l'avenant salarial du 16 janvier 2025 et son champ étendu par l'arrêté publié au Journal officiel le 23 avril 2025.

La valeur Publicodes est `boulangerie industrielle 1747` et les règles sont sous `salarié . convention collective . boulangerie industrielle 1747`.

## Règles implémentées

- `salaire minimum conventionnel` expose les 33 cellules A1 à M de la grille de classification.
- Le minimum est proratisé selon `contrat . temps de travail . quotité`.
- Les niveaux absents de la grille rendent le minimum nul et exposent `niveau hors grille` à `vrai`.

## Sources officielles

- Avenant salarial du 16 janvier 2025, texte KALI `KALITEXT000051537768` et article `KALIARTI000051537779`.
- Arrêté d'extension publié au Journal officiel le 23 avril 2025, texte `JORFTEXT000051508529`.

## Limites

Le modèle ne déduit pas la classification du poste et ne modélise pas les primes, majorations, ancienneté, catégories particulières, comparaison annuelle ou autres dispositions de la convention.

## Tests

`test/boulangerie-industrielle-1747.test.ts` vérifie la date et les sources, les 35 cellules de la grille, la proratisation à temps partiel, les niveaux hors grille et l'inapplicabilité pour une autre convention.
