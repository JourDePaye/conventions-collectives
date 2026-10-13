# Personnel sédentaire des entreprises de navigation — IDCC 2972

La version `2026.1` modélise l'avenant n° 9 du **13 avril 2026** relatif aux salaires minima annuels, avec effet au **1er janvier 2026**. L'avenant a été étendu par arrêté du **17 juillet 2026**, publié au Journal officiel du **23 juillet 2026** ; la version couvre donc le champ général de la convention.

La valeur Publicodes est `personnel sédentaire entreprises navigation` et les règles sont sous `salarié . convention collective . personnel sédentaire entreprises navigation`.

## Règles implémentées

- `niveau` reçoit l'un des niveaux de classification `I` à `IX`.
- `grille annuelle` expose les minima bruts annuels de l'avenant, sur la base de 35 heures hebdomadaires.
- `salaire minimum annuel conventionnel` expose le minimum annuel proratisé par `salarié . contrat . temps de travail . quotité`. La garantie étant annuelle, aucune conversion mensuelle n'est inventée.
- `niveau hors grille` signale une classification absente ; l'endpoint minimum retourne alors zéro.

## Grille au 1er janvier 2026

| Catégorie | Niveau | Minimum annuel brut |
|---|---:|---:|
| Employé | I | 22 604,30 € |
| Employé | II | 22 893,94 € |
| Employé | III | 23 472,91 € |
| Agent de maîtrise | IV | 24 583,86 € |
| Agent de maîtrise | V | 27 235,52 € |
| Agent de maîtrise | VI | 32 191,96 € |
| Cadre | VII | 36 117,82 € |
| Cadre | VIII | 44 644,19 € |
| Cadre | IX | 54 042,96 € |

## Périmètre paie audité

L'accord fixe des minima annuels. Le modèle expose uniquement cette garantie : les éléments effectivement versés, les absences, primes, rémunération variable, temps de travail décompté et modalités de comparaison nécessitent des données de paie qui ne sont pas des entrées génériques du modèle. Les cotisations de santé, prévoyance, formation, AT/MP, primes d'ancienneté et indemnités ne sont pas remplacées sans taux ou assiette calculables et explicitement prévus par cet accord salarial.

## Sources officielles

- Convention collective nationale du personnel sédentaire des entreprises de navigation du 14 septembre 2010, IDCC 2972, conteneur KALI `KALICONT000025844703`.
- Avenant n° 9 du 13 avril 2026 relatif aux salaires minima, publié dans les textes de la convention sur Légifrance.
- Arrêté du 17 juillet 2026 portant extension de l'avenant, JORF du 23 juillet 2026, texte `JORFTEXT000052097520`.

## Limites

La version couvre la grille annuelle étendue au 1er janvier 2026. Elle ne modélise pas les anciennes grilles ni les éléments de rémunération qui ne sont pas des minima annuels directement calculables.
