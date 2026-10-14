# Convention collective nationale de la bijouterie, joaillerie, orfèvrerie, horlogerie — IDCC 3251

Le fichier [2025.1](3251-bijouterie-joaillerie-horlogerie.2025.1.publicodes) reprend l'accord du 19 mars 2025 relatif aux salaires minima conventionnels, revalorisés de 1,5 % au 1er avril 2025 et étendu par arrêté du 12 septembre 2025.

## Règles implémentées

- `classification` accepte les niveaux 1 à 7 avec échelons 1 à 4 ;
- `salaire minimum conventionnel` expose le minimum mensuel brut à 151,67 heures et le prorate selon la quotité de travail ;
- `classification hors grille` bloque les classifications non couvertes et retourne 0 plutôt que d'extrapoler ;
- `audit paie` conserve explicitement les limites de l'audit des cotisations et autres rubriques.

## Audit paie et limites

L'accord salarial et son arrêté d'extension ont été examinés avec recherche dédiée des évolutions de cotisations salariales et patronales, assiettes, plafonds, tranches, forfaits, frais de santé, prévoyance, formation professionnelle, AT/MP, primes, indemnités, avantages en nature et remboursements de frais. Aucun taux conventionnel chiffré exploitable n'est ajouté : les régimes légalement applicables et les contrats d'entreprise restent gérés par `modele-social` ou par des entrées externes. Le taux AT/MP est notifié à l'employeur et les éléments de planning (nuit, dimanche, jours fériés, heures supplémentaires) ne sont pas déductibles de la seule grille salariale. Cette omission documentée ne vaut pas renonciation aux obligations conventionnelles.

Les niveaux hors grille ne sont pas extrapolés ; les catégories particulières, primes et avantages nécessitent des données supplémentaires et restent non automatisés.

## Sources officielles

- Accord du 19 mars 2025 relatif aux salaires minima conventionnels — Légifrance, texte `KALITEXT000052299815`.
- Arrêté du 12 septembre 2025 portant extension de l'accord — JORF du 19 septembre 2025.
- Convention collective nationale de la bijouterie, joaillerie, orfèvrerie, horlogerie du 3 octobre 2023 — Légifrance, conteneur `KALICONT000048984729`.
