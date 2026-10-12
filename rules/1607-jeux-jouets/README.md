# Industries de jeux, jouets, articles de fêtes et ornements de Noël, articles de puériculture, voitures d'enfants et modèles réduits — IDCC 1607

Le fichier [2026.1](1607-jeux-jouets.2026.1.publicodes) entre en vigueur le 1er avril 2026 pour les entreprises relevant d'une organisation d'employeurs signataire. Il est fondé sur l'avenant n° 100 du 3 mars 2026 relatif aux salaires minima et sur l'arrêté d'extension du 20 mai 2026, NOR TRST2612716A, cités dans ses métadonnées. Les textes ont été consultés sur Légifrance.

Le fichier [2026.2](1607-jeux-jouets.2026.2.publicodes) entre en vigueur le 1er juillet 2026 et ajoute la contribution conventionnelle étendue de formation professionnelle issue de l'avenant n° 97 du 16 décembre 2025.

La valeur Publicodes est `jeux jouets articles fêtes ornements noël puériculture voitures enfants modélisme`; les règles sont sous `salarié . convention collective . jeux jouets articles fêtes ornements noël puériculture voitures enfants modélisme`.

## Règles implémentées

- `coefficient` reçoit un coefficient de la grille de l'avenant n° 100.
- `salaire minimum conventionnel . grille` donne le minimum mensuel à temps plein pour 151,67 heures, dans la colonne 0 à 3 ans.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`.
- `coefficient hors grille` signale un coefficient absent ; la grille retourne alors `0 €/mois` et l'application doit traiter l'anomalie.
- `cotisations . formation professionnelle` remplace le montant de droit commun par la contribution globale de branche : `0,60 %` pour moins de 10 salariés, `1,10 %` de 10 à 299 salariés et `1,20 %` à partir de 300 salariés, pour les exercices 2025 à 2027.

## Limites

- La version 2026.1 couvre le barème applicable à compter du 1er avril 2026 ; la version 2026.2 couvre la contribution étendue à compter du 1er juillet 2026.
- Seule la colonne 0 à 3 ans de la grille salariale est modélisée. Les colonnes liées à l'ancienneté supérieure doivent être ajoutées dans une version ultérieure avec leurs entrées explicites.
- Les primes, majorations et autres dispositions de la convention ne sont pas modélisées. La contribution de formation est calculée sur l'assiette de cotisations mensuelle ; les modalités annuelles de collecte auprès de l'OPCO ne le sont pas.
