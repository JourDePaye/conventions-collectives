# Optique-lunetterie de détail (IDCC 1431)

Version `2024.2`, applicable au **1er janvier 2024**, retains the salary grid from the agreement of 14 September 2023 and adds the extended non-cadre pension plan correction from the 14 March 2024 amendment. The salary agreement took effect on 1 January 2024 and was extended by arrêté of 11 December 2023, published in the Journal officiel on 14 December 2023.

## Classification et salaires minima

Le modèle demande la classification effectivement attribuée et le coefficient correspondant. La valeur `ancienne` désigne la classification actuelle par coefficients numériques ; la valeur `nouvelle` désigne la classification de l'avenant n° 8 du 7 avril 2022. Le modèle ne déduit pas la classification d'un diplôme ou de l'intitulé du poste.

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

### Classification de l'avenant n° 8 — « Minimas 2 », professionnels de santé

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

Le minimum exposé est proratisé selon `salarié . contrat . temps de travail . quotité` et arrondi à deux décimales. Les minima légaux (notamment le SMIC) et les situations particulières doivent faire l'objet d'une comparaison séparée par l'application consommatrice.

## Prévoyance

For non-cadre employees, the mandatory branch pension plan is calculated on gross salary over TA + TB (up to four social-security ceilings): **0.56%**, split **0.336% employer / 0.224% employee**. The model leaves cadre employees to the standard cadre regime and does not infer guarantees, portability events, or contract-specific exemptions.

## Limites explicites

- Le modèle ne calcule pas la prime d'ancienneté, les primes, les majorations, la santé, la formation ou les autres cotisations propres à la branche.
- Il ne détermine pas la classification à partir du diplôme, du poste ou de l'expérience.
- L'accord salarial du 9 juillet 2026 a fait l'objet d'un avis d'extension publié le 9 septembre 2026 ; aucune extension n'était vérifiée dans les sources officielles consultées au 11 octobre 2026. Il n'est donc pas intégré à cette version, qui reste la dernière grille étendue vérifiée.

## Références officielles

- Accord du 14 septembre 2023 relatif aux salaires minima : [KALITEXT000048638289](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000048638289).
- Article d'entrée en vigueur et extension de l'accord : [KALIARTI000048638293](https://www.legifrance.gouv.fr/conv_coll/id/KALIARTI000048638293), indiquant l'arrêté du 11 décembre 2023 publié au Journal officiel le 14 décembre 2023.
- Avenant n° 8 du 14 mars 2024 relatif à la prévoyance non-cadres : [KALIARTI000049730988](https://www.legifrance.gouv.fr/conv_coll/id/KALIARTI000049730988), étendu par arrêté du 3 juillet 2024 (JORF du 12 juillet 2024).
- Avenant n° 9 du 26 septembre 2024 relatif à la prévoyance non-cadres : [KALIARTI000050792992](https://www.legifrance.gouv.fr/conv_coll/id/KALIARTI000050792992), étendu par arrêté du 20 mars 2025 (JORF du 27 mars 2025).
- Convention collective nationale et avenant n° 8 du 7 avril 2022 : [KALICONT000005635912](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635912).
- Stock officiel KALI de la DILA, dernier snapshot inspecté : [OPENDATA/KALI](https://echanges.dila.gouv.fr/OPENDATA/KALI/), archive quotidienne du 9 octobre 2026.
