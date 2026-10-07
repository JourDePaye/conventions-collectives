# Cabinets dentaires — IDCC 1619

Le fichier [2026.1](1619-cabinets-dentaires.2026.1.publicodes) entre en vigueur le 1er janvier 2026. Il est fondé sur l’accord du 12 février 2026 relatif aux salaires minima conventionnels, étendu par arrêté du 15 juillet 2026 (JORF n° 0170 du 23 juillet 2026), cités dans ses métadonnées. La valeur Publicodes est `cabinets dentaires` ; les règles sont sous `salarié . convention collective . cabinets dentaires`.

La convention collective nationale des cabinets dentaires du 17 janvier 1992 (brochure 3255) fixe des taux horaires minima par emploi, sans valeur de point.

## Règles implémentées

- `niveau` reçoit l’emploi, parmi les neuf codes suivants (défaut : `non renseigné`) :

| Code | Emploi | Taux horaire | Minimum mensuel (151,67 h) |
|---|---|---|---|
| `entretien` | personnel d'entretien | 12,02 € | 1 823,07 € |
| `reception` | réceptionniste, hôtesse | 12,02 € | 1 823,07 € |
| `secretaire-technique` | secrétaire technique | 13,78 € | 2 090,01 € |
| `aide-dentaire` | aide dentaire | 12,56 € | 1 904,98 € |
| `assistant-dentaire` | assistant dentaire qualifié | 13,93 € | 2 112,76 € |
| `prothesiste-1` | prothésiste niveau 1 | 12,94 € | 1 962,61 € |
| `prothesiste-2` | prothésiste niveau 2 | 16,34 € | 2 478,29 € |
| `prothesiste-3` | prothésiste niveau 3 | 20,21 € | 3 065,25 € |
| `prothesiste-4` | prothésiste niveau 4 | 22,00 € | 3 336,74 € |

- `salaire minimum conventionnel . grille` donne le minimum mensuel à temps plein : le taux horaire multiplié par 151,67 heures, arrondi au centime.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, l’assistant dentaire vaut 2 112,76 €/mois à temps complet (13,93 € × 151,67 h) et 1 056,38 €/mois à mi-temps.
- `niveau hors grille` signale un emploi absent des neuf codes. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Les emplois d’entretien et de réception (12,02 €/h, soit 1 823,07 €) sont inférieurs au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- Les pages consultées donnent des montants mensuels qui diffèrent d’un centime de ceux de la règle (par exemple 2 112,77 € contre 2 112,76 € pour l’assistant dentaire), selon l’arrondi de 151,67 heures : la règle multiplie le taux horaire par 151,67 heures.
- Le texte de l’accord n’a pas pu être lu : les neuf taux viennent de trois pages de synthèse concordantes (juristique.org, cftc-santesociaux.fr et payfit.com), les dates de l’arrêté de pages de presse syndicale et d’un éditeur, son numéro de texte et son NOR ne sont pas vérifiés. Une page consultée, qui donnait une valeur du point et des coefficients, était incohérente avec les autres et n’a pas été retenue. À recouper avec l’accord sur Légifrance.
- Les employeurs non adhérents aux organisations signataires ne sont tenus par l’accord qu’à compter du lendemain de la publication de l’arrêté (24 juillet 2026) : cette distinction n’est pas modélisée.
- La prime d’ancienneté (2 % à partir de 2 ans, puis 1 % par an, plafonnée à 20 %), les primes de mention (administrative, ODF, secrétariat à l’embauche, de 205 € à 220 € par mois d’après les pages consultées) et les règles des contrats de formation ne sont pas modélisées.
- Les grilles antérieures au 1er janvier 2026 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
