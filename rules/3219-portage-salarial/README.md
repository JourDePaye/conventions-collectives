# Portage salarial — IDCC 3219

La version `2024.1` modélise les règles de rémunération issues de l'avenant n° 12 du **20 décembre 2022** et de l'avenant n° 13 du **21 décembre 2023**, étendus par arrêtés publiés au Journal officiel. La date d'effet retenue est le **1er janvier 2024**, pour la combinaison de règles examinée. La valeur Publicodes est `portage salarial` et les règles sont sous `salarié . convention collective . portage salarial`.

## Règles implémentées

- `classification` distingue `premier niveau`, `junior`, `senior` et `expert` ;
- `rémunération minimale mensuelle` applique respectivement 63 %, 70 %, 75 % ou 85 % du plafond mensuel de la sécurité sociale ;
- `réserve financière` expose la réserve CDI de 10 % du salaire de base de la dernière mission, base qui doit être fournie par la paie ;
- `indemnité de précarité` est exposée comme rubrique conventionnelle distincte, mais reste à renseigner lorsqu'un CDD arrive à son terme ;
- `classification hors grille` retourne un taux nul afin de bloquer une classification non reconnue plutôt que d'inventer un taux.

## Audit paie explicite

Les textes officiels dédiés ont été recherchés au-delà de la seule rémunération :

- **Taux salarié/employeur et changements de taux :** l'avenant n° 12 fixe les taux de rémunération minimale, mais ne fixe pas un barème générique de cotisations salarié/employeur. Aucun taux de cotisation conventionnel calculable avec les entrées standard de `modele-social` n'est ajouté ; les taux de droit commun restent ceux de `modele-social`.
- **Assiettes, plafonds et tranches :** la rémunération minimale utilise explicitement le plafond mensuel de sécurité sociale ; aucune assiette conventionnelle distincte, tranche supplémentaire ou plafond propre à l'IDCC 3219 n'est appliqué.
- **Forfaits et frais :** aucun forfait de paie générique officiellement calculable n'a été retenu. Les frais de mission et remboursements exigent les justificatifs et paramètres de mission.
- **Santé et prévoyance :** les textes de branche renvoient aux régimes collectifs et aux garanties/contrats applicables ; aucun taux salarié ou employeur uniforme, indépendant du régime, n'est introduit.
- **Formation professionnelle :** l'accord de branche organise le financement et les dispositifs, sans taux de prélèvement conventionnel générique sûr à appliquer au salaire avec les entrées disponibles.
- **AT/MP :** aucun taux conventionnel de branche ne remplace la tarification AT/MP de l'employeur ; le modèle conserve la règle de `modele-social`.
- **Primes et avantages :** la prime d'apport d'affaire, les congés payés, la réserve CDI et la précarité dépendent de la mission, du contrat et de la base effectivement versée. Seules la réserve et la précarité sont exposées séparément ; aucune base manquante n'est silencieusement remplacée par un salaire calculé.

L'absence de ces calculs ne vaut pas renonciation aux obligations conventionnelles : elle documente uniquement qu'aucune formule nationale, générique et sûre n'est disponible dans ce modèle.

## Sources officielles

- Avenant n° 12 du 20 décembre 2022 relatif à la classification et à la rémunération, articles 3 et 21.3.
- Arrêté du 17 juillet 2023 portant extension de l'avenant n° 12, publié au Journal officiel du 26 juillet 2023.
- Avenant n° 13 du 21 décembre 2023 relatif à la protection sociale complémentaire et aux cotisations conventionnelles, et son arrêté d'extension publié au Journal officiel.
- Convention collective de branche des salariés en portage salarial du 22 mars 2017, IDCC 3219.

## Limites

La convention du portage salarial est très dépendante de la mission, du compte d'activité, du type de contrat et du régime collectif choisi. Le modèle ne calcule pas le compte d'activité, les commissions de gestion, les frais réels, les congés payés effectivement acquis, les contributions de régimes collectifs, ni les taux de cotisations de droit commun.
