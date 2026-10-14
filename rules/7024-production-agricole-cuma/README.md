# Production agricole et CUMA — IDCC 7024

Le fichier [2025.1](7024-production-agricole-cuma.2025.1.publicodes) reprend l'avenant n° 9 du 12 mars 2025, étendu par arrêté du 4 juin 2025 publié au Journal officiel du 11 juin 2025. La grille est applicable au 1er juillet 2025.

## Règles implémentées

- `coefficient` couvre les coefficients 9 à 400 dans les intervalles de l'avenant ;
- `salaire minimum conventionnel` expose les minima horaires bruts 11,88 €, 11,97 €, 12,14 €, 12,40 €, 12,93 €, 13,54 €, 14,33 €, 15,32 €, 16,58 €, 18,36 €, 20,90 € et 23,88 € ;
- `coefficient hors grille` signale les valeurs hors de la grille modélisée.

La source fixe un minimum horaire. Aucune conversion automatique en minimum mensuel ou annuel n'est effectuée : la durée réellement rémunérée et les règles de paie agricoles doivent rester fournies par le calcul appelant.

## Audit paie et limites

L'avenant salarial, le conteneur officiel IDCC 7024, les accords de protection sociale et de formation professionnelle ainsi que leurs éventuels arrêtés d'extension ont été recherchés pour les changements de cotisations salarié et employeur, assiettes, taux, plafonds, tranches, forfaits, santé, prévoyance, retraite complémentaire, formation professionnelle, AT/MP, primes, indemnités, frais et avantages en nature. Aucun taux ou assiette conventionnel générique supplémentaire, applicable à toute la branche et calculable avec les seules entrées de ce modèle, n'a été retenu. Les cotisations légales, la santé, la prévoyance, la retraite, la formation, l'AT/MP et les contributions conventionnelles éventuelles restent externes et ne sont pas remplacées par zéro.

Les primes d'ancienneté, primes et indemnités liées aux travaux agricoles, déplacements, repas, astreintes, heures supplémentaires, congés, avantages en nature et frais dépendent de la situation et des accords territoriaux ou filières ; ils ne sont pas extrapolés. Les accords régionaux ou départementaux et les filières agricoles ayant des garanties plus favorables nécessitent une entrée de périmètre distincte.

## Sources officielles

- Avenant n° 9 du 12 mars 2025 relatif aux salaires minima, Légifrance, texte `KALITEXT000051787305`.
- Arrêté du 4 juin 2025 portant extension, publié au Journal officiel du 11 juin 2025.
- Conteneur officiel de la convention, Légifrance, IDCC 7024.
- Recherche des textes officiels dédiés aux cotisations salarié/employeur, assiettes, plafonds, tranches, forfaits, santé, prévoyance, retraite, formation, AT/MP, primes, avantages et frais : aucune règle calculable additionnelle retenue.