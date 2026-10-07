# Hospitalisation privée — IDCC 2264

Le fichier [2023.1](2264-hospitalisation-privee.2023.1.publicodes) entre en vigueur le 1er janvier 2023. Il est fondé sur l’avenant du 22 février 2023 à l’annexe du 10 décembre 2002 relatif aux salaires, qui fixe la valeur du point à 7,26 € au 1er janvier 2023, cité dans ses métadonnées. La valeur Publicodes est `hospitalisation privée` ; les règles sont sous `salarié . convention collective . hospitalisation privée`.

La convention collective nationale de l’hospitalisation privée du 18 avril 2002 (brochure 3307, FHP, cliniques privées à but lucratif) ne fixe pas une grille par niveau : chaque emploi a un coefficient et le salaire de base est le coefficient multiplié par la valeur du point.

## Règles implémentées

- `coefficient` reçoit le coefficient de l’emploi occupé (défaut : 0).
- `valeur du point` vaut 7,26 € (avenant du 22 février 2023, applicable au 1er janvier 2023).
- `salaire minimum conventionnel . salaire indiciaire` multiplie le coefficient par la valeur du point pour les coefficients à partir de 243 ; il vaut `0 €/mois` en dessous.
- `salaire minimum conventionnel` multiplie ce salaire par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, le coefficient 300 vaut 2 178 €/mois à temps complet et 1 089 €/mois à mi-temps.
- `coefficient hors grille` signale un coefficient absent ou inférieur à 176 : le minimum vaut alors `0 €/mois` et l’application doit traiter l’anomalie.

Les coefficients de 243 à 256 (de 1 764,18 € à 1 858,56 €) donnent un salaire de base inférieur au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants. Le coefficient 258 (1 873,08 €) est le premier à le dépasser, et 257 (1 865,82 €) reste inférieur.

## Limites

- Le texte de l’avenant n’a pas pu être lu : la valeur de 7,26 €, sa date et l’absence de revalorisation depuis 2023 viennent de pages de synthèse concordantes (fiche-paie.net, convention.fr). Son agrément ou son extension n’ont pas été vérifiés. À recouper avec l’avenant sur Légifrance.
- Les coefficients de 176 à 242 ont des montants fixes (de 1 729,36 € pour 176 à 1 761,36 € pour 242 selon les pages consultées), tous inférieurs au SMIC : ils ne sont pas repris, le minimum vaut `0 €/mois` et le SMIC s’applique. Le seuil de 176 est celui de ces pages.
- La grille est celle des secteurs sanitaire et social ; pour le secteur médico-social, une page indique que le salaire intègre une prime d’ancienneté, non modélisée.
- L’avenant n° 33 de 2023, qui prépare une nouvelle classification et un nouveau système de rémunération pour la branche, n’est pas modélisé.
- La liste des coefficients n’est pas contrôlée : tout coefficient à partir de 176 est accepté.
- Les valeurs du point antérieures au 1er janvier 2023, les primes et les compléments Ségur ne sont pas modélisés.
