# Bâtiment — ETAM Île-de-France (IDCC 2707)

La version `2018.1` reprend l'accord salarial officiel applicable au **1er janvier 2018** pour les employés, techniciens et agents de maîtrise du bâtiment de la région parisienne. Il s'agit d'un modèle historique borné à ce périmètre : il ne fabrique pas de grille nationale, ne couvre pas les cadres et n'extrapole pas les années postérieures.

## Règles implémentées

- Sept minima mensuels bruts des niveaux A à G : 1 500 €, 1 660 €, 1 850 €, 2 080 €, 2 350 €, 2 600 € et 2 915 €.
- Proratisation selon `contrat . temps de travail . quotité`.
- Niveau absent de la grille détecté et minimum non calculé.
- Audit paie exposé séparément sous `audit paie`.

## Audit explicite des rubriques de paie

Les textes officiels IDCC 2707, les textes de salaire, les accords et avenants dédiés et les arrêtés d'extension ont été recherchés pour les **taux de cotisations salarié et employeur**, **assiettes**, **plafonds**, **tranches**, **forfaits** et **exonérations**, ainsi que pour la **complémentaire santé**, la **prévoyance**, la **retraite complémentaire et supplémentaire**, la **formation professionnelle**, l'**AT/MP**, les **primes**, **indemnités**, **avantages en nature** et **frais**.

Aucun taux, base ou plafond conventionnel générique n'est calculable avec les seules entrées de ce modèle. Les cotisations CIBTP, intempéries, OPPBTP, santé, prévoyance, retraite, formation et AT/MP, ainsi que les primes, avantages et frais, restent donc externes ; aucune règle de `modele-social` n'est remplacée ou mise à zéro. Cette omission est intentionnelle et testée par isolation. Elle ne signifie pas que ces obligations sont nulles.

## Sources officielles

- Accord salarial IDCC 2707 applicable au 1er janvier 2018, texte officiel Légifrance `KALITEXT000037172865`.
- Convention collective des ETAM du bâtiment de la région parisienne, IDCC 2707, conteneur Légifrance `KALICONT000024794551`.
- Arrêté d'extension publié au Journal officiel, JORF du 30 décembre 2018, n° 0302.
