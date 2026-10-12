# Industrie laitière — IDCC 0112

Le fichier [2026.1](0112-industrie-laitiere.2026.1.publicodes) est applicable à partir du 1er février 2026 et couvre les salaires minima mensuels. Le fichier [2026.2](0112-industrie-laitiere.2026.2.publicodes) ajoute les rémunérations annuelles minimales et les minima de l'encadrement au forfait annuel, applicables au 1er janvier 2026, sans convertir les montants annuels en mensualités. Les textes sont étendus par arrêté du 4 mai 2026 (JORF du 10 mai 2026) ; les références figurent dans les métadonnées. La valeur Publicodes est `industrie laitière` ; les règles sont sous `salarié . convention collective . industrie laitière`.

La convention collective nationale de l'industrie laitière du 20 mai 1955 (brochure 3124) couvre les entreprises relevant de l'IDCC 0112.

## Règles implémentées

- `niveau` reçoit la classification au format `niveau.échelon` : `1.1` à `5.3` pour les ouvriers et employés, `6.1` à `8.3` pour les techniciens et agents de maîtrise, puis `9.1`, `9.2`, `10`, `11` et `12` pour les cadres.
- `salaire minimum conventionnel . grille` fournit les 28 salaires minima mensuels à temps plein de l'annexe I.
- `salaire minimum conventionnel` multiplie ce montant par `salarié . contrat . temps de travail . quotité` de `modele-social`. Il ne faut donc pas appliquer un second prorata : par exemple, le niveau `7.2` vaut 2 235,92 € à temps plein et 1 117,96 € à mi-temps.
- `niveau hors grille` indique une classification absente de la grille ; le minimum est alors `0 €/mois` afin que l'application signale l'anomalie.

Les niveaux les plus bas sont inférieurs au SMIC mensuel applicable : l'application doit retenir le montant le plus favorable.

## Limites

La version 2026.2 couvre les salaires minima mensuels, les rémunérations annuelles minimales et les minima annuels spécifiques de l'encadrement au forfait annuel. Le forfait est une entrée explicite et n'est pas déduit du seul statut cadre. Les primes d'ancienneté, primes et autres dispositions de la convention ne sont pas encore calculées.

Le régime de prévoyance étendu au 1er juillet 2025 et l'accord de formation étendu en 2026 ont été vérifiés. Ils nécessitent des données de catégorie, de contrat, d'assiette ou de contribution qui ne peuvent pas être appliquées génériquement par ce modèle ; aucun taux, plafond, exonération, AT/MP ou forfait de cotisation n'est donc redéfini.
