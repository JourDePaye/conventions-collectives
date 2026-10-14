# Coopératives agricoles de céréales, de meunerie, d'approvisionnement, d'alimentation du bétail et d'oléagineux — IDCC 1077

Le fichier [2025.1](1077-cooperatives-agricoles-cereales.2025.1.publicodes) reprend l'accord salarial du 13 novembre 2024, applicable au 1er mars 2025. Il modélise les minima mensuels des niveaux 1 à 6, pour un temps complet, puis leur proratisation selon la quotité de travail.

## Règles implémentées

- `niveau` couvre les niveaux 1 à 6 de la grille salariale publiée pour 2025 ;
- `salaire minimum conventionnel` expose les minima mensuels bruts 1 831,80 €, 1 846,77 €, 1 872,97 €, 1 947,89 €, 1 984,10 € et 2 039,05 €, puis les prorate selon la quotité ;
- `niveau hors grille` signale toute valeur hors de cette grille bornée.

## Audit paie et limites

L'accord salarial et le conteneur officiel IDCC 1077 ont été recherchés pour les changements de cotisations salarié/employeur, assiettes, plafonds et tranches, forfaits, santé, prévoyance, retraite complémentaire, formation professionnelle, AT/MP, primes, indemnités, frais et avantages en nature. Les accords dédiés de protection sociale et de formation ainsi que leurs éventuels arrêtés d'extension ont été recherchés. Aucun taux ou assiette conventionnel générique supplémentaire n'est calculable avec les seules entrées de ce modèle : les cotisations légales, la santé, la prévoyance, la retraite, la formation, l'AT/MP et les éventuelles contributions conventionnelles restent externes et ne sont pas remplacées par zéro.

Les primes d'ancienneté, primes et indemnités liées aux travaux, déplacements, repas, astreintes, heures supplémentaires, congés, avantages en nature et frais nécessitent des entrées de paie ou de situation absentes du modèle ; elles ne sont pas extrapolées.

## Sources officielles

- Accord du 13 novembre 2024 relatif aux salaires minima — Légifrance, texte `KALITEXT000051910263`.
- Conteneur officiel de la convention — Légifrance, IDCC 1077.
- Recherche des textes officiels dédiés aux cotisations, santé, prévoyance, retraite, formation professionnelle, AT/MP, primes et avantages : aucune règle calculable additionnelle retenue.
