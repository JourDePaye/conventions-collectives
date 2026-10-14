# Ateliers et chantiers d'insertion — IDCC 3016

Le fichier [2026.1](3016-ateliers-chantiers-insertion.2026.1.publicodes) reprend l'avenant n° 39 du 25 novembre 2025 relatif à la classification et aux salaires minima, applicable au 1er juin 2026 après extension.

## Règles implémentées

- `coefficient` reçoit le coefficient de l'emploi-repère du titre V ;
- `salaire minimum conventionnel` applique la formule `928 € + coefficient × 4,04 €` à temps plein, puis la quotité de travail ;
- `coefficient hors grille` bloque les coefficients non présents dans la liste officielle modélisée ;
- les salariés polyvalents en parcours d'insertion, dont le minimum est le SMIC selon l'article 4.4, ne sont pas assimilés à la grille des emplois-repères ;
- `audit paie` conserve l'audit explicite et les omissions justifiées.

## Audit des rubriques de paie

L'avenant salarial et les textes dédiés ont été examinés avec recherche séparée des taux de cotisations salariales et patronales, assiettes, plafonds, tranches, forfaits, frais de santé, prévoyance, retraite complémentaire, formation professionnelle, AT/MP, primes, indemnités, avantages en nature et frais. L'avenant n° 39 ne fournit pas de taux général supplémentaire à injecter. L'accord santé du 25 novembre 2025 et son avenant du 20 février 2026 ont été identifiés mais ne sont pas étendus dans le périmètre de cette version ; l'avenant prévoyance n° 37 a été identifié, mais ses garanties, catégories et tarifs nécessitent une modélisation dédiée. Aucun taux autonome de retraite, formation ou AT/MP n'est donc inventé. Les éléments dépendant de l'entreprise, du régime, du contrat, de l'activité ou d'une notification AT/MP restent externes.

Les primes, indemnités, avantages en nature et frais non déterminables à partir du coefficient ne sont pas ajoutés automatiquement. Cette omission documentée ne vaut pas renonciation aux obligations conventionnelles.

## Sources officielles

- Avenant n° 39 du 25 novembre 2025 relatif à la classification et aux salaires minima, articles 5.2.1 et 5.2.2, étendu par arrêté du 4 mai 2026 — Légifrance, texte `KALITEXT000053576956`, article `KALIARTI000054119948`.
- Convention collective nationale des ateliers et chantiers d'insertion du 31 mars 2011, IDCC 3016 — Légifrance, texte `KALITEXT000027181040`.
- Avenant n° 37 du 25 novembre 2025 relatif au régime de prévoyance, étendu par arrêté du 18 mars 2026 — Légifrance, texte `KALITEXT000053576911`.
- Accord du 25 novembre 2025 relatif aux frais de santé et avenant n° 1 du 20 février 2026 — Légifrance, article `KALIARTI000053576870`.
