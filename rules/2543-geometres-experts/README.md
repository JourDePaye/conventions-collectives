# Géomètres-experts, géomètres-topographes, photogrammètres et experts fonciers — IDCC 2543

Le fichier [2024.1](2543-geometres-experts.2024.1.publicodes) reprend l'accord du 10 janvier 2024 relatif aux salaires minima conventionnels. Il est applicable à compter du **1er avril 2024**, premier jour du mois suivant la publication au Journal officiel du 30 mars 2024 de l'arrêté d'extension du 14 mars 2024.

## Règles implémentées

- `classification` accepte I.1, II.1 à II.3, III.1 à III.3, IV.1 à IV.3 et V.1 ;
- `salaire minimum conventionnel` expose le minimum mensuel brut pour 151,67 heures et le prorata selon la quotité de travail ;
- `classification hors grille` retourne vrai pour une classification absente et le minimum retourne alors `0` ;
- `audit paie` documente l'examen des rubriques conventionnelles sans remplacer les endpoints généraux de `modele-social`.

## Grille salariale au 1er avril 2024

| Classification | Minimum mensuel brut |
|---|---:|
| I.1 | 1 766,92 € |
| II.1 | 1 820,00 € |
| II.2 | 1 950,53 € |
| II.3 | 2 075,38 € |
| III.1 | 2 217,26 € |
| III.2 | 2 546,42 € |
| III.3 | 3 034,49 € |
| IV.1 | 3 282,99 € |
| IV.2 | 3 679,87 € |
| IV.3 | 4 120,85 € |
| V.1 | 4 605,92 € |

## Audit explicite des rubriques de paie

L'accord salarial et les textes officiels de la branche ont été recherchés pour les **taux salarié et employeur**, les **assiettes**, **plafonds**, **tranches**, **forfaits**, **exonérations**, la **santé**, la **prévoyance**, la **formation professionnelle**, l'**AT/MP**, la **retraite**, les **primes**, les **avantages en nature** et les **frais professionnels**.

Aucun taux conventionnel uniforme, aucune assiette ou plafond additionnel et aucun forfait directement calculable à partir des seules entrées de ce modèle n'est ajouté. Les régimes de santé et de prévoyance dépendent des garanties, catégories, organismes et paramètres d'affiliation ; la formation dépend notamment de l'effectif et du dispositif ; le taux AT/MP est notifié à l'employeur. Ces rubriques restent donc dans `modele-social` ou nécessitent des entrées externes. Les primes, indemnités, avantages, frais, retraite, ancienneté et temps de travail ne sont pas chiffrés par l'accord salarial et ne sont pas extrapolés.

Cette omission documentée ne vaut pas renonciation aux obligations conventionnelles. Le test dédié vérifie l'absence de collision avec `modele-social` et l'isolation du namespace.

## Sources officielles

- Accord du 10 janvier 2024 relatif aux salaires minimums conventionnels, Légifrance, `KALIARTI000049271377`.
- Arrêté du 14 mars 2024 portant extension, publié au Journal officiel du 30 mars 2024, Légifrance, `KALITEXT000049271374`.
- Convention collective nationale du 13 octobre 2005, brochure 3205, IDCC 2543.
