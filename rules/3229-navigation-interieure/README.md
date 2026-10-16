# Navigation intérieure — IDCC 3229

La version `2026.2` modélise l'intégralité des huit tableaux annexés au protocole d'accord du **17 décembre 2025** relatif aux salaires minima conventionnels (majoration de 1,0 % au 1er janvier 2026), applicables au **1er janvier 2026** et étendus par arrêté du **18 mai 2026** (JORF du 29 mai 2026). Elle remplace la version `2026.1` (même date d'effet), qui ne couvrait que la ligne Matelot, coefficient 001, de la flotte classique.

Le minimum est une **rémunération annuelle** brute, toutes primes incluses, hors primes de sujétions particulières (nuit, heures supplémentaires, compensations liées à l'organisation du temps de travail) et primes à caractère annuel. Les règles sont sous `salarié . convention collective . navigation intérieure`.

## Règles

- `classification` : clé de la ligne du barème, voir ci-dessous (texte, y compris la tranche d'ancienneté) ;
- `grille annuelle` : minimum annuel brut à temps plein (€/an) ;
- `salaire minimum annuel conventionnel` : minimum proratisé une seule fois par la quotité de travail (€/an) ;
- `classification hors grille` : vraie pour une clé absente du barème (le minimum vaut alors 0) ;
- `audit paie` : `non`.

## Clés de classification

- flotte classique : `matelot — <tranche>` (coefficient 001, clés inchangées depuis `2026.1`) et `classique — <emploi> <coefficient> — <tranche>` ; les coefficients 010 à 013 (timonier-conducteur) et 020 à 023 (capitaine) correspondent aux longueurs de convoi ou d'unité de 38,5 m, de plus de 38,5 m à moins de 70 m, de plus de 70 m à moins de 120 m et de plus de 120 m ;
- flotte exploitée en relève : `relève — <emploi> <coefficient> — <tranche>` (moins de 120 m : coefficients 106, 108, 110, 112, 114 ; plus de 120 m : 107, 109, 111, 113, 115, 117) ;
- tranches d'ancienneté de ces deux flottes : `0 à 3 ans`, `3 à 6 ans`, `6 à 9 ans`, `9 à 12 ans`, `12 à 15 ans`, `au-delà de 15 ans` ;
- personnel sédentaire : `sédentaire ouvrier|employé|agent de maîtrise — niveau <I à V> — <n>er|e échelon` ; `sédentaire cadre — position <I, II, III, III B, III C> — coefficient <n>` ;
- passagers : `passagers technique 1.00|2.00 — <emploi> — <tranche>`, `passagers hôtellerie restauration — <emploi> — <tranche>`, `passagers ETAM et cadres — <emploi> — <tranche>`, avec les tranches `sans ancienneté`, `plus de 3 ans`, `plus de 6 ans`, `plus de 9 ans` (le protocole écrit « après » pour l'hôtellerie restauration et les ETAM et cadres).

Les apostrophes des intitulés sont typographiques (`’`) dans les clés.

## Limites

- Le tableau des agents de maîtrise du protocole ne publie pas le 2e échelon du niveau I (1er, 3e et 4e échelons) : cette clé est hors grille, comme dans le texte.
- Le tableau des cadres sédentaires ne publie que le premier et le dernier coefficient de chaque position : les coefficients intermédiaires ne sont pas modélisés (hors grille). Cette lecture est à vérifier si une règle d'interpolation figure dans la convention collective.
- Le protocole prévoit une renégociation avant le 30 juin 2026 ; aucun texte postérieur n'était publié sur Légifrance à la date de cette version.

## Grilles

### Flotte classique (`classique — <emploi> <coefficient>`, `matelot` pour le coefficient 001)

| Clé (préfixe commun omis) | 0 à 3 ans | 3 à 6 ans | 6 à 9 ans | 9 à 12 ans | 12 à 15 ans | au-delà de 15 ans |
|---|---:|---:|---:|---:|---:|---:|
| `matelot` | 22 889 € | 23 576 € | 24 262 € | 24 949 € | 25 636 € | 26 322 € |
| `classique — matelot-timonier 004` | 23 205 € | 23 901 € | 24 597 € | 25 294 € | 25 990 € | 26 686 € |
| `classique — timonier-conducteur 010` | 23 309 € | 24 008 € | 24 707 € | 25 407 € | 26 106 € | 26 805 € |
| `classique — capitaine 020` | 24 563 € | 25 300 € | 26 037 € | 26 773 € | 27 510 € | 28 247 € |
| `classique — timonier-conducteur 011` | 24 069 € | 24 791 € | 25 513 € | 26 235 € | 26 957 € | 27 679 € |
| `classique — capitaine 021` | 25 303 € | 26 062 € | 26 822 € | 27 581 € | 28 340 € | 29 099 € |
| `classique — timonier-conducteur 012` | 24 563 € | 25 300 € | 26 037 € | 26 773 € | 27 510 € | 28 247 € |
| `classique — capitaine 022` | 27 155 € | 27 969 € | 28 784 € | 29 599 € | 30 413 € | 31 228 € |
| `classique — timonier-conducteur 013` | 25 797 € | 26 571 € | 27 345 € | 28 119 € | 28 893 € | 29 667 € |
| `classique — capitaine 023` | 29 623 € | 30 512 € | 31 401 € | 32 290 € | 33 178 € | 34 067 € |

### Flotte exploitée en relève (`relève — <emploi> <coefficient>`)

Les tirets signalent les tranches que le protocole ne renseigne pas : la clé correspondante est hors grille.

| Clé (préfixe commun omis) | 0 à 3 ans | 3 à 6 ans | 6 à 9 ans | 9 à 12 ans | 12 à 15 ans | au-delà de 15 ans |
|---|---:|---:|---:|---:|---:|---:|
| `relève — matelot débutant 100` | 22 889 € | – | – | – | – | – |
| `relève — matelot niveau 1 101` | 23 106 € | 23 799 € | 24 493 € | 25 186 € | – | – |
| `relève — matelot niveau 2 102` | 23 205 € | 23 901 € | 24 597 € | 25 294 € | 25 990 € | 26 686 € |
| `relève — maître matelot 104` | 23 452 € | 24 155 € | 24 859 € | 25 563 € | 26 266 € | 26 970 € |
| `relève — matelot garde moteur 104` | 23 452 € | 24 155 € | 24 859 € | 25 563 € | 26 266 € | 26 970 € |
| `relève — matelot-timonier 104` | 23 452 € | 24 155 € | 24 859 € | 25 563 € | 26 266 € | 26 970 € |
| `relève — mécanicien 106` | 24 452 € | 25 186 € | 25 919 € | 26 653 € | 27 387 € | 28 120 € |
| `relève — timonier-conducteur 106` | 24 563 € | 25 300 € | 26 037 € | 26 773 € | 27 510 € | 28 247 € |
| `relève — maître mécanicien 108` | 26 112 € | 26 895 € | 27 679 € | 28 462 € | 29 245 € | 30 029 € |
| `relève — second capitaine 110` | 27 155 € | 27 969 € | 28 784 € | 29 599 € | 30 413 € | 31 228 € |
| `relève — 1er capitaine 112` | 30 302 € | 31 211 € | 32 120 € | 33 030 € | 33 939 € | 34 848 € |
| `relève — 1er capitaine responsable de bord 114` | 30 426 € | 31 339 € | 32 251 € | 33 164 € | 34 077 € | 34 990 € |
| `relève — mécanicien 107` | 24 576 € | 25 313 € | 26 050 € | 26 787 € | 27 525 € | 28 262 € |
| `relève — timonier-conducteur 107` | 24 686 € | 25 427 € | 26 167 € | 26 908 € | 27 649 € | 28 389 € |
| `relève — maître mécanicien 109` | 26 235 € | 27 022 € | 27 809 € | 28 596 € | 29 384 € | 30 171 € |
| `relève — second capitaine 111` | 27 895 € | 28 732 € | 29 569 € | 30 406 € | 31 243 € | 32 080 € |
| `relève — 1er capitaine 113` | 31 164 € | 32 099 € | 33 034 € | 33 969 € | 34 904 € | 35 838 € |
| `relève — 1er capitaine responsable de bord 115` | 31 287 € | 32 226 € | 33 165 € | 34 103 € | 35 042 € | 35 980 € |
| `relève — commandant 117` | 34 612 € | 35 651 € | 36 689 € | 37 727 € | 38 766 € | 39 804 € |

### Personnel sédentaire, ouvriers

| Clé | Coefficient | Minimum annuel |
|---|---:|---:|
| `sédentaire ouvrier — niveau I — 1er échelon` | 76 | 22 070 € |
| `sédentaire ouvrier — niveau I — 2e échelon` | 78 | 22 253 € |
| `sédentaire ouvrier — niveau I — 3e échelon` | 80 | 22 498 € |
| `sédentaire ouvrier — niveau II — 1er échelon` | 81 | 22 583 € |
| `sédentaire ouvrier — niveau II — 2e échelon` | 83 | 22 947 € |
| `sédentaire ouvrier — niveau II — 3e échelon` | 86 | 23 379 € |
| `sédentaire ouvrier — niveau III — 1er échelon` | 87 | 23 561 € |
| `sédentaire ouvrier — niveau III — 2e échelon` | 90 | 24 107 € |
| `sédentaire ouvrier — niveau III — 3e échelon` | 93 | 24 970 € |
| `sédentaire ouvrier — niveau IV — 1er échelon` | 94 | 25 237 € |
| `sédentaire ouvrier — niveau IV — 2e échelon` | 101 | 27 103 € |
| `sédentaire ouvrier — niveau IV — 3e échelon` | 106 | 28 421 € |
| `sédentaire ouvrier — niveau V — 1er échelon` | 107 | 28 687 € |
| `sédentaire ouvrier — niveau V — 2e échelon` | 110 | 29 502 € |
| `sédentaire ouvrier — niveau V — 3e échelon` | 118 | 30 933 € |

### Personnel sédentaire, employés

| Clé | Coefficient | Minimum annuel |
|---|---:|---:|
| `sédentaire employé — niveau I — 1er échelon` | 76 | 22 070 € |
| `sédentaire employé — niveau I — 2e échelon` | 78 | 22 192 € |
| `sédentaire employé — niveau I — 3e échelon` | 80 | 22 376 € |
| `sédentaire employé — niveau II — 1er échelon` | 81 | 22 621 € |
| `sédentaire employé — niveau II — 2e échelon` | 83 | 22 705 € |
| `sédentaire employé — niveau II — 3e échelon` | 86 | 23 069 € |
| `sédentaire employé — niveau III — 1er échelon` | 87 | 23 494 € |
| `sédentaire employé — niveau III — 2e échelon` | 90 | 24 100 € |
| `sédentaire employé — niveau III — 3e échelon` | 93 | 24 970 € |
| `sédentaire employé — niveau IV — 1er échelon` | 94 | 25 237 € |
| `sédentaire employé — niveau IV — 2e échelon` | 97 | 26 036 € |
| `sédentaire employé — niveau IV — 3e échelon` | 101 | 27 103 € |
| `sédentaire employé — niveau V — 1er échelon` | 102 | 27 368 € |
| `sédentaire employé — niveau V — 2e échelon` | 106 | 28 421 € |
| `sédentaire employé — niveau V — 3e échelon` | 110 | 29 502 € |

### Personnel sédentaire, agents de maîtrise

| Clé | Coefficient | Minimum annuel |
|---|---:|---:|
| `sédentaire agent de maîtrise — niveau I — 1er échelon` | 102 | 27 341 € |
| `sédentaire agent de maîtrise — niveau I — 3e échelon` | 106 | 28 393 € |
| `sédentaire agent de maîtrise — niveau I — 4e échelon` | 110 | 29 472 € |
| `sédentaire agent de maîtrise — niveau II — 1er échelon` | 111 | 29 738 € |
| `sédentaire agent de maîtrise — niveau II — 2e échelon` | 115 | 30 804 € |
| `sédentaire agent de maîtrise — niveau II — 3e échelon` | 120 | 30 972 € |
| `sédentaire agent de maîtrise — niveau III — 1er échelon` | 121 | 31 182 € |
| `sédentaire agent de maîtrise — niveau III — 2e échelon` | 126 | 32 331 € |
| `sédentaire agent de maîtrise — niveau III — 3e échelon` | 132 | 33 803 € |

### Personnel sédentaire, cadres

| Clé | Coefficient | Minimum annuel |
|---|---:|---:|
| `sédentaire cadre — position I — coefficient 111` | 111 | 29 709 € |
| `sédentaire cadre — position I — coefficient 132` | 132 | 33 769 € |
| `sédentaire cadre — position II — coefficient 133` | 133 | 35 001 € |
| `sédentaire cadre — position II — coefficient 155` | 155 | 40 812 € |
| `sédentaire cadre — position III — coefficient 156` | 156 | 41 161 € |
| `sédentaire cadre — position III — coefficient 175` | 175 | 46 173 € |
| `sédentaire cadre — position III B — coefficient 176` | 176 | 46 482 € |
| `sédentaire cadre — position III B — coefficient 207` | 207 | 57 402 € |
| `sédentaire cadre — position III C — coefficient 208` | 208 | 57 682 € |
| `sédentaire cadre — position III C — coefficient 255` | 255 | 72 886 € |

### Passagers, navigant technique, 1.00 bateaux pour excursion journalière

| Clé (préfixe commun omis) | sans ancienneté | plus de 3 ans | plus de 6 ans | plus de 9 ans |
|---|---:|---:|---:|---:|
| `passagers technique 1.00 — matelot` | 22 287 € | 22 463 € | 22 682 € | 23 120 € |
| `passagers technique 1.00 — matelot agent de sécurité` | 22 408 € | 22 507 € | 22 726 € | 23 164 € |
| `passagers technique 1.00 — capitaine classe 2 (moins de 35 m)` | 22 549 € | 22 728 € | 22 950 € | 23 392 € |
| `passagers technique 1.00 — capitaine classe 1 (plus de 35 m) 3e type de voyages et de voies` | 22 618 € | 23 026 € | 23 477 € | 23 930 € |
| `passagers technique 1.00 — capitaine classe 1 (plus de 35 m) 2e type de voyages et de voies` | 24 627 € | 25 070 € | 25 563 € | 26 055 € |
| `passagers technique 1.00 — capitaine classe 1 (plus de 35 m) 1er type de voyages et de voies` | 25 807 € | 26 272 € | 26 788 € | 27 304 € |

### Passagers, navigant technique, 2.00 bateaux à cabines

| Clé (préfixe commun omis) | sans ancienneté | plus de 3 ans | plus de 6 ans | plus de 9 ans |
|---|---:|---:|---:|---:|
| `passagers technique 2.00 — matelot` | 22 287 € | 22 463 € | 22 682 € | 23 120 € |
| `passagers technique 2.00 — matelot agent de sécurité` | 22 408 € | 22 507 € | 22 726 € | 23 164 € |
| `passagers technique 2.00 — timonier exploitation diurne` | 22 531 € | 22 669 € | 22 891 € | 23 331 € |
| `passagers technique 2.00 — timonier autres types d’exploitation` | 22 653 € | 22 728 € | 22 950 € | 23 392 € |
| `passagers technique 2.00 — capitaine classe 2 (moins de 35 m)` | 22 776 € | 22 956 € | 23 186 € | 23 632 € |
| `passagers technique 2.00 — capitaine classe 1 exploitation diurne plus de 35 m 3e type` | 22 796 € | 23 206 € | 23 662 € | 24 118 € |
| `passagers technique 2.00 — capitaine classe 1 exploitation diurne plus de 35 m 1er et 2e type` | 28 144 € | 28 651 € | 29 214 € | 29 777 € |
| `passagers technique 2.00 — capitaine classe 1 exploitation diurne plus de 55 m 3e type` | 23 771 € | 24 199 € | 24 674 € | 25 149 € |
| `passagers technique 2.00 — capitaine classe 1 exploitation diurne plus de 55 m 1er et 2e type` | 31 258 € | 31 821 € | 32 447 € | 33 071 € |
| `passagers technique 2.00 — capitaine classe 1 autres exploitations plus de 35 m` | 35 759 € | 36 403 € | 37 118 € | 37 833 € |
| `passagers technique 2.00 — capitaine classe 1 autres exploitations plus de 55 m` | 36 503 € | 37 161 € | 37 890 € | 38 620 € |

### Passagers, hôtellerie restauration

| Clé (préfixe commun omis) | sans ancienneté | plus de 3 ans | plus de 6 ans | plus de 9 ans |
|---|---:|---:|---:|---:|
| `passagers hôtellerie restauration — chef de cabine` | 22 578 € | 22 761 € | 23 209 € | 23 656 € |
| `passagers hôtellerie restauration — maître d’hôtel` | 24 639 € | 25 083 € | 25 577 € | 26 069 € |
| `passagers hôtellerie restauration — assistant du directeur ou du commissaire de bord` | 27 250 € | 27 740 € | 28 285 € | 28 829 € |
| `passagers hôtellerie restauration — chef de cuisine` | 31 598 € | 32 167 € | 32 799 € | 33 431 € |
| `passagers hôtellerie restauration — directeur ou commissaire de bord` | 34 786 € | 35 412 € | 36 108 € | 36 803 € |

### Passagers, ETAM et cadres

| Clé (préfixe commun omis) | sans ancienneté | plus de 3 ans | plus de 6 ans | plus de 9 ans |
|---|---:|---:|---:|---:|
| `passagers ETAM et cadres — employé niveau I (débutant, 6 mois de pratique)` | 22 287 € | – | – | – |
| `passagers ETAM et cadres — employé niveau II` | 23 135 € | 23 482 € | 23 829 € | 24 176 € |
| `passagers ETAM et cadres — employé niveau III` | 26 865 € | 27 268 € | 27 670 € | 28 073 € |
| `passagers ETAM et cadres — agent de maîtrise niveau IV maîtrise` | 28 126 € | 28 549 € | 28 970 € | 29 392 € |
| `passagers ETAM et cadres — agent de maîtrise niveau V haute-maîtrise` | 32 151 € | 32 633 € | 33 115 € | 33 599 € |
| `passagers ETAM et cadres — cadre niveau VI` | 34 208 € | 34 721 € | 35 234 € | 35 747 € |
| `passagers ETAM et cadres — cadre supérieur niveau VII` | 58 601 € | 59 480 € | 60 360 € | 61 238 € |

## Audit explicite des rubriques de paie

Les textes officiels du protocole salarial, de la convention et de l'arrêté d'extension ont été recherchés pour :

- **Cotisations salarié/employeur, taux et assiettes** : le protocole fixe des minima de rémunération, sans taux ni assiette conventionnels génériques ; aucun taux n'est ajouté.
- **Plafonds, tranches et forfaits** : aucun plafond, tranche ou forfait de cotisation n'est fixé par ce texte.
- **Santé et prévoyance** : aucun taux ou montant applicable à toute la population n'est publié dans le protocole salarial.
- **Retraite, formation professionnelle, AT/MP** : aucune cotisation conventionnelle n'est créée ou modifiée par le protocole.
- **Primes, avantages et frais** : la garantie annuelle publiée ne permet pas de calculer automatiquement les primes de navigation, indemnités, avantages en nature ou remboursements de frais sans données individuelles.
- **Base de comparaison** : la garantie annuelle brute publiée, proratisée uniquement par la quotité de travail, sans conversion mensuelle.

## Sources officielles

- [Protocole d'accord du 17 décembre 2025 relatif aux salaires minima conventionnels](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054370921), Légifrance `KALITEXT000054370921` (BO 2026-15), ligne Matelot : `KALIARTI000054370936`.
- [Arrêté du 18 mai 2026 portant extension](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054149359), Journal officiel du 29 mai 2026.
- Convention collective nationale du personnel des entreprises de transport en navigation intérieure du 20 décembre 2018, IDCC 3229.
