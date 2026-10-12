# Commerces de gros — IDCC 573

Le fichier [2026.1](0573-commerces-de-gros.2026.1.publicodes) entre en vigueur le 1er mars 2026. Le fichier [2026.2](0573-commerces-de-gros.2026.2.publicodes) entre en vigueur le 1er juillet 2026 et ajoute les cotisations de prévoyance conventionnelle : 0,62 % jusqu'à quatre plafonds de sécurité sociale pour les non-cadres, répartis à 60 % employeur et 40 % salarié, et 1,50 % employeur sur la tranche A pour les cadres. Les garanties, dispenses et désignations d'organisme restent contractuelles.

La convention collective nationale des commerces de gros du 23 juin 1970 (brochure 3044) couvre les entreprises relevant de l’IDCC 573.

## Règles implémentées

- `niveau` reçoit un niveau en chiffres romains et un échelon, au format `<niveau>.<échelon>` (défaut : `non renseigné`) :
  - `I.1` à `VI.3` pour les niveaux à minimum mensuel ;
  - `VII.1` à `VII.3`, `VIII.1` à `VIII.3`, `IX.1`, `IX.2`, `X.1` et `X.2` pour les niveaux à minimum annuel.
- `grille mensuelle` donne le minimum mensuel des 18 positions des niveaux I à VI, pour 151,67 heures, de 1 839,81 € (`I.1`) à 2 371,78 € (`VI.3`). Elle vaut `0 €/mois` pour les niveaux VII à X.
- `rémunération minimale annuelle` donne le minimum annuel des 10 positions des niveaux VII à X, de 30 338,30 € (`VII.1`) à 78 210,61 € (`X.2`). Elle vaut `0 €/an` pour les niveaux I à VI.
- `salaire minimum conventionnel` additionne les deux, puis multiplie par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, `IV.2` vaut 1 953,23 €/mois à temps complet et 976,62 €/mois à mi-temps.
- `niveau hors grille` signale un niveau ou un échelon absent des 28 positions. Les deux grilles retournent alors zéro et l’application doit traiter l’anomalie.

Les positions `I.1` (1 839,81 €), `I.2` (1 850,85 €) et `I.3` (1 861,96 €) sont inférieures au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- Le minimum des niveaux VII à X s’apprécie au 31 décembre, en comparant le total des salaires bruts de l’année au minimum annuel, au prorata du temps passé dans le niveau. Le modèle n’en donne que l’équivalent mensuel, un douzième : c’est une approximation.
- La colonne « coefficient » du tableau de l’accord n’est pas modélisée : les montants sont donnés directement.
- Le passage au deuxième échelon dépend de la durée dans la fonction (un an au niveau I à six ans au niveau VI, réduite de moitié avec un diplôme) : l’échelon se renseigne dans `niveau`, il n’est pas calculé.
- Un accord du 20 juillet 2026 revalorise de 1,70 % les niveaux I à VI au 1er septembre 2026. D’après les synthèses consultées (juristique.org, LégiSocial), il n’est pas étendu à ce jour et ne lie que les adhérents des organisations signataires (CGF, COEDSI, GAF) : il n’est pas modélisé, et son texte n’a pas été lu.
- L’accord s’applique à tous les employeurs du champ depuis l’extension (27 juin 2026) ; pour les employeurs non adhérents, les périodes de mars à juin 2026 sont donc incertaines. La version retient le 1er mars 2026.
- Les primes, majorations, la prévoyance et les autres éléments de la convention ne sont pas modélisés. Les grilles antérieures au 1er mars 2026 non plus.
