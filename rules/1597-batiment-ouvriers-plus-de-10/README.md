# Bâtiment — ouvriers des entreprises de plus de 10 salariés (IDCC 1597)

## Version en vigueur : `2026.6`, commune aux quatre conventions du bâtiment

Les versions `2026.4`, `2026.5` et `2026.6` sont publiées à l'identique pour les IDCC 1596, 1597,
2609 et 2420, depuis les fichiers communs de [`rules/commun/batiment`](../commun/batiment/) (voir leur
[README](../commun/batiment/README.md)) ; `2026.6`, de même date d'effet, l'emporte et ajoute les
indemnités de petits déplacements des ouvriers. Elle complète et corrige la convention du bâtiment
de modele-social (`salarié . convention collective . BTP`), qui couvre à la fois les ouvriers, les
ETAM et les cadres : taux de la cotisation congés payés CIBTP par caisse et par date, cotisation
chômage intempéries, prévoyance des cadres (RNPC) comptée une seule fois, et grilles régionales des
ouvriers et des ETAM à partir de la publication de leur arrêté d'extension : celles de toutes les
régions dans `2026.5`, quatre seulement dans `2026.4`.

**Les versions `2026.1` et `2026.3` ci-dessous ne sont plus utilisées** : elles calculaient leurs cotisations
dans un espace de noms à part, sans remplacer celles de modele-social. Elles restent publiées pour
l'historique ; un consommateur qui choisit la version par date doit partir de `2026.4`.

## Versions antérieures, plus utilisées

Modèle `1597-batiment-ouvriers-plus-de-10`, version `2026.3`, espace de noms
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

- **Congés payés CIBTP** : caisse de rattachement obligatoire ; 20,70 % pour Grand-Ouest et 20,20 % pour Sud-Ouest à compter du 1er avril 2026. Les autres caisses restent hors calcul plutôt que d'être assimilées à tort.
- **Chômage intempéries** : assiette plafonnée au plafond de sécurité sociale ; 0,68 % pour le gros œuvre/travaux publics, 0,13 % pour le second œuvre, zéro pour une activité non exposée. L'abattement annuel par entreprise n'est pas calculé salarié par salarié.
- **RNPC cadres** : uniquement lorsqu'un consommateur demande explicitement le cas cadre ; la tranche A employeur de 1,50 % remplace la prévoyance cadre de droit commun et la tranche C optionnelle n'est pas calculée. Un cadre n'est pas rendu éligible à la grille ouvrière.
- **OPPBTP** : 0,11 % sur les salaires bruts majorés de 13,14 %, dans le total employeur BTP de ce namespace.

## Sources

- [Légifrance — accord régional Nouvelle-Aquitaine du 22 octobre 2025](https://www.legifrance.gouv.fr/conv_coll/id/KALIARTI000053497380), étendu par arrêté publié au JORF le 17 janvier 2026.
- [CIBTP Grand-Ouest — cotisations congés payés](https://www.cibtp-grandouest.fr/entreprise/declarations-cotisations/cotisations-conges-payes), taux 2026 et assiettes des cotisations BTP.
- [CIBTP Sud-Ouest — évolution du taux de cotisation congés payés](https://www.cibtp-sud-ouest.fr/entreprise/cotisations/evolution-du-taux-de-cotisation-conges-payes), taux Sud-Ouest à compter du 1er avril 2026.
- [PRO BTP — notice entreprise assiette et taux](https://www.probtp.com/files/live/sites/probtp/files/media/pdf/PRO/declarations/notice-entreprise-assiette-taux.pdf), régime de prévoyance cadres BTP.

## Limites

La présente version ne prétend pas couvrir les autres régions, les ETAM, les cadres pour le salaire minimum, les primes de vacances, les indemnités de déplacement, les remboursements d'intempéries ni l'abattement annuel d'entreprise. La caisse CIBTP est un paramètre obligatoire ; aucune affectation automatique de caisse à partir de la région n'est déduite.
