# Blanchisserie, laverie, location de linge, nettoyage à sec, pressing et teinturerie — IDCC 2002

La version `2026.1` modélise l’avenant n° 28 du **9 décembre 2025** relatif aux salaires minima conventionnels, applicable au **1er janvier 2026** et étendu par arrêté publié au Journal officiel.

## Règles

- `niveau` accepte les niveaux I-1 à VIII publiés par la grille 2026 ;
- `salaire minimum horaire` expose les taux horaires bruts conventionnels ;
- `salaire minimum conventionnel` convertit le taux sur 151,67 heures et le prorata selon la quotité de travail ;
- `niveau hors grille` signale une classification absente et laisse le minimum à zéro.

## Audit explicite des rubriques de paie

- **Cotisations salarié/employeur, taux et assiettes** : l’avenant salarial ne modifie aucun taux de cotisation ni aucune assiette ; aucun taux générique n’est calculé.
- **Bases, plafonds, tranches et forfaits** : la base calculée est le taux horaire × 151,67 heures × quotité ; aucun plafond, tranche ou forfait conventionnel chiffré n’est attribuable à cette grille.
- **Santé et prévoyance** : les accords et avenants de branche dédiés ont été recherchés ; aucun taux de cotisation ni partage employeur/salarié directement rattachable à l’avenant salarial n’est ajouté.
- **Retraite complémentaire** : aucun paramètre conventionnel distinct n’est modifié par la source salariale ; non calculé.
- **Formation professionnelle** : aucun taux conventionnel chiffré dans l’avenant salarial ; non calculé.
- **AT/MP** : aucune cotisation conventionnelle spécifique ni taux de risque n’est fixé par l’avenant ; non calculé.
- **Primes, indemnités et avantages en nature** : aucun montant ou critère suffisamment déterminé dans l’avenant salarial pour être calculé automatiquement ; non calculés.
- **Exonérations et frais professionnels** : aucune règle conventionnelle calculable et autonome identifiée ; les exonérations légales et remboursements de frais restent hors périmètre.

Ces omissions sont intentionnelles : elles évitent d’inventer des paramètres dépendant du régime légal, de la catégorie du salarié, de l’organisme assureur ou d’un accord distinct.

## Sources officielles

- Avenant n° 28 du 9 décembre 2025 relatif aux salaires minima conventionnels, IDCC 2002, Légifrance.
- Convention collective nationale du 17 novembre 1997, IDCC 2002, Légifrance.
- Arrêté d’extension publié au Journal officiel.
