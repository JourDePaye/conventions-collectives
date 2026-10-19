# Bâtiment — fichier commun aux IDCC 1596, 1597, 2609 et 2420

Le fichier [2026.4](batiment.2026.4.publicodes) est publié à l'identique comme version `2026.4` des quatre conventions du bâtiment : ouvriers des entreprises occupant jusqu'à 10 salariés ([1596](../../1596-batiment-ouvriers-petites-entreprises/README.md)) et plus de 10 salariés ([1597](../../1597-batiment-ouvriers-plus-de-10/README.md)), ETAM ([2609](../../2609-batiment-etam/README.md)) et cadres ([2420](../../2420-batiment-cadres/README.md)). Ses métadonnées listent ces conventions (`agreements`) ; `versions.lock.json` a une entrée par convention, avec la même empreinte.

modele-social n'a qu'une convention du bâtiment, `salarié . convention collective . BTP` (valeur `BTP`), avec ses catégories `ouvrier`, `etam` et `cadre` : une entreprise y relève d'une seule convention, alors que ses salariés relèvent de l'une ou l'autre des quatre selon leur catégorie. La version commune complète et corrige cette convention pour toute l'entreprise, quel que soit l'IDCC déclaré, sans redéfinir de règle de modele-social.

`validFrom` est le 1er janvier 2020 : les taux et les grilles sont datés dans les règles (`date`), avec les taux de modele-social avant 2026. Les versions antérieures de chaque convention ne sont plus utilisées : un consommateur qui choisit la version par date doit partir de `2026.4`.

## Corrections de modele-social

- `cotisation congés payés` remplace `congés intempéries` (qui ne contient que la cotisation congés payés) : taux de la caisse de rattachement (`congés intempéries . caisse de rattachement`, valeurs de modele-social) à la date de la période. En octobre 2026 : Île-de-France 20,20 %, Nord-Ouest 20,70 %, Grand-Ouest 20,70 %, Centre et Centre-Ouest 20,70 %, Grand Est 20,35 %, Rhône-Alpes Auvergne 20,30 %, Méditerranée 19,60 %, Sud-Ouest 20,20 % ; Nord-Ouest 22,85 % et Grand-Ouest 21,95 % au 1er novembre 2026. Avant 2026, les taux de modele-social, sauf Grand-Ouest (19,70 % depuis le 1er avril 2023).
- `chômage intempéries` : 0,68 % (`catégorie` = `gros œuvre et travaux publics`) ou 0,13 % (`second œuvre`) du salaire plafonné à la sécurité sociale, 0 % pour une activité `non assujettie` (valeur par défaut). La catégorie est celle sous laquelle la caisse CIBTP a affilié l'entreprise. L'abattement annuel par entreprise ne se calcule pas sur une paie : `sous l'abattement` annule la cotisation tant que la masse salariale ne l'a pas dépassé. Elle est ajoutée aux cotisations employeur de modele-social (`OPPBTP et chômage intempéries` remplace la référence à `OPPBTP` dans `cotisations employeur`).
- `catégorie . cadre . prévoyance RNPC` : 1,50 % de la tranche A pour l'employeur, qui vaut cotisation de prévoyance des cadres (`prévoyances . employeur . cadres` n'est plus ajoutée), et 2,40 % de la tranche B partagés à parts égales ; pas de tranche C, qui est une option de PRO BTP.

## Salaires minima

- `région` : la région de l'établissement (13 régions métropolitaines, `non renseignée` par défaut, et pour l'outre-mer). `classification` : le coefficient de l'ouvrier (150 à 270) ou le niveau de l'ETAM (A à H). `jusqu'à 10 salariés` se déduit de l'effectif de modele-social (`entreprise . salariés . effectif`).
- Grilles vérifiées, pour 35 heures, chacune à partir de la date à laquelle elle lie toutes les entreprises (publication de l'arrêté d'extension) :

| Grille | Accord | Lie toutes les entreprises à partir du | Montants |
|---|---|---|---|
| Ouvriers jusqu'à 10 salariés, Centre-Val de Loire (1596) | avenant du 10 avril 2026, applicable au 1er mai 2026 (KALITEXT000054936694) | 4 août 2026 | 1 823 € (150) à 2 412 € (270) |
| Ouvriers de plus de 10 salariés, Nouvelle-Aquitaine (1597) | accord du 22 octobre 2025, applicable au 1er janvier 2026 (KALITEXT000053497377) | 17 janvier 2026 | 1 838,24 € (150) à 2 560,19 € (270) |
| ETAM, Corse (2609) | accord du 15 décembre 2025, applicable au 1er avril 2026 (KALITEXT000054092314) | 6 juin 2026 | 1 827,10 € (A) à 3 231,05 € (H) |
| ETAM, Occitanie (2609) | accord du 13 février 2026, applicable au 1er mai 2026 (KALITEXT000054337649) | 29 mai 2026 | 1 847,16 € (A) à 3 497,50 € (H) |

- `grille applicable` dit si une grille de la catégorie, de la région et (pour les ouvriers) de la taille de l'entreprise lie l'entreprise à la date de la période. `salaire minimum conventionnel` multiplie la grille par la quotité de travail ; il vaut 0 €/mois sans grille applicable, et seul le SMIC s'impose alors. `classification hors grille` signale une classification absente de la grille qui s'applique ; sans grille, aucune classification n'est contrôlée.
- Les cadres (2420) n'ont pas de grille : l'avenant n° 78 du 19 janvier 2026 n'est pas étendu, et une version commune ne peut pas réserver une seule de ses grilles aux adhérents d'une organisation signataire.

## Limites

- Les autres régions ne sont pas modélisées : chaque accord régional sera ajouté dans une nouvelle version commune, après lecture de son texte et de son arrêté d'extension sur Légifrance. Les ETAM d'Île-de-France relèvent de l'IDCC 2707.
- Les grilles s'appliquent aux entreprises adhérentes d'une organisation signataire dès la date d'effet de l'accord ; la version ne les contrôle qu'à partir de l'extension.
- L'arrêté fixant les taux de la cotisation chômage intempéries de la campagne 2026-2027 n'a pas été trouvé sur Légifrance : les taux sont ceux que toutes les caisses CIBTP appellent.
- Les travaux publics (1702, 2614, 3212) ne sont pas concernés : modele-social n'a pas de convention des travaux publics.
