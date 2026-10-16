# Sociétés d’assurances — IDCC 1672

Le fichier [2026.3](1672-societes-assurances.2026.3.publicodes) entre en vigueur le 1er janvier 2026. Il est fondé sur le protocole d’accord du 10 juin 2026 relatif aux rémunérations minimales annuelles (RMA) du personnel administratif, applicable à compter du 1er janvier 2026, publié par Légifrance comme texte en vigueur non étendu. La valeur Publicodes est `sociétés assurances` ; les règles sont sous `salarié . convention collective . sociétés assurances`.

## Version 2026.4 (correction)

Les versions `2026.1` et `2026.3` portaient par erreur le barème **2025** (22 230 € à 60 690 €) alors qu'elles citaient le protocole du 10 juin 2026. La version `2026.4`, de même date d'effet (1er janvier 2026) et donc prioritaire, reprend le barème lu dans l'annexe du protocole (KALITEXT000054887698) : classes 1 à 7 = 22 680, 24 120, 25 580, 30 140, 35 430, 45 030, 60 940 €.

Le protocole est « en vigueur non étendu » : la règle `adhérent d'une organisation signataire` (oui ou non, non par défaut) rend les minima non applicables pour un employeur non lié. Clés, unités et noms de règles sont ceux de 2026.3, plus `adhérent d'une organisation signataire`. Le barème 2025 (protocole du 16 juin 2025, KALITEXT000052226828) n'est pas modélisé en version propre.

La convention collective nationale des sociétés d’assurances du 27 mai 1992 (brochure 3265) fixe une rémunération minimale annuelle par classe, de 1 à 4 pour les non-cadres et de 5 à 7 pour les cadres. Le personnel commercial et les inspecteurs relèvent d’autres conventions de la branche.

## Règles implémentées

- `niveau` reçoit la classe, de `1` à `7` (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille annuelle` donne la RMA à temps plein, de 22 230 € (classe 1) à 60 690 € (classe 7).
- `salaire minimum annuel conventionnel` expose la RMA annuelle, proratisée selon la quotité ; c’est l’endpoint de comparaison principal.
- `salaire minimum conventionnel` donne seulement un équivalent mensuel indicatif (RMA / 12), multiplié par `salarié . contrat . temps de travail . quotité` et arrondi au centime. La classe 3 vaut ainsi 25 070 € / 12 = 2 089,17 €/mois à temps complet ; le modèle ne déduit pas de treizième mois.
- `niveau hors grille` signale une classe absente des sept classes. La grille retourne alors `0` et l’application doit traiter l’anomalie.

Les classes 1 (1 852,50 € par mois en équivalent indicatif) est inférieure au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- Le protocole est non étendu : il ne doit pas être présenté comme obligatoire pour les employeurs non signataires ou non adhérents. Le texte officiel et la fiche conventionnelle sont cités dans les métadonnées du fichier.
- La RMA est un minimum annuel ; l’équivalent mensuel / 12 est informatif et ne remplace pas la comparaison annuelle, qui dépend notamment des éléments de rémunération retenus par le protocole.
- Le personnel commercial et les inspecteurs d’assurance, les primes, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures au 1er janvier 2026 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
