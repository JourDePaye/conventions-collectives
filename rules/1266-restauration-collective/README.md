# Restauration de collectivités — IDCC 1266

## Version et champ

`2025.1` retient le **1er juillet 2025** pour l'application générale de l'avenant n° 68 du 14 février 2025 : l'article 11 distingue le 1er mars 2025 pour les organisations patronales signataires et le premier jour du mois suivant la publication de l'extension pour les autres entreprises.[11] L'arrêté du 30 avril 2025 est publié au JORF du 13 juin 2025 (référence dans les métadonnées) ; la date du 13 juin n'est donc pas la date d'effet générale. Cette version ne couvre pas l'application anticipée aux signataires. Les règles de calcul sont non applicables avant le 1er juillet 2025, même si cette version est chargée par erreur.

Le champ est la restauration collective en France métropolitaine, y compris les sièges et bureaux régionaux ; l'avitaillement ferroviaire, maritime et aérien est exclu.[16] Le consommateur vérifie le champ et renseigne `hors champ conventionnel = oui` lorsqu'il est exclu.

## Grilles de référence

Les grilles ci-dessous sont celles de l'avenant n° 68 : taux horaires, salaires minima mensuels pour 151,67 heures et revenus minima annuels garantis après un an d'ancienneté continue et révolue.[6][7][5]

| Niveau | Horaire brut | SMM brut | RMA brut |
|---|---:|---:|---:|
| I | 11,89 € | 1 803,32 € | 23 443,16 € |
| II | 11,95 € | 1 812,42 € | 23 561,46 € |
| III | 12,10 € | 1 835,17 € | 23 857,21 € |
| IV | 12,30 € | 1 865,50 € | 24 251,50 € |
| V | 12,96 € | 1 965,60 € | 25 552,80 € |
| VI | 13,46 € | 2 041,43 € | 26 538,59 € |
| VII | 14,30 € | 2 168,83 € | 28 194,79 € |
| VIII | 15,02 € | 2 278,03 € | 29 614,39 € |
| IX | 19,31 € | 2 928,68 € | 38 072,84 € |

Les sorties `salaire minimum conventionnel` et `salaire minimum annuel conventionnel` sont distinctes et proratisées selon la quotité standard. Le RMA conserve l'unité `€/an` : il n'est pas divisé par douze pour fabriquer un salaire mensuel. Le SMM n'inclut pas un treizième mois mensualisé. Le consommateur assure la comparaison annuelle, l'assiette admissible, les entrées/sorties et régularisations ; PAC et PSM n'entrent pas dans le RMA.[13]

`niveau` est une chaîne de `'I'` à `'IX'`. Une valeur absente ou inconnue active `niveau hors grille` ; le zéro technique des minima de référence ne valide pas une classification. Les sorties de minimum annuel et de protection SMIC sont alors non applicables. `taux horaire minimum applicable` et `salaire minimum légal et conventionnel` exposent séparément le plancher SMIC de `modele-social`, sans altérer la grille conventionnelle. Les contrats légaux spécifiques nécessitent une validation séparée.[12]

## Primes et entrées validées

Préfixe : `salarié . convention collective . restauration collective` ; valeur du choix : `'restauration collective'`.

- **Ancienneté** : `ancienneté entreprise` en années, selon l'ancienneté juridiquement reprise. Pour les employés (niveaux I à V), 1/2/3/4 % du SMM après 5/10/15/20 ans ; aucun taux pour les niveaux VI à IX.[2]
- **PAC** : 53 € mensuels de référence. Il faut explicitement valider l'établissement fonctionnant sept jours sur sept, les roulements/repos conventionnels et le travail du dimanche. `fraction horaire entreprise ouvrant droit` doit refléter le temps effectif admissible rapporté à l'horaire applicable dans l'entreprise ; son défaut est la quotité standard. Le plancher de 50 % ne joue que pour le temps partiel avec un mois complet ouvrant droit. Une prime de même objet déjà versée est déduite, sans supplément négatif.[8]
- **PSM** : 22,50 € mensuels, seulement pour l'activité continue de restauration/hôtellerie au bénéfice de convives dépendants et l'obligation personnelle de service minimum. Même proratisation et plancher temps partiel ; non-cumul avec une prime de même objet. PAC et PSM peuvent se cumuler si leurs conditions propres sont remplies. Leur maintien pendant les congés payés doit être intégré à la fraction admissible lorsqu'il n'est pas déjà compris dans le mode de calcul des congés : le modèle n'identifie pas automatiquement ces périodes.[13]
- **Treizième mois** : `un an continu révolu` doit être validé. Le résultat annuel est le douzième du `salaire annuel de base éligible au treizième mois`, moins le montant assimilé déjà versé, avec plancher zéro. Cette base obligatoire est celle de l'année civile réellement admissible **au-delà de la première année continue**, après prise en compte du travail effectif, des absences assimilées et des entrées/sorties ; elle exclut ancienneté, PAC et PSM. Aucune deuxième proratisation par quotité n'est faite. Les dispositions plus favorables et échéances de versement restent à vérifier.[12]
- **Intermittence scolaire** : contrat intermittent, six mois d'ancienneté et présence à l'effectif au versement à valider. Prime annuelle de 3,5 % du salaire annuel de base intermittent si la durée annuelle est strictement inférieure à 1 000 heures, sinon 2 %. Les deux bases sont obligatoires lorsque la prime est due ; elles ne sont pas supposées nulles. La date de versement, à défaut d'accord au plus tard sur la paie de septembre, reste à gérer par le consommateur.[10]
- **Coupures** : saisir un compteur de coupures **juridiquement éligibles de plus de deux heures**, après contrôle du régime temps partiel/intermittent et des contreparties d'amplitude, de repos et de séquence. Le résultat mensuel est 57 % du minimum garanti légal fourni par coupure, moins l'indemnité de même objet déjà versée. Le MG est obligatoire dès qu'une coupure est saisie ; aucun montant légal figé n'est inventé.[9]
- **Détachement temporaire** : jours validés, prime entreprise au moins égale à 4 €/jour, dès le premier jour. Les exclusions (fermeture provisoire et tournants), l'écrit, les durées maximales et accords de prolongation, les limites de périodes et le remboursement des transports doivent être contrôlés séparément. Le modèle ne plafonne pas artificiellement la rémunération des jours effectivement dus.[14]
- **Paritarisme** : sortie **annuelle par entreprise**, 0,016 % de la masse salariale N−1 obligatoire. Ce n'est ni une cotisation mensuelle par salarié ni un montant automatiquement ajouté au total employeur ; la collecte et toute allocation interne sont à gérer séparément.[15]

Les booléens d'éligibilité sont `non` par défaut : le consommateur doit les renseigner, et non conclure que l'obligation est inexistante. Les sorties de primes sont autonomes : elles ne fixent pas automatiquement le brut ni les rubriques d'un bulletin JourDePaye.

## Protection sociale, héritage et limites

Aucune règle Restauration collective n'est héritée de `modele-social@11.1.0` : aucune exception structurelle ou collision n'est nécessaire. Les tests différentiels évaluent AT/MP, formation, santé employeur/salarié, prévoyance conventionnelle et le total des cotisations employeur, puis l'isolation hors convention. Préserver ces endpoints ne signifie pas que le régime assurantiel de branche est intégralement couvert.

L'avenant n° 69 comporte une répartition globale égale et une offre de l'organisme recommandé à 1,03 %, dont 0,10 % pour reprise de passif ; ce tarif d'offre n'est **pas transformé en cotisation universelle** de paie.[17] Le texte correctif du 16 mars 2026 précise le salaire brut de référence de la rente invalidité.[18] Contrat choisi, garanties, affiliation, assiette, prévoyance cadre/non-cadre, santé, dispenses, collecte et régularisation restent à intégrer séparément. Les cotisations de droit commun du moteur ne remplacent pas ces obligations.

Ne sont pas modélisés : attribution automatique des classifications, salaires avant l'effet général de cette version, temps de travail aménagé, heures complémentaires/supplémentaires, majorations de nuit/dimanche/jours fériés, maintien de salaire, congés, avantages en nature nourriture et obligation de nourrir, indemnités de rupture, garanties d'assurance et bulletin complet.

## Recherche officielle et limites d'accès

Audit effectué le **11 octobre 2026**. Légifrance direct a répondu HTTP 403 ; l'extraction web configurée n'a pas récupéré les pages. Les textes complets des articles ont été lus dans les **XML officiels DILA KALI**, stock du 13 juillet 2025 et mises à jour ciblées jusqu'au 23 juillet 2026 (notamment prévoyance et correction 2026), puis croisés avec les fiches du Code du travail numérique. La recherche indexée d'actualités a été renouvelée, mais ne permet pas de garantir l'absence de modification non récupérée après le dernier XML. Aucun barème 2026 non vérifié n'a été extrapolé. L'arrêté d'extension est référencé dans les métadonnées ; sa page complète n'a pas pu être relue directement pendant cet audit.

## Tests

`test/restauration-collective.test.ts` couvre les neuf grilles horaires/mensuelles/annuelles, quotités, seuils d'ancienneté, conditions PAC/PSM et non-cumul, treizième mois et bases manquantes, frontières six mois/1 000 heures, MG requis, détachement, paritarisme annuel, SMIC, classification invalide, dates/champ et endpoints standard/isolation. `test/models.test.ts` contrôle l'export, les références, l'intégration et les empreintes historiques.

```sh
npm test
npm run typecheck
npm run build
git diff --check
```

## Sources

[2] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000018649438
[5] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000051694284
[6] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000051694282
[7] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000051694283
[8] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000051694286
[9] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000051694287
[10] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000051694285
[11] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000051694295
[12] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000033555311
[13] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000026606520
[14] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000050141957
[15] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000050135924
[16] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000005767282
[17] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000052288887
[18] https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000054454102

## Maintien de salaire

La révision 2025.2 ajoute le maintien de salaire conventionnel (articles 25 B et 26 B) sous `maintien de salaire`, lu sur Légifrance le 24 octobre 2026 : les durées, taux, carences et modalités sont dans les sources de la version et dans `test/salary-maintenance-2.test.ts`. L’interface est décrite dans le README du package. Les trois périodes de la maladie entre 1 et 2 ans d’ancienneté utilisent la sortie facultative `troisième période`.

La révision 2025.3 ajoute l'indemnité de licenciement (article 14) et l'indemnité de départ à la retraite (article 35), sous `indemnité de rupture`, lus sur Légifrance le 28 octobre 2026 : les barèmes, seuils d'ancienneté et plafonds sont dans les sources de la version et dans `test/termination-indemnity.test.ts`, en mois de salaire de référence. La condition d'âge de 60 ans du départ à la retraite n'est pas reprise.
