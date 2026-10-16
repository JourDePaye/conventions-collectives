# Industrie pharmaceutique — IDCC 176

La version `2026.2` modélise l'accord du 13 novembre 2025 relatif aux salaires minima conventionnels applicables au **1er janvier 2026** (articles 1 et 3). Elle remplace la révision `2026.1` (même date d'effet), qui ignorait la grille différenciée de l'article 3 pour les salariés ayant au moins 18 mois d'ancienneté.

La valeur Publicodes est `industrie pharmaceutique` et les règles sont sous `salarié . convention collective . industrie pharmaceutique`.

## Règles implémentées

- `groupe` reçoit la classification fournie par l'application.
- `ancienneté en mois` (nouvelle règle, 0 mois par défaut) reçoit l'ancienneté du salarié dans l'entreprise.
- `salaire minimum de la grille article 1` donne les 20 minima mensuels des groupes et niveaux 1A/1B à 11 de l'article 1, pour 151,67 heures.
- `salaire minimum de la grille` applique la grille de l'article 3 (1A/1B 1 844,57 ; 1C/2A 1 863,36 ; 2B 1 900,95) aux groupes 1A à 2B à partir de 18 mois d'ancienneté ; les autres groupes sont identiques dans les deux grilles.
- `salaire minimum conventionnel` en prend la valeur puis applique une seule fois la quotité du contrat.
- Les groupes absents de la grille rendent le minimum inapplicable.

## Sources officielles

- Accord du 13 novembre 2025 relatif aux salaires minima conventionnels, article 1, texte KALI `KALIARTI000053721382`, et article 3 (grille à partir de 18 mois d'ancienneté), lu dans `KALITEXT000053721378`.
- Texte consolidé de la convention collective nationale de l'industrie pharmaceutique, texte KALI `KALITEXT000053721378`.

## Limites

Le modèle ne compare pas les éléments de rémunération effectivement versés avec le minimum conventionnel et ne déduit pas la classification depuis l'intitulé du poste. Les primes, majorations, classifications individuelles et règles particulières de rémunération doivent être traitées par l'application consommatrice.
