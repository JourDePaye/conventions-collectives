# Courtage d’assurances et de réassurances — IDCC 2247

Le fichier [2026.2](2247-courtage-assurances.2026.2.publicodes), applicable depuis le 1er juillet 2025, corrige la conversion mensuelle de la grille et expose le minimum annuel. Il est fondé sur l’avenant du 19 juin 2025 relatif aux salaires, étendu par arrêté du 2 septembre 2025 (JORF du 4 septembre 2025), cités dans ses métadonnées. La valeur Publicodes est `courtage assurances` ; les règles sont sous `salarié . convention collective . courtage assurances`.

La convention collective nationale des entreprises de courtage d’assurances et/ou de réassurances du 18 janvier 2002 (brochure 3110) fixe un salaire annuel minimum par classe, de A à H, qui inclut selon les pages consultées la part variable de la rémunération.

## Règles implémentées

- `niveau` reçoit la classe, de `A` à `H` (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille annuelle` donne le minimum annuel à temps plein, de 23 076 € (classe A) à 55 221 € (classe H).
- `salaire minimum conventionnel` donne le douzième indicatif de ce minimum annuel, multiplié par `salarié . contrat . temps de travail . quotité` de `modele-social` et arrondi au centime. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, la classe D vaut 28 704 € / 12 = 2 392,00 €/mois à temps complet.
- `salaire minimum annuel conventionnel` expose le minimum annuel proratisé selon la quotité de travail ; c’est l’endpoint à comparer juridiquement, car l’avenant fixe une garantie annuelle.
- `niveau hors grille` signale une classe absente des huit classes. La grille retourne alors `0` et l’application doit traiter l’anomalie.

Les classes A et B (1 923,00 € et 2 022,33 € par mois à temps plein) sont au-dessus du SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026.

## Limites

- **Grille échue.** L’avenant limite la grille à la période du 1er juillet 2025 au 30 juin 2026. Aucun avenant postérieur n’a été trouvé, la branche négociant en principe chaque année en juin pour le 1er juillet : la grille d’une période postérieure au 30 juin 2026 est celle de 2025, à défaut de texte plus récent, et peut être dépassée. À remplacer dès la publication d’un nouvel avenant.
- **Conversion mensuelle.** Le texte fixe une garantie annuelle ; le douzième est un équivalent mensuel indicatif et ne remplace pas la comparaison annuelle.
- Le salaire annuel minimum inclut, selon les pages consultées, la part variable : la règle n’en donne que l’équivalent mensuel, plus strict que son appréciation annuelle.
- Les primes, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures au 1er juillet 2025 ne sont pas modélisées : la première version couvre les périodes à partir de cette date. La version 2025.1 conserve l’ancien calcul pour préserver son empreinte publiée ; utiliser 2026.1 pour le calcul corrigé.
