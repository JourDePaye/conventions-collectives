# Miroiterie, transformation et négoce du verre — IDCC 1499

Trois versions, espace de noms `salarié . convention collective . miroiterie transformation négoce verre` (valeur Publicodes `miroiterie transformation négoce verre`) :

- `2025.1` : accord du **26 mars 2025** (KALITEXT000051910288), minima au **1er mai 2025**, étendu par arrêté du 13 juin 2025 (JORF du 19 juin 2025). Conservée telle quelle (version publiée) ;
- `2025.2` : même accord et même date d'effet que `2025.1`, qui la remplace : la prime de panier de nuit est corrigée et la prime d'ancienneté n'est plus appliquée aux coefficients 370 et supérieurs ;
- `2026.1` : accord du **3 mars 2026** (KALITEXT000054337384), minima au **1er mai 2026**, étendu par arrêté du 19 mai 2026 (JORF du 29 mai 2026).

## Règles

- `coefficient` sélectionne l'un des 17 coefficients publiés, de 140 à 880 ;
- `salaire minimum conventionnel` : minimum mensuel brut pour 151,67 heures, proratisé une seule fois par la quotité de travail ;
- `salaire minimum horaire` : SMP horaire publié ;
- `coefficient ouvrant droit à la prime` (depuis `2025.2`) : vrai pour les coefficients 140 à 330, seuls à avoir une prime dans l'annexe ;
- `prime ancienneté horaire` : 3 % (3 ans), 6 % (6 ans), 9 % (9 ans), 12 % (12 ans), 15 % (15 ans) du SMP horaire ; nulle pour les coefficients 370 et supérieurs. L'annexe distingue 3 à 5 ans, 6 à 8, 9 à 11, 12 à 14 et « > 15 ans » : la clôture à 15 ans pile est retenue ;
- `smp horaire coefficient 140` (depuis `2025.2`) et `prime de panier de nuit` : voir ci-dessous ;
- `coefficient hors grille` : vrai pour un coefficient absent de la grille (le minimum vaut alors 0).

## Prime de panier de nuit

L'article 29 de la convention collective prévoit, dans les services travaillant en continu, une prime de panier par poste de nuit « d'un montant égal à une fois et demie le salaire minimum professionnel du coefficient 140 ». L'article 2 de l'accord du 26 mars 2025 la porte, à compter du 1er mai 2025, à « 1,6 fois le montant du salaire mensuel professionnel du coefficient 140 ». La version `2025.1` en avait fait 2 882,768 €/mois (1,6 fois le minimum mensuel), ce qui n'a pas de sens pour un panier.

Depuis `2025.2`, `prime de panier de nuit` est un montant **par poste de nuit, en euros** : 1,6 fois le SMP horaire du coefficient 140, soit 19,008 € en `2025.2` (11,88 €) et 19,232 € en `2026.1` (12,02 €, l'accord de 2026 ne modifiant pas le multiplicateur). **Lecture à confirmer** : le texte de l'accord écrit « mensuel » ; la lecture horaire est celle qui est cohérente avec l'article 29.

## Grille au 1er mai 2025 (versions `2025.1` et `2025.2`)

| Coefficient | Minimum mensuel (151,67 h) | SMP horaire | Prime horaire 3 ans | 6 ans | 9 ans | 12 ans | 15 ans |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 140 | 1 801,73 € | 11,88 € | 0,3564 € | 0,7128 € | 1,0692 € | 1,4255 € | 1,7819 € |
| 150 | 1 816,78 € | 11,98 € | 0,3594 € | 0,7187 € | 1,0781 € | 1,4375 € | 1,7968 € |
| 160 | 1 822,90 € | 12,02 € | 0,3606 € | 0,7211 € | 1,0817 € | 1,4423 € | 1,8029 € |
| 170 | 1 829,02 € | 12,06 € | 0,3618 € | 0,7236 € | 1,0854 € | 1,4471 € | 1,8089 € |
| 180 | 1 835,13 € | 12,10 € | 0,3630 € | 0,7260 € | 1,0890 € | 1,4520 € | 1,8150 € |
| 200 | 1 844,11 € | 12,16 € | 0,3648 € | 0,7295 € | 1,0943 € | 1,4591 € | 1,8238 € |
| 225 | 1 891,77 € | 12,47 € | 0,3742 € | 0,7484 € | 1,1226 € | 1,4968 € | 1,8710 € |
| 250 | 1 962,26 € | 12,94 € | 0,3881 € | 0,7763 € | 1,1644 € | 1,5526 € | 1,9407 € |
| 275 | 2 020,84 € | 13,32 € | 0,3997 € | 0,7995 € | 1,1992 € | 1,5989 € | 1,9986 € |
| 300 | 2 157,51 € | 14,23 € | 0,4268 € | 0,8535 € | 1,2803 € | 1,7070 € | 2,1338 € |
| 330 | 2 316,84 € | 15,28 € | 0,4583 € | 0,9166 € | 1,3748 € | 1,8331 € | 2,2914 € |
| 370 | 2 526,12 € | 16,66 € | – | – | – | – | – |
| 410 | 2 743,81 € | 18,09 € | – | – | – | – | – |
| 460 | 3 016,31 € | 19,89 € | – | – | – | – | – |
| 550 | 3 510,27 € | 23,14 € | – | – | – | – | – |
| 660 | 4 117,84 € | 27,15 € | – | – | – | – | – |
| 880 | 5 340,49 € | 35,21 € | – | – | – | – | – |

## Grille au 1er mai 2026 (version `2026.1`)

| Coefficient | Minimum mensuel (151,67 h) | SMP horaire | Prime horaire 3 ans | 6 ans | 9 ans | 12 ans | 15 ans |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 140 | 1 823,35 € | 12,02 € | 0,3606 € | 0,7212 € | 1,0818 € | 1,4424 € | 1,8030 € |
| 150 | 1 834,94 € | 12,09 € | 0,3627 € | 0,7254 € | 1,0881 € | 1,4508 € | 1,8135 € |
| 160 | 1 839,30 € | 12,12 € | 0,3636 € | 0,7272 € | 1,0908 € | 1,4544 € | 1,8180 € |
| 170 | 1 843,65 € | 12,15 € | 0,3645 € | 0,7290 € | 1,0935 € | 1,4580 € | 1,8225 € |
| 180 | 1 849,81 € | 12,19 € | 0,3657 € | 0,7314 € | 1,0971 € | 1,4628 € | 1,8285 € |
| 200 | 1 858,86 € | 12,25 € | 0,3675 € | 0,7350 € | 1,1025 € | 1,4700 € | 1,8375 € |
| 225 | 1 906,89 € | 12,56 € | 0,3768 € | 0,7536 € | 1,1304 € | 1,5072 € | 1,8840 € |
| 250 | 1 977,95 € | 13,04 € | 0,3912 € | 0,7824 € | 1,1736 € | 1,5648 € | 1,9560 € |
| 275 | 2 037,00 € | 13,42 € | 0,4026 € | 0,8052 € | 1,2078 € | 1,6104 € | 2,0130 € |
| 300 | 2 174,77 € | 14,34 € | 0,4302 € | 0,8604 € | 1,2906 € | 1,7208 € | 2,1510 € |
| 330 | 2 335,36 € | 15,40 € | 0,4620 € | 0,9240 € | 1,3860 € | 1,8480 € | 2,3100 € |
| 370 | 2 546,31 € | 16,79 € | – | – | – | – | – |
| 410 | 2 765,76 € | 18,23 € | – | – | – | – | – |
| 460 | 3 040,44 € | 20,04 € | – | – | – | – | – |
| 550 | 3 538,34 € | 23,32 € | – | – | – | – | – |
| 660 | 4 150,78 € | 27,36 € | – | – | – | – | – |
| 880 | 5 383,21 € | 35,49 € | – | – | – | – | – |

Les primes horaires de l'annexe sont calculées à partir du SMP non arrondi ; celles du modèle le sont à partir du SMP publié à deux décimales (écart maximal 0,0008 €).

## Audit des rubriques de paie

Les accords modifient les minima et, pour 2025, la prime de panier de nuit. Ils ne fournissent pas de taux ou d'assiette générique de cotisations, de santé, de prévoyance, de formation professionnelle, d'exonération, d'avantage en nature ou d'AT/MP calculable sans données supplémentaires. Ces rubriques restent donc hors périmètre ; les primes et remboursements ne sont pas intégrés automatiquement au minimum mensuel.

## Sources officielles

- Accord du 26 mars 2025 relatif aux salaires minima professionnels (SMP) au 1er mai 2025, Légifrance, `KALITEXT000051910288` ; arrêté du 13 juin 2025, JORF du 19 juin 2025.
- Accord du 3 mars 2026 relatif aux salaires minima professionnels (SMP) au 1er mai 2026, Légifrance, `KALITEXT000054337384` (BO 2026-16) ; arrêté du 19 mai 2026, JORF du 29 mai 2026.
- Article 29 de la convention collective nationale de la miroiterie, de la transformation et du négoce du verre du 9 mars 1988 (travail de nuit), `KALIARTI000005864135`.
