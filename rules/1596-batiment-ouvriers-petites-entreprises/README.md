# Bâtiment — ouvriers des entreprises jusqu'à 10 salariés (IDCC 1596)

Modèle `1596-batiment-ouvriers-petites-entreprises`, version `2026.2`, espace de noms
`salarié . convention collective . bâtiment ouvriers petites entreprises`.

## Périmètre juridiquement borné

Cette version modélise uniquement les ouvriers des entreprises occupant jusqu'à 10 salariés. La grille de salaire est limitée à la région **Centre-Val de Loire**, aux coefficients 150, 170, 185, 210, 230, 250 et 270, et à la période du 1er mai au 31 décembre 2026. La valeur de `région` doit être celle du champ territorial de l'entreprise, pas le domicile du salarié.

Aucune grille nationale ni extrapolation vers une autre région n'est fournie. Les ETAM, cadres pour le calcul du salaire minimum, autres régions, années antérieures ou postérieures, primes et indemnités de déplacement ne sont pas couverts. Ces cas donnent un salaire minimum conventionnel non applicable (`null`).

## Grille mensuelle Centre-Val de Loire — 2026

| Coefficient | Minimum brut mensuel |
|---:|---:|
| 150 | 1 823 € |
| 170 | 1 863 € |
| 185 | 1 907 € |
| 210 | 2 056 € |
| 230 | 2 175 € |
| 250 | 2 293 € |
| 270 | 2 412 € |

Les montants sont ceux de l'accord régional référencé par `KALITEXT000054936694`. Le modèle ne fabrique pas de barème pour les coefficients ou régions non vérifiés.

## Comportements BTP isolés dans ce modèle

Les règles restent dans l'espace de noms IDCC 1596 et ne redéfinissent pas les clés globales BTP de `modele-social`.

- **Congés payés CIBTP** : taux Centre de 20,70 % à compter du 1er janvier 2026, sur l'assiette de cotisations.
- **Chômage intempéries** : assiette plafonnée au plafond de sécurité sociale ; 0,68 % pour le gros œuvre/travaux publics, 0,13 % pour le second œuvre, zéro pour une activité non exposée. L'abattement annuel par entreprise n'est pas calculé salarié par salarié.
- **RNPC cadres** : lorsque le consommateur demande explicitement le cas cadre, la tranche A employeur de 1,50 % remplace la prévoyance cadre de droit commun ; la tranche C de 3,60 % optionnelle n'est pas calculée. Ce cas ne rend pas un cadre éligible à la grille salariale ouvrière.
- **OPPBTP** : 0,11 % sur les salaires bruts majorés de 13,14 %, dans le total employeur BTP de ce namespace.

## Utilisation

Entrées nécessaires pour la grille : `catégorie`, `région`, `coefficient` et `date de calcul`. Pour les cotisations CIBTP, renseigner l'assiette standard et le secteur d'intempéries. Les sorties de cotisations sont des montants de contrôle employeur ; elles ne calculent pas l'abattement annuel d'entreprise ni les indemnités de chômage intempéries.

## Sources

- Accord régional IDCC 1596, Centre-Val de Loire, référencé par [KALITEXT000054936694](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054936694).
- [CIBTP Centre — cotisations congés payés](https://www.cibtp-centre.fr/entreprise/declarations-cotisations/cotisations-conges-payes), assiettes et taux publiés pour 2026.
- [CIBTP Centre — évolution du taux de cotisation congés](https://www.cibtp-centre.fr/entreprise/vos-cotisations/evolution-du-taux-de-cotisation-conges), décision de taux à compter du 1er janvier 2026.
- [CIBTP Centre — cotisations chômage intempéries](https://www.cibtp-centre.fr/entreprise/declarations-cotisations/cotisations-chomage-intemperies), assiette plafonnée, taux et abattement de campagne 2026-2027.
- [PRO BTP — notice entreprise assiette et taux](https://www.probtp.com/files/live/sites/probtp/files/media/pdf/PRO/declarations/notice-entreprise-assiette-taux.pdf), RNPC.

La récupération HTML directe de Légifrance était bloquée par 403 lors de la recherche ; l'identifiant KALI officiel reste conservé comme référence de l'accord. Les sources CIBTP et PRO BTP ont été vérifiées directement le 12 octobre 2026.
