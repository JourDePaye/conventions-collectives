# Entreprises de pompes funèbres — IDCC 759

Le fichier [2020.4](0759-pompes-funebres.2020.4.publicodes) modélise la grille étendue au 1er janvier 2020 de l’accord du 13 février 2020 relatif aux salaires pour l’année 2020. La convention nationale des pompes funèbres du 1er mars 1974 couvre les entreprises exerçant principalement une activité de pompes funèbres et/ou de soins aux défunts sur le territoire métropolitain et les DOM.

## Versions

- [2020.4](0759-pompes-funebres.2020.4.publicodes) : grille de l'accord du 13 février 2020, avec le niveau I.1 à 1 550 € quelle que soit l'ancienneté (erreur : le texte donne des paliers).
- [2020.5](0759-pompes-funebres.2020.5.publicodes) : même date d'effet (1er janvier 2020), remplace 2020.4 ; le niveau I.1 a ses paliers (1 550, 1 593, 1 613, 1 655, 1 704, 1 747, 1 800).
- 2021.1 (accord du 14 janvier 2021), 2023.1 (accord du 1er février 2023), 2024.1 (avenant du 17 janvier 2024), 2025.1 (avenant du 14 janvier 2025) et [2026.1](0759-pompes-funebres.2026.1.publicodes) (avenant du 13 janvier 2026, étendu par arrêté du 7 avril 2026, JORF du 10 avril 2026) : barèmes au 1er janvier de chaque année, mêmes clés. Aucun barème de 2022 n'a été trouvé dans les textes salaires de Légifrance.
- Le niveau I n'a pas de position dans les textes de 2023 à 2026 ; le modèle le saisit toujours avec la position 1.
- Un accord paritaire du 28 avril 2026 sur les classifications des emplois (KALITEXT000054871929) n'a pas été lu et n'est pas modélisé.

## Règles implémentées

- `niveau`, `position` et `ancienneté dans l'emploi` sont saisis selon la classification réellement attribuée.
- `salaire minimum conventionnel temps plein` applique les 13 combinaisons de niveaux I à VII et les paliers d’ancienneté à 3, 5, 10, 15, 20 et 25 ans publiés dans l’annexe de l’accord.
- `salaire minimum conventionnel` prorate le minimum mensuel selon la quotité de travail.

## Audit paie et limites

L’accord précise que la comparaison du minimum inclut certains éléments fixes et mensuels (notamment gratifications, avantages en nature et primes issues d’un usage, d’un accord d’entreprise ou du contrat), au prorata du temps de présence, mais exclut les heures supplémentaires, primes d’assiduité et d’ancienneté et remboursements de frais. Ces rubriques ne sont pas automatiquement calculées : le modèle expose uniquement le minimum de grille afin de ne pas inventer une assiette.

La convention comporte également des dispositions de prévoyance, santé, formation, indemnités et primes liées à l’activité. Aucun taux ou forfait suffisamment déterminé et directement rattaché à la grille salariale n’est ajouté ici ; ces obligations restent à auditer et à renseigner séparément.

## Sources officielles

- [Accord du 13 février 2020 relatif aux salaires — article 2](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000042131979)
- [Annexe de l’accord du 13 février 2020](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000042132002)
- [Convention collective nationale des pompes funèbres — IDCC 759](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635490)
- [Données KALI de la DILA](https://echanges.dila.gouv.fr/OPENDATA/KALI/)
