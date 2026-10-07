# Coiffure et professions connexes — IDCC 2596

Le fichier [2026.1](2596-coiffure.2026.1.publicodes) entre en vigueur le 1er mars 2026. Il est fondé sur l’avenant n° 51 du 3 décembre 2025 relatif aux salaires minima, étendu par arrêté du 17 février 2026, cités dans ses métadonnées. La valeur Publicodes est `coiffure` ; les règles sont sous `salarié . convention collective . coiffure`.

La convention collective nationale de la coiffure et des professions connexes du 10 juillet 2006 (brochure 3159) a quatre filières : technique de la coiffure (niveaux et échelons), esthétique-cosmétique, non technique et administrative (coefficients).

## Règles implémentées

- `niveau` reçoit l’un des 30 codes suivants (défaut : `non renseigné`), qui ne sont pas ceux de la convention : un même coefficient ou échelon existe dans plusieurs filières, et deux emplois du niveau 3 partagent un échelon.

| Code | Classification | Minimum mensuel (151,67 h) |
|---|---|---|
| `T1.1` | technique, niveau 1, échelon 1, coiffeur débutant | 1 843,00 € |
| `T1.2` | technique, niveau 1, échelon 2, coiffeur | 1 843,00 € |
| `T1.3` | technique, niveau 1, échelon 3, coiffeur confirmé | 1 845,00 € |
| `T2.1` | technique, niveau 2, échelon 1, coiffeur qualifié ou technicien | 1 869,00 € |
| `T2.2` | technique, niveau 2, échelon 2, coiffeur hautement qualifié | 1 944,00 € |
| `T2.3` | technique, niveau 2, échelon 3, coiffeur très hautement qualifié | 2 055,00 € |
| `T3.1` | technique, niveau 3, échelon 1, manager | 2 183,00 € |
| `T3.2` | technique, niveau 3, échelon 2, manager confirmé | 2 623,00 € |
| `T3.2R` | technique, niveau 3, échelon 2, animateur de réseau | 3 122,00 € |
| `T3.3` | technique, niveau 3, échelon 3, manager hautement qualifié | 3 271,00 € |
| `T3.3R` | technique, niveau 3, échelon 3, animateur de réseau confirmé | 3 367,00 € |
| `EC105` | esthétique-cosmétique, coefficient 105 | 1 843,00 € |
| `EC115` | esthétique-cosmétique, coefficient 115 | 1 843,00 € |
| `EC125` | esthétique-cosmétique, coefficient 125 | 1 845,00 € |
| `EC135` | esthétique-cosmétique, coefficient 135 | 1 855,00 € |
| `EC145` | esthétique-cosmétique, coefficient 145 | 1 871,00 € |
| `EC155` | esthétique-cosmétique, coefficient 155 | 1 944,00 € |
| `EC165` | esthétique-cosmétique, coefficient 165 | 2 055,00 € |
| `NT100` | non technique, coefficient 100 | 1 843,00 € |
| `NT110` | non technique, coefficient 110 | 1 843,00 € |
| `NT120` | non technique, coefficient 120 | 1 845,00 € |
| `NT130` | non technique, coefficient 130 | 1 855,00 € |
| `A230` | administrative, coefficient 230 | 1 919,00 € |
| `A240` | administrative, coefficient 240 | 1 919,00 € |
| `A250` | administrative, coefficient 250 | 1 952,00 € |
| `A285` | administrative, coefficient 285 | 2 220,00 € |
| `A295` | administrative, coefficient 295 | 2 251,00 € |
| `A305` | administrative, coefficient 305 | 2 363,00 € |
| `A330` | administrative, coefficient 330 | 2 477,00 € |
| `A330P` | administrative, coefficient supérieur à 330 | 2 806,00 € |

- `salaire minimum conventionnel . grille` donne le minimum mensuel à temps plein de ces classifications.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, `T2.1` vaut 1 869,00 €/mois à temps complet et 934,50 €/mois à mi-temps.
- `niveau hors grille` signale une classification absente de ces codes. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Les classifications de 1 843 € à 1 855 € (niveau 1 technique, esthétique-cosmétique jusqu’au coefficient 135, non technique) sont inférieures au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- Le texte de l’avenant n’a pas pu être lu : les montants viennent de trois pages de synthèse concordantes (payfit.com, fiche-paie.net et convention.fr). La date de publication de l’arrêté d’extension diffère selon les pages (17 février ou 24 février 2026) et son numéro de texte et son NOR ne sont pas vérifiés. À recouper avec l’avenant sur Légifrance.
- Le code `A330P` désigne la ligne « 330+ » des pages de synthèse (2 806 €), dont le sens exact (coefficient supérieur à 330) n’a pas pu être vérifié.
- La prime d’ancienneté (de 36 € à 5 ans à 117 € à 20 ans par mois d’après les pages consultées), les autres primes, la prévoyance et le contrat d’apprentissage ne sont pas modélisés.
- Les grilles antérieures au 1er mars 2026 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
