# Pâtisserie — IDCC 1267

Modèle `1267-patisserie`, versions `2025.1` et `2026.1`, espace de noms
`salarié . convention collective . pâtisserie`.

## Périmètre

Le modèle couvre la grille nationale des salaires minima mensuels (151,67 heures)
de la convention collective nationale de la pâtisserie du 30 juin 1983, par
**coefficient** de 160 à 350, d'après l'annexe 1 des avenants de salaires :

- `2025.1` : avenant n° 112 du 4 février 2025, applicable au 1er janvier 2025
  (+2,2 %), étendu par arrêté du 9 avril 2025 (JORF du 26 avril 2025) ;
- `2026.1` : avenant n° 114 du 29 janvier 2026, applicable au 1er janvier 2026,
  étendu par arrêté du 9 avril 2026 (JORF du 17 avril 2026).

Les versions antérieures à 2025 ne sont pas modélisées.

## Grille mensuelle (annexe 1)

| Coefficient | 2025.1 | 2026.1 | Filières de l'annexe |
|---:|---:|---:|---|
| 160 | 1 841,27 € | 1 863,37 € | fabrication, vente, administratif, entretien |
| 165 | 1 851,89 € | 1 874,11 € | fabrication, vente, administratif, entretien, livraison |
| 170 | 1 873,12 € | 1 895,60 € | fabrication, vente, administratif, livraison |
| 175 | 1 885,26 € | 1 907,88 € | fabrication, vente |
| 180 | 1 906,49 € | 1 929,37 € | fabrication, vente, administratif, livraison |
| 185 | 1 965,64 € | 1 989,23 € | fabrication |
| 190 | 2 011,14 € | 2 035,28 € | fabrication, administratif, entretien, livraison |
| 200 | 2 096,08 € | 2 121,23 € | vente |
| 210 | 2 203,77 € | 2 230,21 € | vente |
| 220 | 2 308,42 € | 2 336,12 € | fabrication |
| 250 | 2 620,86 € | 2 652,31 € | fabrication, vente |
| 270 | 2 828,65 € | 2 862,59 € | fabrication |
| 290 | 3 040,98 € | 3 077,48 € | fabrication |
| 310 | 3 250,29 € | 3 289,29 € | fabrication |
| 330 | 3 461,11 € | 3 502,64 € | fabrication |
| 350 | 3 670,41 € | 3 714,46 € | fabrication |

Un même coefficient a le même montant dans toutes les filières de l'annexe
(vérifié ligne à ligne). La filière n'est donc pas une entrée du modèle.

Le `salaire minimum conventionnel` est proratisé une seule fois par la quotité de
travail. Un coefficient absent de la grille est signalé par `coefficient hors grille`
et donne un minimum nul afin que l'application appelante puisse bloquer le calcul.

## Sources officielles

- [Légifrance — avenant n° 114 du 29 janvier 2026](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054066586)
- [Légifrance — avenant n° 112 du 4 février 2025](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051537691)
- [Légifrance — convention collective (conteneur)](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635611)

## Limites

- L'article 1er de l'avenant n° 114 annonce une revalorisation de 1,2 % « pour les
  coefficients de 160 à 190 compris », mais l'annexe 1 applique aussi 1,2 % aux
  coefficients 200 à 350 (par exemple 220 : 2 308,42 -> 2 336,12). Le modèle suit
  les montants de l'annexe.
- Les primes (ancienneté, etc.), indemnités et autres dispositions de la convention
  ne sont pas modélisées. Les contrôles SMIC et le choix de la version applicable
  à la période de paie restent à la charge de l'application consommatrice.
