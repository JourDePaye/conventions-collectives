# Sport — IDCC 2511

## Version et périmètre

`2026.1`, applicable au **1er janvier 2026**, couvre les groupes 1 à 8 du chapitre IX de la convention collective nationale du sport. Les références et leurs arrêtés d'extension sont exportés dans les métadonnées du modèle. Audit des textes au **11 octobre 2026**.

| Groupe | Minimum brut de référence à temps plein | Périodicité |
|---|---:|---|
| 1 | 1 848,42 € | mensuelle |
| 2 | 1 885,14 € | mensuelle |
| 3 | 1 997,87 € | mensuelle |
| 4 | 2 099,37 € | mensuelle |
| 5 | 2 333,99 € | mensuelle |
| 6 | 2 865,97 € | mensuelle |
| 7 | 40 597,94 € | annuelle |
| 8 | 46 833,81 € | annuelle |

Les groupes 7 et 8 ne constituent **pas** un salaire mensuel garanti égal au douzième du minimum annuel. `salaire minimum annuel conventionnel` conserve l'unité `€/an` et la quotité du contrat ; `salaire minimum conventionnel` est non applicable pour ces deux groupes. Le consommateur assure la comparaison de la rémunération annuelle, les entrées/sorties et les régularisations. Aucune conversion automatique en salaire mensuel n'est faite.

Pour les groupes 1 à 6, le minimum mensuel est proratisé selon la quotité. Le minimum horaire est majoré de **5 % jusqu'à 10 heures hebdomadaires incluses**, de **2 % au-delà de 10 heures et en dessous de 24 heures**, sans majoration à 24 heures. Les heures et la quotité doivent être cohérentes. La légalité d'un contrat inférieur à 24 heures doit être vérifiée séparément.

La prime d'ancienneté des groupes 1 à 6 est égale à **1 % du minimum du groupe 3 par période complète de 24 mois**, proratisée selon la quotité. Les salariés actuellement classés dans le groupe 1 bénéficient de **5 % supplémentaires après trois ans dans l'entreprise**. Le taux total, supplément compris, est plafonné à **15 %**. Aucune prime n'est attribuée aux groupes 7 et 8, ni à une classification absente/inconnue. Le décompte du travail effectif, les reprises d'ancienneté et les dates sont à la charge du consommateur.

## Version 2026.4

`2026.4` (même date d'effet, remplace `2026.3`) reprend les grilles, la prime d'ancienneté, la prévoyance et la santé de `2026.3`, sous sa propre valeur de convention : `salarié . convention collective = 'branche du sport'`, espace de noms `salarié . convention collective . branche du sport`. Elle s'utilise à la place de la convention `sport` de modele-social, dont aucune règle ne s'applique alors (exonération AT, assiette forfaitaire, franchise, primes de manifestation : régimes de sécurité sociale propres à certaines structures et fonctions, pas des stipulations de la convention). Elle calcule les contributions de branche que `2026.3` laissait à saisir, ajoutées à `salarié . cotisations . employeur` :

- **Financement du paritarisme** (`financement du paritarisme`, article 2.3.2 dans la rédaction de l'avenant n° 214 du 23 septembre 2025, [KALITEXT000053401858](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000053401858), étendu le 12 février 2026) : 0,09 % de la masse salariale brute pour la masse salariale de 2026 (collecte de 2027), au lieu de 0,08 % (avenant n° 180) ; versement minimum de 3 € par entreprise.
- **Formation professionnelle conventionnelle** (`formation professionnelle conventionnelle`, article 8.6.2, [KALISCTA000039432397](https://www.legifrance.gouv.fr/conv_coll/id/KALISCTA000039432397)) : en plus des contributions légales, 1,05 % de la masse salariale brute sous 10 salariés (versement minimum de 30 €), 0,20 % de 10 à moins de 50, 0,15 % de 50 à moins de 300, 0,10 % à partir de 300.
- **Formation des dirigeants bénévoles** (`formation des dirigeants bénévoles`, même article) : 0,02 % de la masse salariale brute, minimum de 2 € sous 10 salariés et de 10 € au-delà, maximum de 5 000 €.

L'assiette est celle de la contribution à la formation professionnelle continue (article 8.6.1), la base des cotisations de sécurité sociale (`masse salariale`). Ces contributions sont annuelles et par entreprise : le modèle en fait une provision mensuelle par salarié, les minimums et le maximum de l'entreprise étant répartis également entre ses salariés (`entreprise . salariés . effectif`) et les mois de l'année, ce qui suppose des salaires comparables.

## Entrées et sorties

Préfixe : `salarié . convention collective . sport` ; choix de convention : `'sport'`.

- `groupe` : chaîne `'1'` à `'8'`. Une valeur absente/inconnue active `groupe hors grille` ; le consommateur doit refuser cette classification, et non considérer le résultat de zéro comme un minimum valide.
- `périodes de 24 mois d'ancienneté` : nombre entier de périodes **complètes**, par défaut zéro.
- `ancienneté groupe 1 au moins 3 ans` : booléen, par défaut `non`. Ne s'applique qu'au groupe 1 actuel.
- Version `2026.2` (même date d'effet, remplace 2026.1) : ces deux entrées se déduisent de `ancienneté dans l'entreprise` (années complètes) ; les périodes se comptent depuis l'embauche, au plus depuis l'extension de la convention (arrêté du 21 novembre 2006, article 9.2.3.1), sans décompter les absences qui ne sont pas du travail effectif.
- Version `2026.3` (même date d'effet, remplace 2026.2) : mêmes montants et mêmes entrées, sans redéfinir de règle de `modele-social` (voir « Exceptions structurelles »). Le supplément de formation se saisit dans `formation professionnelle 2025 . supplément conventionnel validé`.
- `salarié relevant du chapitre XII` : booléen, par défaut `non`. Saisir `oui` pour les sportifs/entraîneurs professionnels ; cela désactive les minima et la prime du chapitre IX ainsi que la prévoyance du chapitre X. Le régime propre au chapitre XII reste à implémenter.
- Quotité et temps partiel : utiliser les entrées standard de `modele-social`, notamment `salarié . contrat . temps de travail . temps partiel` et `. heures par semaine`.

Les minima et la prime sont des sorties autonomes. Ils ne fixent pas automatiquement `salarié . rémunération . brut` et la prime d'ancienneté n'est pas automatiquement ajoutée aux primes de manifestation héritées. L'application de paie doit sélectionner la version, contrôler le minimum légal/contractuel plus favorable, puis intégrer les éléments de rémunération sans double compte.

## Protection sociale et intégration réelle avec modele-social

- **Prévoyance non-cadres du chapitre X** : depuis le 1er janvier 2025, taux global de **0,97 %**, soit **0,485 % employeur et 0,485 % salarié**. Le plafond d'assiette est corrigé à quatre plafonds de sécurité sociale ajustés au temps de travail (TA + TB), au lieu du plafond hérité de huit. Le calcul mensuel ne remplace pas la régularisation annuelle de ces tranches. Les cadres ne reçoivent pas cette cotisation non-cadre : la prévoyance cadre standard de `modele-social` demeure en place ; les garanties complémentaires et leur financement doivent être vérifiés au contrat. Les salariés du chapitre XII sont exclus de cette cotisation.
- **Frais de santé du salarié isolé** : depuis le 1er juillet 2025, tarif indicatif de **0,96 % du PMSS** au régime général et **0,61 %** au régime local Alsace-Moselle. Le PMSS de santé n'est pas proratisé au temps partiel. Ces tarifs ne remplacent pas la validation des garanties ni le contrat souscrit : l'avenant permet une cotisation inférieure avec respect des garanties.
- Le montant contractuel total se saisit dans `santé 2025 . montant contractuel` (`€/mois`). **Utiliser cette entrée, pas le montant de santé standard remplacé par Sport.** Le défaut suit le tarif indicatif ci-dessus ; saisir zéro seulement après validation d'une dispense. La part employeur utilise l'entrée standard `salarié . cotisations . prévoyances . santé . taux employeur`, 50 % par défaut. Les anciennes options héritées R1/R2/R3 ne définissent plus des tarifs actuels : ayants droit, renforts et contrats plus favorables exigent un montant contractuel explicite.
- La part salariale de santé est corrigée localement en `montant × (1 − part employeur)` ; la formule héritée `montant − taux employeur` produisait une soustraction incohérente d'unités.

Les tests évaluent les endpoints **standard** `salarié . cotisations . prévoyances . conventionnelle . employeur/salarié`, `salarié . cotisations . prévoyances . santé . montant/employeur/salarié`, la prévoyance cadre et le total de cotisations employeur, et pas uniquement des règles autonomes de taux.

### Exceptions structurelles, strictement limitées

La fusion avec `modele-social@11.1.0` doit accepter exactement ces **quatre** clés Sport déjà existantes pour cette version :

1. `salarié . convention collective . sport . cotisations . prévoyance` : reconstruire les enfants inline `avec` et leurs `remplace` standard. Remplacer seulement les références aux enfants hérités laissait les endpoints standard à 0,29 %.
2. `salarié . convention collective . sport . cotisations . formation professionnelle` : retirer l'agrégation obsolète et préserver le remplacement du endpoint standard avec sa formule de droit commun.
3. `salarié . convention collective . sport . exonération cotisation AT` : retirer le `rend non applicable` structurel qui exonérait automatiquement tous les salariés Sport.
4. `salarié . convention collective . sport . cotisations . assiette forfaitaire` : retirer le remplacement automatique de l'assiette ordinaire fondé uniquement sur une rémunération faible.

Ces exceptions sont autorisées par nom exact, pour les versions `2026.1` et `2026.2` seulement, dans `test/models.test.ts`.

La version `2026.3` n'en a plus besoin : une application qui refuse toute collision (comme JourDePaye) peut la fusionner. Elle rend non applicable toute la branche `salarié . convention collective . sport . cotisations` de `modele-social` : une règle rendue non applicable garde ses propres `remplace`, mais ses descendants sont désactivés avec elle. Elle définit à la place, sous de nouveaux noms, la prévoyance (`prévoyance 2025 . part employeur` et `. part salarié`), le montant de santé (`santé 2025 . montant`), la formation (`formation professionnelle 2025`, avec son supplément) et l'ajout du paritarisme au total employeur (`cotisations employeur avec paritarisme`). Elle refuse l'exonération AT en remplaçant `refus exonération cotisation AT` par `oui`. Les règles désactivées avec la branche (`cotisations . franchise`, `cotisations . financement du paritarisme`, `cotisations . assiette forfaitaire`) sont non applicables. `test/sport.test.ts` vérifie les mêmes montants sur `2026.1` et `2026.3`. Toutes les autres collisions restent interdites ; aucune règle standard hors du namespace Sport n'est redéfinie. La santé, la franchise, le paritarisme et les autres neutralisations utilisent `remplace` ou `rend non applicable`. Des tests différentiels vérifient que les contributions hors Sport restent identiques au modèle de base.

## Audit de l'héritage et limites explicites

| Héritage de modele-social | Traitement de cette version | Ce qui n'est pas couvert |
|---|---|---|
| Prévoyance 0,29 % + 0,29 % | Remplacée par 0,485 % + 0,485 % pour les non-cadres | Garanties et éventuels contrats supplémentaires ; chapitre XII |
| Santé anciens tarifs R1/R2/R3 | Tarif isolé actualisé, entrée de montant contractuel, partage corrigé | Ayants droit, surcomplémentaires, validation des dispenses et garanties |
| Plan de formation, professionnalisation, CIF CDI/CDD et minima mensuels 30 € / 5 € | Neutralisés ; contribution légale standard restaurée | **Calcul des contributions conventionnelles de formation du chapitre VIII** et leur régularisation annuelle |
| Paritarisme 0,06 % appliqué mensuellement | Remplacé par `allocation mensuelle paritarisme validée`, zéro par défaut | **Cotisation annuelle par entreprise, versement minimum et collecte** |
| Exonération AT automatique | Supprimée ; AT/MP ordinaire rétablie | Régimes particuliers d'exonération et conditions d'éligibilité |
| Base forfaitaire et franchise sportive automatiques | Base forfaitaire désactivée ; franchise égale à zéro | Régimes Urssaf réservés à certaines structures et fonctions, plafonds/manifestations, cumul et éligibilité |

**Zéro par défaut ne signifie pas absence d'obligation.** Pour la formation, renseigner `cotisations . formation professionnelle . supplément conventionnel validé` (`formation professionnelle 2025 . supplément conventionnel validé` en `2026.3`) après validation externe : ce montant non négatif est ajouté à la contribution légale et au total employeur. Pour le paritarisme, fournir `allocation mensuelle paritarisme validée` après calcul annuel externe : le lien de remplacement vers le total employeur est conservé et testé.

Le paritarisme historique de 0,06 % est obsolète : l'avenant n° 180 l'a porté à 0,08 % ; l'avenant n° 214 fixe 0,09 % pour la collecte 2027 assise sur la masse salariale 2026. Une allocation mensuelle par salarié ne permet pas à elle seule de reproduire une obligation annuelle par entreprise et son minimum de versement. Le modèle n'invente donc pas cette allocation.

Les bases forfaitaires/franchises ne découlent pas de l'IDCC : les conditions Urssaf de structure, de fonctions et de rémunération doivent être vérifiées. Cette version les **désactive**, sans offrir d'activation simplifiée qui prétendrait valider l'éligibilité. Les primes de manifestation héritées ne servent plus à diminuer l'assiette ; si elles sont utilisées pour la rémunération, leurs montants doivent être explicitement fournis.

Ne sont pas modélisés : sportifs/entraîneurs professionnels du chapitre XII, primes autres que l'ancienneté, temps de travail aménagé, heures complémentaires/supplémentaires, majorations de nuit/dimanche/jours fériés, congés, indemnités de rupture, maintien de salaire, avantages en nature, garanties d'assurance et régularisations annuelles. Ce modèle n'est pas un bulletin de paie complet.

## Sources et vérification

- Salaires : [avenant n° 210 du 3 avril 2025, article 1er](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000051927561), [arrêté du 24 juin 2025, JORF du 2 juillet 2025](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051832714).
- Classification : [article 9.1](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000017577826). Temps partiel et ancienneté : article 9.2, [référence du Code du travail numérique](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000047394518) et [synthèse officielle sur la prime](https://code.travail.gouv.fr/contribution/2511-quand-le-salarie-a-t-il-droit-a-une-prime-danciennete-quel-est-son-montant). `KALIARTI000017577830` concerne l'article 9.3, pas la prime 9.2.3.
- Prévoyance : [champ non-cadre, article 10.1](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000050332501), [avenant n° 205 du 17 octobre 2024](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000050828767), [article 10.8 actualisé](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000050833914). La limite TA + TB (quatre plafonds annuels) est également reproduite dans [le texte CCNS diffusé par la ligue de tennis](https://www.liguehautsdefrancetennis.fr/app/uploads/2025/06/CCNS-062025.pdf). Cette reproduction indique février 2025 ; la date du texte officiel indexé est janvier 2025. Cette divergence n'affecte pas la version 2026.
- Santé : [avenant n° 4 du 11 avril 2025, article 4](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000051947639), [arrêté d'extension du 4 juillet 2025, JORF du 30 juillet 2025](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052001622). Les taux et la date du 1er juillet ont été vérifiés dans le **texte original BOCC 2025-21 TRA**, [reproduit par une organisation syndicale](https://fo-services.fr/uploads/negotiation/3OJ/s_application__file_original.pdf) ; l'application aux non-adhérents suit l'extension.
- Audit formation : [article 8.6 actuel](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000039432383). Paritarisme : [avenant n° 214](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000053401858), distinguant l'année d'assiette et la collecte.
- Régimes spécifiques : [Urssaf, association de sport](https://www.urssaf.fr/accueil/employeur/cotisations/base-forfaitaire-franchise-cotis/association-sportive.html).

L'accès HTTP direct à Légifrance a renvoyé un contrôle anti-robot pendant cet audit. Les références officielles ont été recherchées dans leur index, croisées avec le Code du travail numérique et le texte original BOCC pour la santé ; cela ne constitue pas une récupération intégrale de chaque page Légifrance. La tentative finale d'extraction par l'outil web a également échoué : son backend de recherche ne prend pas en charge l'extraction des pages.

## Validation

`test/sport.test.ts` vérifie la grille complète, les frontières 10/24 heures pour chacun des groupes mensuels, les paliers/cap de la prime pour les huit groupes, la restriction du supplément au groupe 1, les minima annuels et leur quotité, les classifications invalides, la protection sociale sur les endpoints standard, les contrats santé explicites, les allocations formation/paritarisme jusqu'au total employeur, l'AT ordinaire, l'absence de forfait/franchise automatiques et l'isolation hors Sport.

```sh
npm run compile-rules
node --test test/sport.test.ts test/models.test.ts
npm test
npm run typecheck
npm run build
git diff --check
```

## Maintien de salaire

La révision 2026.5 ajoute le maintien de salaire conventionnel (article 4.3) sous `maintien de salaire`, lu sur Légifrance le 24 octobre 2026 : les durées, taux, carences et modalités sont dans les sources de la version et dans `test/salary-maintenance-2.test.ts`. L’interface est décrite dans le README du package. L’accident de trajet suit la maladie.

La révision 2026.6 ajoute l'indemnité de licenciement (article 4.4.3.3) et les indemnités de départ et de mise à la retraite (article 4.4.2.2), sous `indemnité de rupture`, lus sur Légifrance le 28 octobre 2026 : les barèmes, seuils d'ancienneté et plafonds sont dans les sources de la version et dans `test/termination-indemnity.test.ts`, en mois de salaire de référence. Aucun montant propre pour la rupture conventionnelle.
