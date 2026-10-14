# Inspection d'assurance — IDCC 1679

La version `2007.2` modélise le protocole d'accord du **21 mars 2007** relatif aux rémunérations minimales annuelles (RMA), avec effet au **1er janvier 2007**. L'accord est publié par Légifrance comme texte **en vigueur non étendu**. Il concerne les inspecteurs encore en fonction à la date de signature ; le modèle conserve cette limite dans sa documentation et ne présente pas cette grille historique comme une garantie actuelle universelle.

La valeur Publicodes est `inspection assurance` et les règles sont sous `salarié . convention collective . inspection assurance`.

## Règles implémentées

- `classe` accepte les classes 5, 6 et 7 du barème des fonctions d'inspection ;
- `grille annuelle` fournit respectivement `27 120 €/an`, `35 800 €/an` et `49 970 €/an` ;
- `salaire minimum annuel conventionnel` conserve la comparaison en `€/an` et applique la quotité de travail ;
- `salaire minimum mensuel indicatif` expose uniquement le douzième informatif de la RMA ;
- `classe hors grille` signale les classes absentes.

## Audit explicite des rubriques de paie

La recherche a couvert le protocole salarial, la convention de base, les accords dédiés et les textes publiés ou rattachés à l'IDCC 1679, ainsi que les arrêtés d'extension disponibles.

- **Cotisations salarié/employeur, taux et assiettes** : le protocole du 21 mars 2007 ne modifie pas les cotisations générales et ne fournit pas de taux conventionnel générique calculable ; aucune différence salarié/employeur n'est ajoutée.
- **Bases, plafonds, tranches et forfaits** : aucune base, plafond, tranche ou assiette forfaitaire nouvelle n'est fixée par le texte salarial ; omission explicite.
- **Santé et prévoyance** : aucun taux universel salarié/employeur, régime assureur et assiette indépendante ne sont calculables à partir des entrées du modèle ; omission explicite.
- **Formation professionnelle** : aucune contribution conventionnelle chiffrée et paramétrable n'a été trouvée dans le périmètre du modèle ; les contributions légales restent externes.
- **AT/MP** : aucun taux conventionnel n'est fixé ; la tarification dépend de l'activité et du régime réglementaire.
- **Primes et avantages** : le protocole exclut les inspecteurs qui ne sont plus en fonction et renvoie aux modalités de comparaison de la convention ; aucune prime d'ancienneté, variable, frais, avantage en nature ou indemnité n'est calculée faute d'assiette et de conditions suffisamment paramétrées.
- **Comparaison** : les RMA restent annuelles ; le montant mensuel n'est qu'un équivalent indicatif et n'intègre pas automatiquement les éléments de rémunération retenus par le texte.

## Sources officielles

- [Protocole d'accord du 21 mars 2007 relatif aux rémunérations minimales pour l'année 2007](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000017890005).
- [Convention collective nationale de l'inspection d'assurance du 27 juillet 1992, IDCC 1679](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635475).

## Limites

Aucun accord de branche salarial plus récent et directement calculable n'a été identifié dans le périmètre retenu pour cette version. Les accords d'entreprise rattachés à l'IDCC 1679 ne sont pas utilisés comme minima de branche. Une future version devra remplacer ou compléter cette grille seulement sur la base d'un nouveau texte officiel de branche, sans modifier `2007.1`.
