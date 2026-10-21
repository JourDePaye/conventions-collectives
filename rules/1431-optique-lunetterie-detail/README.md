# Optique-lunetterie de détail (IDCC 1431)

Version `2024.3`, applicable au **1er janvier 2024**, retains the salary grid from the agreement of 14 September 2023 adds the extended non-cadre pension plan correction from the 14 March 2024 amendment, and (revision `2024.3`, replacing `2024.2` with the same effective date) adds the missing non-health-professional levels 1.1 to 3.6 of the new classification. Revision `2024.4`, replacing `2024.3` with the same effective date, deduces the classification from the coefficient and adds the non-cadres' seniority bonus of article 32 of the convention. The salary agreement took effect on 1 January 2024 and was extended by arrêté of 11 December 2023, published in the Journal officiel on 14 December 2023.

**Non modélisé** : l'accord du 9 juillet 2026 relatif aux salaires minima, étendu par arrêté du 12 octobre 2026 (JORF du 15 octobre 2026, JORFTEXT000054983839), sous une réserve portant sur le champ territorial de l'accord et non sur ses montants. Il est publié au BOCC n° 2026/36, qui n'était pas en ligne au 19 octobre 2026, et ne figure pas dans KALI : sa grille sera ajoutée dans une nouvelle version dès qu'elle pourra être lue. KALI ne contient aucun accord de salaires entre celui du 14 septembre 2023 et celui-ci.

## Classification et salaires minima

Le modèle demande la classification effectivement attribuée et le coefficient correspondant. La valeur `ancienne` désigne la classification actuelle par coefficients numériques ; la valeur `nouvelle` désigne la classification de l'avenant n° 8 du 7 avril 2022. Depuis la révision `2024.4`, seul le coefficient est nécessaire : la classification en est déduite (coefficient numérique de la grille « Minimas 1 » : `ancienne` ; sinon `nouvelle`), les codes des deux classifications étant distincts. Le modèle ne déduit pas la classification d'un diplôme ou de l'intitulé du poste.

Les minima mensuels bruts à temps plein (151,67 heures) sont :

### Classification actuelle — « Minimas 1 »

| Coefficient | Minimum mensuel |
|---:|---:|
| 110 | 1 830 € |
| 115 | 1 850 € |
| 130 | 1 850 € |
| 140 | 1 870 € |
| 150 | 1 900 € |
| 160 | 1 900 € |
| 170 | 1 900 € |
| 180 | 1 930 € |
| 190 | 1 950 € |
| 195 | 1 950 € |
| 200 | 2 000 € |
| 210 | 2 000 € |
| 220 | 2 150 € |
| 230 | 2 250 € |
| 240 | 2 315 € |
| 250 | 2 315 € |
| 280 | 2 455 € |
| 300 | 2 850 € |
| 330 | 2 850 € |
| 350 | 3 115 € |
| 380 | 3 400 € |

### Classification de l'avenant n° 8 — « Minimas 2 », professionnels de santé (`nouvelle`, niveaux A à K)

| Niveau | Minimum mensuel |
|:---:|---:|
| A | 1 935 € |
| B | 2 010 € |
| C | 2 060 € |
| D | 2 135 € |
| E | 2 195 € |
| F | 2 300 € |
| G | 2 400 € |
| H | 2 500 € |
| I | 3 000 € |
| J | 3 400 € |
| K | 3 700 € |

### Classification de l'avenant n° 8 — « Minimas 2 », non professionnels de santé (`nouvelle`, niveaux 1.1 à 3.6)

| Niveau | Minimum mensuel |
|:---:|---:|
| 1.1 | 1 830 € |
| 1.2 | 1 850 € |
| 1.3 | 1 870 € |
| 1.4 | 1 900 € |
| 1.5 | 1 930 € |
| 1.6 | 1 950 € |
| 2.1 | 2 000 € |
| 2.2 | 2 050 € |
| 2.3 | 2 100 € |
| 2.4 | 2 150 € |
| 3.1 | 2 250 € |
| 3.2 | 2 315 € |
| 3.3 | 2 455 € |
| 3.4 | 2 850 € |
| 3.5 | 3 115 € |
| 3.6 | 3 400 € |

Le minimum exposé est proratisé selon `salarié . contrat . temps de travail . quotité` et arrondi à deux décimales. Les minima légaux (notamment le SMIC) et les situations particulières doivent faire l'objet d'une comparaison séparée par l'application consommatrice.

## Prime d'ancienneté (révision `2024.4`)

L'article 32 de la convention ([KALIARTI000039748563](https://www.legifrance.gouv.fr/conv_coll/id/KALIARTI000039748563)) attribue aux salariés non-cadres une prime d'ancienneté calculée sur le minimum de l'annexe II de leur classification, proportionnellement à l'horaire de travail : 3 % à partir de 3 ans d'ancienneté, 6 % à partir de 6 ans, 9 % à partir de 9 ans, 12 % à partir de 12 ans et 15 % à partir de 15 ans. L'ancienneté est celle de l'article 29 ([KALIARTI000039748560](https://www.legifrance.gouv.fr/conv_coll/id/KALIARTI000039748560)), contrats antérieurs dans l'entreprise ou ses filiales compris : elle est l'entrée `ancienneté entreprise` (en années, 0 par défaut). La prime est `prime d'ancienneté` (€/mois, 0 pour un cadre ou hors grille) ; elle s'ajoute à la rémunération et n'entre pas dans la comparaison au minimum. La majoration du minimum pour heures supplémentaires, que l'article 32 inclut dans l'assiette, n'est pas modélisée.

## Prévoyance

For non-cadre employees, the mandatory branch pension plan is calculated on gross salary over TA + TB (up to four social-security ceilings): **0.56%**, split **0.336% employer / 0.224% employee**. The model leaves cadre employees to the standard cadre regime and does not infer guarantees, portability events, or contract-specific exemptions.

## Limites explicites

- Le modèle ne calcule ni la prime d'ancienneté avant la révision `2024.4`, ni les autres primes, les majorations, la santé, la formation ou les autres cotisations propres à la branche.
- Il ne détermine pas la classification à partir du diplôme, du poste ou de l'expérience.
- L'accord salarial du 9 juillet 2026, étendu par arrêté du 12 octobre 2026 (voir plus haut), n'était toujours pas dans KALI au 21 octobre 2026 : il n'est pas intégré, et la grille de 2023 reste la dernière modélisée.

## Références officielles

- Accord du 14 septembre 2023 relatif aux salaires minima : [KALITEXT000048638289](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000048638289).
- Article d'entrée en vigueur et extension de l'accord : [KALIARTI000048638293](https://www.legifrance.gouv.fr/conv_coll/id/KALIARTI000048638293), indiquant l'arrêté du 11 décembre 2023 publié au Journal officiel le 14 décembre 2023.
- Avenant n° 8 du 14 mars 2024 relatif à la prévoyance non-cadres : [KALIARTI000049730988](https://www.legifrance.gouv.fr/conv_coll/id/KALIARTI000049730988), étendu par arrêté du 3 juillet 2024 (JORF du 12 juillet 2024).
- Avenant n° 9 du 26 septembre 2024 relatif à la prévoyance non-cadres : [KALIARTI000050792992](https://www.legifrance.gouv.fr/conv_coll/id/KALIARTI000050792992), étendu par arrêté du 20 mars 2025 (JORF du 27 mars 2025).
- Convention collective nationale du 13 juin 2019 : [KALITEXT000039748471](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000039748471), articles 29 et 32.
- Convention collective nationale et avenant n° 8 du 7 avril 2022 : [KALICONT000005635912](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635912).
- Stock officiel KALI de la DILA, dernier snapshot inspecté : [OPENDATA/KALI](https://echanges.dila.gouv.fr/OPENDATA/KALI/), archive quotidienne du 9 octobre 2026.
