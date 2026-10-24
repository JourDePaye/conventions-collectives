# Métallurgie — IDCC 3248

Le fichier [2026.1](3248-metallurgie.2026.1.publicodes) entre en vigueur le 1er janvier 2026. Le fichier [2026.2](3248-metallurgie.2026.2.publicodes) corrige les références officielles et ajoute la majoration des minima pour les conventions de forfait annuel. Le fichier [2026.3](3248-metallurgie.2026.3.publicodes), de même date d'effet et qui remplace la 2026.2, ajoute le barème des salariés débutants du groupe F et reprend les montants majorés du texte. Les textes concernent la convention collective nationale de la métallurgie du 7 février 2022 (IDCC 3248, conteneur KALICONT000046993250) et l’avenant du 20 février 2026 relatif aux salaires minima hiérarchiques (KALITEXT000054254725, qui crée l’annexe 6.1 ; articles 1er et 2 seulement), étendu par arrêté du 20 mai 2026 publié au JORF du 5 juin 2026 (NOR TRST2612724A). La valeur Publicodes est `métallurgie` ; les règles sont sous `salarié . convention collective . métallurgie`.

Depuis le 1er janvier 2024, la convention collective nationale de la métallurgie remplace les conventions territoriales : un barème national unique, exprimé en montants annuels par classe d’emplois, s’applique sur tout le territoire.

## Règles implémentées

- `niveau` reçoit la classe d’emplois : la lettre du groupe (A à I) suivie du numéro de classe (1 à 18), soit `A1`, `A2`, `B3`, `B4`, `C5`, `C6`, `D7`, `D8`, `E9`, `E10`, `F11`, `F12`, `G13`, `G14`, `H15`, `H16`, `I17`, `I18` (défaut : `non renseigné`).
- `salaire minimum hiérarchique annuel` donne le SMH annuel de la classe, pour 35 heures par semaine, de 21 980 € (`A1`) à 68 450 € (`I18`).
- `expérience professionnelle groupe F` (2026.3) accepte `moins de 2 ans`, `de 2 ans à moins de 4 ans`, `de 4 ans à 6 ans` ou `plus de 6 ans` (défaut). Pour `F11` et `F12`, le second tableau de l’annexe 6.1 (salariés débutants du groupe F pendant leurs six premières années, article 139 : +5 % après 2 ans, +8 % après 4 ans) remplace alors le barème unique : `F11` 28 430 / 29 852 / 32 240 € et `F12` 29 940 / 31 437 / 33 952 € par an. Sans effet hors du groupe F. L’application doit renseigner l’expérience des débutants du groupe F ; la valeur par défaut applique le barème unique.
- `forfait annuel` accepte explicitement `aucun`, `heures 15 %`, `heures 30 %` ou `jours`. `salaire minimum hiérarchique annuel au forfait` reprend, depuis la 2026.3, les colonnes « Majoration de 15 % » et « Majoration de 30 % » du texte, arrondies à l’euro (par exemple `B3` 26 117 € et non 26 116,50 €), y compris pour les débutants du groupe F. Aucun forfait n’est supposé par défaut. L’adaptation des forfaits en jours inférieurs au forfait temps complet (article 139) n’est pas modélisée.
- `salaire minimum conventionnel` en est le douzième, multiplié par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, `C5` vaut 24 510 € / 12 = 2 042,50 €/mois à temps complet et 1 021,25 €/mois à mi-temps.
- `niveau hors grille` signale une classe absente des 18 positions. Le barème retourne alors `0 €/an` et l’application doit traiter l’anomalie.

Les classes `A1` et `A2` (21 980 € et 22 100 € par an, soit 1 831,67 € et 1 841,67 € par mois) sont inférieures au SMIC en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- La version 2026.1 conservait des références de source incomplètes ; la version 2026.2 les remplace par les identifiants officiels du texte et de l’arrêté d’extension (ses sources ont ensuite été corrigées : l’avenant n’a pas d’article 13, la majoration de 15 % ou 30 % vient de l’article 139 de la convention).
- Le SMH est un minimum annuel, primes comprises (ancienneté, congés, majorations pour travail posté). La règle n’en donne que le douzième : l’application de paie le compare au salaire brut du mois, ce qui est plus strict que l’appréciation annuelle de la convention.
- Avant la 2026.3, les minima des salariés débutants du groupe F n’étaient pas modélisés (les versions 2026.1 et 2026.2 appliquent 35 200 € et 37 000 € à tous). La condition de « débutant » et le calcul des six années d’expérience (article 139 : années comme cadre, alternance comptée pour moitié, régime transitoire) restent à apprécier par l’application.
- L’avenant entre en vigueur le lendemain de son dépôt (date de dépôt non relevée) et ne contient pas de date rétroactive : la date d’effet du 1er janvier 2026 est le début de l’année 2026 du barème.
- L’extension ne rend le barème applicable aux employeurs non adhérents qu’à compter de l’arrêté, et les barèmes de 2024 et 2025 ne sont pas modélisés : la première version couvre les périodes à partir du 1er janvier 2026.
- Les primes, majorations, la prévoyance et les autres éléments de la convention ne sont pas modélisés.

## Congés payés

La révision [2026.4](3248-metallurgie.2026.4.publicodes), à la même date que 2026.3, ajoute `congés payés . jours supplémentaires`, les congés supplémentaires des articles 89.1 et 89.2, en jours ouvrables : 1 jour pour 2 ans d'ancienneté, 2 jours à partir de 45 ans et 3 jours à partir de 55 ans avec 20 ans d'ancienneté (les paliers d'âge supposent les 2 ans d'ancienneté), et 1 jour de plus pour le cadre dirigeant ou le salarié en forfait annuel ayant 1 an d'ancienneté. L'application renseigne `congés payés . ancienneté`, `congés payés . âge` (à la fin de la période de référence) et `congés payés . cadre dirigeant ou forfait annuel`, et proratise ces jours par le congé légal acquis avant l'arrondi (article 89.3). Les droits supérieurs maintenus (articles 89.4) et l'éviction par un accord d'entreprise (article 89) restent à la charge de l'application.

## Maintien de salaire

La révision 2026.5 ajoute le maintien de salaire conventionnel (articles 91.1 et 92) sous `maintien de salaire`, lu sur Légifrance le 24 octobre 2026 : les durées, taux, carences et modalités sont dans les sources de la version et dans `test/salary-maintenance.test.ts`. L’interface est décrite dans le README du package. Les règles d’un arrêt à cheval sur deux années civiles (article 91.1.3) ne sont pas reprises : les jours sont décomptés par année civile.
