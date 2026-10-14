# Organismes publics et coopératifs de l'habitat social — IDCC 3220

La version `2026.1` modélise l'avenant n° **1 du 21 janvier 2026** relatif à la revalorisation du barème des rémunérations minimales, applicable avec effet au **1er janvier 2026**. Le champ est celui de la convention collective nationale étendue des organismes publics et coopératifs de l'habitat social, qui couvre les offices publics de l'habitat, les sociétés de coordination et les sociétés coopératives HLM.

La valeur Publicodes est `offices publics habitat` et les règles sont sous `salarié . convention collective . offices publics habitat`.

## Règles implémentées

- `classe` reçoit une classe d'emploi de 1 à 13 ;
- `salaire minimum conventionnel` expose le salaire minimum hiérarchique mensuel brut à 35 heures de l'avenant, proratisé selon la quotité de travail ;
- `grille mensuelle` expose les 13 montants de 1 825,22 € à 5 359,23 € ;
- `classe hors grille` signale une valeur absente et laisse l'endpoint à zéro.

Le barème est composé uniquement du salaire de base : les primes et avantages en nature sont exclus. Les organismes peuvent appliquer des barèmes plus favorables.

## Audit explicite des rubriques de paie

Les textes dédiés de la branche ont été recherchés en plus de l'avenant salarial : convention et arrêté d'extension, accords de rémunération, textes de prévoyance et de frais de santé, dispositions de formation professionnelle, accords relatifs aux primes et avantages, et leurs éventuelles extensions. L'audit couvre explicitement :

- **Cotisations salarié/employeur, taux et assiettes** : l'avenant n° 1 revalorise uniquement le barème des minima hiérarchiques ; il ne modifie aucun taux ni aucune assiette de cotisation. Aucun taux conventionnel générique n'est ajouté.
- **Plafonds, tranches et forfaits** : aucun plafond, tranche, forfait social ou assiette conventionnelle n'est fixé ou modifié par le texte salarial ; omission documentée.
- **Santé** : les garanties et cotisations de complémentaire santé relèvent d'accords autonomes et des paramètres d'adhésion de l'organisme ; aucun taux salarié/employeur calculable avec certitude à partir de l'avenant n° 1 n'est calculé.
- **Prévoyance** : aucun changement de taux ou de base de prévoyance n'est introduit par l'avenant salarial ; les régimes autonomes ne sont pas fusionnés avec le barème.
- **Retraite** : aucune cotisation de retraite complémentaire ou supplémentaire n'est fixée par l'avenant ; les taux réglementaires ou de régime ne sont pas remplacés.
- **Formation professionnelle** : aucune contribution conventionnelle additionnelle chiffrée n'est créée ou modifiée par l'avenant ; les contributions dépendent notamment de l'effectif et des dispositifs.
- **AT/MP** : aucun taux conventionnel n'est fixé ; la tarification dépend de l'activité et du régime réglementaire. Non calculé.
- **Primes, avantages et frais** : le texte précise que le barème ne comprend que le salaire de base, hors primes et avantages en nature. Le treizième mois, primes, avantages en nature, remboursements de frais et indemnités ne sont pas calculés faute de paramètres et de conditions d'attribution sûrs.
- **Base et plafond de comparaison** : la base est un minimum mensuel brut pour 35 heures, proratisé uniquement par `contrat . temps de travail . quotité`; aucune base de cotisation ou conversion annuelle implicite n'est ajoutée.

Ces omissions sont intentionnelles : elles évitent de transformer des paramètres réglementaires, d'organisme ou de textes autonomes en taux conventionnels inventés.

## Sources officielles

- Fédération nationale des Offices Publics de l'Habitat, **avenant n° 1 du 21 janvier 2026** relatif aux rémunérations minimales : [PDF officiel](https://www.foph.fr/system/files/medias/file/2026/02/Avenant_1_Salaires_OPCHS_CPPNI_21_janvier_2026_VD%C3%A9f%20sign%C3%A9.docx_1.pdf).
- Fédération nationale des Offices Publics de l'Habitat, page officielle **« Revalorisation des salaires de branche 2026, impacts chiffrés »**, publiée le 2 février 2026 et mise à jour le 20 avril 2026 : [page officielle](https://www.foph.fr/documentation/negociation-de-branche/revalorisation-des-salaires-de-branche-2026-impacts-chiffres).
- Arrêté d'extension du 10 juin 2025, publié au Journal officiel n° 0143 du 21 juin 2025, référence reproduite dans l'avenant n° 1.

## Limites

Les dispositions autonomes de santé, prévoyance, retraite, formation, AT/MP, primes, avantages en nature et frais nécessitent leurs propres textes, dates d'effet, paramètres et périmètres. Elles sont auditées et explicitement omises plutôt que calculées avec des taux ou bases par défaut.
