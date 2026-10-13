# Activités industrielles de boulangerie et pâtisserie et professionnels de l'œuf — IDCC 3255

La version `2025.1` modélise l'article 21 de la convention collective nationale du **1er octobre 2024**, avec les salaires minima conventionnels mensuels bruts applicables au **1er février 2025** pour 151,67 heures mensuelles. La convention a été étendue par arrêté du 20 novembre 2025, publié au Journal officiel le 27 novembre 2025. La version `2026.1` reprend l'avenant n° 4 du 22 janvier 2026, applicable aux entreprises non signataires au **1er avril 2026** après extension.

La valeur Publicodes est `boulangerie industrielle` et les règles sont sous `salarié . convention collective . boulangerie industrielle`.

## Règles implémentées

- `salaire minimum conventionnel` expose la grille mensuelle des niveaux et échelons A1 à E3.
- La grille `2026.1` est celle de l'avenant n° 4 ; elle s'applique au 1er mars 2026 aux entreprises signataires et au 1er avril 2026 à tous les employeurs après extension.
- Le minimum est proratisé selon `contrat . temps de travail . quotité`.
- Les niveaux absents de la grille rendent l'endpoint inapplicable.

## Sources officielles

- Convention collective et article 21 relatif aux salaires minima, texte KALI `KALITEXT000052299903`.
- Conteneur officiel de la convention collective, IDCC 3255, KALI `KALICONT000051160618`.
- Arrêté d'extension du 20 novembre 2025, publié au Journal officiel le 27 novembre 2025, indiqué par le texte officiel Légifrance.

## Limites

Le modèle ne déduit pas la classification du poste et ne modélise pas les primes, majorations, ancienneté, catégories particulières, comparaison annuelle ou autres dispositions de la convention.

## Tests

`test/boulangerie-industrielle.test.ts` vérifie les treize cellules de la grille, la proratisation à temps partiel et l'inapplicabilité d'un niveau hors grille.
