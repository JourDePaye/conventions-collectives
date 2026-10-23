# Rouissage-teillage de lin — IDCC 1659

La version `2024.1` modélise les rémunérations minima garanties mensuelles applicables au **1er janvier 2024** pour 151,67 heures. Elle reprend l'avenant n° 37 du 10 janvier 2024, étendu par arrêté publié au Journal officiel du 17 juillet 2024. Les montants officiels sont ceux de l'annexe salariale, pour les coefficients 120 à 600.

La version `2025.1` reprend l'avenant n° 38 du 19 février 2025, qui revalorise de 2,3 % les barèmes de l'avenant n° 37 au **1er mars 2025** (Légifrance `KALITEXT000051664798`, étendu par arrêté du 15 juillet 2025 publié au Journal officiel du 16 juillet 2025). Les 14 coefficients sont inchangés.

La valeur Publicodes est `rouissage teillage lin` et les règles sont sous `salarié . convention collective . rouissage teillage lin`.

## Règles implémentées

- `salaire minimum conventionnel` expose les 14 rémunérations minima mensuelles de l'annexe 2024, pour 151,67 heures.
- Le minimum est proratisé selon `contrat . temps de travail . quotité`.
- Les coefficients absents de l'annexe rendent le minimum nul et exposent `coefficient hors grille` à `vrai`.
- `audit paie` signale explicitement le périmètre de l'audit sans remplacer les règles générales de paie.

## Audit explicite des rubriques de paie

Les textes officiels et les avenants dédiés du conteneur IDCC 1659 ont été recherchés pour les **taux de cotisations salarié et employeur**, leurs **assiettes**, **plafonds**, **tranches**, **forfaits** et **exonérations**, ainsi que pour la **complémentaire santé**, la **prévoyance**, la **retraite complémentaire et supplémentaire**, la **formation professionnelle**, l'**AT/MP**, les **primes**, **indemnités**, **avantages en nature** et **frais**, avec vérification des arrêtés d'extension.

La version ne redéfinit aucune règle de cotisation de `modele-social` : les textes conventionnels examinés ne fournissent pas, dans un format suffisamment déterminé par les seules entrées de ce modèle, un taux et une assiette génériques calculables pour l'ensemble des salariés. Les cotisations santé/prévoyance et les garanties associées dépendent notamment du régime, des catégories et du contrat ; la formation, l'AT/MP, la retraite, les exonérations et les frais relèvent principalement du droit commun ou de paramètres externes. Les primes, indemnités, avantages, apprentissage, maintien de salaire et indemnités de rupture nécessitent des entrées dédiées et ne sont donc pas calculés automatiquement. Ces omissions sont intentionnelles, documentées et testées par isolation ; elles ne signifient pas que les obligations légales sont nulles.

## Sources officielles

- Avenant n° 37 du 10 janvier 2024 relatif aux salaires, article 1er, Légifrance `KALIARTI000049271188` : revalorisation de 3,5 % au 1er janvier 2024.
- Annexe salariale de l'avenant n° 37, publiée dans le texte officiel Légifrance `KALITEXT000005654162` / conteneur `KALICONT000005635927`.
- Arrêté du 11 juillet 2024 portant extension de l'avenant n° 37, publié au Journal officiel n° 0169 du 17 juillet 2024 (JORFTEXT000050002868) ; l'avenant salarial est étendu à tous les employeurs et salariés du champ IDCC 1659.
- Convention collective nationale du rouissage-teillage de lin du 28 janvier 1992, IDCC 1659, conteneur Légifrance `KALICONT000005635927`.

## Tests

`test/rouissage-teillage-lin-1659.test.ts` vérifie les 14 cellules de la grille, la date et les sources, la proratisation, le coefficient hors grille, l'audit paie et l'isolation vis-à-vis de `modele-social`.
