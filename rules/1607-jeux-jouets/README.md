# Industries de jeux, jouets, articles de fêtes et ornements de Noël, articles de puériculture, voitures d'enfants et modèles réduits — IDCC 1607

Le fichier [2026.1](1607-jeux-jouets.2026.1.publicodes) entre en vigueur le 1er avril 2026 pour les entreprises relevant d'une organisation d'employeurs signataire. Il est fondé sur l'avenant n° 100 du 3 mars 2026 relatif aux salaires minima et sur l'arrêté d'extension du 20 mai 2026, NOR TRST2612672A, cités dans ses métadonnées. Les textes ont été consultés sur Légifrance.

Le fichier [2026.2](1607-jeux-jouets.2026.2.publicodes) entre en vigueur le 1er juillet 2026 et ajoute la contribution conventionnelle étendue de formation professionnelle issue de l'avenant n° 97 du 16 décembre 2025.

La valeur Publicodes est `jeux jouets articles fêtes ornements noël puériculture voitures enfants modélisme`; les règles sont sous `salarié . convention collective . jeux jouets articles fêtes ornements noël puériculture voitures enfants modélisme`.

Les fichiers [2026.3](1607-jeux-jouets.2026.3.publicodes) (1er avril 2026) et [2026.4](1607-jeux-jouets.2026.4.publicodes) (1er juillet 2026) remplacent respectivement 2026.1 et 2026.2 à dates d'effet identiques : ils modélisent les six colonnes d'ancienneté de la grille de l'avenant n° 100 (0 à 3 ans, 3 à 6, 6 à 9, 9 à 12, 12 à 15, plus de 15 ans), alors que 2026.1 et 2026.2 ne contenaient que la colonne 0 à 3 ans et sous-estimaient le minimum des salariés ayant 3 ans d'ancienneté ou plus. La révision la plus haute à date d'effet égale l'emporte. 2026.4 reprend en plus la contribution de formation de 2026.2.

## Règles implémentées

- `coefficient` reçoit un coefficient de la grille de l'avenant n° 100.
- `ancienneté en années` (unité `an`, 0 par défaut) choisit la colonne : moins de 3 ans, 3 à moins de 6, 6 à moins de 9, 9 à moins de 12, 12 à moins de 15, 15 et plus (2026.3 et 2026.4). Le texte ne précise pas le traitement des bornes exactes ; la borne basse est incluse dans la colonne supérieure (3 ans pile : colonne 3 à 6 ans), comme dans les autres grilles du dépôt. La nature de l'ancienneté (entreprise) n'a pas été vérifiée dans le texte de la convention.
- `salaire minimum conventionnel . grille` donne le minimum mensuel à temps plein pour 151,67 heures, dans la colonne d'ancienneté retenue (0 à 3 ans en 2026.1 et 2026.2).
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`.
- `coefficient hors grille` signale un coefficient absent ; la grille retourne alors `0 €/mois` et l'application doit traiter l'anomalie.
- `cotisations . formation professionnelle` remplace le montant de droit commun par la contribution globale de branche : `0,60 %` pour moins de 10 salariés, `1,10 %` de 10 à 299 salariés et `1,20 %` à partir de 300 salariés, pour les exercices 2025 à 2027.

## Limites

- La version 2026.1 couvre le barème applicable à compter du 1er avril 2026 ; la version 2026.2 couvre la contribution étendue à compter du 1er juillet 2026.
- Les versions 2026.1 et 2026.2 ne modélisent que la colonne 0 à 3 ans ; elles sont remplacées par 2026.3 et 2026.4. La colonne « Base ancienneté » de l'avenant (774 à 2 824 €, base de calcul de la prime d'ancienneté) n'est pas un minimum et n'est pas modélisée.
- Les primes, majorations et autres dispositions de la convention ne sont pas modélisées. La contribution de formation est calculée sur l'assiette de cotisations mensuelle ; les modalités annuelles de collecte auprès de l'OPCO ne le sont pas.
