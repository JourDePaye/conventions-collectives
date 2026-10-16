# Coopératives de consommateurs salariés — IDCC 3205

Modèle `3205-cooperatives-consommateurs`, versions `2026.1`, `2026.2` et `2026.3`,
espace de noms `salarié . convention collective . coopératives de consommateurs`.

## Périmètre

Chaque revalorisation des salaires minima est une version distincte, avec sa date d'effet :

| Version | Texte | Date d'effet | Extension |
|---|---|---|---|
| `2026.1` | Avenant n° 932 du 29 janvier 2026 | 1er février 2026 | Arrêté du 4 mai 2026, JORF du 10 mai 2026 |
| `2026.2` | Avenant n° 933 du 16 avril 2026 | 1er mai 2026 | Arrêté du 6 juillet 2026, JORF du 10 juillet 2026, sous réserve du respect du SMIC |
| `2026.3` | Avenant n° 934 du 18 juin 2026 | 1er juillet 2026 | Arrêté du 7 septembre 2026, JORF du 19 septembre 2026 |

Les trois avenants sont étendus : aucune règle d'adhésion à une organisation signataire n'est nécessaire et chaque
version s'applique à sa date d'effet. Les minima sont mensuels, pour 151,67 heures.

## Grille mensuelle 2026

La classification est le **groupe** : 1 à 7, 8a, 8b, 9a et 9b (11 groupes).

| Groupe | Avenant 932 (1er février) | Avenant 933 (1er mai) | Avenant 934 (1er juillet) |
|---|---:|---:|---:|
| 1 | 1 823,50 € | 1 824,00 € | 1 867,50 € |
| 2 | 1 874,69 € | 1 880,31 € | 1 889,71 € |
| 3 | 1 897,40 € | 1 903,09 € | 1 912,61 € |
| 4 | 1 913,76 € | 1 919,50 € | 1 929,10 € |
| 5 | 1 943,37 € | 1 949,20 € | 1 958,95 € |
| 6 | 2 017,88 € | 2 023,93 € | 2 034,05 € |
| 7 | 2 162,02 € | 2 168,51 € | 2 179,35 € |
| 8a | 2 511,04 € | 2 518,57 € | 2 531,16 € |
| 8b | 2 658,60 € | 2 666,58 € | 2 679,91 € |
| 9a | 2 779,33 € | 2 787,67 € | 2 801,61 € |
| 9b | 3 634,24 € | 3 645,14 € | 3 663,37 € |

Le `salaire minimum conventionnel` est proratisé une seule fois par la quotité de travail.
Un groupe absent de la grille est signalé par `groupe hors grille` et donne un minimum nul afin
que l'application appelante puisse bloquer le calcul.

## Sources officielles

- [Légifrance — avenant n° 932 du 29 janvier 2026](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054303994)
- [Légifrance — avenant n° 933 du 16 avril 2026](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054872346)
- [Légifrance — avenant n° 934 du 18 juin 2026](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054982101)
- [Légifrance — convention collective nationale](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000030185307)

## Limites

Seuls les minima mensuels sont modélisés ; les primes, indemnités et autres dispositions de la
convention ne le sont pas. Les contrôles SMIC (l'avenant n° 933 est étendu sous réserve) et le
choix de la version applicable à la période de paie restent à la charge de l'application
consommatrice.
