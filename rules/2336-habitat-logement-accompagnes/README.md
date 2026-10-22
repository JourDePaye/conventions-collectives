# Habitat et logement accompagnés — IDCC 2336

La version `2025.1` (historique) prend effet le **1er janvier 2025** et couvre les montants calculables des textes salaires publiés sur Légifrance : l'accord n° 30 du 19 novembre 2024 pour les personnels PACT ARIM et l'avenant n° 66 du 19 novembre 2024 pour les structures FSJT.

## Versions 2026.2 et 2026.3 : système HLA et anciens systèmes

L'**avenant n° 67 du 1er juillet 2025** ([KALITEXT000052326768](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000052326768), étendu par arrêté du 10 décembre 2025, JORF du 20 décembre 2025) crée le système commun HLA : minimum mensuel = coefficient × valeur du point + base (article 16.2 de la CCN), comparé à la rémunération contractuelle hors compléments conventionnels (primes d'expérience professionnelle, treizième mois, solde de revalorisation Ségur). Il entre en vigueur le lendemain de la parution de l'extension, le 21 décembre 2025 ; chaque entreprise l'applique au plus tard 9 mois après (article 12), soit le 21 septembre 2026 : jusque-là, les anciens systèmes FSJT et PACT ARIM restent possibles (article 7.2).

`système de rémunération` choisit le système de l'entreprise : `HLA` (par défaut), `PACT ARIM 35 heures payées 35`, `PACT ARIM 35 heures payées 39` ou `FSJT`. L'ancien système FSJT n'est pas calculé (`grille applicable` est faux, pas de minimum) ; les anciens systèmes sont hors grille à partir du 21 septembre 2026 (`anciens systèmes abrogés`).

| Version | Date d'effet | Extension | HLA | PACT ARIM 35/35 | PACT ARIM 35/39 |
|---|---|---|---|---|---|
| `2026.2` | 21 décembre 2025 | 20 décembre 2025 | 1 218,00 € + 2,03 € × coefficient (avenant n° 67, article 7.2) | 880,24 € + 1,99 € (accord n° 30) | 971,56 € + 2,22 € |
| `2026.3` | 1er janvier 2026 | 10 juillet 2026 | 1 227,74 € + 2,05 € (avenant n° 70, article 6) | 887,28 € + 2,00 € (article 5) | 979,33 € + 2,24 € |

L'avenant n° 70 n'est signé que par HEXOPÉE : jusqu'à son extension, un autre employeur garde les valeurs de `2026.2`. `2026.2`, numérotée après `2026.1` bien qu'en vigueur avant elle, et `2026.3` remplacent `2025.1`, qui datait l'accord n° 30 du 1er janvier 2025 alors qu'il entre en vigueur le lendemain de son extension (17 avril 2025), et `2026.1`, sans système HLA ni extension : un consommateur commence à `2026.2`.

## Version 2026.1

La version `2026.1` prend effet le **1er janvier 2026** (article 8) et reprend l'**avenant n° 70 du 30 septembre 2025** (KALITEXT000054872078, étendu sous réserve du SMIC par arrêté du 6 juillet 2026, JORF du 10 juillet 2026). Il remplace l'accord n° 30 et l'avenant n° 66 (article 3). Pour les personnels PACT ARIM : valeur du point `2,00 €` (35 heures payées 35 heures) et `2,24 €` (35 heures payées 39 heures) ; partie fixe `887,28 €` et `979,33 €`. Les règles et clés sont celles de 2025.1 ; seuls les montants changent. Les valeurs FSJT (point socle `1,202 €`, tranche supérieure `1,179 €`) et le système HLA de l'avenant n° 67 (base `1 227,74 €`, point `2,05 €`) ne sont pas calculés.

## Version 2025.1 : sources

Les valeurs PACT ARIM de 2025.1 (point `1,99 €`/`2,22 €`, partie fixe `880,24 €`/`971,56 €`) proviennent de l'**accord n° 30 du 19 novembre 2024** (KALITEXT000051163225, étendu par arrêté du 2 avril 2025, JORF du 16 avril 2025) et non de l'avenant n° 66, qui ne concerne que le champ FSJT.

## Règles calculées

- Pour le périmètre PACT ARIM, le minimum mensuel est `partie fixe + coefficient × valeur du point`, puis proratisé une seule fois par la quotité de travail.
- Pour 35 heures payées 35 heures : valeur du point `1,99 €`, partie fixe `880,24 €`.
- Pour 35 heures payées 39 heures : valeur du point `2,22 €`, partie fixe `971,56 €`.
- Les textes FSJT fixent pour 2025 les valeurs de point socle `1,193 €` et de tranche supérieure `1,17 €`, mais le calcul nécessite les données de classement et de tranche propres au salarié ; elles ne sont pas appliquées automatiquement ici.

## Audit explicite des rubriques de paie

Les textes de la CCN HLA, les textes salaires et les accords/avenants dédiés ont été recherchés avec leurs arrêtés d'extension pour les rubriques suivantes :

- **Cotisations salarié/employeur, taux et assiettes** : aucun taux générique chiffré et directement calculable n'est créé par les textes salaires 2025 ; omission documentée.
- **Plafonds, tranches et forfaits** : les valeurs de tranche supérieure FSJT sont exposées dans la source mais non calculées sans classification détaillée ; aucun plafond ou forfait de cotisation n'est inventé.
- **Santé et prévoyance** : aucun taux ou montant universel suffisamment déterminé dans les textes retenus pour être appliqué sans contrat et catégorie ; omission documentée.
- **Retraite complémentaire et supplémentaire** : pas de taux ou assiette conventionnelle nouvelle calculable dans cette version ; omission documentée.
- **Formation professionnelle** : les obligations de branche ne fournissent pas ici de taux additionnel générique sûr ; omission documentée.
- **AT/MP** : aucun taux conventionnel ; la tarification relève du régime réglementaire et de l'activité.
- **Primes et indemnités** : aucune prime ou indemnité 2025 générique n'est calculée sans conditions individuelles ; omission documentée.
- **Avantages, exonérations et frais professionnels** : aucun montant forfaitaire ou exonération suffisamment déterminé n'est ajouté.

Ces omissions sont intentionnelles : aucun taux salarié/employeur, base, plafond, tranche ou forfait non sourcé n'est mis à zéro. Les règles sont isolées sous `salarié . convention collective . habitat logement accompagnés`.

## Sources officielles

- [Avenant n° 70 du 30 septembre 2025 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054872078)
- [Accord n° 30 du 19 novembre 2024 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051163225)
- [Avenant n° 66 du 19 novembre 2024 relatif à la négociation salariale annuelle obligatoire — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051163241)
- [Convention collective nationale de l'habitat et du logement accompagnés — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635560)
- Arrêté du 6 février 2025 portant extension de l'avenant n° 66, publié au Journal officiel du 14 février 2025 (référence indiquée sur le texte Légifrance).
