# Détaillants en chaussures — IDCC 733

Le fichier [2026.1](0733-detaillants-chaussures.2026.1.publicodes) entre en vigueur le 1er juillet 2026, premier jour du mois suivant la publication de l’arrêté d’extension du 11 juin 2026. Il est fondé sur l’avenant n° 108 du 9 mars 2026 relatif aux salaires minima, étendu par arrêté du 11 juin 2026 publié au Journal officiel du 27 juin 2026. La valeur Publicodes est `détaillants chaussures` ; les règles sont sous `salarié . convention collective . détaillants chaussures`.

La convention collective nationale des détaillants en chaussures du 27 juin 1973 (brochure 3008) couvre les entreprises relevant de l’IDCC 733.

## Règles implémentées

- `niveau` reçoit l’une des neuf catégories de la grille de l’avenant n° 108 : `1` à `9`.
- `grille` donne le salaire minimum mensuel à temps plein pour 151,67 heures : 1 828 € en catégorie 1, 1 838 € en catégorie 2, 1 869 € en catégorie 3, 1 935 € en catégorie 4, 2 033 € en catégorie 5, 2 407 € en catégorie 6, 2 710 € en catégorie 7, 3 732 € en catégorie 8 et 4 302 € en catégorie 9.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`.
- `niveau hors grille` signale une classification absente de la grille. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

## Limites

- Cette version modélise uniquement la grille des salaires minima de l’avenant n° 108 à compter du 1er juillet 2026 ; les grilles antérieures ne sont pas incluses.
- Les primes, majorations, indemnités, classifications détaillées et autres obligations conventionnelles ne sont pas modélisés.
- Le texte est étendu à l’ensemble du champ de la convention à compter du 1er juillet 2026, sous réserve des réserves de l’arrêté d’extension ; aucune extrapolation à une autre convention n’est faite.
