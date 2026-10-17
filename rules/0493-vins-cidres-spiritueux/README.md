# Vins, cidres, jus de fruits, sirops, spiritueux et liqueurs de France — IDCC 493

Le fichier [2026.1](0493-vins-cidres-spiritueux.2026.1.publicodes) entre en vigueur le 1er février 2026. Il modélise l'accord du 10 décembre 2025 relatif aux salaires minima conventionnels pour l'année 2026, étendu par arrêté du 20 février 2026, cité dans les métadonnées de la source officielle.

La valeur Publicodes est `vins cidres spiritueux` ; les règles sont sous `salarié . convention collective . vins cidres spiritueux`.

## Règles implémentées

- `position` reçoit l'une des 21 positions de la grille : `1A` à `6B`, `7A`, `8A`, `9A`, `9B` et `10A`.
- `salaire minimum conventionnel . grille` donne le minimum mensuel à temps complet, de 1 844 € pour la position 1A à 5 023 € pour la position 10A.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois.
- `position hors grille` signale une position absente ; la grille retourne alors `0 €/mois`.

## Limites

- Seuls les salaires minima mensuels de l'accord 2026 sont modélisés. Les primes, indemnités, classifications détaillées, frais et autres dispositions de la convention ne le sont pas.
- La grille est applicable à compter du 1er février 2026 conformément à l'accord et à son extension. Les situations antérieures ne sont pas couvertes par cette version.
- Les montants sont ceux du barème officiel, en euros mensuels pour un temps complet.
