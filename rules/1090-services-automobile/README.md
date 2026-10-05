# Services de l’automobile — IDCC 1090

Le fichier [2026.1](1090-services-automobile.2026.1.publicodes) entre en vigueur le 1er mai 2026. Il est fondé sur l’avenant n° 110 du 22 janvier 2026 relatif aux salaires minima, étendu par arrêté du 2 avril 2026 (JORF n° 0090 du 16 avril 2026, NOR TRST2609049A), cités dans ses métadonnées. La valeur Publicodes est `services automobile` ; les règles sont sous `salarié . convention collective . services automobile`.

La convention collective nationale des services de l’automobile du 15 janvier 1981 (brochure 3034) couvre notamment le commerce et la réparation de l’automobile, du cycle et du motocycle, les activités connexes, le contrôle technique automobile et la formation des conducteurs (écoles de conduite).

## Règles implémentées

- `niveau` reçoit l’échelon ou le niveau de classification (défaut : `non renseigné`) :
  - `1` à `12` pour les ouvriers et employés ;
  - `17` à `25` pour la maîtrise (les échelons 13 à 16 n’existent pas) ;
  - `I.A` à `IV.C` pour les cadres, au format `<niveau>.<degré>`, et `V` sans degré.
- `salaire minimum conventionnel . grille` donne le minimum garanti à temps plein, pour 35 heures par semaine, pour les 34 positions de l’article 1er de l’avenant.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, l’échelon `7` vaut 1 999 € à temps plein et 999,50 € à mi-temps.
- `niveau hors grille` signale une valeur absente des 34 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

L’échelon 1 (1 853 €) est inférieur au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- La valeur du point de formation-qualification (3,47 €, article 2 de l’avenant) et le montant de l’indemnité de panier (6,09 €, article 3) sont fixés par l’avenant, mais ne sont pas calculés ici. Les autres primes, majorations et éléments de la convention ne sont pas non plus modélisés.
- Les minima de l’avenant n° 109 du 3 juillet 2025, étendu par arrêté du 27 août 2025 (JORF du 2 septembre 2025), en vigueur avant le 1er mai 2026, ne sont pas modélisés : la première version couvre les périodes à partir du 1er mai 2026.
