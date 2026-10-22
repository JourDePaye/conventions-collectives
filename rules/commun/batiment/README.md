# Bâtiment — fichier commun aux IDCC 1596, 1597, 2609 et 2420

Les fichiers [2026.4](batiment.2026.4.publicodes), [2026.5](batiment.2026.5.publicodes) et [2026.6](batiment.2026.6.publicodes) sont publiés à l'identique comme versions `2026.4`, `2026.5` et `2026.6` des quatre conventions du bâtiment : ouvriers des entreprises occupant jusqu'à 10 salariés ([1596](../../1596-batiment-ouvriers-petites-entreprises/README.md)) et plus de 10 salariés ([1597](../../1597-batiment-ouvriers-plus-de-10/README.md)), ETAM ([2609](../../2609-batiment-etam/README.md)) et cadres ([2420](../../2420-batiment-cadres/README.md)). Leurs métadonnées listent ces conventions (`agreements`) ; `versions.lock.json` a une entrée par convention, avec la même empreinte.

- `2026.4` : les corrections de modele-social et quatre grilles régionales.
- `2026.7` (même `validFrom`, elle l'emporte) : la `2026.6` sous sa propre valeur de convention (voir ci-dessous).
- `2026.6` (même `validFrom`) : la `2026.5` et les indemnités de petits déplacements des ouvriers (voir plus bas).
- `2026.5` : les mêmes corrections et la grille du dernier accord régional étendu de chaque région, pour les ouvriers et les ETAM ; la grille des ouvriers de Nouvelle-Aquitaine s'applique aussi aux entreprises jusqu'à 10 salariés (l'accord du 22 octobre 2025 vise les IDCC 1596 et 1597), alors que `2026.4` la réservait aux entreprises de plus de 10 salariés.

modele-social n'a qu'une convention du bâtiment, `salarié . convention collective . BTP` (valeur `BTP`), avec ses catégories `ouvrier`, `etam` et `cadre` : une entreprise y relève d'une seule convention, alors que ses salariés relèvent de l'une ou l'autre des quatre selon leur catégorie. La version commune complète et corrige cette convention pour toute l'entreprise, quel que soit l'IDCC déclaré, sans redéfinir de règle de modele-social.

`validFrom` est le 1er janvier 2020 : les taux et les grilles sont datés dans les règles (`date`), avec les taux de modele-social avant 2026. Les versions antérieures de chaque convention ne sont plus utilisées : un consommateur qui choisit la version par date doit partir de `2026.4`, puis prend la plus récente des deux.

## Valeur de convention propre (2026.7)

La version `2026.7` (même `validFrom`, elle l'emporte sur la `2026.6`, dont elle reprend les grilles, les taux et les petits déplacements) a sa propre valeur de convention, `salarié . convention collective = 'bâtiment et travaux publics'`, et ses règles sont sous `salarié . convention collective . bâtiment et travaux publics` : elle s'utilise à la place de la convention `BTP` de modele-social, dont aucune règle ne s'applique alors. Les règles ont les mêmes noms pour le bâtiment et les travaux publics (une entreprise relève de l'un ou de l'autre). Elle reprend les règles du BTP de modele-social, vérifiées sur Légifrance :

- `catégorie` (`ouvrier`, `etam` ou `cadre`) ; un cadre a le statut cadre.
- `catégorie . ouvrier . prévoyance RNPO` : 1,72 % pour l'employeur et 0,87 % pour l'ouvrier (taux de référence de 2,59 %, articles 5.1 et 5.3 de l'accord du 31 juillet 1968 dans la rédaction de l'avenant n° 59 du 20 mars 2018, [KALITEXT000037482425](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000037482425)).
- `catégorie . etam . prévoyance RNPE` : 1,25 % pour l'employeur (1,20 % et une cotisation additionnelle temporaire de 0,05 %) et 0,60 % pour l'ETAM (articles 5.1 et 5.3 de l'accord du 13 décembre 1990 dans la rédaction de l'avenant n° 34 du 20 mars 2018, [KALITEXT000037482365](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000037482365)).
- Ces deux cotisations sont assises sur la base des cotisations de sécurité sociale limitée à trois plafonds, primes comprises : modele-social prenait le seul salaire de base du contrat.
- `catégorie . etam` : répartition de la retraite complémentaire des ETAM (tranche 1 : 4,47 % employeur et 3,40 % salarié ; tranche 2 : 12,70 % et 8,89 %), reprise de modele-social sans avoir pu être vérifiée sur Légifrance : l'article 5 de l'accord du 13 décembre 1990 sur la retraite des ETAM ([KALITEXT000005643281](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000005643281)) ne fixe que l'ancien taux contractuel.
- `OPPBTP` : 0,11 % des salaires versés, y compris les indemnités de congés payés versées par la caisse, estimées comme dans modele-social à 13,14 % du salaire (arrêté du 12 décembre 2025, [JORFTEXT000053096376](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053096376)).
- Pas d'indemnité compensatrice de congés payés en fin de CDD : la caisse de congés payés verse les congés (code du travail, articles L. 1242-16 et L. 3141-32).
- `cotisations employeur` ajoute aux cotisations employeur la cotisation congés payés, l'OPPBTP et la cotisation chômage intempéries. La caisse de congés payés de rattachement se saisit dans `cotisation congés payés . caisse de rattachement` (mêmes valeurs que modele-social).

Non repris : le taux AT/MP des fonctions support propre au BTP (un taux de tarification des risques professionnels, pas une règle de la convention) ; c'est la règle générale de modele-social qui s'applique.

## Corrections de modele-social

- `cotisation congés payés` remplace `congés intempéries` (qui ne contient que la cotisation congés payés) : taux de la caisse de rattachement (`congés intempéries . caisse de rattachement`, valeurs de modele-social) à la date de la période. En octobre 2026 : Île-de-France 20,20 %, Nord-Ouest 20,70 %, Grand-Ouest 20,70 %, Centre et Centre-Ouest 20,70 %, Grand Est 20,35 %, Rhône-Alpes Auvergne 20,30 %, Méditerranée 19,60 %, Sud-Ouest 20,20 % ; Nord-Ouest 22,85 % et Grand-Ouest 21,95 % au 1er novembre 2026. Avant 2026, les taux de modele-social, sauf Grand-Ouest (19,70 % depuis le 1er avril 2023).
- `chômage intempéries` : 0,68 % (`catégorie` = `gros œuvre et travaux publics`) ou 0,13 % (`second œuvre`) du salaire plafonné à la sécurité sociale, 0 % pour une activité `non assujettie` (valeur par défaut). La catégorie est celle sous laquelle la caisse CIBTP a affilié l'entreprise. L'abattement annuel par entreprise ne se calcule pas sur une paie : `sous l'abattement` annule la cotisation tant que la masse salariale ne l'a pas dépassé. Elle est ajoutée aux cotisations employeur de modele-social (`OPPBTP et chômage intempéries` remplace la référence à `OPPBTP` dans `cotisations employeur`).
- `catégorie . cadre . prévoyance RNPC` : 1,50 % de la tranche A pour l'employeur, qui vaut cotisation de prévoyance des cadres (`prévoyances . employeur . cadres` n'est plus ajoutée), et 2,40 % de la tranche B partagés à parts égales ; pas de tranche C, qui est une option de PRO BTP.

## Salaires minima

- `région` : la région de l'établissement (13 régions métropolitaines, `non renseignée` par défaut, et pour l'outre-mer). `classification` : le coefficient de l'ouvrier (150 à 270) ou le niveau de l'ETAM (A à H). `jusqu'à 10 salariés` se déduit de l'effectif de modele-social (`entreprise . salariés . effectif`).
- Grilles de la version `2026.5`, lues sur Légifrance le 20 octobre 2026, pour 35 heures, chacune à partir de la date à laquelle elle lie toutes les entreprises (publication de l'arrêté d'extension, ou date d'effet si elle est postérieure). Une grille commune aux deux conventions des ouvriers s'applique quel que soit l'effectif.

| Région | Ouvriers (coefficients 150 à 270) | ETAM (niveaux A à H) |
|---|---|---|
| Auvergne-Rhône-Alpes | accord du 14 janvier 2026, à partir du 17 avril 2026 : 1 824 € à 2 597,13 € | accord du 14 janvier 2026, à partir du 17 avril 2026 : 1 834 € à 3 341,81 € |
| Bourgogne-Franche-Comté | accord du 30 avril 2026, à partir du 4 septembre 2026 : 1 850 € à 2 518 €, puis au 1er janvier 2027 : 1 859 € à 2 531 € | accord paritaire du 30 avril 2026, à partir du 4 septembre 2026 : 1 850 € à 3 227 €, puis au 1er janvier 2027 : 1 859 € à 3 243 € |
| Bretagne | accord du 27 novembre 2025, à partir du 5 février 2026 : 1 863,43 € à 2 574,41 € | accord du 27 novembre 2025, à partir du 5 février 2026 : 1 857 € à 3 354 € |
| Centre-Val de Loire | jusqu'à 10 salariés : avenant du 10 avril 2026 (1596), à partir du 4 août 2026 : 1 823 € à 2 412 € ; plus de 10 : avenant du 10 avril 2026 (1597), à partir du 10 juillet 2026 : 1 823 € à 2 400 € | accord du 3 février 2025, à partir du 26 avril 2025 : 1 808 € à 3 311 € (l'accord paritaire du 10 avril 2026 n'est pas étendu) |
| Corse | accord du 15 décembre 2025, à partir du 6 juin 2026 : 1 827,10 € à 2 622,44 € | accord du 15 décembre 2025, à partir du 6 juin 2026 : 1 827,10 € à 3 231,05 € |
| Grand Est | accord du 16 janvier 2025, à partir du 3 mai 2025 : 1 802,80 € à 2 578,38 € | accord du 16 janvier 2025, à partir du 3 mai 2025 : 1 870,77 € à 3 346,39 € |
| Hauts-de-France | jusqu'à 10 salariés : accord du 1er décembre 2025 (1596), à partir du 28 mars 2026 : 1 832 € à 2 650 € ; plus de 10 : accord du 25 novembre 2024 (1597), barème du 1er juillet 2025 : 1 808 € à 2 616 € (l'accord du 1er décembre 2025 pour 1597 n'est pas étendu) | accord du 20 novembre 2025, à partir du 28 mars 2026 : 1 838 € à 3 365 € |
| Île-de-France | accord du 5 novembre 2025, à partir du 5 février 2026 : 1 843 € à 2 510 € | accord du 5 novembre 2025, à partir du 5 février 2026 : 1 843 € à 3 357 € |
| Normandie | accord du 10 février 2026, à partir du 10 mai 2026 : 1 823,03 € à 2 527,04 € | accord du 10 février 2026, à partir du 10 mai 2026 : 1 833,19 € à 3 386,15 € |
| Nouvelle-Aquitaine | accord du 22 octobre 2025, à partir du 17 janvier 2026 : 1 838,24 € à 2 560,19 € | accord du 22 octobre 2025, à partir du 17 janvier 2026 : 1 838,24 € à 3 423,86 € |
| Occitanie | accord du 13 février 2026, à partir du 29 mai 2026 : 1 836,33 € à 2 547,01 € | accord du 13 février 2026, à partir du 29 mai 2026 : 1 847,16 € à 3 497,50 € |
| Pays de la Loire | accord du 7 novembre 2025, à partir du 1er mars 2026 : 1 832,17 € à 2 607,21 € | aucun accord rattaché à l'IDCC 2609 |
| Provence-Alpes-Côte d'Azur | accord du 30 septembre 2024, à partir du 3 janvier 2025 : 1 837,80 € à 2 680,18 € | accord du 30 septembre 2024, à partir du 3 janvier 2025 : 1 825 € à 3 310 € |

Les identifiants KALITEXT et les arrêtés d'extension sont dans les sources de la version ; les montants de chaque coefficient et de chaque niveau dans la description de chaque règle `grille . …`. La version `2026.4` n'avait que les grilles des ouvriers jusqu'à 10 salariés du Centre-Val de Loire, des ouvriers de plus de 10 salariés de Nouvelle-Aquitaine et des ETAM de Corse et d'Occitanie.

- `grille applicable` dit si une grille de la catégorie, de la région et (pour les ouvriers) de la taille de l'entreprise lie l'entreprise à la date de la période. `salaire minimum conventionnel` multiplie la grille par la quotité de travail ; il vaut 0 €/mois sans grille applicable, et seul le SMIC s'impose alors. `classification hors grille` signale une classification absente de la grille qui s'applique ; sans grille, aucune classification n'est contrôlée.
- Les cadres (2420) n'ont pas de grille : l'avenant n° 78 du 19 janvier 2026 n'est pas étendu, et une version commune ne peut pas réserver une seule de ses grilles aux adhérents d'une organisation signataire.

## Petits déplacements (version `2026.6`)

La version `2026.6` ajoute le régime des petits déplacements des ouvriers (titre VIII, chapitre 1er, des conventions collectives nationales des ouvriers du 8 octobre 1990) : pour chaque jour de chantier, une indemnité de trajet et une indemnité de transport selon la zone concentrique du chantier autour du siège, de l'agence ou du bureau, et une indemnité de repas.

- Entrées : `petits déplacements . département` (numéro du département de l'entreprise, `20` pour la Corse), `jours zone 1A` à `jours zone 7` (jours de chantier du mois dans chaque zone, telle que le barème du territoire la définit) et `repas` (indemnités de repas du mois). Les ETAM et les cadres du bâtiment n'en bénéficient pas : `saisie hors barème` signale des jours ou des repas saisis sans barème, pour un salarié qui n'en bénéficie pas, ou dans une zone que le barème n'a pas.
- Barèmes : celui du département de l'entreprise, à partir de la publication de l'arrêté d'extension (ou de la date d'effet si elle est postérieure), et depuis le 1er janvier 2026 (le barème en vigueur au début de 2026, puis son successeur). Le Centre-Val de Loire a un barème pour chaque convention des ouvriers (jusqu'à 10 salariés, plus de 10 salariés) ; dans le Rhône, la zone 1 est celle du tableau A (entreprise de la métropole de Lyon), les zones 1A et 1B celles du tableau B.
- Traitement social : l'indemnité de trajet compense une sujétion, c'est un élément de salaire (soumis à cotisations et imposable), compté parmi les primes conventionnelles de modele-social (`primes . activité . conventionnelles`). L'indemnité de transport et l'indemnité de repas sont des frais professionnels, ajoutés à ceux de modele-social et exonérés dans les limites du BOSS (§§ 1940 et 1960) : pour le transport, la moitié du barème kilométrique d'un véhicule de 4 CV pour la distance aller et retour jusqu'à la limite extérieure de la zone (au moins 100 km au-delà de 50 km) ; pour le repas, 10,40 € en 2026. La part au-delà entre dans le brut. L'exonération suppose que l'employeur ne pratique pas la déduction forfaitaire spécifique.

| Barème | Départements | Période | Repas | Zones |
|---|---|---|---|---|
| Île-de-France hors Seine-et-Marne, accord du 7 novembre 2024 | 75, 78, 91, 92, 93, 94, 95 | du 01/01/2026 au 05/02/2026 (exclu) | 11,60 € | 1, 2, 3, 4, 5, 6 |
| Seine-et-Marne, accord du 7 novembre 2024 | 77 | du 01/01/2026 au 05/02/2026 (exclu) | 11,60 € | 1, 2, 3, 4, 5, 6 |
| Île-de-France, accord du 5 novembre 2025 | 75, 77, 78, 91, 92, 93, 94, 95 | du 05/02/2026 | 11,85 € | 1, 2, 3, 4, 5, 6 |
| Bretagne, accord du 3 décembre 2024 | 22, 29, 35, 56 | du 01/01/2026 au 05/02/2026 (exclu) | 12,14 € | 1A, 1B, 2, 3, 4, 5 |
| Bretagne, accord du 27 novembre 2025 | 22, 29, 35, 56 | du 05/02/2026 | 12,30 € | 1A, 1B, 2, 3, 4, 5 |
| Hauts-de-France, accord du 25 novembre 2024 | 02, 59, 60, 62, 80 | du 01/01/2026 au 28/03/2026 (exclu) | 14,00 € | 1, 2, 3, 4, 5 |
| Hauts-de-France, accord du 1er décembre 2025 | 02, 59, 60, 62, 80 | du 28/03/2026 | 14,00 € | 1, 2, 3, 4, 5 |
| Normandie, accord du 22 janvier 2025 | 14, 27, 50, 61, 76 | du 01/01/2026 au 10/05/2026 (exclu) | 12,00 € | 1, 2, 3, 4, 5 |
| Normandie, accord du 10 février 2026 | 14, 27, 50, 61, 76 | du 10/05/2026 | 12,50 € | 1, 2, 3, 4, 5 |
| Grand Est (Alsace), accord du 16 janvier 2025 | 67, 68 | du 01/01/2026 | 11,80 € | 1, 2, 3, 4, 5 |
| Grand Est (Lorraine), accord du 16 janvier 2025 | 54, 55, 57, 88 | du 01/01/2026 | 11,80 € | 1, 2, 3, 4, 5 |
| Grand Est (Champagne-Ardenne), accord du 16 janvier 2025 | 08, 10, 51, 52 | du 01/01/2026 | 11,80 € | 1, 2, 3, 4, 5 |
| Centre-Val de Loire (plus de 10 salariés), avenant du 3 février 2025 | 18, 28, 36, 37, 41, 45 | du 01/01/2026 au 10/07/2026 (exclu) | 11,00 € | 1A, 1B, 2, 3, 4, 5 |
| Centre-Val de Loire (plus de 10 salariés), avenant du 10 avril 2026 | 18, 28, 36, 37, 41, 45 | du 10/07/2026 | 11,17 € | 1A, 1B, 2, 3, 4, 5 |
| Centre-Val de Loire (jusqu'à 10 salariés), avenant du 3 février 2025 | 18, 28, 36, 37, 41, 45 | du 01/01/2026 au 04/08/2026 (exclu) | 11,00 € | 1A, 1B, 2, 3, 4, 5 |
| Centre-Val de Loire (jusqu'à 10 salariés), avenant du 10 avril 2026 | 18, 28, 36, 37, 41, 45 | du 04/08/2026 | 11,17 € | 1A, 1B, 2, 3, 4, 5 |
| Bourgogne-Franche-Comté, accord du 18 mars 2024 | 21, 25, 39, 58, 70, 71, 89, 90 | du 01/01/2026 au 04/09/2026 (exclu) | 11,44 € | 1, 2, 3, 4, 5 |
| Bourgogne-Franche-Comté, accord du 30 avril 2026 (2026) | 21, 25, 39, 58, 70, 71, 89, 90 | du 04/09/2026 au 01/01/2027 (exclu) | 11,61 € | 1, 2, 3, 4, 5 |
| Bourgogne-Franche-Comté, accord du 30 avril 2026 (2027) | 21, 25, 39, 58, 70, 71, 89, 90 | du 01/01/2027 | 11,67 € | 1, 2, 3, 4, 5 |
| Pays de la Loire, accord du 10 octobre 2023 | 44, 49, 53, 72, 85 | du 01/01/2026 au 01/03/2026 (exclu) | 11,50 € | 1A, 1B, 2, 3, 4, 5, 6, 7 |
| Pays de la Loire, accord du 7 novembre 2025 | 44, 49, 53, 72, 85 | du 01/03/2026 | 12,00 € | 1A, 1B, 2, 3, 4, 5, 6, 7 |
| Nouvelle-Aquitaine, accord du 20 juin 2023 | 16, 17, 19, 23, 24, 33, 40, 47, 64, 79, 86, 87 | du 01/01/2026 au 17/01/2026 (exclu) | 10,80 € | 1A, 1B, 2, 3, 4, 5 |
| Nouvelle-Aquitaine, accord du 22 octobre 2025 | 16, 17, 19, 23, 24, 33, 40, 47, 64, 79, 86, 87 | du 17/01/2026 | 11,20 € | 1A, 1B, 2, 3, 4, 5 |
| Occitanie, accord du 16 février 2024 | 09, 11, 12, 30, 31, 32, 34, 46, 48, 65, 66, 81, 82 | du 01/01/2026 au 29/05/2026 (exclu) | 13,00 € | 1A, 1B, 2, 3, 4, 5 |
| Occitanie, accord du 13 février 2026 | 09, 11, 12, 30, 31, 32, 34, 46, 48, 65, 66, 81, 82 | du 29/05/2026 | 13,20 € | 1A, 1B, 2, 3, 4, 5 |
| Provence-Alpes-Côte d'Azur, accord du 30 septembre 2024 | 04, 05, 06, 13, 83, 84 | du 01/01/2026 | 12,20 € | 1, 2, 3, 4, 5 |
| Corse, accord régional du 2 juin 2023 | 20 | du 01/01/2026 au 06/06/2026 (exclu) | 10,50 € | 1, 2, 3, 4, 5, 6, 7 |
| Corse, accord du 15 décembre 2025 | 20 | du 06/06/2026 | 11,00 € | 1, 2, 3, 4, 5, 6, 7 |
| Allier, Cantal, Haute-Loire et Puy-de-Dôme, accord du 12 mars 2024 | 03, 15, 43, 63 | du 01/01/2026 au 29/05/2026 (exclu) | 11,65 € | 1A, 1B, 2, 3, 4, 5 |
| Allier, Cantal, Haute-Loire et Puy-de-Dôme, accord du 10 février 2026 | 03, 15, 43, 63 | du 29/05/2026 | 12,00 € | 1A, 1B, 2, 3, 4, 5 |
| Ain, accord du 14 février 2024 | 01 | du 01/01/2026 au 08/05/2026 (exclu) | 11,71 € | 1A, 1B, 2, 3, 4, 5 |
| Ain, accord du 21 janvier 2026 | 01 | du 08/05/2026 | 12,06 € | 1A, 1B, 2, 3, 4, 5 |
| Loire, accord du 18 décembre 2023 | 42 | du 01/01/2026 au 29/05/2026 (exclu) | 11,76 € | 1A, 1B, 2, 3, 4, 5 |
| Loire, accord du 15 janvier 2026 | 42 | du 29/05/2026 | 12,11 € | 1A, 1B, 2, 3, 4, 5 |
| Savoie, accord du 12 décembre 2024 | 73 | du 01/01/2026 au 24/02/2026 (exclu) | 12,03 € | 1, 2, 3, 4, 5 |
| Savoie, accord du 16 décembre 2025 | 73 | du 24/02/2026 | 12,25 € | 1, 2, 3, 4, 5 |
| Haute-Savoie, accord du 30 janvier 2024 | 74 | du 01/01/2026 au 20/03/2026 (exclu) | 12,63 € | 1A, 1B, 2, 3, 4, 5 |
| Haute-Savoie, accord du 16 décembre 2025 | 74 | du 20/03/2026 | 12,88 € | 1A, 1B, 2, 3, 4, 5 |
| Isère, accord du 11 décembre 2023 | 38 | du 01/01/2026 au 19/03/2026 (exclu) | 11,82 € | 1A, 1B, 2, 3, 4, 5 |
| Isère, accord du 15 décembre 2025 | 38 | du 19/03/2026 | 12,06 € | 1A, 1B, 2, 3, 4, 5 |
| Drôme-Ardèche, accord du 18 décembre 2024 | 07, 26 | du 01/01/2026 au 29/05/2026 (exclu) | 11,82 € | 1A, 1B, 2, 3, 4, 5 |
| Drôme-Ardèche, accord du 10 décembre 2025 | 07, 26 | du 29/05/2026 | 12,00 € | 1A, 1B, 2, 3, 4, 5 |
| Rhône, accord du 3 décembre 2024 | 69 | du 01/01/2026 au 06/03/2026 (exclu) | 12,05 € | 1, 1A, 1B, 2, 3, 4, 5 |
| Rhône, accord du 1er décembre 2025 | 69 | du 06/03/2026 | 12,35 € | 1, 1A, 1B, 2, 3, 4, 5 |

Limites : la majoration de 25 % des indemnités de transport et de trajet pour les chantiers des communes de montagne de l'Ain n'est pas appliquée ; en Savoie et en Isère, la zone se détermine sur la distance routière réelle (c'est l'entrée de la zone qui en tient compte) ; la footnote bretonne sur la zone 1A (repas présumé pris à la résidence) relève de la saisie des repas. Les limites d'exonération de 2027 seront reprises dans une nouvelle version.

## Limites

- Seule la grille du dernier accord étendu de chaque région est modélisée, à partir de son extension : avant, aucune grille, alors que l'accord étendu précédent liait les entreprises. Un nouvel accord régional, une fois étendu, entre dans une nouvelle version commune, après lecture de son texte et de son arrêté d'extension sur Légifrance.
- Les accords de salaires des ETAM d'Île-de-France sont rattachés à l'IDCC 2609 depuis l'avenant n° 10 du 4 décembre 2018 ; le modèle de la convention régionale (IDCC 2707, avenant n° 9 de 2017) n'est plus utilisé.
- Pays de la Loire, ouvriers : le tableau de l'accord du 7 novembre 2025 diffère de quelques centimes de la partie fixe et des valeurs de point du même article (par exemple 1 832,17 € pour le coefficient 150, contre 164 + 150 × 11,120 = 1 832 €) ; la version reprend le tableau.
- Les grilles s'appliquent aux entreprises adhérentes d'une organisation signataire dès la date d'effet de l'accord ; la version ne les contrôle qu'à partir de l'extension.
- L'arrêté fixant les taux de la cotisation chômage intempéries de la campagne 2026-2027 n'a pas été trouvé sur Légifrance : les taux sont ceux que toutes les caisses CIBTP appellent.
- Les travaux publics (1702, 2614, 3212) ne sont pas concernés : modele-social n'a pas de convention des travaux publics.
