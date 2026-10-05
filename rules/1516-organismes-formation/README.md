# Organismes de formation — IDCC 1516

Les fichiers [2025.1](1516-organismes-formation.2025.1.publicodes) et [2027.1](1516-organismes-formation.2027.1.publicodes) entrent en vigueur respectivement les 1er janvier 2025 et 1er janvier 2027. Ils sont fondés sur l’avenant du 18 novembre 2024 (minima de l’année 2025) et sur l’avenant du 17 avril 2026 (minima de l’année 2027), cités dans leurs métadonnées avec leurs arrêtés d’extension. La valeur Publicodes est `organismes de formation` ; les règles sont sous `salarié . convention collective . organismes de formation`.

La convention collective nationale des organismes de formation du 10 juin 1988 (brochure 3249) couvre les organismes de formation privés.

Aucun avenant ne fixe de grille pour l’année 2026 : la grille 2025 est reconduite sans revalorisation, d’après plusieurs sources secondaires (à confirmer sur Légifrance). La version `2025.1` reste donc la dernière en vigueur jusqu’au 31 décembre 2026.

## Règles implémentées

- `coefficient` reçoit le coefficient de l’emploi (défaut : `0`), de 100 à 600 et plus.
- `salaire minimum conventionnel . grille` donne le salaire minimum annuel brut du palier du coefficient, à temps complet, pour les 31 paliers de l’avenant. Il va de 22 090,38 € (palier 1, coefficients 100 à 109) à 68 604,01 € (palier 31, coefficients 600 et plus) en 2025, et de 22 532,19 € à 69 633,07 € en 2027.
- `salaire minimum conventionnel` convertit ce minimum annuel en minimum mensuel, un douzième du montant annuel (article 4 de l’avenant du 4 février 2026, dispositions transitoires), puis le multiplie par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, le coefficient `240` (palier 15) vaut 2 463,73 €/mois à temps complet en 2025 et 2 513,00 €/mois en 2027.
- `coefficient hors grille` signale un coefficient inférieur à 100. La grille retourne alors `0 €/an` et l’application doit traiter l’anomalie.

Les cinq premiers paliers de la grille 2025 (de 1 841 € à 1 863 € par mois) sont inférieurs au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- Les avenants apprécient les minima à l’année, avec une régularisation au 31 décembre ; le modèle ne fournit que l’équivalent mensuel. Les éléments de rémunération pris en compte pour la comparaison (treizième mois pendant la période transitoire, primes, avantages en nature) et la régularisation ne sont pas calculés ici.
- À l’issue de la période transitoire de quatre ans de l’avenant du 4 février 2026, les minima seront fixés directement par mois : une nouvelle version devra alors remplacer ces règles.
- Les dispositions de prévoyance (avenant du 14 novembre 2025, étendu par arrêtés des 3 et 7 juillet 2026) et les primes ne sont pas modélisées.
- Les grilles antérieures à 2025 ne sont pas modélisées : la première version couvre les périodes à partir du 1er janvier 2025.
