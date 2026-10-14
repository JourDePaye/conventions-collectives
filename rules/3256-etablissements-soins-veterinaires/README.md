# Convention collective nationale des établissements de soins vétérinaires — IDCC 3256

Le fichier [2026.1](3256-etablissements-soins-veterinaires.2026.1.publicodes) est applicable au 1er janvier 2026. Il reprend la valeur du point conventionnel de 17,96 € fixée par l'avenant n° 91 du 6 janvier 2026 et la grille des cinq coefficients du personnel salarié non vétérinaire.

## Règles implémentées

- `coefficient` couvre les cinq coefficients salariés non vétérinaires : 105, 108, 110, 113 et 120 ;
- `valeur du point` expose 17,96 € ;
- `salaire minimum conventionnel` calcule le coefficient multiplié par la valeur du point pour 151,67 heures, puis prorate selon la quotité ;
- `coefficient hors grille` signale les coefficients absents et retourne 0 pour le minimum ;
- `audit paie` explicite les éléments nécessitant des entrées externes.

## Audit paie et limites

Le modèle couvre les minima de la grille salariée non vétérinaire. Les points supplémentaires liés aux CQP, primes, gardes, astreintes, dimanches, jours fériés, frais, congés, santé, prévoyance, formation professionnelle et les dispositions propres aux vétérinaires nécessitent des données de qualification, de planning ou de paie qui ne sont pas représentées automatiquement. Leur absence du calcul du minimum ne vaut pas renonciation à la règle conventionnelle.

Les coefficients non listés ne sont pas extrapolés.

## Sources officielles

- Avenant n° 91 du 6 janvier 2026 relatif à la valeur du point — Légifrance, texte `KALITEXT000054066637`.
- Annexe I à la convention collective des cabinets et cliniques vétérinaires, classification des emplois modifiée par l’avenant n° 84 du 16 janvier 2024 — Légifrance, article `KALIARTI000050150780`.
- Convention collective nationale des établissements de soins vétérinaires du 24 juin 2025, IDCC 3256 — champ de la branche issue de la fusion des champs vétérinaires.
