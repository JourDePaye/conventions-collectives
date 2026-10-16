# Coopération maritime — IDCC 2494

Les versions `2026.1` et `2026.2` modélisent l'accord du **31 mars 2026** relatif aux salaires minima conventionnels au 1er avril 2026. L'accord a été étendu par arrêté du **11 juin 2026**, publié au Journal officiel le **27 juin 2026** ; son application générale est donc modélisée à compter du **1er juillet 2026**.

La version `2026.2` corrige la version `2026.1` (même date d'effet, la révision la plus haute l'emporte) : le niveau 7, échelon A, est de **37 220 €** par an selon l'article 2 de l'accord (et non 36 220 €). Les 14 autres montants sont inchangés.

La valeur Publicodes est `coopération maritime` et les règles sont sous `salarié . convention collective . coopération maritime`.

## Règles implémentées

- `niveau et échelon` reçoit la classification contractuelle : `1.1` à `3.3`, `4`, `5`, `6.A`, `6.B`, `7.A`, `7.B`, `8` ou `9`.
- `grille annuelle` expose les minima bruts annuels de l'accord, sur la base de 35 heures hebdomadaires.
- `salaire minimum annuel conventionnel` expose le minimum annuel proratisé par `salarié . contrat . temps de travail . quotité`. Le texte fixe une garantie annuelle : aucune conversion mensuelle n'est inventée.
- Pour les niveaux 6 et 7, `A` correspond à moins de trois ans d'ancienneté dans la fonction et `B` à partir de trois ans ; cette ancienneté est fournie dans la classification (`6.A`, `6.B`, `7.A`, `7.B`) et n'est pas déduite automatiquement.
- `niveau hors grille` signale une classification absente ; l'endpoint minimum retourne alors zéro.

## Périmètre paie audité

L'accord salarial fixe une garantie annuelle et précise les éléments de rémunération pris en compte pour la comparaison. Le modèle expose uniquement cette garantie, car les éléments effectivement versés, les absences, les primes, le treizième mois, la rémunération variable, le temps de travail décompté et les autres modalités de comparaison nécessitent des données de paie qui ne sont pas des entrées génériques du modèle. Les cotisations de santé, prévoyance, formation, AT/MP, les primes d'ancienneté et les indemnités ne sont pas remplacées sans taux ou assiette calculables et explicitement prévus par cet accord salarial.

## Sources officielles

- Convention collective nationale de la coopération maritime du 7 décembre 2004, IDCC 2494, conteneur KALI `KALICONT000018563634`.
- Accord du 31 mars 2026 relatif aux salaires minima conventionnels au 1er avril 2026, `KALITEXT000054426738` (BO 2026-18), publié dans les textes de la convention sur Légifrance.
- Arrêté du 11 juin 2026 portant extension de l'accord, publié au JORF du 27 juin 2026.

## Limites

La version couvre la grille étendue à compter du 1er juillet 2026. L'avenant ultérieur du 8 juillet 2026, publié et étendu après cette grille, fera l'objet d'une version distincte lorsqu'il sera ajouté ; la version publiée ici reste immuable.
