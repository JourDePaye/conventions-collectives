# Bâtiment — ETAM (IDCC 2609)

## Version en vigueur : `2026.4`, commune aux quatre conventions du bâtiment

La version `2026.4` est publiée à l'identique pour les IDCC 1596, 1597, 2609 et 2420, depuis le
fichier commun [`rules/commun/batiment/batiment.2026.4.publicodes`](../commun/batiment/batiment.2026.4.publicodes)
(voir son [README](../commun/batiment/README.md)). Elle complète et corrige la convention du bâtiment
de modele-social (`salarié . convention collective . BTP`), qui couvre à la fois les ouvriers, les
ETAM et les cadres : taux de la cotisation congés payés CIBTP par caisse et par date, cotisation
chômage intempéries, prévoyance des cadres (RNPC) comptée une seule fois, et grilles régionales des
ouvriers et des ETAM à partir de la publication de leur arrêté d'extension.

**Les versions `2026.1` et `2026.2` ci-dessous ne sont plus utilisées** : elles calculaient leurs cotisations
dans un espace de noms à part, sans remplacer celles de modele-social. Elles restent publiées pour
l'historique ; un consommateur qui choisit la version par date doit partir de `2026.4`.

## Versions antérieures, plus utilisées

Modèles `2609-batiment-etam`, versions `2026.1` et `2026.2`, espace de noms
`salarié . convention collective . bâtiment ETAM`.

## Périmètre juridiquement borné

La version `2026.1` modélise les ETAM du bâtiment dans la région **Corse**, pour
la période du 1er avril au 31 décembre 2026. La version `2026.2` modélise la
grille **Occitanie**, applicable du 1er mai au 31 décembre 2026. Les modèles ne
fabriquent pas de grille nationale, ni de minimum de salaire pour les cadres.

## Grille mensuelle Corse — 2026.1

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
salaires à compter du 1er avril 2026.

## Grille mensuelle Occitanie — 2026.2

Pour 35 heures par semaine ou 151,67 heures mensuelles :

| Niveau | Minimum brut mensuel |
|---:|---:|
| A | 1 847,16 € |
| B | 1 936,54 € |
| C | 2 061,72 € |
| D | 2 256,45 € |
| E | 2 462,01 € |
| F | 2 902,48 € |
| G | 3 176,04 € |
| H | 3 497,50 € |

Ces montants proviennent de l'accord Occitanie du 13 février 2026 relatif aux
salaires minimaux au 1er mai 2026, étendu par arrêté publié le 29 mai 2026.

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
- [Légifrance — accord Occitanie du 13 février 2026 relatif aux salaires minimaux au 1er mai 2026](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054337649), étendu par arrêté du 19 mai 2026 publié au Journal officiel le 29 mai 2026 (NOR TRST2612648A)
- [Légifrance — convention collective nationale IDCC 2609, brochure 3002](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018773893)
- [CIBTP France — principales revalorisations pour 2026](https://www.cibtp.fr/actualite-/-presse/actualites/actualite/principales-revalorisations-pour-2026)
- [CIBTP France — régime de chômage intempéries](https://www.cibtp.fr/media/commun/1_Documents/chomage-intemperies/en-bref_regime-intemperies/ci_med_en-bref_regime-intemperies.pdf)
- [OPPBTP — arrêté fixant le taux 2026](https://www.oppbtp.com/app/uploads/2025/12/arrete-2025-taux-2026.pdf)

## Limites

La version ne couvre pas les autres régions, les années antérieures ou
postérieures, les cadres, les primes, les indemnités de petits déplacements,
les remboursements d'intempéries, ni le calcul de l'abattement annuel CIBTP au
niveau de l'entreprise. Le contrôle de compatibilité avec le SMIC et le choix
de période de paie restent à la charge de l'application consommatrice.
