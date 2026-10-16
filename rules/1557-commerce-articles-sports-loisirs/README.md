# Commerce des articles de sports et équipements de loisirs — IDCC 1557

La version `2025.2` modélise les accords du **4 mars 2025** relatifs aux salaires minima conventionnels, applicables au **1er mars 2025**. Ils ont été étendus par arrêté du **13 mai 2025**, publié au Journal officiel du **24 mai 2025**. Elle remplace la version `2025.1` (même date d'effet) dont la grille générale reprenait par erreur les montants de l'accord du 9 février 2024 ; la grille ouvriers (O1 à O4) était exacte et reste identique. Les clés de classification (`'130'` à `'550'`, `'O1'` à `'O4'`) et les noms de règles sont inchangés.

La valeur Publicodes est `commerce articles sports loisirs`. Les règles sont sous `salarié . convention collective . commerce articles sports loisirs`.

## Règles implémentées

- `classification` reçoit la référence de la grille salariale : les coefficients `130` à `550` de la grille générale ou `O1` à `O4` de la grille ouvriers/ouvrières.
- `salaire minimum conventionnel` donne le minimum mensuel à temps plein et le prorata selon la quotité de travail.
- `classification hors grille` signale les classifications non présentes dans les deux grilles.

## Limites

- Les primes, majorations et autres dispositions de la convention ne sont pas modélisées.
- La règle expose les minima mensuels ; les conditions individuelles de classement et les éventuelles garanties plus favorables restent à apprécier dans la paie.

## Sources officielles

- Accord du 4 mars 2025 relatif aux salaires minima conventionnels (grille générale), IDCC 1557, publié sur Légifrance : https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051694872
- Accord du 4 mars 2025 relatif aux salaires minima conventionnels (grille ouvriers/ouvrières), IDCC 1557, publié sur Légifrance : https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051694880
- Arrêté du 13 mai 2025 portant extension des accords, JORF du 24 mai 2025 : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051566263
