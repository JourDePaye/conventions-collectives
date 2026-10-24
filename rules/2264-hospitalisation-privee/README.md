# Hospitalisation privée — IDCC 2264

Le fichier [2023.3](2264-hospitalisation-privee.2023.3.publicodes) entre en vigueur le 1er janvier 2023. Il reprend la grille de l’avenant n° 32 du 10 novembre 2022 pour les coefficients 176 à 242 et l’avenant du 22 février 2023 pour la valeur du point à 7,26 € à partir du coefficient 243. La valeur Publicodes est `hospitalisation privée` ; les règles sont sous `salarié . convention collective . hospitalisation privée`.

La convention collective nationale de l’hospitalisation privée du 18 avril 2002 (brochure 3307, FHP, cliniques privées à but lucratif) ne fixe pas une grille par niveau : chaque emploi a un coefficient et le salaire de base est le coefficient multiplié par la valeur du point.

## Règles implémentées

- `coefficient` reçoit le coefficient de l’emploi occupé (défaut : 0).
- `valeur du point` vaut 7,26 € (avenant du 22 février 2023, applicable au 1er janvier 2023).
- `salaire minimum conventionnel . salaire indiciaire` applique la grille mensuelle forfaitaire des coefficients 176 à 242, puis multiplie le coefficient par la valeur du point à partir de 243.
- `salaire minimum annuel conventionnel` expose la rémunération annuelle garantie de la grille pour les coefficients 176 à 242.
- `salaire minimum conventionnel` multiplie ce salaire par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, le coefficient 300 vaut 2 178 €/mois à temps complet et 1 089 €/mois à mi-temps.
- `coefficient hors grille` signale un coefficient absent ou inférieur à 176 : le minimum vaut alors `0 €/mois` et l’application doit traiter l’anomalie.

Les coefficients de 243 à 256 (de 1 764,18 € à 1 858,56 €) donnent un salaire de base inférieur au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants. Le coefficient 258 (1 873,08 €) est le premier à le dépasser, et 257 (1 865,82 €) reste inférieur.

## Limites

- Le texte de l’avenant n’a pas pu être lu : la valeur de 7,26 €, sa date et l’absence de revalorisation depuis 2023 viennent de pages de synthèse concordantes (fiche-paie.net, convention.fr). Son agrément ou son extension n’ont pas été vérifiés. À recouper avec l’avenant sur Légifrance.
- Les coefficients 176 à 242 sont modélisés avec les montants mensuels et annuels forfaitaires de l’annexe 1 de l’avenant n° 32. Le SMIC légal reste un plancher à appliquer par le moteur de paie lorsque le minimum conventionnel est inférieur.
- La grille est celle des secteurs sanitaire et social ; pour le secteur médico-social, une page indique que le salaire intègre une prime d’ancienneté, non modélisée.
- L’avenant n° 33 de 2023, qui prépare une nouvelle classification et un nouveau système de rémunération pour la branche, n’est pas modélisé.
- Les coefficients 176 à 242 absents de la grille, notamment 177 et 179, sont signalés hors grille ; tout coefficient à partir de 243 est accepté pour l’application de la valeur du point.
- Les valeurs du point antérieures au 1er janvier 2023, les primes et les compléments Ségur ne sont pas modélisés.

## Maintien de salaire

L’article 84 de la convention institue un régime de prévoyance collective obligatoire (incapacité de travail) géré par un organisme assureur : ce n’est pas un maintien de salaire par l’employeur, il n’est pas décrit ; le maintien légal s’applique.
