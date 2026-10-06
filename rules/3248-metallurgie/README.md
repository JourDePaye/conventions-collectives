# Métallurgie — IDCC 3248

Le fichier [2026.1](3248-metallurgie.2026.1.publicodes) entre en vigueur le 1er janvier 2026. Il est fondé sur l’avenant du 20 février 2026 portant barème unique des salaires minima hiérarchiques (SMH) à partir de l’année 2026, dont l’extension a fait l’objet d’un avis au JORF du 15 mars 2026 (NOR TRST2607042V) puis d’un arrêté du 20 mai 2026, cités dans ses métadonnées. La valeur Publicodes est `métallurgie` ; les règles sont sous `salarié . convention collective . métallurgie`.

Depuis le 1er janvier 2024, la convention collective nationale de la métallurgie remplace les conventions territoriales : un barème national unique, exprimé en montants annuels par classe d’emplois, s’applique sur tout le territoire.

## Règles implémentées

- `niveau` reçoit la classe d’emplois : la lettre du groupe (A à I) suivie du numéro de classe (1 à 18), soit `A1`, `A2`, `B3`, `B4`, `C5`, `C6`, `D7`, `D8`, `E9`, `E10`, `F11`, `F12`, `G13`, `G14`, `H15`, `H16`, `I17`, `I18` (défaut : `non renseigné`).
- `salaire minimum hiérarchique annuel` donne le SMH annuel de la classe, pour 35 heures par semaine, de 21 980 € (`A1`) à 68 450 € (`I18`).
- `salaire minimum conventionnel` en est le douzième, multiplié par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, `C5` vaut 24 510 € / 12 = 2 042,50 €/mois à temps complet et 1 021,25 €/mois à mi-temps.
- `niveau hors grille` signale une classe absente des 18 positions. Le barème retourne alors `0 €/an` et l’application doit traiter l’anomalie.

Les classes `A1` et `A2` (21 980 € et 22 100 € par an, soit 1 831,67 € et 1 841,67 € par mois) sont inférieures au SMIC en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- Ni le texte de l’avenant ni celui de l’arrêté d’extension n’ont été lus : les montants viennent de deux pages de synthèse concordantes (UIMM Côte d’Azur et Corse, Éditions Tissot). Le numéro de texte et le NOR de l’arrêté ne sont pas vérifiés, et sa date de publication varie entre le 5 et le 6 juin 2026 selon les pages. À recouper avec l’avenant sur Légifrance.
- Le SMH est un minimum annuel, primes comprises (ancienneté, congés, majorations pour travail posté). La règle n’en donne que le douzième : l’application de paie le compare au salaire brut du mois, ce qui est plus strict que l’appréciation annuelle de la convention.
- Les salariés débutants du groupe F (classes `F11` et `F12`) ont un barème adapté pendant leurs six premières années d’expérience professionnelle : il n’est pas modélisé, et le minimum retenu pour eux est le barème général.
- Les majorations de 15 % et 30 % applicables aux salariés en forfait annuel en heures ou en jours ne sont pas modélisées.
- L’extension ne rend le barème applicable aux employeurs non adhérents qu’à compter de l’arrêté, et les barèmes de 2024 et 2025 ne sont pas modélisés : la première version couvre les périodes à partir du 1er janvier 2026.
- Les primes, majorations, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
