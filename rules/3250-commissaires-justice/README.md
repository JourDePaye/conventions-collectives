# Commissaires de justice et sociétés de ventes volontaires — IDCC 3250

Modèle `3250-commissaires-justice`, versions `2025.1` et `2026.1`, espace de noms
`salarié . convention collective . commissaires de justice et sociétés de ventes volontaires`.

## Périmètre

Convention collective nationale du 16 novembre 2022, étendue par arrêté du 10 juillet 2024.
Les avenants salariaux sont étendus, aucune règle `adhérent d'une organisation signataire` n'est donc nécessaire.

| Version | Date d'effet | Texte |
|---|---|---|
| `2025.1` | 1er janvier 2025 | Avenant n° 8 du 19 décembre 2024, étendu par arrêté du 15 mai 2025 (JORF du 7 juin 2025) |
| `2026.1` | 1er avril 2026 | Avenant n° 12 du 16 mars 2026, étendu par arrêté du 18 mai 2026 (JORF du 29 mai 2026, BO 2026-14) |

Le minimum conventionnel (article 41.1) est calculé à partir de deux valeurs de point : une valeur de
référence pour les 214 premiers points de chaque coefficient (8,65 € en 2025, 8,87 € depuis le
1er avril 2026) et une valeur complémentaire de 8,19 € au-delà. L'avenant n° 12 ne change que la valeur
de référence ; la valeur complémentaire n'y est pas répétée, mais tous les montants publiés de la grille
la vérifient. Le modèle porte les montants de l'annexe, pas la formule.

## Classification

La saisie est `classification`, sous la forme `<catégorie>-<coefficient>` : `I-214`, `II-296`,
`IIbis-230`, `III-470`. La catégorie est nécessaire car certains coefficients existent dans plusieurs
catégories (214, 270, 302, 317).

Catégorie I (support) : 214, 215, 219, 223, 270, 283, 299, 300, 302, 317, 331, 345, 360, 410.
Catégorie II (exercice de la profession) : 214, 221, 231, 240, 246, 250, 258, 270, 296, 302, 315, 317, 365, 400, 447, 456.
Catégorie II bis (accès à la profession) : 217, 230. Catégorie III (responsables de l'office) : 393, 403, 441, 460, 470, 542.

## Grille mensuelle (151,67 heures)

| Clé | 2025.1 | 2026.1 | Emploi repère (exemple) |
|---|---:|---:|---|
| I-214 | 1 851,10 € | 1 898,18 € | Agent d'entretien, employé administratif |
| I-270 | 2 309,74 € | 2 356,82 € | Comptable |
| I-410 | 3 456,34 € | 3 503,42 € | Directeur juridique |
| II-214 | 1 851,10 € | 1 898,18 € | Assesseur des appréciateurs des crédits municipaux |
| II-296 | 2 522,68 € | 2 569,76 € | Clerc gestionnaire |
| II-456 | 3 833,08 € | 3 880,16 € | Commissaire-priseur habilité |
| IIbis-217 | 1 875,67 € | 1 922,75 € | OVV stagiaire |
| IIbis-230 | 1 982,14 € | 2 029,22 € | Commissaire de justice stagiaire |
| III-393 | 3 317,11 € | 3 364,19 € | Directeur de département |
| III-470 | 3 947,74 € | 3 994,82 € | Commissaire de justice salarié |
| III-542 | 4 537,42 € | 4 584,50 € | Directeur général |

Les 38 lignes sont dans les fichiers de règles. Le `salaire minimum conventionnel` (€/mois) est proratisé
une seule fois par la quotité de travail. Une classification absente de la grille est signalée par
`classification hors grille` et donne un minimum nul.

## Sources officielles

- [Légifrance — avenant n° 12 du 16 mars 2026](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054177556)
- [Légifrance — avenant n° 8 du 19 décembre 2024](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051352624)
- [Légifrance — convention collective nationale](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000047212228)

## Limites

Seuls les minima de la grille sont modélisés (le règlement de l'`audit paie` est à `non`). Les primes,
indemnités et autres dispositions ne le sont pas. Le choix de la version applicable à la période de paie
et le contrôle du SMIC restent à la charge de l'application consommatrice. La version `2025.1` couvre
aussi janvier à mars 2026 ; les versions antérieures à 2025 ne sont pas modélisées.
