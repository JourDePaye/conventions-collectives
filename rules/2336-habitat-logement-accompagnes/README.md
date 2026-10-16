# Habitat et logement accompagnés — IDCC 2336

La version `2025.1` (historique) prend effet le **1er janvier 2025** et couvre les montants calculables des textes salaires publiés sur Légifrance : l'accord n° 30 du 19 novembre 2024 pour les personnels PACT ARIM et l'avenant n° 66 du 19 novembre 2024 pour les structures FSJT.

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
