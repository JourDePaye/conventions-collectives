# Distributeurs conseils hors domicile — IDCC 1536

Le fichier [2026.1](1536-distributeurs-conseils-hors-domicile.2026.1.publicodes) entre en vigueur le 1er mars 2026. Il est fondé sur l’avenant n° 2026/1 du 3 mars 2026 relatif aux salaires minima conventionnels et sur l’arrêté d’extension du 20 mai 2026, publié au Journal officiel du 29 mai 2026. Les textes officiels ont été consultés sur Légifrance.

La convention collective nationale des distributeurs conseils hors domicile (IDCC 1536, brochure 3086) couvre les entreprises relevant de son champ. La valeur Publicodes est `distributeurs conseils hors domicile` ; les règles sont sous `salarié . convention collective . distributeurs conseils hors domicile`.

## Règles implémentées

- `classification` reçoit le niveau et l’échelon sous la forme `I.1` à `VI.4`.
- `grille` donne le salaire minimum mensuel à temps plein pour 151,67 heures : 1 844 € à 4 632 € selon les 24 positions de l’avenant n° 2026/1.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`.
- `classification hors grille` signale une classification absente de la grille. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

## Limites

- Cette version modélise uniquement la grille des salaires minima de l’avenant n° 2026/1 ; les grilles antérieures ne sont pas incluses.
- Les primes, majorations, indemnités, classifications détaillées et autres obligations conventionnelles ne sont pas modélisés.
- La date d’application au 1er mars 2026 est celle indiquée par l’avenant ; l’arrêté d’extension du 20 mai 2026 est le texte qui étend l’avenant au champ de la convention.

## Sources officielles

- [Avenant n° 2026/1 relatif aux salaires minima — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000052796605)
- [Convention collective nationale IDCC 1536 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635789)
