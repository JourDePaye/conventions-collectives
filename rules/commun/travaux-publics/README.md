# Travaux publics — fichier commun aux IDCC 1702, 2614 et 3212

Les fichiers [2026.4](travaux-publics.2026.4.publicodes) et [2026.5](travaux-publics.2026.5.publicodes) sont publiés à l'identique comme versions `2026.4` et `2026.5` (la `2026.5`, de même date d'effet, l'emporte : elle ajoute les indemnités de petits déplacements, voir plus bas) des trois conventions des travaux publics : ouvriers ([1702](../../1702-travaux-publics-ouvriers/README.md)), ETAM ([2614](../../2614-travaux-publics-etam/README.md)) et cadres ([3212](../../3212-travaux-publics-cadres/README.md)). Ses métadonnées listent ces conventions (`agreements`) ; `versions.lock.json` a une entrée par convention, avec la même empreinte.

modele-social n'a pas de convention des travaux publics. Ses règles du bâtiment (`salarié . convention collective . BTP`, valeur `BTP`, catégories `ouvrier`, `etam` et `cadre`) portent les régimes communs au BTP : prévoyance PRO BTP (RNPO, RNPE, RNPC, les mêmes pour le bâtiment et les travaux publics d'après la notice PRO BTP 2026), répartition de la retraite complémentaire des ETAM, OPPBTP. La version les complète et les corrige pour les travaux publics, sans redéfinir de règle de modele-social. Elle partage les noms de règles de la version commune du bâtiment (`rules/commun/batiment`) : une entreprise relève de l'une ou de l'autre.

`validFrom` est le 1er janvier 2026, date du taux de la CNETP repris. Les versions antérieures de chaque convention ne sont plus utilisées : un consommateur qui choisit la version par date doit partir de `2026.4`.

## Valeur de convention propre (2026.6)

La version `2026.6` (même `validFrom`, elle l'emporte sur la `2026.5`, dont elle reprend les grilles, les taux et les petits déplacements) a sa propre valeur de convention, `salarié . convention collective = 'bâtiment et travaux publics'`, et ses règles sont sous `salarié . convention collective . bâtiment et travaux publics` : elle s'utilise à la place de la convention `BTP` de modele-social, dont aucune règle ne s'applique alors. Les règles ont les mêmes noms pour le bâtiment et les travaux publics (une entreprise relève de l'un ou de l'autre). Elle reprend les règles du BTP de modele-social, vérifiées sur Légifrance :

- `catégorie` (`ouvrier`, `etam` ou `cadre`) ; un cadre a le statut cadre.
- `catégorie . ouvrier . prévoyance RNPO` : 1,72 % pour l'employeur et 0,87 % pour l'ouvrier (taux de référence de 2,59 %, articles 5.1 et 5.3 de l'accord du 31 juillet 1968 dans la rédaction de l'avenant n° 59 du 20 mars 2018, [KALITEXT000037482425](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000037482425)).
- `catégorie . etam . prévoyance RNPE` : 1,25 % pour l'employeur (1,20 % et une cotisation additionnelle temporaire de 0,05 %) et 0,60 % pour l'ETAM (articles 5.1 et 5.3 de l'accord du 13 décembre 1990 dans la rédaction de l'avenant n° 34 du 20 mars 2018, [KALITEXT000037482365](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000037482365)).
- Ces deux cotisations sont assises sur la base des cotisations de sécurité sociale limitée à trois plafonds, primes comprises : modele-social prenait le seul salaire de base du contrat.
- `catégorie . etam` : répartition de la retraite complémentaire des ETAM (tranche 1 : 4,47 % employeur et 3,40 % salarié ; tranche 2 : 12,70 % et 8,89 %), reprise de modele-social sans avoir pu être vérifiée sur Légifrance : l'article 5 de l'accord du 13 décembre 1990 sur la retraite des ETAM ([KALITEXT000005643281](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000005643281)) ne fixe que l'ancien taux contractuel.
- `OPPBTP` : 0,11 % des salaires versés, y compris les indemnités de congés payés versées par la caisse, estimées comme dans modele-social à 13,14 % du salaire (arrêté du 12 décembre 2025, [JORFTEXT000053096376](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053096376)).
- Pas d'indemnité compensatrice de congés payés en fin de CDD : la caisse de congés payés verse les congés (code du travail, articles L. 1242-16 et L. 3141-32).
- `cotisations employeur` ajoute aux cotisations employeur la cotisation congés payés, l'OPPBTP et la cotisation chômage intempéries.

Non repris : le taux AT/MP des fonctions support propre au BTP (un taux de tarification des risques professionnels, pas une règle de la convention) ; c'est la règle générale de modele-social qui s'applique.

## Corrections de modele-social

- `cotisation congés payés` remplace `congés intempéries`, qui applique les taux des caisses CIBTP du bâtiment : les entreprises de travaux publics cotisent à la CNETP, 21 % depuis le 1er janvier 2026 (20,20 % auparavant).
- `chômage intempéries` : 0,68 % du salaire plafonné à la sécurité sociale, le taux des entreprises du gros œuvre et des travaux publics, ajouté aux cotisations employeur. `sous l'abattement` l'annule tant que la masse salariale de l'entreprise ne dépasse pas l'abattement annuel (96 168 € pour la campagne 2026-2027).
- `catégorie . cadre . prévoyance RNPC` : comme pour le bâtiment, 1,50 % de la tranche A pour l'employeur, qui vaut cotisation de prévoyance des cadres, et 2,40 % de la tranche B partagés à parts égales ; pas de tranche C.

## Salaires minima hiérarchiques

- `région` : la région de l'établissement. `classification` : le coefficient de l'ouvrier (100, 110, 125, 140, 150, 165, 180, soit les positions I-1 à IV) ou le niveau de l'ETAM (A à H). `forfait jours` : le salarié a une convention de forfait annuel en jours.
- Les minima sont annuels, pour 35 heures, en `€/an` ; `salaire minimum conventionnel` les proratise selon la quotité de travail. Chaque grille s'applique de la publication de son arrêté d'extension au 31 décembre 2026 : les accords fixent les minima « pour 2026 ».

| Région | Extension (JORF) | Ouvriers (100 à 180) | ETAM (A à H) | ETAM F à H au forfait jours |
|---|---|---|---|---|
| Bourgogne-Franche-Comté | 5 mars 2026 | 23 287 € à 34 182 € | 23 287 € à 39 824 € | 40 321 €, 44 761 €, 45 797 € |
| Bretagne | 24 février 2026 | 23 863 € à 34 529 € | 23 941 € à 41 936 € | 40 883 €, 45 673 €, 48 226 € |
| Centre-Val de Loire | 20 mars 2026 | 22 893 € à 32 166 € | 22 899 € à 38 985 € | 40 340 €, 43 118 €, 44 833 € |
| Grand Est | 20 mars 2026 | 23 294 € à 33 525 € | 23 340 € à 40 644 € | 39 804 €, 44 655 €, 46 741 € |
| Hauts-de-France | 20 mars 2026 | 23 305 € à 34 577 € | 23 224 € à 41 203 € | 41 444 €, 45 275 €, 47 383 € |
| Île-de-France | 17 avril 2026 | 23 709 € à 34 569 € | 23 545 € à 40 624 € | 42 843 €, 45 572 €, 46 718 € |
| Normandie | 24 février 2026 | 23 462 € à 34 634 € | 23 542 € à 40 913 € | 40 226 €, 44 665 €, 47 050 € |
| Nouvelle-Aquitaine | 17 avril 2026 | 23 242 € à 34 040 € | 23 106 € à 40 138 € | 40 039 €, 44 309 €, 46 159 € |
| Occitanie | 20 mars 2026 | 23 160 € à 33 928 € | 23 057 € à 41 405 € | 41 365 €, 45 317 €, 47 616 € |
| Pays de la Loire | 4 septembre 2026 | 23 537 € à 34 619 € | 23 535 € à 42 412 € | 40 534 €, 45 330 €, 48 774 € |

Les identifiants KALITEXT des accords et leurs arrêtés d'extension sont dans les sources de la version ; les montants de chaque coefficient et de chaque niveau dans la description de chaque règle `grille . …`.

## Petits déplacements (version `2026.5`)

La version `2026.5` ajoute le régime des petits déplacements des travaux publics (chapitre VIII-1 de la convention collective nationale des ouvriers du 15 décembre 1992) : pour chaque jour de chantier, une indemnité de trajet et une indemnité de transport selon la zone concentrique du chantier, et une indemnité de repas ; les ETAM non sédentaires perçoivent l'indemnité de repas et l'indemnité de transport (article 7.1.9 de la convention des ETAM). Mêmes entrées et même traitement social que pour le bâtiment (voir le README de `rules/commun/batiment`).

Les accords fixent les barèmes pour 2026 : chacun s'applique de la publication de son arrêté d'extension au 31 décembre 2026. Aucun barème en Auvergne-Rhône-Alpes, en Provence-Alpes-Côte d'Azur et en Corse (derniers accords pour 2024), ni avant l'extension de l'accord de 2026 de chaque région.

| Barème | Départements | Période | Repas | Zones |
|---|---|---|---|---|
| Île-de-France | 75, 77, 78, 91, 92, 93, 94, 95 | du 17/04/2026 au 01/01/2027 (exclu) | 14,00 € | 1, 2, 3, 4, 5, 6 |
| Aquitaine | 24, 33, 40, 47, 64 | du 17/04/2026 au 01/01/2027 (exclu) | 14,20 € | 1, 2, 3, 4, 5 |
| Limousin | 19, 23, 87 | du 17/04/2026 au 01/01/2027 (exclu) | 14,20 € | 1A, 1B, 2, 3, 4, 5, 6 |
| Poitou-Charentes | 16, 17, 79, 86 | du 17/04/2026 au 01/01/2027 (exclu) | 14,20 € | 1A, 1B, 2, 3, 4, 5 |
| Centre-Val de Loire | 18, 28, 36, 37, 41, 45 | du 20/03/2026 au 01/01/2027 (exclu) | 14,30 € | 1, 2, 3, 4, 5, 6, 7 |
| Bretagne | 22, 29, 35, 56 | du 24/02/2026 au 01/01/2027 (exclu) | 14,50 € | 1, 2, 3, 4, 5 |
| Bourgogne | 21, 58, 71, 89 | du 05/03/2026 au 01/01/2027 (exclu) | 13,50 € | 1, 2, 3, 4, 5 |
| Franche-Comté | 25, 39, 70, 90 | du 05/03/2026 au 01/01/2027 (exclu) | 13,50 € | 1, 2, 3, 4, 5, 6 |
| Occitanie | 09, 11, 12, 30, 31, 32, 34, 46, 48, 65, 66, 81, 82 | du 20/03/2026 au 01/01/2027 (exclu) | 14,10 € | 1, 2, 3, 4, 5 |
| Hauts-de-France | 02, 59, 60, 62, 80 | du 20/03/2026 au 01/01/2027 (exclu) | 14,40 € | 1, 2, 3, 4, 5 |
| Pays de la Loire | 44, 49, 53, 72, 85 | du 04/09/2026 au 01/01/2027 (exclu) | 14,50 € | 1, 2, 3, 4, 5 |
| Grand Est (Alsace) | 67, 68 | du 20/03/2026 au 01/01/2027 (exclu) | 13,80 € | 1, 2, 3, 4, 5, 6 |
| Grand Est (hors Alsace) | 08, 10, 51, 52, 54, 55, 57, 88 | du 20/03/2026 au 01/01/2027 (exclu) | 13,80 € | 1, 2, 3, 4, 5 |
| Normandie | 14, 27, 50, 61, 76 | du 24/02/2026 au 01/01/2027 (exclu) | 14,50 € | 1, 2, 3, 4, 5 |

Au Centre-Val de Loire, les zones 6 et 7 n'ont qu'une indemnité de trajet ; en Grand Est, la zone 6 (au-delà de 50 km) ne vaut que pour l'Alsace ; dans le Limousin, la zone 6 (de 50 à 60 km) fait l'objet d'un accord à part.

## Limites

- Auvergne-Rhône-Alpes et Provence-Alpes-Côte d'Azur : les derniers accords étendus fixent les minima pour 2024 ; aucune grille en 2026, seul le SMIC s'impose. Pas d'accord pour la Corse ni l'outre-mer.
- Cadres (3212) : le dernier accord étendu fixe les minima pour 2024 (accord du 14 novembre 2023) ; aucune grille en 2026. La décision unilatérale de la FNTP et de la CNATP pour 2026 n'est pas un accord collectif et n'est pas sur Légifrance.
- Pays de la Loire : le tableau des accords du 4 décembre 2025 porte l'en-tête « Année 2025 », mais leur titre et leur article 1er fixent les salaires pour 2026.
- Les minima ne valent qu'en 2026 : un accord pour 2027, une fois étendu, entre dans une nouvelle version.
- La répartition de la retraite complémentaire des ETAM (4,47 % et 3,40 % sur la tranche 1) est celle de modele-social, au titre de l'accord du BTP du 13 décembre 1990, auquel renvoie la convention des ETAM des travaux publics ; l'OPPBTP est celle de modele-social (0,11 % du salaire majoré de 13,14 %).
