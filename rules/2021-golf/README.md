# Golf — IDCC 2021

## Version et périmètre

`2026.1` est applicable au **1er avril 2026** et `2026.2` corrige les sources et le minimum annuel du groupe 6 à la suite de l'avenant n° 96 du 21 janvier 2026, étendu le 17 avril 2026. L'audit s'appuie exclusivement sur les références officielles Légifrance/JORF indiquées dans les règles.

| Groupe | Minimum mensuel brut à temps plein |
|---|---:|
| 1 | 1 882,56 € |
| 2 | 1 899,84 € |
| 3 | 1 975,06 € |
| 4 | 2 136,68 € |
| 5 | 2 379,63 € |
| 6 | 3 032,22 € |
| 7 | 3 586,21 € |

Le minimum mensuel est proratisé par la quotité de travail. Une classification absente ou différente de 1 à 7 rend le minimum mensuel non applicable ; le résultat ne doit pas être interprété comme une valeur zéro.

Après **deux ans d'ancienneté non interrompue dans le groupe de classification et dans l'entreprise ou la ou les chaîne(s) de golf regroupant différentes structures**, l'accord prévoit en complément un minimum annuel pour les groupes 6 et 7 : **37 899 €/an** dans `2026.1`, puis **38 524 €/an** dans `2026.2` pour le groupe 6, et **48 060 €/an** pour le groupe 7 (plafond annuel de la sécurité sociale 2026). La sortie `salaire minimum annuel conventionnel` conserve l'unité annuelle et est proratisée par la quotité. Le modèle ne convertit pas ce minimum annuel en douzième mensuel et ne calcule pas les régularisations ou comparaisons de rémunération.

## Entrées et limites

Préfixe : `salarié . convention collective . golf` ; choix de convention : `'golf'`.

- `groupe` : chaîne `'1'` à `'7'`.
- `deux ans d'ancienneté` : booléen, par défaut `non`. Il doit être fourni par le consommateur à partir des dates et règles d'ancienneté applicables.
- `contrat . temps de travail . quotité` : entrée standard de `modele-social` utilisée pour la proratisation.

Ne sont pas modélisés : classifications détaillées au sein des groupes, primes, majorations, congés, maintien de salaire, indemnités, temps de travail, régularisations annuelles et autres dispositions de la convention. Le minimum légal ou contractuel plus favorable reste à comparer par l'application consommatrice.

## Sources officielles

- [Arrêté du 8 avril 2026 portant extension de l'avenant n° 96, JORF du 17 avril 2026](https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000053907829).
- [Avenant n° 96 du 21 janvier 2026 relatif aux salaires minima conventionnels, texte convention collective Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054092229).
- [Article 1er de l'avenant n° 96, Légifrance](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000054092233).

## Validation

`test/golf.test.ts` vérifie les sept montants mensuels, la proratisation, les deux minima annuels conditionnés par l'ancienneté, l'inapplicabilité d'une classification hors grille et l'isolation hors convention.
