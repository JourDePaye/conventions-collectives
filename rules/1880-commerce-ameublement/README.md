# Négoce de l'ameublement — IDCC 1880

Modèle `1880-commerce-ameublement`, version `2026.1`, espace de noms
`salarié . convention collective . commerce de l'ameublement`.

Convention collective nationale du négoce de l'ameublement du 31 mai 1995
(intitulé Légifrance).

## Périmètre

La version `2026.1` couvre la grille des salaires minima mensuels de l'accord du
19 mars 2026 (article 1er), sur la base de 151,67 heures : 9 groupes, 23 positions.

**Date d'effet.** L'article 2 applique la grille à compter du **1er mai 2026** pour
les adhérents de la CNEF, et à compter de l'extension pour les entreprises non
adhérentes. L'accord est étendu par arrêté du 11 juin 2026 (JORF du 27 juin 2026),
sous réserve de l'application des dispositions relatives au SMIC. `validFrom` est
le 1er mai 2026 ; pour un employeur non adhérent, la grille ne s'impose qu'à partir
du 28 juin 2026.

## Grille mensuelle 2026

Clé de classification (`niveau`) : `groupe.niveau`, le groupe 1 (niveau unique) se note `1`.

| Groupe | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---:|---:|---:|
| 1 (niveau unique, clé `1`) | 1 830 € | | |
| 2 | 1 835 € | 1 839 € | 1 845 € |
| 3 | 1 863 € | 1 885 € | 1 916 € |
| 4 | 1 956 € | 1 986 € | 2 016 € |
| 5 | 2 098 € | 2 139 € | 2 244 € |
| 6 | 2 395 € | 2 468 € | 2 541 € |
| 7 | 2 725 € | 3 129 € | 3 354 € |
| 8 | 3 545 € | 3 862 € | |
| 9 | 4 507 € | 4 970 € | |

Le `salaire minimum conventionnel` est proratisé une seule fois par la quotité de
travail. Une classification absente de la grille est signalée par `niveau hors grille`
et donne un minimum nul.

## Sources officielles

- [Légifrance — accord du 19 mars 2026 relatif aux salaires minima pour l'année 2026](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054426659)

## Limites

Seule la grille des minima est modélisée. Les primes, indemnités et autres dispositions
de la convention ne le sont pas. Les contrôles SMIC (l'extension est prononcée sous
réserve) et le choix de la version applicable restent à la charge de l'application.
