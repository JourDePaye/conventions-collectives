# Branche ferroviaire — IDCC 3217

## Versions

- `2025.1` : 1er janvier 2025, avenant du 18 décembre 2024 (KALITEXT000051472726, étendu le 11 juin 2025).
- `2026.1` : 1er janvier 2026, **avenant du 17 décembre 2025** à l'accord du 6 décembre 2021 (KALITEXT000053973515, étendu par arrêté du 16 mars 2026, JORF du 20 mars 2026). Même structure (9 classes, 12 seuils d'ancienneté à l'embauche puis 3 à 33 ans, €/an) ; classe 1 : 22 641 € à l'embauche, 26 670 € à 33 ans ; classe 9 : 66 468 € à l'embauche, 78 296 € à 33 ans. Les indemnités de nuit (4,80 € sédentaires, 4,34 € roulants) et de dimanche et jours fériés (4,31 €) de ses articles 3 et 4 ne sont pas modélisées.

L'ancienneté (règle `ancienneté`, en années révolues) sélectionne le seuil applicable : la valeur du dernier seuil atteint.

La version `2025.1` modélise l'accord du **18 décembre 2024 relatif aux salaires minimaux**, applicable au **1er janvier 2025**. Son barème de rémunérations annuelles garanties a été étendu et publié au Journal officiel du **11 juin 2025**.

## Règles calculées

- Rémunérations annuelles garanties des classes 1 à 9 ;
- douze seuils d'ancienneté : embauche, puis 3 à 33 ans par pas de 3 ans ;
- comparaison conservée en `€/an` et proratisation selon la quotité de travail ;
- détection des classes hors grille.

## Audit explicite des rubriques de paie

Les textes officiels de la convention, l'accord de classifications et rémunérations, l'accord salarial dédié et son extension ont été recherchés pour :

- **Cotisations salarié/employeur, taux et assiettes** : l'accord salarial fixe seulement les rémunérations annuelles garanties ; aucun taux ni aucune assiette conventionnelle générique chiffrée n'est modifié.
- **Plafonds, tranches et forfaits** : aucun paramètre conventionnel calculable n'est fixé par le texte salarial ; omission documentée.
- **Santé et prévoyance** : aucun taux ou montant chiffré, universel et applicable sans choix de régime n'est ajouté.
- **Retraite complémentaire et supplémentaire** : aucun taux ou assiette n'est modifié par l'accord salarial.
- **Formation professionnelle** : aucune contribution additionnelle calculable n'est créée par ce texte.
- **AT/MP** : aucun taux conventionnel ; la tarification relève du régime réglementaire et de l'activité.
- **Primes, indemnités, avantages, exonérations et frais** : non calculés sans paramètres contractuels ou de situation sûrs ; ils ne sont pas inclus automatiquement dans le minimum annuel.

Ces omissions sont intentionnelles : aucun taux salarié/employeur, base, plafond, tranche ou forfait n'est inventé ou mis à zéro.

## Sources officielles

- [Convention collective nationale de la branche ferroviaire — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000033373201)
- [Accord du 6 décembre 2021 relatif aux classifications et rémunérations — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000045396776)
- Accord du 18 décembre 2024 relatif aux salaires minimaux, BOCC 2025-07 TRA, et arrêté d'extension publié au Journal officiel du 11 juin 2025.
