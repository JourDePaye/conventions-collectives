# Bâtiment — ouvriers des entreprises de plus de 10 salariés (IDCC 1597)

Modèle `1597-batiment-ouvriers-plus-de-10`, version `2026.1`, espace de noms
`salarié . convention collective . bâtiment ouvriers plus de 10 salariés`.

## Périmètre juridiquement borné

Cette version modélise uniquement les ouvriers des entreprises occupant plus de 10 salariés. La grille de salaire est limitée à la région **Nouvelle-Aquitaine**, aux coefficients 150, 170, 185, 210, 230, 250 et 270, et à la période du 1er janvier au 31 décembre 2026. Aucune extrapolation nationale ou régionale n'est fournie. Les cadres, coefficients non vérifiés, années hors couverture, primes et indemnités de déplacement restent hors modèle.

## Grille mensuelle Nouvelle-Aquitaine — 2026

| Coefficient | Minimum brut mensuel | Taux horaire |
|---:|---:|---:|
| 150 | 1 838,24 € | 12,12 € |
| 170 | 1 862,51 € | 12,28 € |
| 185 | 1 912,56 € | 12,61 € |
| 210 | 2 073,33 € | 13,67 € |
| 230 | 2 229,55 € | 14,70 € |
| 250 | 2 399,42 € | 15,82 € |
| 270 | 2 560,19 € | 16,88 € |

Montants issus de l'accord régional Nouvelle-Aquitaine du 22 octobre 2025, applicable au 1er janvier 2026. Le modèle ne fabrique pas de barème pour les coefficients ou régions non vérifiés.

## Comportements BTP isolés dans ce modèle

Les règles restent dans l'espace de noms IDCC 1597 et ne redéfinissent pas les clés globales BTP de `modele-social`.

- **Congés payés CIBTP** : taux 2026 de 20,70 % sur l'assiette standard, avec caisse de rattachement explicitement exposée.
- **Chômage intempéries** : assiette plafonnée au plafond de sécurité sociale ; 0,68 % pour le gros œuvre/travaux publics, 0,13 % pour le second œuvre, zéro pour une activité non exposée. L'abattement annuel par entreprise n'est pas calculé salarié par salarié.
- **RNPC cadres** : uniquement lorsqu'un consommateur demande explicitement le cas cadre ; la tranche A employeur de 1,50 % remplace la prévoyance cadre de droit commun et la tranche C optionnelle n'est pas calculée. Un cadre n'est pas rendu éligible à la grille ouvrière.
- **OPPBTP** : 0,11 % sur les salaires bruts majorés de 13,14 %, dans le total employeur BTP de ce namespace.

## Sources

- [Légifrance — accord régional Nouvelle-Aquitaine du 22 octobre 2025](https://www.legifrance.gouv.fr/conv_coll/id/KALIARTI000053497380), étendu par arrêté publié au JORF le 17 janvier 2026.
- [CIBTP Grand-Ouest — cotisations congés payés](https://www.cibtp-grandouest.fr/entreprise/declarations-cotisations/cotisations-conges-payes), taux 2026 et assiettes des cotisations BTP.
- [PRO BTP — notice entreprise assiette et taux](https://www.probtp.com/files/live/sites/probtp/files/media/pdf/PRO/declarations/notice-entreprise-assiette-taux.pdf), régime de prévoyance cadres BTP.

## Limites

La présente version ne prétend pas couvrir les autres régions, les ETAM, les cadres pour le salaire minimum, les primes de vacances, les indemnités de déplacement, les remboursements d'intempéries ni l'abattement annuel d'entreprise. La caisse CIBTP est un paramètre déclaré ; aucune affectation automatique de caisse à partir de la région n'est déduite.
