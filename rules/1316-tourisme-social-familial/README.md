# Tourisme social et familial — IDCC 1316

Le fichier [2026.1](1316-tourisme-social-familial.2026.1.publicodes) modélise les salaires minima mensuels des avenants n° 77 du 4 décembre 2025 et n° 78 du 15 janvier 2026, étendus par arrêtés publiés au Journal officiel en février et mai 2026. Il couvre les paliers d'entrée en vigueur du 1er janvier, du 1er février et du 1er mai 2026. Les références officielles figurent dans les métadonnées du fichier source.

La valeur Publicodes est `tourisme social et familial` ; les règles sont sous `salarié . convention collective . tourisme social et familial`.

## Règles implémentées

- `niveau` reçoit l'un des niveaux `A` à `G`.
- `date de calcul` sélectionne le palier légalement applicable en 2026.
- `grille mensuelle` donne le minimum brut pour 151,67 heures.
- `salaire minimum conventionnel` applique la quotité de travail de `modele-social`.
- `niveau hors grille` détecte les classifications absentes.

## Limites

- Les primes, le treizième mois, les avantages en nature et les autres éléments de rémunération ne sont pas modélisés.
- La version couvre les salaires minima 2026 à compter du 1er janvier 2026 ; les périodes antérieures sont signalées comme hors couverture.
- Le modèle ne déduit pas automatiquement les compléments individuels ou les dispositions plus favorables applicables au salarié.
