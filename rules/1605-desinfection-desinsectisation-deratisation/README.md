# Convention collective nationale des entreprises de désinfection, désinsectisation, dératisation (3D) — IDCC 1605

Le fichier [2026.2](1605-desinfection-desinsectisation-deratisation.2026.2.publicodes) est applicable à compter du **18 mars 2026**, date de publication au Journal officiel de l'arrêté d'extension du 9 mars 2026. Il reprend l'intégralité de l'annexe 1 de l'accord du 17 décembre 2025 relatif à la revalorisation salariale pour 2026 (KALITEXT000054040312) : les douze niveaux des trois groupes et la prime d'ancienneté. Il remplace le fichier [2026.1](1605-desinfection-desinsectisation-deratisation.2026.1.publicodes), de même date d'effet, qui ne modélisait que les niveaux 1 à 4 du groupe 1.

## Règles implémentées

- `niveau` couvre les niveaux 1 à 12 : groupe 1 (ouvriers et employés) niveaux 1 à 4, groupe 2 niveaux 5 à 8, groupe 3 (cadres) niveaux 9 à 12 ;
- `salaire minimum conventionnel` expose les minima mensuels bruts pour 151,67 heures, puis les prorate selon la quotité : 1 837,13 / 1 892,13 / 1 947,13 / 2 002,13 € (niveaux 1 à 4), 2 112,13 / 2 255,26 / 2 517,53 / 2 690,80 € (niveaux 5 à 8), 2 911,45 / 3 729,93 / 5 337,11 / 6 119,03 € (niveaux 9 à 12) ;
- `niveau hors grille` signale les niveaux absents de 1 à 12 ;
- `tranche d'ancienneté` et `prime d'ancienneté` (€/mois, proratisée selon la quotité) donnent la prime des niveaux 2 à 8 d'après les montants en euros de l'annexe 1, à partir de `salarié . ancienneté` : par exemple niveau 2, 37,84 € à 2 ans, 56,76 € de 3 à 6 ans, 340,58 € au-delà de 20 ans. Pas de prime au niveau 1 (sans objet) ni pour les cadres (niveaux 9 à 12) ni avant 2 ans.

L'annexe ne définit pas les bornes des tranches (« 2 ans », « 3-6 ans », « 6-9 ans », « 9-12 ans », « 12-15 ans », « 15-20 ans », « > 20 ans ») : la lecture retenue est de 2 à moins de 3 ans, de 3 à moins de 6 ans, de 6 à moins de 9 ans, de 9 à moins de 12 ans, de 12 à moins de 15 ans, de 15 à 20 ans inclus, plus de 20 ans. L'article 30 de la convention (taux de 3 % à 15 % après 3 à 15 ans) ne prévoit ni la tranche à 2 ans ni celle de plus de 20 ans, que seule l'annexe de l'accord de 2026 contient.

## Audit paie et limites

L'accord salarial et le conteneur officiel IDCC 1605 ont été examinés pour les changements de taux et d'assiette des cotisations salarié/employeur, bases, plafonds et tranches, forfaits, santé, prévoyance, retraite, formation professionnelle, AT/MP, primes, indemnités et avantages. Les textes dédiés de prévoyance/retraite et de formation ont été recherchés, ainsi que l'arrêté d'extension de l'accord salarial. Aucun taux ou assiette conventionnel générique supplémentaire n'est calculable avec les entrées de ce modèle : ces rubriques restent externes et ne sont pas remplacées par zéro.

La prime panier (portée de 10,10 à 10,30 € par l'accord, renvoyée au plafond Urssaf), le barème des indemnités de départ à la retraite (annexe 2), les indemnités de déplacement, les majorations, les frais et les avantages en nature nécessitent des entrées de paie ou de situation non représentées automatiquement.

## Sources officielles

- Accord du 17 décembre 2025 relatif à la revalorisation salariale pour l'année 2026 — Légifrance, texte `KALITEXT000054040312`.
- Conteneur officiel de la convention — Légifrance, `KALICONT000005635437`.
- Arrêté du 9 mars 2026 portant extension, publié au Journal officiel le 18 mars 2026 — `JORFTEXT000053685524`.
- Article 30 (KALIARTI000005778104) et article 27 (KALIARTI000049394963) de la convention : prime d'ancienneté et définition de l'ancienneté.
