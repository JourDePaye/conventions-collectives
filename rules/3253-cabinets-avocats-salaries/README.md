# Salariés des cabinets d'avocats — IDCC 3253

Le modèle `2025.1` entre en vigueur le **1er octobre 2025**, premier jour du mois suivant la publication au Journal officiel de l'arrêté d'extension du 18 septembre 2025. Il couvre la convention collective nationale des salariés des cabinets d'avocats du 21 juin 2024, issue de la fusion des champs IDCC 1000 et IDCC 1850.

## Règles calculées

- `coefficient` est la classification du personnel non-avocat fournie par l'application.
- `date de calcul` borne l'application à partir du 1er octobre 2025.
- `salaire minimum conventionnel` expose le minimum mensuel brut à temps plein puis applique une seule fois la quotité de travail.
- La grille reprend les 16 coefficients de l'avenant n° 136 du 24 janvier 2025 ; le `salaire minimum annuel conventionnel` expose les treize mensualités rappelées par cet avenant.
- `coefficient hors grille` signale les coefficients non présents sans inventer de montant.

## Audit explicite des rubriques de paie

L'audit a porté sur la convention de base, l'avenant salarial n° 136, l'arrêté d'extension, l'accord de formation professionnelle du 2 juillet 2025 et l'accord de financement du paritarisme du 12 décembre 2025, ainsi que sur les textes dédiés publiés pour la santé et la prévoyance.

- **Salaires, bases et avantages** : la grille mensuelle et la règle des treize mensualités sont calculées ; aucune prime, indemnité, avantage en nature, forfait ou assiette conventionnelle additionnelle n'est calculé sans entrée fiable et disposition directement applicable au salarié.
- **Cotisations salariales et patronales** : aucun taux conventionnel salarié ou employeur, répartition, base, plafond, tranche ou forfait de cotisation suffisamment déterminé pour être calculé par ce modèle n'est ajouté. Les cotisations légales et de droit commun restent celles de `modele-social`.
- **Santé et prévoyance** : l'audit n'a pas retenu de taux ou répartition calculable dans la version publiée ; les garanties, l'organisme assureur, les catégories et les appels éventuels dépendent de paramètres de régime absents. Aucune règle santé/prévoyance n'est donc inventée.
- **Formation professionnelle** : l'accord du 2 juillet 2025 est identifié ; ses contributions dépendent de l'effectif, de l'assiette et du régime légal/conventionnel applicable. Aucune contribution automatique n'est exposée faute d'un endpoint sûr dans ce modèle.
- **AT/MP** : aucun taux de branche calculable n'est créé ; le taux AT/MP reste celui de l'établissement et de sa tarification.
- **Primes et indemnités** : aucun montant exploitable et conditionné par des variables absentes n'est inclus. Le salaire annuel ne doit pas être interprété comme un treizième mois versé à une date particulière.

Ces omissions sont intentionnelles et testées par l'isolation du namespace : le modèle n'écrase aucune règle de `modele-social` et ne prétend pas calculer une obligation dont la base, le plafond, la catégorie ou le régime ne sont pas fournis.

## Limites

- Le modèle concerne les salariés non-avocats et ne modélise pas une rémunération propre aux avocats salariés.
- Une nouvelle version devra être ajoutée pour tout avenant salarial postérieur.
- Les éléments variables, primes, garanties de protection sociale et contributions nécessitant des paramètres d'entreprise restent à renseigner par l'application.
