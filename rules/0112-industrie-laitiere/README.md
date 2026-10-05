# Industrie laitière — IDCC 0112

Le fichier [2026.1](0112-industrie-laitiere.2026.1.publicodes) est applicable à partir du 1er février 2026. Il transcrit l'avenant n° 57 du 22 janvier 2026, étendu par arrêté du 4 mai 2026 (JORF du 10 mai 2026), dont les références figurent dans ses métadonnées. La valeur Publicodes est `industrie laitière` ; les règles sont sous `salarié . convention collective . industrie laitière`.

La convention collective nationale de l'industrie laitière du 20 mai 1955 (brochure 3124) couvre les entreprises relevant de l'IDCC 0112.

## Règles implémentées

- `niveau` reçoit la classification au format `niveau.échelon` : `1.1` à `5.3` pour les ouvriers et employés, `6.1` à `8.3` pour les techniciens et agents de maîtrise, puis `9.1`, `9.2`, `10`, `11` et `12` pour les cadres.
- `salaire minimum conventionnel . grille` fournit les 28 salaires minima mensuels à temps plein de l'annexe I.
- `salaire minimum conventionnel` multiplie ce montant par `salarié . contrat . temps de travail . quotité` de `modele-social`. Il ne faut donc pas appliquer un second prorata : par exemple, le niveau `7.2` vaut 2 235,92 € à temps plein et 1 117,96 € à mi-temps.
- `niveau hors grille` indique une classification absente de la grille ; le minimum est alors `0 €/mois` afin que l'application signale l'anomalie.

Les niveaux les plus bas sont inférieurs au SMIC mensuel applicable : l'application doit retenir le montant le plus favorable.

## Limites

Cette version couvre les seuls salaires minima mensuels. Les rémunérations annuelles minimales, primes d'ancienneté, primes et autres dispositions de la convention ne sont pas encore calculées.
