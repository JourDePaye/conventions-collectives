# Industrie pharmaceutique — IDCC 176

La version `2026.1` modélise l'accord du 13 novembre 2025 relatif aux salaires minima conventionnels applicables au **1er janvier 2026**.

La valeur Publicodes est `industrie pharmaceutique` et les règles sont sous `salarié . convention collective . industrie pharmaceutique`.

## Règles implémentées

- `groupe` reçoit la classification fournie par l'application.
- `salaire minimum conventionnel` fournit les 20 minima mensuels des groupes et niveaux 1A/1B à 11, pour 151,67 heures, puis applique une seule fois la quotité du contrat.
- Les groupes absents de la grille rendent le minimum inapplicable.

## Sources officielles

- Accord du 13 novembre 2025 relatif aux salaires minima conventionnels, texte KALI `KALIARTI000053721382`.
- Texte consolidé de la convention collective nationale de l'industrie pharmaceutique, texte KALI `KALITEXT000053721378`.

## Limites

Le modèle ne compare pas les éléments de rémunération effectivement versés avec le minimum conventionnel et ne déduit pas la classification depuis l'intitulé du poste. Les primes, majorations, classifications individuelles et règles particulières de rémunération doivent être traitées par l'application consommatrice.
