# Branche ferroviaire — IDCC 3244

La version `2023.1` modélise la **Convention collective nationale de la branche ferroviaire du 31 mai 2016**, étendue par arrêté du **6 novembre 2023**. L'article 41 fixe une valeur du point de **16,315 €** ; le minimum mensuel est calculé par coefficient × valeur du point, avec le plancher conventionnel du plafond mensuel de sécurité sociale, puis proratisé selon la quotité.

## Règles implémentées

- `coefficient` reçoit le coefficient contractuel ;
- `valeur du point` expose la valeur officielle de 16,315 € ;
- `grille mensuelle` calcule coefficient × valeur du point ;
- `salaire minimum conventionnel` applique le maximum entre la grille et le plafond mensuel de sécurité sociale, puis la quotité ;
- les coefficients hors de la plage modélisée (210 à 270) sont signalés.

## Audit explicite des rubriques de paie

Les textes de la convention, l'arrêté d'extension et l'avenant relatif à la formation professionnelle ont été inspectés. L'audit couvre explicitement les changements de taux, d'assiette et de plafond ; aucun taux additionnel n'est injecté sans base générique calculable.

- **Cotisations salarié/employeur, taux et assiettes** : aucun taux conventionnel général salarié/employeur autonome n'a été identifié dans les textes retenus. Les cotisations légales et les taux propres à l'entreprise restent fournis par le modèle social.
- **Plafonds et tranches** : le plancher de rémunération renvoie au plafond mensuel de sécurité sociale ; aucun plafond ou découpage de tranches propre à une cotisation conventionnelle n'est ajouté.
- **Forfaits et assiettes forfaitaires** : aucun forfait ou assiette forfaitaire générique applicable à tous les salariés n'est calculé.
- **Santé** : aucune cotisation santé chiffrée et générique n'est modélisée ; les contrats, dispenses et répartitions restent externes.
- **Prévoyance** : aucune cotisation prévoyance chiffrée et générique n'est modélisée ; les garanties et répartitions dépendent du régime et de la catégorie.
- **Formation professionnelle** : l'avenant n° 1 du 15 décembre 2022 a été recherché ; aucune contribution conventionnelle additionnelle calculable avec les entrées standard du modèle n'est retenue dans cette version. Les contributions légales restent dans le modèle social.
- **AT/MP** : aucun taux conventionnel ; le taux dépend de l'activité et de la tarification réglementaire.
- **Primes, indemnités et avantages** : les primes liées au poste, à la sujétion, au travail de nuit, aux déplacements, à l'ancienneté, aux astreintes et les avantages en nature ne sont pas ajoutés automatiquement faute de règle générique et d'entrées suffisantes.
- **Évolution de taux et de base** : les recherches dédiées des avenants et textes d'extension n'ont pas établi de modification de taux ou d'assiette nécessaire à cet endpoint salarial ; les textes signataire-only ou postérieurs à cette version ne sont pas présentés comme obligations générales.

## Sources officielles

- Convention collective nationale de la branche ferroviaire du 31 mai 2016, IDCC 3244, KALICONT000046802926 : https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000046802926
- Arrêté du 6 novembre 2023 portant extension, JORFTEXT000048423669 : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000048423669
- Avenant n° 1 du 15 décembre 2022 relatif à la formation professionnelle, KALIARTI000047932919 : https://www.legifrance.gouv.fr/conv_coll/id/KALIARTI000047932919

Les taux légaux, les cotisations santé/prévoyance propres aux régimes, l'AT/MP, la formation légale et les rubriques conditionnelles restent fournis par les entrées appropriées de paie plutôt que par défaut dans ce modèle.
