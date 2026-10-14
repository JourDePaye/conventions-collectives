# Personnel navigant technique des exploitants d'hélicoptères — IDCC 1612

La version `2024.1` reprend l'avenant n° 8 du 21 novembre 2023 relatif aux salaires minima de la convention collective nationale du personnel navigant technique des exploitants d'hélicoptères. La grille FTR1-1 à FTR8-3 est applicable au 1er janvier 2024, pour 151,67 heures mensuelles, et est proratisée selon la quotité de travail.

## Règles implémentées

- `classification` reçoit la classification FTR publiée par l'avenant n° 8 ;
- `salaire minimum conventionnel` expose les 24 minima mensuels bruts et applique la quotité de travail ;
- les classifications hors grille restent explicitement non couvertes ;
- `audit paie` expose que les rubriques conventionnelles non calculées ont été recherchées.

## Audit explicite des rubriques de paie

Les textes de base, l'avenant salarial n° 8, les avenants dédiés et les arrêtés d'extension disponibles ont été recherchés. Seules les valeurs salariales officiellement calculables sont implémentées.

- **Cotisations salarié/employeur, taux et assiettes** : aucun taux conventionnel générique salarié/employeur calculable avec les entrées standard n'est ajouté ; les cotisations légales restent dans `modele-social`.
- **Bases, plafonds et tranches** : aucune assiette, aucun plafond ou découpage de tranches propre à la branche n'est identifié dans les textes retenus pour la grille salariale ; les bases légales restent externes.
- **Forfaits et assiettes forfaitaires** : aucun forfait conventionnel générique applicable à tous les salariés n'est automatisé.
- **Santé et prévoyance** : les régimes et répartitions sont dépendants des garanties et catégories ; aucun taux ou montant générique suffisamment déterminé pour cet endpoint salarial n'est ajouté.
- **Formation professionnelle** : les recherches d'avenants et d'arrêtés d'extension dédiés n'ont pas établi de contribution additionnelle calculable avec les entrées du modèle ; la contribution légale reste dans le modèle social.
- **AT/MP et retraite** : aucun taux conventionnel universel ; AT/MP dépend de la tarification de l'activité et la retraite des paramètres légaux/régimes applicables.
- **Primes, indemnités, avantages et frais** : les indemnités de vol, déplacement, découcher, repas, ancienneté, sujétions et avantages en nature ne sont pas déduits du minimum faute d'une règle générique et d'entrées suffisantes.
- **Évolution des taux et bases** : une recherche dédiée des avenants de cotisations, santé, prévoyance, formation, retraite et des textes d'extension a été menée ; aucun changement de taux, base, plafond ou forfait nécessaire à ce calcul n'est retenu. Les textes non étendus ou catégoriels ne sont pas présentés comme obligations générales.

## Sources officielles

- Convention collective nationale du personnel navigant technique des exploitants d'hélicoptères, IDCC 1612, KALICONT000005635114.
- Avenant n° 8 du 21 novembre 2023 relatif aux salaires minima, KALITEXT000049938920 et KALIARTI000049938925.

Cette version n'intègre pas automatiquement les cotisations légales, régimes santé/prévoyance, AT/MP, formation, retraite, primes ou frais qui nécessitent des entrées de paie propres à l'employeur, à la catégorie ou au régime concerné.
