# Ateliers et chantiers d'insertion — IDCC 3016

Les fichiers [2026.1](3016-ateliers-chantiers-insertion.2026.1.publicodes) et [2026.2](3016-ateliers-chantiers-insertion.2026.2.publicodes) reprennent l'avenant n° 39 du 25 novembre 2025 relatif à la classification et aux salaires minima, applicable au 1er juin 2026 après extension (arrêté du 4 mai 2026, JORF du 8 mai 2026).

La version `2026.2` remplace `2026.1` pour la même date d'effet : la formule est inchangée, mais la liste des coefficients admis est corrigée. Elle contient les 19 coefficients des emplois-repères de la branche (article 5.1.4), obtenus en additionnant les points des paliers de l'article 5.1.3 : 240, 263, 274, 281, 297, 303, 312, 313, 322, 334, 393, 395, 400, 430, 434, 492, 494, 564 et 670. La liste de la version `2026.1` comportait 16 valeurs absentes du texte. Les emplois-repères créés par une structure peuvent avoir un autre coefficient : ils sont signalés `coefficient hors grille`. Le tableau des minima publié au BOCC 2025/52 (page 144) n'a pas pu être lu ; seule la formule de l'article 5.2.2 est modélisée.

## Règles implémentées

- `coefficient` reçoit le coefficient de l'emploi-repère du titre V ;
- `salaire minimum conventionnel` applique la formule `928 € + coefficient × 4,04 €` à temps plein, puis la quotité de travail ;
- `coefficient hors grille` bloque les coefficients non présents dans la liste des emplois-repères de la branche ;
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
