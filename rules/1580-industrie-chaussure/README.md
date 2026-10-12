# Industrie de la chaussure — IDCC 1580

Le fichier [2026.1](1580-industrie-chaussure.2026.1.publicodes) entre en vigueur le 1er janvier 2026. Il modélise l'accord du 26 mars 2026 relatif aux salaires minima, étendu par arrêté du 11 juin 2026 publié au Journal officiel le 27 juin 2026. Les références officielles figurent dans les métadonnées du fichier source.

La valeur Publicodes est `industrie chaussure` ; les règles sont sous `salarié . convention collective . industrie chaussure`.

## Règles implémentées

- `classification` reçoit les classifications publiées : `1.1` à `3.2`, `4.1` à `6.2`, `P1.1`, `P1.2` et `P2` à `P4`.
- `grille mensuelle` donne les minima mensuels à temps complet des niveaux 1 à 3.
- `rémunération minimale annuelle` donne les minima annuels à temps complet des niveaux TAM 4 à 6 et des positions cadres P1 à P4 ; le minimum conventionnel en prend le douzième pour fournir une sortie mensuelle homogène.
- `salaire minimum conventionnel` applique la quotité de travail une seule fois.
- `classification hors grille` vaut vrai lorsqu'une classification n'est pas dans l'une des deux grilles.

## Limites

Le modèle couvre les minima de l'accord de salaires 2026. Les primes, accessoires, dispositions de durée du travail et autres garanties conventionnelles ne sont pas modélisés. Le modèle ne calcule pas le SMIC ; la règle légale correspondante reste à la charge du moteur consommateur.
