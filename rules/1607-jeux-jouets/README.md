# Industries de jeux, jouets, articles de fêtes et ornements de Noël, articles de puériculture, voitures d'enfants et modèles réduits — IDCC 1607

Le fichier [2026.1](1607-jeux-jouets.2026.1.publicodes) entre en vigueur le 1er avril 2026 pour les entreprises relevant d'une organisation d'employeurs signataire. Il est fondé sur l'avenant n° 100 du 3 mars 2026 relatif aux salaires minima et sur l'arrêté d'extension du 20 mai 2026, NOR TRST2612716A, cités dans ses métadonnées. Les textes ont été consultés sur Légifrance.

La valeur Publicodes est `jeux jouets articles fêtes ornements noël puériculture voitures enfants modélisme`; les règles sont sous `salarié . convention collective . jeux jouets articles fêtes ornements noël puériculture voitures enfants modélisme`.

## Règles implémentées

- `coefficient` reçoit un coefficient de la grille de l'avenant n° 100.
- `salaire minimum conventionnel . grille` donne le minimum mensuel à temps plein pour 151,67 heures, dans la colonne 0 à 3 ans.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`.
- `coefficient hors grille` signale un coefficient absent ; la grille retourne alors `0 €/mois` et l'application doit traiter l'anomalie.

## Limites

- La version couvre le barème applicable à compter du 1er avril 2026 ; l'extension est mentionnée dans les sources et le champ étendu prend effet selon l'arrêté.
- Seule la colonne 0 à 3 ans de la grille salariale est modélisée. Les colonnes liées à l'ancienneté supérieure doivent être ajoutées dans une version ultérieure avec leurs entrées explicites.
- Seuls les salaires minima de l'avenant sont modélisés ; les primes, majorations et autres dispositions de la convention ne le sont pas.
