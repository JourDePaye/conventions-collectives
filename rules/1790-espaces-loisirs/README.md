# Espaces de loisirs, d'attractions et culturels — IDCC 1790

La version `2026.1` modélise l'avenant n° **76 du 13 mars 2026** relatif aux rémunérations conventionnelles. Il a été étendu par arrêté du **6 juillet 2026**, publié au Journal officiel ; la version est datée de cette extension.

La valeur Publicodes est `espaces loisirs` et les règles sont sous `salarié . convention collective . espaces loisirs`.

## Règles implémentées

- `niveau`, `échelon` et `coefficient` reçoivent la classification contractuelle ;
- `rémunération minimale` expose les minima mensuels bruts de la grille 2026.1 pour 151,67 heures ;
- `salaire minimum conventionnel` applique uniquement le prorata de `contrat . temps de travail . quotité` ;
- `classification hors grille` signale les couples niveau/coefficient non publiés et laisse l'endpoint minimum à zéro.

## Audit explicite des rubriques de paie

Les textes dédiés de la branche ont été recherchés en plus de l'avenant salarial : avenants n° 72 (catégories objectives de protection sociale complémentaire), n° 74 (frais de santé), les accords prévoyance de la branche, les textes de formation professionnelle et leurs arrêtés d'extension. L'audit couvre les rubriques suivantes :

- **Cotisations salarié/employeur, taux et assiettes** : l'avenant n° 76 salarial ne modifie pas de taux ni d'assiette de cotisation ; aucun taux conventionnel générique n'est ajouté.
- **Plafonds, tranches et forfaits** : aucune modification calculable des plafonds, tranches ou forfaits de cotisation dans l'avenant salarial ; non implémentés.
- **Santé** : l'avenant n° 74 est un texte autonome de frais de santé ; ses cotisations dépendent du régime, du PMSS et de paramètres d'adhésion qui ne sont pas des entrées sûres de ce modèle salarial. Aucune cotisation santé n'est inventée.
- **Prévoyance** : les accords dédiés organisent des garanties et cotisations distinctes du barème salarial ; aucun changement de taux ou d'assiette directement rattaché à l'avenant n° 76 n'est calculé ici.
- **Formation professionnelle** : les contributions légales et conventionnelles sont collectées selon l'effectif et les dispositifs applicables ; l'avenant n° 76 ne fixe aucun taux additionnel calculable. Omission documentée.
- **AT/MP** : aucun taux de cotisation AT/MP conventionnel n'est fixé par l'avenant salarial ; le taux dépend de l'activité et de la tarification réglementaire. Non calculé.
- **Primes, indemnités, cachets et avantages en nature** : la grille peut comporter des montants distincts pour certaines activités, mais aucun montant accessoire n'est intégré au minimum mensuel faute d'entrée de filière et de conditions d'attribution sûres. Aucun montant n'est inventé.
- **Base de comparaison** : le minimum est un montant mensuel brut pour 151,67 heures ; les éléments de rémunération à retenir ou exclure pour la comparaison ne sont pas modélisés comme une assiette générique.

## Sources officielles

- Avenant n° 76 du 13 mars 2026 relatif aux rémunérations conventionnelles, Légifrance, `KALITEXT000054871990`.
- Article 1er de l'avenant n° 76, grille des rémunérations minimales, Légifrance, `KALIARTI000054871994`.
- Arrêté du 6 juillet 2026 portant extension de l'avenant n° 76, Journal officiel, `JORFTEXT000054408839`.
- Conteneur de la convention collective nationale des espaces de loisirs, d'attractions et culturels du 5 janvier 1994, IDCC 1790, `KALICONT000005635453`.

## Limites

Les dispositions autonomes de santé, prévoyance, formation, AT/MP, primes et avantages nécessitent leurs propres entrées, dates d'effet et périmètres. Elles sont auditées et explicitement omises ici plutôt que calculées avec des valeurs par défaut.
