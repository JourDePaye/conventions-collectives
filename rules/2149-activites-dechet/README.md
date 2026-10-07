# Activités du déchet — IDCC 2149

Le fichier [2026.1](2149-activites-dechet.2026.1.publicodes) entre en vigueur le 1er janvier 2026. Il applique la valeur du point de 18,90 € (revalorisation de 1,23 %) aux onze coefficients de la classification. La valeur Publicodes est `activités du déchet` ; les règles sont sous `salarié . convention collective . activités du déchet`.

La convention collective nationale des activités du déchet du 11 mai 2000 (brochure 3156) classe les emplois par coefficient, de 100 à 170, et le salaire minimum est le coefficient multiplié par la valeur du point.

## Règles implémentées

- `coefficient` reçoit le coefficient, parmi les onze valeurs suivantes (défaut : 0) :

| Coefficient | Niveau et position | Minimum mensuel (151,67 h) |
|---|---|---|
| `100` | I | 1 890,00 € |
| `104` | II.1 | 1 965,60 € |
| `107` | II.2 | 2 022,30 € |
| `110` | II.3 | 2 079,00 € |
| `114` | III.1 | 2 154,60 € |
| `118` | III.2 | 2 230,20 € |
| `125` | III.3 | 2 362,50 € |
| `132` | III.4 | 2 494,80 € |
| `150` | IV.1 | 2 835,00 € |
| `167` | IV.2 | 3 156,30 € |
| `170` | V | 3 213,00 € |

- `valeur du point` vaut 18,90 € au 1er janvier 2026.
- `salaire minimum conventionnel` multiplie le coefficient par la valeur du point, puis par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, le coefficient 125 vaut 2 362,50 €/mois à temps complet et 1 181,25 €/mois à mi-temps.
- `coefficient hors grille` signale un coefficient absent des onze coefficients : le minimum vaut alors `0 €/mois` et l’application doit traiter l’anomalie.

Tous les minima de la grille (à partir de 1 890,00 €) dépassent le SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026.

## Limites

- **Base juridique non établie.** Le texte qui fixe la valeur du point de 18,90 € n’a pas pu être lu. Les deux pages de synthèse consultées (juristique.org et salaire-minimum.com) donnent la même valeur et la même grille, et un document de la fédération patronale FNADE sur la valeur du point au 1er janvier 2026, dont le PDF était illisible, existe, mais je n’ai pu établir ni sa date, ni sa nature (accord paritaire ou recommandation patronale), ni son extension. Un arrêté d’extension du 18 mars 2026 (JORF du 2 avril 2026) existe pour cette convention, mais il étend l’avenant n° 80 sur la prise en charge de l’invalidité, non les salaires. Si la valeur est une recommandation patronale, elle ne s’impose qu’aux adhérents de la fédération. À recouper avec les textes sur Légifrance.
- Les niveaux et positions ci-dessus sont ceux des pages de synthèse ; les coefficients absents du tableau, notamment ceux des cadres, ne sont pas repris.
- Les indemnités (salissure, repas) et les primes de la convention ne sont pas modélisées.
- Les valeurs du point antérieures au 1er janvier 2026 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
