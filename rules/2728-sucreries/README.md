# Sucreries, sucreries-distilleries et raffineries de sucre — IDCC 2728

La version `2026.2` modélise l'avenant n° 17 du **7 avril 2026** relatif aux rémunérations minimales annuelles garanties au **1er avril 2026**. La grille comporte les classes/groupes `1A` à `7B`, puis `8`, `9` et `10`.

La valeur Publicodes est `sucreries` et les règles sont sous `salarié . convention collective . sucreries`.

## Périmètre juridique

- À compter du **1er avril 2026**, la version lie les employeurs adhérents d'une organisation signataire.
- À compter du **27 juin 2026**, date de publication de l'arrêté d'extension indiqué par Légifrance, le modèle accepte tous les employeurs, adhérents ou non.
- Métadonnée `extension: 2026-06-27` ; plus aucune entrée d'adhésion ni de date dans les règles.
- La classe est fournie par l'application. Le modèle ne la déduit pas du poste et ne couvre pas les classifications hors de la grille.

## Règles implémentées

- `grille annuelle` fournit les 17 montants annuels de l'accord, de 23 005,08 € (1A) à 61 807,31 € (10).
- `rémunération spécifique` fournit les minima annuels des agents de maîtrise et techniciens confirmés (31 370,10 €), ingénieurs et cadres confirmés (43 208,27 €) et cadres supérieurs (80 043,76 €), avec la condition de confirmation fournie explicitement pour les deux premières catégories.
- `montant de la prime de panier` fournit 6,02 € pour un poste de 8 heures et 7,59 € pour un poste de plus de 8 heures ; `prime de panier` multiplie ce montant par le nombre de postes renseigné.
- `prime de vacances` expose le forfait brut de 520,26 €.
- `salaire minimum annuel conventionnel` expose le minimum en `€/an`, sans inventer de conversion mensuelle.
- Les classes hors grille et les périodes ou champs juridiques non couverts rendent l'endpoint inapplicable.

## Sources officielles

- Avenant n° 17 du 7 avril 2026 relatif aux rémunérations minimales annuelles garanties, texte KALI `KALITEXT000054802118`.
- Convention collective nationale des sucreries, sucreries-distilleries et raffineries de sucre, IDCC 2728, conteneur KALI `KALICONT000005635183`.
- Arrêté d'extension publié au Journal officiel le 27 juin 2026, selon les métadonnées officielles de la convention sur Légifrance.

## Limites

Le modèle ne compare pas les éléments de rémunération effectivement versés avec le minimum annuel et ne modélise pas les primes, avantages, ancienneté, absences, temps partiel, treizième mois ou modalités de comparaison prévues par la convention. Les versions antérieures ne sont pas modélisées.
