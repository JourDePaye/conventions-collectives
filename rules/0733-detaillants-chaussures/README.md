# Détaillants en chaussures — IDCC 733

Le fichier [2026.1](0733-detaillants-chaussures.2026.1.publicodes) entre en vigueur le 1er juillet 2026, premier jour du mois suivant la publication de l’arrêté d’extension du 17 juin 2026. Il est fondé sur l’avenant n° 108 du 8 avril 2026 relatif aux salaires minima, étendu par arrêté du 17 juin 2026 publié au Journal officiel du 26 juin 2026 (NOR TRET2614064A). La valeur Publicodes est `détaillants chaussures` ; les règles sont sous `salarié . convention collective . détaillants chaussures`.

La convention collective nationale des détaillants en chaussures du 27 juin 1973 (brochure 3008) couvre les entreprises relevant de l’IDCC 733.

## Règles implémentées

- `niveau` reçoit l’une des cinq classes de la grille de l’avenant n° 108 : `I-A`, `II-A`, `III-A`, `IV-A` et `V-A`.
- `grille` donne le salaire minimum mensuel à temps plein pour 151,67 heures : 1 831 € en I-A, 1 867 € en II-A, 1 940 € en III-A, 2 293 € en IV-A et 3 197 € en V-A.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`.
- `niveau hors grille` signale une classification absente de la grille. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

## Limites

- Cette version modélise uniquement la grille des salaires minima de l’avenant n° 108 à compter du 1er juillet 2026 ; les grilles antérieures ne sont pas incluses.
- Les niveaux B, les primes, majorations, indemnités, classifications détaillées et autres obligations conventionnelles ne sont pas modélisés : ils ne figurent pas dans la grille A retenue pour cette version.
- Le texte est étendu à l’ensemble du champ de la convention à compter du 1er juillet 2026, sous réserve des réserves de l’arrêté d’extension ; aucune extrapolation à une autre convention n’est faite.
