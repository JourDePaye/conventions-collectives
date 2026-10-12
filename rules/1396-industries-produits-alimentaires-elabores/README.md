# Industries de produits alimentaires élaborés — IDCC 1396

Le fichier [2026.1](1396-industries-produits-alimentaires-elabores.2026.1.publicodes) entre en vigueur le 1er février 2026. Il est fondé sur l’accord n° 123 du 30 janvier 2026 relatif aux salaires minima conventionnels, étendu par arrêté du 8 avril 2026 publié au Journal officiel le 17 avril 2026, cités dans ses métadonnées. La valeur Publicodes est `industries de produits alimentaires élaborés` ; les règles sont sous `salarié . convention collective . industries de produits alimentaires élaborés`.

La convention collective nationale des industries de produits alimentaires élaborés du 17 janvier 1952 (IDCC 1396, brochure 3127) couvre les entreprises de la branche concernée.

## Règles implémentées

- `coefficient` reçoit le coefficient hiérarchique, de 120 à 345 pour les salariés non cadres et de 350 à 700 pour les cadres.
- `minimum mensuel` donne le minimum mensuel à temps complet des 24 coefficients 120 à 345, de 1 829,14 € à 3 235,12 €.
- `rémunération minimale annuelle` donne le minimum annuel à temps complet des 37 coefficients cadres 350 à 700, de 39 003,23 € à 76 512,98 €.
- `salaire minimum conventionnel` utilise le minimum mensuel pour les coefficients 120 à 345 et le douzième du minimum annuel pour les cadres, puis applique `salarié . contrat . temps de travail . quotité`.
- `coefficient hors grille` signale les coefficients absents. Les deux grilles retournent alors zéro et l’application doit traiter l’anomalie.

## Limites

- Seuls les minima de l’accord n° 123, applicables à compter du 1er février 2026, sont modélisés ; les grilles historiques et les autres éléments de rémunération de la convention ne le sont pas.
- Les minima annuels cadres sont conservés en `€/an` dans leur règle dédiée et convertis uniquement dans le minimum mensuel conventionnel.
- Le modèle ne calcule pas les primes, majorations, indemnités ou dispositifs de protection sociale de la branche.
