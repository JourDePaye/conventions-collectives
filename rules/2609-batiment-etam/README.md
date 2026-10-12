# Bâtiment — ETAM (IDCC 2609)

Modèle `2609-batiment-etam`, version `2026.1`, espace de noms
`salarié . convention collective . bâtiment ETAM`.

## Périmètre juridiquement borné

Cette version modélise les ETAM du bâtiment dans la région **Corse**, pour la
période du 1er avril au 31 décembre 2026. Elle ne fabrique pas de grille
nationale, ni de grille pour une autre région, ni de minimum de salaire pour
les cadres.

## Grille mensuelle Corse — 2026

Pour 35 heures par semaine ou 151,67 heures mensuelles :

| Niveau | Minimum brut mensuel |
|---:|---:|
| A | 1 827,10 € |
| B | 1 870,60 € |
| C | 1 957,61 € |
| D | 2 117,12 € |
| E | 2 328,77 € |
| F | 2 655,83 € |
| G | 2 959,16 € |
| H | 3 231,05 € |

Ces montants proviennent de l'accord Corse du 15 décembre 2025 relatif aux
salaires à compter du 1er avril 2026. Le modèle reste limité à la région et à
la période explicitement vérifiées par cette source.

## Comportements BTP isolés dans ce modèle

Les règles restent dans l'espace de noms IDCC 2609 et ne redéfinissent pas les
clés globales de `modele-social`.

- **Congés payés CIBTP** : taux 2026 de 20,70 % sur l'assiette standard ; la
  caisse de rattachement est un paramètre déclaré et n'est pas déduite de la
  région.
- **Chômage intempéries** : assiette plafonnée au PMSS ; 0,68 % pour le gros
  œuvre/travaux publics, 0,13 % pour le second œuvre, zéro pour une activité
  non exposée. L'abattement annuel et sa limitation sont des calculs au niveau
  entreprise : ils ne sont pas imputés artificiellement salarié par salarié.
- **OPPBTP** : taux 2026 de 0,11 % sur la masse salariale BTP, y compris les
  indemnités de congés payés concernées ; le modèle conserve la majoration
  conventionnelle d'assiette utilisée par les extensions BTP existantes.
- **RNPC cadres** : aucune correction RNPC cadre n'est ajoutée à cette
  convention ETAM. Les ETAM ne reçoivent donc pas la règle de prévoyance cadre
  introduite par les modèles ouvriers BTP.

## Sources

- [Légifrance — accord Corse du 15 décembre 2025 relatif aux salaires à compter du 1er avril 2026](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054092314)
- [CIBTP France — principales revalorisations pour 2026](https://www.cibtp.fr/actualite-/-presse/actualites/actualite/principales-revalorisations-pour-2026)
- [CIBTP France — régime de chômage intempéries](https://www.cibtp.fr/media/commun/1_Documents/chomage-intemperies/en-bref_regime-intemperies/ci_med_en-bref_regime-intemperies.pdf)
- [OPPBTP — arrêté fixant le taux 2026](https://www.oppbtp.com/app/uploads/2025/12/arrete-2025-taux-2026.pdf)

## Limites

La version ne couvre pas les autres régions, les années antérieures ou
postérieures, les cadres, les primes, les indemnités de petits déplacements,
les remboursements d'intempéries, ni le calcul de l'abattement annuel CIBTP au
niveau de l'entreprise. Le contrôle de compatibilité avec le SMIC et le choix
de période de paie restent à la charge de l'application consommatrice.
