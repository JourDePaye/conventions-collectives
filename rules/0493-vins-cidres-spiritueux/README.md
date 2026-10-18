# Vins, cidres, jus de fruits, sirops, spiritueux et liqueurs de France — IDCC 493

Les fichiers [2026.1](0493-vins-cidres-spiritueux.2026.1.publicodes) et [2026.2](0493-vins-cidres-spiritueux.2026.2.publicodes) entrent en vigueur le 1er février 2026 et modélisent la grille de l'**avenant n° 31 du 13 février 2026** relatif aux salaires minima conventionnels (KALITEXT000054253980). Il lie les membres des organisations signataires dès le 1er février 2026, et les autres entreprises à compter du **1er juin 2026**, premier jour du mois suivant la publication de l'arrêté d'extension du 4 mai 2026 (JORF du 8 mai 2026, JORFTEXT000054048652).

La version `2026.2` remplace `2026.1` (même grille) : `2026.1` citait un « accord du 10 décembre 2025 » (KALITEXT000053863733, sans contenu sur Légifrance) et un arrêté d'extension d'une autre convention ; `2026.2` cite les bons textes et déclare l'extension (`extension: 2026-06-01`).

**Non modélisé** : l'avenant n° 32 du 3 juillet 2026 relatif aux salaires minima conventionnels, étendu par arrêté du 22 septembre 2026 (JORF du 30 septembre 2026). Il est publié au BOCC n° 2026/32, qui n'était pas en ligne au 18 octobre 2026 : sa grille sera ajoutée dans une nouvelle version dès qu'elle pourra être lue.

La valeur Publicodes est `vins cidres spiritueux` ; les règles sont sous `salarié . convention collective . vins cidres spiritueux`.

## Règles implémentées

- `position` reçoit l'une des 21 positions de la grille : `1A` à `6B`, `7A`, `8A`, `9A`, `9B` et `10A`.
- `salaire minimum conventionnel . grille` donne le minimum mensuel à temps complet, de 1 844 € pour la position 1A à 5 023 € pour la position 10A.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois.
- `position hors grille` signale une position absente ; la grille retourne alors `0 €/mois`.

## Limites

- Seuls les salaires minima mensuels de l'accord 2026 sont modélisés. Les primes, indemnités, classifications détaillées, frais et autres dispositions de la convention ne le sont pas.
- La grille est applicable à compter du 1er février 2026 aux membres des organisations signataires, et du 1er juin 2026 aux autres entreprises. Les situations antérieures ne sont pas couvertes.
- Les montants sont ceux du barème officiel, en euros mensuels pour un temps complet.
