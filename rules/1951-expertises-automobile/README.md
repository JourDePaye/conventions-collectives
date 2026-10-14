# Cabinets ou entreprises d'expertises en automobile — IDCC 1951

La version `2025.1` modélise l'avenant n° 92 du **19 juin 2025**, applicable au **1er janvier 2025**. L'avenant a été étendu par arrêté du **4 septembre 2025**, publié au Journal officiel du **10 septembre 2025**.

La valeur Publicodes est `expertises automobile` et les règles sont sous `salarié . convention collective . expertises automobile`.

## Règles implémentées

- `niveau` accepte les niveaux 1 à 10 de la grille 2025 ;
- `grille annuelle` fournit les revenus annuels bruts minima de 22 111 € à 52 071 € ;
- `salaire minimum annuel conventionnel` conserve la comparaison en `€/an` et applique la quotité de travail ;
- `salaire minimum mensuel indicatif` expose uniquement le douzième informatif du montant annuel ;
- `niveau hors grille` signale les niveaux absents ;
- `audit paie` reste à `non` : il documente qu'aucune rubrique conventionnelle générique supplémentaire n'est automatiquement calculée.

## Audit explicite des rubriques de paie

La recherche a couvert la convention de base, l'avenant salarial n° 92, les textes rattachés à l'IDCC 1951 et les accords dédiés repérés dans la liste officielle Légifrance, notamment les textes relatifs à la prévoyance et à la formation professionnelle. Les accords d'entreprise et les dispositifs légaux ne sont pas transformés en règles de branche.

- **Cotisations salarié/employeur, taux et assiettes** : l'avenant n° 92 ne modifie aucune cotisation et ne fixe pas de taux conventionnel générique calculable ; aucune différence salarié/employeur n'est ajoutée.
- **Bases, plafonds, tranches et forfaits** : la grille salariale ne crée pas de base, plafond, tranche ou assiette forfaitaire ; omission explicite.
- **Santé et prévoyance** : les textes dédiés repérés doivent être appliqués selon le régime, les garanties, la catégorie et les paramètres du contrat collectif ; aucun taux salarié/employeur et aucune assiette universelle suffisamment déterminés pour les entrées standard de ce modèle ne sont ajoutés.
- **Formation professionnelle** : les textes de branche relatifs à la formation ont été recherchés ; aucune contribution conventionnelle chiffrée et paramétrable à ajouter à la grille salariale n'a été retenue. Les contributions légales restent externes.
- **AT/MP** : aucun taux conventionnel n'est fixé par l'avenant salarial ; la tarification dépend de l'activité et du régime réglementaire.
- **Primes et avantages** : l'avenant fixe une rémunération annuelle minimale ; aucune prime, indemnité, frais, avantage en nature ou variable n'est calculé automatiquement faute d'assiette et de conditions paramétrées dans le modèle.
- **Comparaison** : les montants restent annuels. Le montant mensuel est seulement un équivalent indicatif et ne remplace pas la comparaison annuelle prévue par le texte.

## Sources officielles

- [Avenant n° 92 du 19 juin 2025 relatif à la grille des salaires](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051842821).
- [Convention collective nationale du 20 novembre 1996, IDCC 1951](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636009).
- [Arrêté du 4 septembre 2025 portant extension de l'avenant n° 92](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052221215).

## Limites

Les revenus annuels de niveau 1 peuvent être inférieurs au SMIC applicable à une date donnée : le plancher légal doit être évalué séparément par `modele-social`. Le modèle ne convertit pas la grille en salaire mensuel juridiquement comparé et ne fabrique pas de taux de cotisations, de santé, de prévoyance, de formation ou d'AT/MP en l'absence d'un paramétrage conventionnel universel et sûr.
