# Golf — IDCC 2021

## Version et périmètre

`2026.1` est applicable au **1er avril 2026**. Il modélise les minima conventionnels de la convention collective nationale du golf pour les groupes 1 à 7, après extension de l'accord du 27 novembre 2025. L'audit s'appuie exclusivement sur les références officielles Légifrance/JORF indiquées dans les règles.

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

Après **deux ans d'ancienneté dans l'entreprise**, l'accord prévoit en complément un minimum annuel pour les groupes 6 et 7 : **37 899 €/an** pour le groupe 6 et **48 060 €/an** pour le groupe 7. La sortie `salaire minimum annuel conventionnel` conserve l'unité annuelle et est proratisée par la quotité. Le modèle ne convertit pas ce minimum annuel en douzième mensuel et ne calcule pas les régularisations ou comparaisons de rémunération.

## Entrées et limites

Préfixe : `salarié . convention collective . golf` ; choix de convention : `'golf'`.

- `groupe` : chaîne `'1'` à `'7'`.
- `deux ans d'ancienneté` : booléen, par défaut `non`. Il doit être fourni par le consommateur à partir des dates et règles d'ancienneté applicables.
- `contrat . temps de travail . quotité` : entrée standard de `modele-social` utilisée pour la proratisation.

Ne sont pas modélisés : classifications détaillées au sein des groupes, primes, majorations, congés, maintien de salaire, indemnités, temps de travail, régularisations annuelles et autres dispositions de la convention. Le minimum légal ou contractuel plus favorable reste à comparer par l'application consommatrice.

## Sources officielles

- [Arrêté du 10 mars 2026 portant extension de l'accord du 27 novembre 2025 relatif aux salaires minima conventionnels, JORF du 19 mars 2026](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053749739).
- [Accord du 27 novembre 2025 relatif aux salaires minima conventionnels, texte convention collective Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000053741377).

## Validation

`test/golf.test.ts` vérifie les sept montants mensuels, la proratisation, les deux minima annuels conditionnés par l'ancienneté, l'inapplicabilité d'une classification hors grille et l'isolation hors convention.
