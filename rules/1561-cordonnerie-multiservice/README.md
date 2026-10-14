# Cordonnerie multiservice — IDCC 1561

La version `2026.1` modélise l'accord salarial du **18 février 2026**, étendu par arrêté du **4 mai 2026**, avec effet au **1er janvier 2026**. Le secteur est rattaché à la branche maroquinerie, mais sa grille dédiée est exposée sous une namespace distincte.

## Règles

- `classification` accepte les catégories et échelons publiés par l'accord ;
- `grille mensuelle` expose les minima bruts mensuels à 151,67 heures ;
- `salaire minimum conventionnel` prorata le minimum par la quotité de travail ;
- `classification hors grille` signale une valeur non publiée et laisse le minimum à zéro.

## Audit explicite des rubriques de paie

- **Cotisations salarié/employeur, taux et assiettes** : l'accord salarial ne modifie aucun taux ni aucune assiette ; aucun taux générique n'est calculé.
- **Plafonds, tranches et forfaits** : aucun changement conventionnel chiffré dans l'accord salarial ; les paramètres réglementaires restent hors modèle.
- **Santé et prévoyance** : les textes de branche rattachée ont été recherchés ; aucun taux ou partage spécifique de l'IDCC 1561 ne peut être attribué avec certitude à cette grille, donc omission documentée.
- **Retraite, formation et AT/MP** : aucune modification chiffrée dans l'accord salarial ; non calculés.
- **Primes, avantages et frais** : aucun montant ou condition calculable dans l'accord salarial ; non calculés.
- **Base** : minimum mensuel brut sur 151,67 heures, proratisé uniquement par `contrat . temps de travail . quotité`.

Ces omissions évitent d'inventer des paramètres de paie qui dépendent d'accords autonomes, du régime réglementaire ou de l'organisme assureur.

## Sources officielles

- Accord du 18 février 2026 relatif aux salaires minima, IDCC 1561, Légifrance.
- Arrêté d'extension du 4 mai 2026 publié au Journal officiel.
- Convention collective nationale de la cordonnerie multiservice du 7 août 1989 et textes de rattachement publiés sur Légifrance.
