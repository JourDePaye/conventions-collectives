# Négoce des matériaux de construction — IDCC 3216

La version [2025.1](3216-negoce-materiaux-construction.2025.1.publicodes) est applicable aux employeurs et salariés compris dans le champ de l'accord à compter du **26 avril 2025**, date de publication de l'arrêté d'extension de l'avenant du 21 janvier 2025. L'avenant prévoit une application conventionnelle au 1er janvier 2025 pour les entreprises relevant de son champ avant extension.

La convention collective nationale des salariés du négoce des matériaux de construction du 8 décembre 2015 (brochure 3154) couvre notamment les entreprises du négoce des matériaux de construction relevant de l'IDCC 3216.

## Règles implémentées

- `coefficient` reçoit les coefficients 165, 170, 180, 195, 210, 225, 245, 250, 270, 290, 310, 330 ou 350.
- `salaire minimum conventionnel` donne le minimum mensuel pour la durée légale du travail, proratisé selon `contrat . temps de travail . quotité`.
- `coefficient hors grille` signale une classification absente de la grille et le minimum vaut alors `0 €/mois`.

## Grille au 1er janvier 2025

| Niveau | Coefficient | Minimum mensuel |
|---|---:|---:|
| I | 165 | 1 827,10 € |
| II | 170 | 1 834,20 € |
| II | 180 | 1 848,66 € |
| II | 195 | 1 907,99 € |
| III | 210 | 1 967,31 € |
| III | 225 | 2 026,64 € |
| III | 245 | 2 105,74 € |
| IV | 250 | 2 125,51 € |
| IV | 270 | 2 204,61 € |
| IV | 290 | 2 283,71 € |
| V | 310 | 2 362,81 € |
| V | 330 | 2 441,91 € |
| V | 350 | 2 521,01 € |

## Audit des rubriques de paie

L'avenant a été examiné au-delà des minima : il contient une prime d'ancienneté et des paramètres forfaitaires de cette prime, mais son assiette conventionnelle et ses conditions d'éligibilité ne sont pas déduites automatiquement de la seule classification et de la quotité. Elle n'est donc pas calculée ici afin de ne pas produire un montant juridiquement faux ; elle doit être fournie par une donnée paie validée.

La source examinée ne fixe pas de taux ou plafond de cotisations, d'assiette forfaitaire de cotisations, de régime santé/prévoyance, de contribution formation ou de taux AT/MP directement calculables dans ce modèle. Ces rubriques restent celles de `modele-social` ou d'une source paie dédiée. Le modèle ne prétend pas calculer les primes de congés, indemnités ou autres éléments non déterminables avec les seules entrées exposées.

## Sources officielles

- [Avenant du 21 janvier 2025 relatif aux minima conventionnels — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051537906)
- [Arrêté du 9 avril 2025 portant extension — Journal officiel, JORFTEXT000051521231](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051521231), publié le 26 avril 2025

## Limites

- La grille modélisée est celle de l'avenant du 21 janvier 2025 ; les textes ultérieurs nécessiteront une nouvelle version immuable.
- Les minima sont exprimés pour la durée légale et proratisés uniquement par la quotité fournie.
- Un minimum légal supérieur doit être appliqué par le moteur de paie ; ce modèle expose le minimum conventionnel publié et ne remplace pas le contrôle du Smic.
