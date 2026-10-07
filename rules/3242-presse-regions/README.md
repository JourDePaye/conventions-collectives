# Presse quotidienne et hebdomadaire en régions — IDCC 3242

Le fichier [2023.1](3242-presse-regions.2023.1.publicodes) entre en vigueur le 1er juillet 2023. Il est fondé sur l’accord du 30 juin 2023 relatif aux salaires minima, étendu par arrêté du 22 septembre 2025 (JORF du 4 octobre 2025), cités dans ses métadonnées. La valeur Publicodes est `presse en régions` ; les règles sont sous `salarié . convention collective . presse en régions`.

La convention collective nationale de la presse quotidienne et hebdomadaire en régions du 9 août 2021 fixe des salaires minima propres à chaque famille de presse (quotidienne régionale, quotidienne départementale, hebdomadaire régionale). Cette version ne reprend que la grille de l’accord du 30 juin 2023, qui concerne la presse quotidienne régionale d’après des pages de synthèse.

## Règles implémentées

- `niveau` reçoit `O` (ouvriers), `E1` à `E6` (échelons des employés) ou `C1.1`, `C1.2`, `C2.1`, `C2.2`, `C3.1`, `C3.2`, `C4.1`, `C4.2` (sous-groupes des cadres, groupes I à IV) (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille` donne le minimum mensuel des 15 positions : 1 782,18 € pour les ouvriers et les employés des échelons 1 et 2, de 1 796,48 € (échelon 3) à 2 003,20 € (échelon 6) pour les employés, de 1 866,87 € (groupe I, coefficient 100) à 3 640,40 € (groupe IV, coefficient 195) pour les cadres.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, l’échelon 5 des employés vaut 1 878,55 €/mois à temps complet et 939,28 €/mois à mi-temps.
- `niveau hors grille` signale une position absente des 15 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Les ouvriers et les employés des échelons 1 à 4 (de 1 782,18 € à 1 821,60 €) sont inférieurs au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- **Famille de presse.** Les pages de synthèse rattachent l’accord du 30 juin 2023 à la presse quotidienne régionale, mais un résumé de la page Légifrance cite l’organisation d’employeurs de la presse hebdomadaire régionale parmi les signataires. Cette famille n’a pas pu être confirmée sur le texte.
- **Familles non couvertes.** Les barèmes de la presse hebdomadaire régionale (accord du 2 juin 2023, dont une page donne des minima d’employés de 1 900 € à 2 250 € sans autre source), de la presse quotidienne départementale et des journalistes ne sont pas repris. Un employeur de ces familles est contrôlé avec une grille qui n’est pas la sienne.
- Les tableaux ont été lus sur Légifrance à travers un résumé de page ; les montants des cadres vérifient un point de 18,6687 € par point de coefficient, à un centime près. Le numéro de texte et le NOR de l’arrêté d’extension ne sont pas vérifiés. La base horaire n’est pas précisée dans les pages consultées.
- Les entreprises non adhérentes aux organisations signataires ne sont tenues par l’accord qu’à compter du 1er novembre 2025, ce qui n’est pas modélisé.
- Aucun accord de salaires postérieur à celui du 30 juin 2023 n’a été trouvé pour cette famille, sans que son absence soit établie.
- Les primes, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures au 1er juillet 2023 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
