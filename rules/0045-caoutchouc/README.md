# Caoutchouc — IDCC 45

Le fichier [2025.1](0045-caoutchouc.2025.1.publicodes) entre en vigueur le **1er mai 2025**, premier jour du mois suivant la publication de l'arrêté d'extension du 9 avril 2025 au Journal officiel du 26 avril 2025. Il est fondé sur l'accord du 29 janvier 2025 relatif aux salaires minima de la convention collective nationale du caoutchouc du 6 mars 1953 (brochure 3046). La valeur Publicodes est `caoutchouc` ; les règles sont sous `salarié . convention collective . caoutchouc`.

## Règles implémentées

- `coefficient` reçoit l'un des coefficients couverts par la grille 2025 : 130, 140, 150, 160, 170, 180, 190, 215, 225, 240, 255 ou 270 (défaut : 0).
- `point mensuel` expose la valeur conventionnelle de 7,45 € par point.
- `salaire minimum conventionnel . grille` donne les taux effectifs garantis mensuels des coefficients 130 à 255 et le salaire minimum hiérarchique du coefficient 270, pour un temps complet.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois.
- `coefficient hors grille` signale un coefficient absent de la grille. La grille retourne alors `0 €/mois` et l'application doit traiter l'anomalie.

## Audit paie

L'accord du 29 janvier 2025 porte sur les salaires minima. L'audit a recherché, dans la convention étendue du 6 mars 1953 et les textes dédiés disponibles sous l'IDCC 45, les effets suivants : cotisations salarié et employeur, assiettes, taux, plafonds et tranches, forfaits, frais de santé, prévoyance, formation professionnelle, AT/MP, primes et avantages en nature. Aucun taux ou base générique supplémentaire, officiellement sourcé et calculable avec les entrées de `modele-social`, n'a été retenu :

- santé et prévoyance : les garanties et contrats dépendent du régime, du collège et de paramètres contractuels ; aucun montant ou taux national automatiquement calculable n'est ajouté ;
- formation professionnelle : les accords consultés organisent les dispositifs et financements de branche, sans base de paie générique sûre à appliquer dans ce modèle ;
- AT/MP, assiettes, plafonds/tranches, forfaits et exonérations : aucune dérogation générique propre à l'IDCC 45 n'est appliquée, les règles de `modele-social` restent en vigueur ;
- primes, indemnités et avantages : ils dépendent de conditions de travail, d'ancienneté, de catégorie ou de paramètres d'entreprise non fournis et ne sont pas calculés.

La source de périmètre auditée est la [convention collective étendue sur Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635597), en complément de l'accord salarial et de son arrêté d'extension cités dans les métadonnées. Le test `caoutchouc.test.ts` compare explicitement les endpoints de cotisations AT/MP, formation, prévoyance conventionnelle, assiette forfaitaire et les sorties standard à la baseline droit commun.

## Limites

- Cette première version couvre la grille salariale applicable à compter du 1er mai 2025 ; les barèmes antérieurs et les éventuels accords ultérieurs ne sont pas modélisés.
- Les coefficients non listés par l'accord salarial ne sont pas extrapolés à partir de la valeur du point.
- Le SMIC légal reste un plancher distinct à appliquer par l'outil de paie lorsque le minimum conventionnel lui est inférieur.
