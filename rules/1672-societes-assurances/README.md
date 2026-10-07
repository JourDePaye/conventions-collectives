# Sociétés d’assurances — IDCC 1672

Le fichier [2026.1](1672-societes-assurances.2026.1.publicodes) entre en vigueur le 1er janvier 2026. Il est fondé sur le protocole d’accord du 10 juin 2026 relatif aux rémunérations minimales annuelles (RMA) du personnel administratif, applicable à compter du 1er janvier 2026, cité dans ses métadonnées. La valeur Publicodes est `sociétés assurances` ; les règles sont sous `salarié . convention collective . sociétés assurances`.

La convention collective nationale des sociétés d’assurances du 27 mai 1992 (brochure 3265) fixe une rémunération minimale annuelle par classe, de 1 à 4 pour les non-cadres et de 5 à 7 pour les cadres. Le personnel commercial et les inspecteurs relèvent d’autres conventions de la branche.

## Règles implémentées

- `niveau` reçoit la classe, de `1` à `7` (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille annuelle` donne la RMA à temps plein, de 22 230 € (classe 1) à 60 690 € (classe 7).
- `salaire minimum conventionnel` est le treizième de la RMA (le treizième mois étant versé en fin d’année), multiplié par `salarié . contrat . temps de travail . quotité` de `modele-social` et arrondi au centime. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, la classe 3 vaut 25 070 € / 13 = 1 928,46 €/mois à temps complet.
- `niveau hors grille` signale une classe absente des sept classes. La grille retourne alors `0` et l’application doit traiter l’anomalie.

Les classes 1 et 2 (1 710,00 € et 1 818,46 € par mois) sont inférieures au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- Le texte du protocole n’a pas pu être lu. Les sept montants viennent de trois pages de synthèse concordantes, et leur millésime 2026 est déduit des revalorisations annoncées (+1,5 % pour la classe 1 et +0,4 % pour la classe 7 par rapport à 21 900 € et 60 450 €). Certaines pages datent la même grille de 2025. L’arrêté d’extension n’a pas été trouvé : l’accord peut ne lier que les employeurs adhérents à France Assureurs. À recouper avec le protocole sur Légifrance.
- Les pages ne précisent pas si la RMA se divise par 12 ou par 13 pour le minimum mensuel : la règle retient le treizième (le plus bas), le treizième mois étant prévu par la convention et versé en fin d’année.
- La RMA est un minimum annuel (pour une durée annuelle de 1 712 heures selon une page) : la règle n’en donne que l’équivalent mensuel, plus strict que son appréciation annuelle.
- Le personnel commercial et les inspecteurs d’assurance, les primes, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures au 1er janvier 2026 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
