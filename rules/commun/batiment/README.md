# Bâtiment — fichier commun aux IDCC 1596, 1597, 2609 et 2420

Les fichiers [2026.4](batiment.2026.4.publicodes) et [2026.5](batiment.2026.5.publicodes) sont publiés à l'identique comme versions `2026.4` et `2026.5` des quatre conventions du bâtiment : ouvriers des entreprises occupant jusqu'à 10 salariés ([1596](../../1596-batiment-ouvriers-petites-entreprises/README.md)) et plus de 10 salariés ([1597](../../1597-batiment-ouvriers-plus-de-10/README.md)), ETAM ([2609](../../2609-batiment-etam/README.md)) et cadres ([2420](../../2420-batiment-cadres/README.md)). Leurs métadonnées listent ces conventions (`agreements`) ; `versions.lock.json` a une entrée par convention, avec la même empreinte.

- `2026.4` : les corrections de modele-social et quatre grilles régionales.
- `2026.5` (même `validFrom`, elle l'emporte) : les mêmes corrections et la grille du dernier accord régional étendu de chaque région, pour les ouvriers et les ETAM ; la grille des ouvriers de Nouvelle-Aquitaine s'applique aussi aux entreprises jusqu'à 10 salariés (l'accord du 22 octobre 2025 vise les IDCC 1596 et 1597), alors que `2026.4` la réservait aux entreprises de plus de 10 salariés.

modele-social n'a qu'une convention du bâtiment, `salarié . convention collective . BTP` (valeur `BTP`), avec ses catégories `ouvrier`, `etam` et `cadre` : une entreprise y relève d'une seule convention, alors que ses salariés relèvent de l'une ou l'autre des quatre selon leur catégorie. La version commune complète et corrige cette convention pour toute l'entreprise, quel que soit l'IDCC déclaré, sans redéfinir de règle de modele-social.

`validFrom` est le 1er janvier 2020 : les taux et les grilles sont datés dans les règles (`date`), avec les taux de modele-social avant 2026. Les versions antérieures de chaque convention ne sont plus utilisées : un consommateur qui choisit la version par date doit partir de `2026.4`, puis prend la plus récente des deux.

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

## Limites

- Seule la grille du dernier accord étendu de chaque région est modélisée, à partir de son extension : avant, aucune grille, alors que l'accord étendu précédent liait les entreprises. Un nouvel accord régional, une fois étendu, entre dans une nouvelle version commune, après lecture de son texte et de son arrêté d'extension sur Légifrance.
- Les accords de salaires des ETAM d'Île-de-France sont rattachés à l'IDCC 2609 depuis l'avenant n° 10 du 4 décembre 2018 ; le modèle de la convention régionale (IDCC 2707, avenant n° 9 de 2017) n'est plus utilisé.
- Pays de la Loire, ouvriers : le tableau de l'accord du 7 novembre 2025 diffère de quelques centimes de la partie fixe et des valeurs de point du même article (par exemple 1 832,17 € pour le coefficient 150, contre 164 + 150 × 11,120 = 1 832 €) ; la version reprend le tableau.
- Les grilles s'appliquent aux entreprises adhérentes d'une organisation signataire dès la date d'effet de l'accord ; la version ne les contrôle qu'à partir de l'extension.
- L'arrêté fixant les taux de la cotisation chômage intempéries de la campagne 2026-2027 n'a pas été trouvé sur Légifrance : les taux sont ceux que toutes les caisses CIBTP appellent.
- Les travaux publics (1702, 2614, 3212) ne sont pas concernés : modele-social n'a pas de convention des travaux publics.
