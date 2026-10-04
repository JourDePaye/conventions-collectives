# Pharmacie d’officine — IDCC 1996

Deux fichiers Publicodes couvrent cette convention : [2025.1](1996-pharmacie-officine.2025.1.publicodes), en vigueur depuis le 24 mai 2025, et [2026.1](1996-pharmacie-officine.2026.1.publicodes), en vigueur depuis le 17 avril 2026. Les accords salariaux et les arrêtés d’extension figurent dans leurs métadonnées. La valeur Publicodes est `pharmacie` et toutes les règles sont sous `salarié . convention collective . pharmacie`.

## Règles implémentées

- `coefficient` reçoit le coefficient de l’emploi (défaut : `0`). La plage modélisée va de 100 à 800, y compris les coefficients intermédiaires des cadres. L’application détermine ce coefficient selon la classification en vigueur.
- `valeur du point` vaut 5,215 €/heure dans la version 2025.1 et 5,278 €/heure dans la version 2026.1. `salaire garanti au coefficient 100` vaut respectivement 1 802 € et 1 824 € par mois pour 35 heures hebdomadaires, primes exclues.
- `salaire minimum conventionnel . temps plein` utilise la `courbe de raccordement` linéaire entre le salaire garanti au coefficient 100 et le montant du coefficient 240 pour les coefficients inférieurs à 240. À partir de 240, `selon le point` calcule coefficient ÷ 100 × valeur du point × 151,67 heures, arrondi au centime. Le montant à temps plein est ensuite multiplié par `salarié . contrat . temps de travail . quotité` pour produire `salaire minimum conventionnel`.
- `coefficient hors grille` signale les valeurs inférieures à 100 ou supérieures à 800 ; le minimum est alors `0 €/mois` et doit être traité comme une anomalie.

Par exemple, le coefficient 470 donne 3 717,51 €/mois en version 2025.1 et 3 762,42 €/mois en version 2026.1, à temps plein. Les primes et autres éléments conventionnels ne sont pas inclus. La date d’effet de chaque fichier est conservée dans ses métadonnées ; le choix de la version applicable à une période de paie revient à l’application consommatrice.
