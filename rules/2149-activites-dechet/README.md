# Activités du déchet — IDCC 2149

Le fichier [2026.2](2149-activites-dechet.2026.2.publicodes) entre en vigueur le 1er janvier 2026. Il retient la dernière valeur du point officiellement publiée, 18,67 € au 1er janvier 2025, faute de texte officiel 2026 opposable à l'ensemble du champ. La convention distingue les minima mensuels des coefficients 100 à 132 et les minima annuels des coefficients 150 à 170.

La convention collective nationale des activités du déchet du 16 avril 2019 (brochure 3156) classe les emplois par coefficient, de 100 à 170. La valeur Publicodes est `activités du déchet` ; les règles sont sous `salarié . convention collective . activités du déchet`.

## Règles implémentées

- `coefficient` reçoit le coefficient, parmi les onze valeurs suivantes (défaut : 0) :

| Coefficient | Niveau et position | Minimum mensuel (151,67 h) |
|---|---|---|
| `100` | I | 1 867,00 € |
| `104` | II.1 | 1 941,68 € |
| `107` | II.2 | 1 997,69 € |
| `110` | II.3 | 2 053,70 € |
| `114` | III.1 | 2 128,38 € |
| `118` | III.2 | 2 203,06 € |
| `125` | III.3 | 2 333,75 € |
| `132` | III.4 | 2 464,44 € |
| `150` | IV.1 | 33 606,00 € / an |
| `167` | IV.2 | 37 414,68 € / an |
| `170` | V | 38 086,80 € / an |

- `valeur du point` vaut 18,67 €, dernière valeur officiellement publiée et utilisée faute de nouvelle valeur opposable.
- `salaire minimum conventionnel` couvre les coefficients 100 à 132 et multiplie le coefficient par la valeur du point, puis par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, le coefficient 125 vaut 2 333,75 €/mois à temps complet et 1 166,88 €/mois à mi-temps.
- `salaire minimum annuel conventionnel` couvre les coefficients 150 à 170, en €/an, et applique la quotité une seule fois.
- `coefficient hors grille` signale un coefficient absent des onze coefficients : le minimum vaut alors `0 €/mois` et l’application doit traiter l’anomalie.

Les minima mensuels de la grille sont comparés au SMIC par `modele-social`; les coefficients IV et V sont exposés en annuel.

## Limites

- La valeur de 18,67 € est celle du dernier texte officiel retrouvé, applicable au 1er janvier 2025 ; aucune valeur 2026 opposable à l'ensemble du champ n'a été retenue.
- Les indemnités (salissure, repas) et les primes de la convention ne sont pas modélisées.
- Les coefficients absents du tableau, notamment ceux des cadres, ne sont pas repris.
