# Navigation intérieure — IDCC 3229

La version `2026.1` modélise le protocole d'accord du **17 décembre 2025** relatif aux salaires minima conventionnels, applicable au **1er janvier 2026** et étendu par arrêté du **18 mai 2026**.

## Périmètre modélisé

- `classification` accepte `matelot — tranche d'ancienneté`, correspondant à la ligne coefficient 001 du barème publié ;
- `rémunération minimale annuelle conventionnelle` expose la garantie annuelle brute et la proratisation par la quotité de travail ;
- les autres classifications et les valeurs hors grille restent explicitement non couvertes.

## Audit explicite des rubriques de paie

Les textes officiels du protocole salarial, de la convention et de l'arrêté d'extension ont été recherchés pour :

- **Cotisations salarié/employeur, taux et assiettes** : le protocole fixe des minima de rémunération, sans taux ni assiette conventionnels génériques ; aucun taux n'est ajouté.
- **Plafonds, tranches et forfaits** : aucun plafond, tranche ou forfait de cotisation n'est fixé par ce texte ; omission documentée.
- **Santé et prévoyance** : aucun taux ou montant applicable à toute la population n'est publié dans le protocole salarial ; les régimes nécessitent leurs paramètres d'affiliation.
- **Retraite** : aucune cotisation complémentaire ou supplémentaire n'est modifiée par le protocole ; les taux de régime restent ceux du droit applicable.
- **Formation professionnelle** : aucune contribution conventionnelle additionnelle chiffrée n'est créée par le texte salarial.
- **AT/MP** : aucun taux conventionnel n'est fixé ; la tarification relève du régime réglementaire et de l'activité.
- **Primes, avantages et frais** : la garantie annuelle publiée ne permet pas de calculer automatiquement les primes de navigation, indemnités, avantages en nature ou remboursements de frais sans données individuelles.
- **Base de comparaison** : la base modélisée est la garantie annuelle brute publiée ; elle est proratisée uniquement par la quotité de travail, sans conversion mensuelle inventée.

Ces omissions sont intentionnelles : aucun montant ou taux salarié/employeur ne peut être calculé sûrement à partir du protocole salarial seul.

## Sources officielles

- Protocole d'accord du 17 décembre 2025, Légifrance, texte `KALIARTI000054370936`.
- Arrêté du 18 mai 2026 portant extension, Journal officiel du 29 mai 2026.
- Convention collective nationale du personnel des entreprises de transport en navigation intérieure du 20 décembre 2018, IDCC 3229.
