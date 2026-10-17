# Personnel des agences générales d'assurances — IDCC 2335

La version `2026.1` modélise l'avenant n° 6 du **11 décembre 2025** relatif aux salaires minima annuels bruts au **1er janvier 2026**. La grille comporte les classes 1 à 6 et la classe 5 bis.

La version `2026.2` modélise l'avenant n° 7 du **27 mai 2026** (`KALITEXT000054982041`) : après la hausse du SMIC du 1er juin 2026, la classe 1 passe de 23 194 € à **23 524 €** (+ 1,4 %) au **1er juin 2026** ; les autres classes sont inchangées. Il est étendu par arrêté du 7 septembre 2026 (JORF n° 0219 du **19 septembre 2026**, `JORFTEXT000054860951`, effet à la date de publication) : `extension: 2026-09-19`.

La valeur Publicodes est `agences générales assurances` et les règles sont sous `salarié . convention collective . agences générales assurances`.

## Périmètre juridique

- À compter du **1er janvier 2026**, la version lie les employeurs adhérents d'une organisation signataire.
- À compter du **19 mars 2026**, date de publication de l'arrêté d'extension indiqué par Légifrance, le modèle accepte tous les employeurs, adhérents ou non.
- Métadonnée `extension: 2026-03-19` ; plus aucune entrée d'adhésion ni de date dans les règles.
- La classe de classification est fournie par l'application. Le modèle ne la déduit pas du poste et ne couvre pas les catégories hors de la grille.

## Règles implémentées

- `grille annuelle` fournit les sept montants de l'avenant : de 23 194 € (classe 1) à 44 383 € (classe 6), avec la classe 5 bis à 39 206 €.
- `salaire minimum annuel conventionnel` expose le minimum en `€/an`, sans inventer de conversion mensuelle.
- Les classes hors grille et les périodes ou champs juridiques non couverts rendent l'endpoint inapplicable.

## Sources officielles

- Avenant n° 6 du 11 décembre 2025 relatif aux salaires minima au 1er janvier 2026, texte KALI `KALITEXT000054040577`.
- Avenant n° 7 du 27 mai 2026 relatif aux salaires minima au 1er juin 2026, texte KALI `KALITEXT000054982041`, étendu par arrêté du 7 septembre 2026 (JORF du 19 septembre 2026).
- Convention collective nationale du personnel des agences générales d'assurances, IDCC 2335, conteneur KALI `KALICONT000005635361`, qui indique l'extension par arrêté du 13 mars 2026 publié au Journal officiel le 19 mars 2026.

## Limites

Le modèle ne compare pas les éléments de rémunération effectivement versés avec le minimum annuel et ne modélise pas les primes, avantages, ancienneté, absences, temps partiel, treizième mois ou modalités de comparaison prévues par la convention. Les versions antérieures ne sont pas modélisées.
