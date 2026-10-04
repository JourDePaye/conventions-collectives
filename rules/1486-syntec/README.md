# Bureaux d’études techniques, cabinets d’ingénieurs-conseils et sociétés de conseils — IDCC 1486 (Syntec)

Le fichier [2025.1](1486-syntec.2025.1.publicodes) entre en vigueur le 1er janvier 2025. Ses métadonnées citent l’accord salarial du 26 juin 2024 et son arrêté d’extension. La valeur Publicodes de la convention est `syntec` ; les règles sont dans `salarié . convention collective . syntec` et ne s’appliquent que lorsque cette convention est sélectionnée.

## Règles implémentées

- `coefficient` reçoit le coefficient de classification (défaut : `0`). La grille ETAM contient 240, 250, 275, 310, 355, 400, 450 et 500. Celle des ingénieurs et cadres contient 95, 100, 105, 115, 130, 150, 170, 210 et 270. L’application doit déterminer le coefficient à partir de la position conventionnelle ; elle doit notamment distinguer le coefficient 105 réservé à la position 2.1 avant 26 ans du coefficient 115 à partir de 26 ans.
- `salaire minimum conventionnel` donne le minimum brut mensuel à temps plein. La règle utilise `salarié . contrat . statut cadre` de `modele-social` pour choisir `grille ingénieurs et cadres` ou `grille ETAM`. Par exemple, le coefficient ETAM 355 donne 2 045 €/mois et le coefficient cadre 130 donne 2 850 €/mois. Les montants ne sont pas proratisés par cette règle.
- `coefficient hors grille` vaut vrai lorsque le coefficient est absent de la grille correspondant au statut cadre. Dans ce cas, le minimum vaut `0 €/mois` : l’application doit signaler la classification manquante ou incohérente.

Les primes, les majorations et les autres dispositions de la convention ne sont pas calculées par ce fichier. La sélection de version et la vérification du minimum applicable restent à la charge de l’application consommatrice. Les références juridiques détaillées figurent dans les métadonnées du fichier Publicodes.
