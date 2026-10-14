# Ports et manutention — IDCC 3017

La version `2024.1` reprend l’avenant n° 17 du **27 octobre 2023** relatif aux salaires minimaux conventionnels garantis, étendu par arrêté du **13 mai 2024** publié au Journal officiel du 31 mai 2024, avec effet au **1er janvier 2024**.

## Règles implémentées

- `classification` et `ancienneté dans la classification` reçoivent les entrées nécessaires à la grille ;
- `salaire minimum conventionnel` calcule la SBMH mensuelle à temps plein de la ligne **B** des salariés des établissements portuaires des ports de commerce et de pêche, selon les paliers d’ancienneté de 0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30 et 33 ans ;
- le minimum est proratisé par `salarié . contrat . temps de travail . quotité` ;
- `classification hors grille` signale les classifications non couvertes, notamment les autres lignes de la grille et les catégories de manutention non modélisées.

## Audit explicite des rubriques de paie

L’avenant salarial, le conteneur IDCC 3017 et les textes dédiés ont fait l’objet d’une recherche séparée sur les cotisations **salarié et employeur**, leurs assiettes, taux, plafonds, tranches, forfaits et exonérations, ainsi que sur la santé, la prévoyance, la retraite complémentaire et supplémentaire, la formation professionnelle, l’AT/MP, la préretraite/pénibilité, les primes, médailles, indemnités, avantages en nature et frais, et les arrêtés d’extension.

Aucun taux ou assiette conventionnel générique supplémentaire, calculable avec les seules entrées de ce modèle, n’est retenu. Les accords de prévoyance et de retraite supplémentaire nécessitent des paramètres de régime et de statut ; plusieurs textes contributifs sont soumis à des champs ou à des extensions distincts. Ces rubriques restent externes et ne sont pas remplacées par zéro. Les autres classifications, primes, indemnités, frais et avantages exigent des entrées de situation et des textes spécifiques.

## Sources officielles

- Avenant n° 17 du 27 octobre 2023 relatif aux salaires minimaux conventionnels garantis, texte Légifrance `KALITEXT000049508746`.
- Arrêté du 13 mai 2024 portant extension, publié au Journal officiel du 31 mai 2024.
- Conteneur officiel de la convention collective nationale unifiée ports et manutention, IDCC 3017, `KALICONT000029142476`.
- Recherche dédiée des accords et avenants de cotisations salarié/employeur, assiettes, plafonds, tranches, forfaits, santé, prévoyance, retraite, formation, AT/MP, primes, avantages et frais : aucune règle calculable additionnelle retenue.
