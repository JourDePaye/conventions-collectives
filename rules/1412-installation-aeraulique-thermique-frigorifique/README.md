# Entreprises d'installation sans fabrication de matériel aéraulique, thermique et frigorifique — IDCC 1412

Le fichier [2026.2](1412-installation-aeraulique-thermique-frigorifique.2026.2.publicodes) est applicable au 1er janvier 2026 et remplace la révision 2026.1 (même date d'effet), dont la grille annuelle était le mensuel multiplié par douze au lieu de la colonne « forfait annuel heures, base 1 607 heures » de l'annexe, et sans la colonne « forfait annuel jours, base 218 jours ». Il reprend l'avenant n° 77 du 26 mars 2026 relatif aux salaires minima, étendu par arrêté du 11 juin 2026 publié au Journal officiel du 27 juin 2026 (NOR TRST2615573A). Les références officielles figurent dans les métadonnées du fichier source.

La valeur Publicodes est `installation aeraulique thermique frigorifique` ; les règles sont sous `salarié . convention collective . installation aeraulique thermique frigorifique`.

## Règles implémentées

- `coefficient` reçoit les 24 coefficients publiés par l'avenant n° 77, des niveaux I à VII.
- `salaire minimum conventionnel` donne le minimum mensuel brut à temps plein sur la base de 151,667 heures, proratisé une seule fois par la quotité de travail.
- `salaire minimum annuel conventionnel` expose les rémunérations annuelles des coefficients 370 à 700 de la colonne « forfait annuel heures, base 1 607 heures » ; cette valeur reste exprimée en €/an et est proratisée par la quotité.
- `salaire minimum annuel forfait jours conventionnel` expose la colonne « forfait annuel jours, base 218 jours » (coefficients 370 à 700), en €/an, proratisée par la quotité.
- `coefficient hors grille` signale une classification absente et retourne 0 pour les grilles concernées.

## Audit paie et limites

L'arrêté d'extension du 27 juin 2026 rend également obligatoire l'avenant n° 78 du 26 mars 2026 relatif à la prime d'ancienneté. Cette première version documente cette disposition mais ne la calcule pas : le taux dépend de l'ancienneté et sa base conventionnelle doit être saisie avec les bornes d'application correspondantes dans une version ultérieure. Les régimes de santé, de prévoyance, les astreintes et les autres primes ne sont pas modélisés ici.

Les montants des coefficients 370, 375 et 380 concernent les jeunes diplômés dans les conditions de l'article X-2 de la convention. Aucune classification absente n'est extrapolée.

## Sources officielles

- [Avenant n° 77 du 26 mars 2026 relatif à la fixation des salaires minima — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054426537)
- [Grille de l'avenant n° 77 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000054426545)
- [Arrêté du 11 juin 2026 portant extension des avenants n° 77 et n° 78 — Journal officiel](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054322388)
