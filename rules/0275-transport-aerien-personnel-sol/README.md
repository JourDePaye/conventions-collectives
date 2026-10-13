# Personnel au sol des entreprises de transport aérien — IDCC 0275

Le modèle `2025.1` entre en vigueur le **1er avril 2025** pour les employeurs signataires ou adhérents. Il transpose l’avenant n° 100 relatif aux salaires minima de la convention collective nationale du personnel au sol des entreprises de transport aérien (brochure 3177). Les références officielles Légifrance figurent dans les métadonnées du fichier Publicodes.

## Règles calculées

- `coefficient` est le coefficient de classification fourni par l’application ; il n’est pas déduit du poste.
- `date de calcul` borne l’application des paliers de l’avenant : 1er avril 2025, 1er septembre 2025 et 1er novembre 2025.
- `champ juridique` doit être explicitement `employeur signataire ou adhérent`. Le modèle ne présume pas une extension à tous les employeurs.
- `salaire minimum conventionnel` expose le minimum hiérarchique mensuel brut à temps plein, puis applique une seule fois `salarié . contrat . temps de travail . quotité`.
- `coefficient hors grille` vaut `oui` lorsque le coefficient fourni n’est pas présent dans la grille et le minimum devient non applicable.
- `indemnité de panier` expose séparément `7,40 €/jour` à partir du 1er avril 2025 ; elle n’est pas additionnée au salaire minimum.

## Audit des rubriques de paie

L’avenant n° 100 fixe les salaires minima, les paliers de la grille et l’indemnité de panier. L’audit a vérifié les effets paie au-delà du minimum : aucune base, taux de cotisation, plafond, forfait, santé, prévoyance, formation professionnelle ou AT/MP générique et calculable n’est créé par cet avenant. Ces rubriques restent donc héritées de `modele-social` ou dépendent d’informations de caisse, de catégorie, de régime ou d’entreprise absentes du modèle ; elles ne sont pas remplacées dans ce namespace.

Le panier est volontairement un endpoint autonome : son attribution et son nombre de jours sont des données de paie à fournir par l’application et ne sont pas inventés.

## Limites

- Les coefficients et montants sont ceux des trois paliers 2025 de l’avenant n° 100 ; une nouvelle version devra être ajoutée pour tout accord salarial ultérieur.
- L’extension éventuelle de l’avenant n’est pas supposée : le champ juridique doit être fourni explicitement.
- Les classifications particulières, primes, majorations et indemnités autres que le panier ne sont pas calculées sans base conventionnelle et entrées fiables.
