# Sucreries, sucreries-distilleries et raffineries de sucre — IDCC 2728

La version `2026.1` modélise l'accord du **11 février 2026** relatif aux salaires minima annuels bruts au **1er avril 2026**. La grille comporte les classes/groupes `1A` à `7B`, puis `8`, `9` et `10`.

La valeur Publicodes est `sucreries` et les règles sont sous `salarié . convention collective . sucreries`.

## Périmètre juridique

- À compter du **1er avril 2026**, le modèle accepte l'accord pour un `champ juridique` égal à `employeur signataire ou adhérent`.
- À compter du **27 juin 2026**, date de publication de l'arrêté d'extension indiqué par Légifrance, le modèle accepte `tous employeurs après extension`.
- Aucun champ juridique ni aucune date ne sont supposés : sans valeurs explicites, le calcul reste inapplicable.
- La classe est fournie par l'application. Le modèle ne la déduit pas du poste et ne couvre pas les classifications hors de la grille.

## Règles implémentées

- `grille annuelle` fournit les 17 montants annuels de l'accord, de 23 005,08 € (1A) à 61 807,31 € (10).
- `salaire minimum annuel conventionnel` expose le minimum en `€/an`, sans inventer de conversion mensuelle.
- Les classes hors grille et les périodes ou champs juridiques non couverts rendent l'endpoint inapplicable.

## Sources officielles

- Accord du 11 février 2026 relatif aux salaires minima annuels, texte KALI `KALITEXT000052643609`.
- Convention collective nationale des sucreries, sucreries-distilleries et raffineries de sucre, IDCC 2728, conteneur KALI `KALICONT000005635183`.
- Arrêté d'extension publié au Journal officiel le 27 juin 2026, selon les métadonnées officielles de la convention sur Légifrance.

## Limites

Le modèle ne compare pas les éléments de rémunération effectivement versés avec le minimum annuel et ne modélise pas les primes, avantages, ancienneté, absences, temps partiel, treizième mois ou modalités de comparaison prévues par la convention. Les versions antérieures ne sont pas modélisées.
