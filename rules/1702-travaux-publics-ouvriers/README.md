# Travaux publics — ouvriers (IDCC 1702)

## Version en vigueur : `2026.5`, commune aux trois conventions des travaux publics

Les versions `2026.4` et `2026.5` (qui ajoute les indemnités de petits déplacements) sont publiées à l'identique pour les IDCC 1702, 2614 et 3212, depuis le fichier
commun [`rules/commun/travaux-publics/travaux-publics.2026.4.publicodes`](../commun/travaux-publics/travaux-publics.2026.4.publicodes)
(voir son [README](../commun/travaux-publics/README.md)). Elle complète et corrige les règles du
BTP de modele-social pour les travaux publics : cotisation congés payés de la CNETP, cotisation
chômage intempéries, prévoyance des cadres (RNPC) comptée une seule fois, et salaires minima
hiérarchiques régionaux de 2026 des ouvriers et des ETAM (forfait jours compris).

**Les versions antérieures ci-dessous ne sont plus utilisées** : elles calculaient leurs
cotisations dans un espace de noms à part, sans remplacer celles de modele-social. Elles restent
publiées pour l'historique ; un consommateur qui choisit la version par date doit partir de
`2026.4`.

## Versions antérieures, plus utilisées

Modèle `1702-travaux-publics-ouvriers`, versions `2026.1` et `2026.3`, espace de noms
`salarié . convention collective . travaux publics ouvriers`.

La version `2026.3` ajoute le régime national de prévoyance des ouvriers : part employeur
minimale de 1,72 % sur le salaire brut plafonné à trois plafonds de la sécurité sociale,
à la charge exclusive de l'entreprise. La part appelée au salarié, les dispenses, garanties
et compléments contractuels ne sont pas déduits automatiquement.

## Périmètre et dates

Cette version couvre les **ouvriers uniquement**, sept coefficients et dix textes régionaux de SMH annuels sur une base de **35 heures**. Elle ne constitue pas une grille nationale. Les classifications I-1, I-2, II-1, II-2, III-1, III-2 et IV correspondent respectivement aux coefficients 100, 110, 125, 140, 150, 165 et 180.[1]

`validFrom: 2026-02-24` est la première publication d'extension du jeu de données, pas une date d'effet commune à toutes les régions.[1][8] Chaque calcul est également contrôlé par la date de publication régionale ci-dessous ; le `DATE_DEBUT` KALI du 1er janvier ne suffit pas à ouvrir le calcul pour toute la branche. L'application antérieure aux employeurs signataires/adhérents n'est **pas automatisée** : utiliser un traitement juridique séparé et explicitement validé. Les dates ci-dessous constituent la politique de sélection de cette version, sans application anticipée.

| Région (valeur exacte) | Accord | Arrêté d'extension | Publication JORF / ouverture du modèle | Source |
|---|---|---|---|---|
| Bretagne | 9 décembre 2025 | 17 février 2026 | 24 février 2026 | [1] |
| Nouvelle-Aquitaine | 11 décembre 2025 | 10 avril 2026 | 17 avril 2026 | [2] |
| Bourgogne-Franche-Comté | 9 décembre 2025 | 24 février 2026 | 5 mars 2026 | [3] |
| Centre-Val de Loire | 11 décembre 2025 | 12 mars 2026 | 20 mars 2026 | [4] |
| Grand Est | 28 novembre 2025 | 17 mars 2026 | 20 mars 2026 | [5] |
| Hauts-de-France | 5 décembre 2025 | 9 mars 2026 | 20 mars 2026 | [6] |
| Île-de-France | 16 janvier 2026 | 2 avril 2026 | 17 avril 2026 | [7] |
| Normandie | 26 novembre 2025 | 17 février 2026 | 24 février 2026 | [8] |
| Occitanie | 8 décembre 2025 | 12 mars 2026 | 20 mars 2026 | [9] |
| Pays de la Loire | 4 décembre 2025 | 24 août 2026 | 4 septembre 2026 | [10] |

Le calcul des SMH est bloqué avant cette ouverture et après le 31 décembre 2026. Cette borne supérieure est un choix de sécurité du modèle : elle ne signifie pas que les textes cessent juridiquement de produire leurs effets en 2027.

**Pays de la Loire :** le titre et le corps de l'article 1 visent 2026, mais l'en-tête de la ligne du tableau indique « Année 2025 ».[10] Les sept montants sont conservés sans corriger le texte source. Le modèle renvoie `null` tant que `année Pays de la Loire confirmée` n'est pas explicitement `oui` après validation juridique externe ; `incohérence année grille` reste vrai même après cette confirmation.

**Régions non couvertes :** Auvergne-Rhône-Alpes, Provence-Alpes-Côte d'Azur, Corse et outre-mer. Aucune grille 2026 vérifiée n'est fournie pour elles dans cette version ; aucune extrapolation, grille nationale ou reprise automatique d'une autre région n'est permise. La région doit correspondre au champ territorial de l'entreprise dans l'accord, non au seul domicile du salarié. Les textes définissent leurs limites territoriales à l'article 1.[1][2][10]

## Barèmes annuels à temps plein

Montants bruts en euros par an, dans l'ordre des coefficients ; les articles 1 des accords sont les sources de chaque ligne.

| Région | 100 / I-1 | 110 / I-2 | 125 / II-1 | 140 / II-2 | 150 / III-1 | 165 / III-2 | 180 / IV | Source |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Bretagne | 23863 | 24133 | 24621 | 27126 | 29020 | 31711 | 34529 | [1] |
| Nouvelle-Aquitaine | 23242 | 23751 | 24210 | 26969 | 28883 | 31214 | 34040 | [2] |
| Bourgogne-Franche-Comté | 23287 | 23785 | 24764 | 27420 | 29345 | 31733 | 34182 | [3] |
| Centre-Val de Loire | 22893 | 23337 | 23931 | 26783 | 28683 | 29490 | 32166 | [4] |
| Grand Est | 23294 | 23597 | 24339 | 26978 | 28399 | 31054 | 33525 | [5] |
| Hauts-de-France | 23305 | 23607 | 24287 | 27148 | 29005 | 31697 | 34577 | [6] |
| Île-de-France | 23709 | 23930 | 24826 | 27474 | 28954 | 31886 | 34569 | [7] |
| Normandie | 23462 | 23552 | 24691 | 27202 | 29145 | 31746 | 34634 | [8] |
| Occitanie | 23160 | 23518 | 24606 | 27301 | 29105 | 31550 | 33928 | [9] |
| Pays de la Loire (confirmation obligatoire) | 23537 | 23733 | 24749 | 27334 | 29301 | 31743 | 34619 | [10] |

Soit 70 cellules sourcées : 63 utilisables sans confirmation spéciale et 7 conditionnelles.

## Contrat d'utilisation des règles

Les valeurs `catégorie: 'ouvrier'`, `région`, `coefficient` et `date de calcul` sont obligatoires pour le SMH. Un statut cadre standard contradictoire bloque également le calcul. Les valeurs manquantes, une classification inconnue, une région non couverte ou une date exclue donnent `calcul bloqué: oui` et un minimum **non applicable (`null`)**, jamais un faux minimum nul. Consulter aussi `région hors grille`, `coefficient hors grille` et `période hors couverture`.

- `grille annuelle` et `minimum annuel` : même montant à temps plein, en `€/an`, avec les mêmes contrôles de champ/date.
- `salaire minimum annuel conventionnel` : minimum annuel multiplié **une seule fois** par `fraction annuelle validée`. Cette entrée obligatoire représente déjà temps partiel, présence, changements de classement et neutralisations. Elle n'est pas à multiplier à nouveau par la quotité du contrat. L'article 4.1 prévoit les prorata et la neutralisation des périodes rémunérées par un tiers.[11]
- `régularisation annuelle` : différence positive entre ce minimum proratisé et `rémunération annuelle retenue`, uniquement si `assiette annuelle validée: oui`. Une rémunération manquante reste une variable manquante, pas zéro. L'assiette comprend congés, prime de vacances et éléments permanents ; elle exclut notamment frais, heures supplémentaires, intéressement/participation, régularisations antérieures et primes exceptionnelles. La vérification se fait en fin d'année civile, avec régularisation avant la fin du premier mois de l'année suivante.[11]

Les durées, changements de région/classement, absences et périodes maintenues par des tiers sont à traiter en amont, avec des segments comparables. Ne pas utiliser une seule photographie mensuelle pour recomposer toute l'année. L'entrée de fraction n'automatise pas cette validation.

**Aucun minimum mensuel n'est fabriqué en divisant le SMH annuel par douze.** Il n'existe donc pas de sortie `salaire minimum conventionnel` en `€/mois` pour cette convention. Le versement mensuel reste obligatoire et distinct du contrôle annuel.[11] Le contrôle légal du SMIC à chaque période de paie doit être conservé, indépendamment de la comparaison annuelle ; les accords rappellent qu'aucun salaire ne peut être inférieur au SMIC.[1][2]

## Congés et prime de vacances

- `prime de vacances` est un **montant en euros**, égal à 30 % de `indemnité de congé des 24 jours`, moins `prime de même objet déjà versée`, avec plancher zéro. Il n'est pas mensualisé. La base est celle des seuls 24 jours ouvrables, pas la totalité des cinq semaines. La prime ne se cumule pas avec les versements de même objet et est versée avec l'indemnité de congé.[12]
- L'entrée `droit à prime validé par caisse: oui` est requise ; sans elle, le résultat est `null`, ce qui n'annule pas une obligation légale. La caisse doit valider le quota de travail BTP, les heures assimilées et les exceptions maladie/service national ; leur calcul n'est pas automatisé. Le texte de l'article 5.8 mentionne 1200 heures, jusqu'à 75 heures de chômage partiel, et une exception à 150 heures pour le service national.[12]
- `congés supplémentaires d'ancienneté` fournit 2, 4 ou 6 jours pour 20, 25 ou 30 ans de services continus ou non dans la même entreprise assujettie, appréciés en fin de référence. `services dans la même entreprise à fin de référence` est une entrée requise, non l'ancienneté cumulée dans toute la branche. L'indemnisation et le calendrier de prise relèvent de la caisse et de l'employeur.[13]

Ces droits nationaux sont contrôlés par catégorie ouvrière, statut non cadre et année 2026, indépendamment de la disponibilité d'un barème régional de SMH. Le drapeau `calcul bloqué` concerne le **SMH**, pas la suppression des droits nationaux. Les sorties ne sont pas ajoutées automatiquement au salaire ou à un bulletin.

## Limites et isolation

- ETAM et cadres, stages, apprentissage/professionnalisation, primes de spécialités, indemnités de petits/grands déplacements, frais, paniers et trajets ne sont pas modélisés. En particulier, aucun montant universel d'IPD n'est inventé.
- Le modèle n'active pas la convention partagée `BTP` de `modele-social` : aucune collision de clé ni reprise de ses taux de caisse, intempéries ou OPPBTP. La prévoyance ouvriers est toutefois redéfinie dans la version `2026.3` : 1,72 % employeur, plafonné à trois plafonds de la sécurité sociale, conformément au régime national TP. Les cotisations de caisse et intempéries nécessitent toujours une caisse de rattachement et des taux vérifiés ; elles ne sont pas calculées ici. Préserver les endpoints de droit commun **n'est pas** une validation des cotisations particulières TP.
- Pas de remplacement des heures supplémentaires légales par un seuil historique de 39 heures. Les endpoints standards de SMIC, majoration d'heures supplémentaires et formation restent inchangés ; la prévoyance employeur est l'exception explicitement redéfinie ci-dessus. Le consommateur conserve les contrôles légaux et gère les accords d'entreprise applicables.
- L'application anticipée aux signataires, les grilles antérieures aux dates d'ouverture et les grilles postérieures à 2026 ne sont pas fournies.
- La publication de ce modèle dans le package ne réalise pas son intégration dans JourDePaye. Catalogue applicatif, sélection de version, champs annuels/caisse et lignes du bulletin nécessitent un travail séparé.

## Provenance et vérification

Relevé du 11 octobre 2026 : la récupération HTML directe Légifrance a répondu 403. Les articles et métadonnées ont été lus dans le corpus XML officiel DILA KALI, à partir du stock du 13 juillet 2025 puis de 256 archives incrémentales disponibles jusqu'à `KALI_20261009-214339.tar.gz` inclus.[16][17] Les montants viennent des articles 1, les dates d'extension de `LIBELLE_EXTENSION`, non de `DATE_DEBUT`. Cette revue ne prétend pas couvrir des publications postérieures à la dernière archive inspectée.

Les tests utilisent le moteur réel fusionné avec `modele-social` : 70 cellules régionales, frontières d'extension, refus des régions/classes/dates inconnues, garde Pays de la Loire, proratisation annuelle et bases manquantes, régularisation, prime/non-cumul, congés d'ancienneté, SMIC mensuel, endpoints standard et isolation. `test/models.test.ts` vérifie aussi l'export et le verrou des empreintes historiques. Les différentes fonctionnalités ont été ajoutées par cycles RED → GREEN avant la validation globale.

## Sources

[1] https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054033905
[2] https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054092149
[3] https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000053748293
[4] https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054040344
[5] https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000053973328
[6] https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000053914180
[7] https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054161979
[8] https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054033890
[9] https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054040329
[10] https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054886381
[11] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000005801786
[12] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000005801805
[13] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000005801803
[14] Avenant n° 59 du 20 mars 2018 à l'accord du 31 juillet 1968 relatif à la prévoyance (KALIARTI000045304355), Légifrance
[15] Avenant n° 40 du 17 décembre 2025 instituant BTP-Prévoyance au titre du RNPO (KALIARTI000054254792), Légifrance
[16] https://echanges.dila.gouv.fr/OPENDATA/KALI
[17] https://echanges.dila.gouv.fr/OPENDATA/KALI/Freemium_kali_global_20250713-140000.tar.gz
