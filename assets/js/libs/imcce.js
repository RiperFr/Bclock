w = self;
function oar(OK, CODE1, CODE2) { /*objets a ranger*/
    this.OK
    this.CODE1
    this.CODE2
    this.n_jrl
    this.JR_courant
    this.bool
    this.chaine
}

function date(JJD, AN, MOIS, JOUR, TYPEA, NBMOIS) {
    this.JJD
    this.AN
    this.MOIS
    this.JOUR
    this.TYPEA
    this.NBMOIS
}

function trunc(x) {
    if (x > 0.0) return(Math.floor(x));
    else return Math.ceil(x);
}

function JJDATEJ() {
    Z1 = date.JJD + 0.5;
    Z = trunc(Z1);
    A = Z;
    B = A + 1524;
    C = trunc((B - 122.1) / 365.25);
    D = trunc(365.25 * C);
    E = trunc((B - D) / 30.6001);
    date.JOUR = trunc(B - D - trunc(30.6001 * E));
    if (E < 13.5)date.MOIS = trunc(E - 1);
    else date.MOIS = trunc(E - 13);
    if (date.MOIS >= 3) date.AN = trunc(C - 4716);
    else   date.AN = trunc(C - 4715);
}

function JJDATE() {
    Z1 = date.JJD + 0.5;
    Z = trunc(Z1);
    if (Z < 2299161) A = Z;
    else {
        ALPHA = trunc((Z - 1867216.25) / 36524.25);
        A = Z + 1 + ALPHA - trunc(ALPHA / 4);
    }
    B = A + 1524;
    C = trunc((B - 122.1) / 365.25);
    D = trunc(365.25 * C);
    E = trunc((B - D) / 30.6001);
    date.JOUR = trunc(B - D - trunc(30.6001 * E));
    if (E < 13.5) date.MOIS = trunc(E - 1);
    else date.MOIS = trunc(E - 13);
    if (date.MOIS >= 3) date.AN = trunc(C - 4716);
    else   date.AN = trunc(C - 4715);
}

function BISG()
    /*         TYPEA = 0 annee commune.                         */
    /*         TYPEA = 1 annee bissextile.                      */ {
    date.NBMOIS = 12;
    date.TYPEA = 0;
    if ((date.AN % 4) == 0)               date.TYPEA = 1;
    if ((date.AN % 100) == 0 && (date.AN % 400) != 0) date.TYPEA = 0;
}


function BISJ()
    /*         TYPEA = 0 annee commune.                         */
    /*         TYPEA = 1 annee bissextile.                      */ {
    date.NBMOIS = 12;
    if ((date.AN % 4) == 0) date.TYPEA = 1; else date.TYPEA = 0;
}

function moonph(form)     /* Fonction calculant les phases de la Lune */ {
    PI314 = 3.141592653589793;
    tabm = new Array(0.041e0, 0.126e0, 0.203e0, 0.288e0,
        0.370e0, 0.455e0, 0.537e0, 0.622e0,
        0.707e0, 0.789e0, 0.874e0, 0.956e0);
    xMOIS = date.MOIS;
    oar.CODE1 = date.AN;
    oar.CODE2 = date.MOIS;
    if (date.MOIS == 1) {
        an = date.AN - 1;
        date.MOIS = 12;
    }
    else {
        an = date.AN;
        date.MOIS--;
    }
    an += tabm[date.MOIS - 1];
    k = (an - 1900) * 12.3685e0;
    lik = trunc(k);
    rk = lik;
    k = rk - 0.25e0;
    if (k < 0.e0)k = k - 1;
    rad = PI314 / 180e0;
    nx = 0;
    with (Math) {
        for (ii = 0; ii < 12; ii++) {
            k = k + 0.25;
            t = k / 1236.85e0;
            t2 = t * t;
            t3 = t * t2;
            j = 2415020.75933e0 + 29.5305888531e0 * k
                + 0.0001337e0 * t2 - 0.000000150e0 * t3
                + 0.00033e0 * sin(rad * (166.56e0 + 132.87 * t - 0.009 * t2));
            m = rad * (359.2242e0 + 29.10535608e0 * k
                - 0.0000333e0 * t2 - 0.00000347e0 * t3);

            m = m % (2 * PI314);
            mp = rad * (306.0253e0 + 385.81691806e0 * k
                + 0.0107306e0 * t2 + 0.00001236e0 * t3);
            mp = mp % (2 * PI314);
            f = rad * (21.2964e0 + 390.67050646e0 * k
                - 0.0016528e0 * t2 - 0.00000239e0 * t3);
            f = f % (2 * PI314);
            oar.OK = 0;
            i = ii % 4;
            if (i == 0 || i == 2) {
                j = j + (0.1734e0 - 0.000393e0 * t) * sin(m)
                    + 0.0021e0 * sin(2 * m) - 0.4068e0 * sin(mp)
                    + 0.0161e0 * sin(2 * mp) - 0.0004e0 * sin(3 * mp)
                    + 0.0104e0 * sin(2 * f) - 0.0051e0 * sin(m + mp)
                    - 0.0074e0 * sin(m - mp) + 0.0004e0 * sin(2 * f + m)
                    - 0.0004e0 * sin(2 * f - m) - 0.0006e0 * sin(2 * f + mp)
                    + 0.001e0 * sin(2 * f - mp) + 0.0005e0 * sin(m + 2 * mp);
                date.JJD = j;
                testmoi(i, xMOIS);
                /*NL,PL */
                if (oar.OK == 1) affmoph(form, i);
            }
            else {
                j = j + (0.1721e0 - 0.0004e0 * t) * sin(m)
                    + 0.0021e0 * sin(2 * m) - 0.6280e0 * sin(mp)
                    + 0.0089e0 * sin(2 * mp) - 0.0004e0 * sin(3 * mp)
                    + 0.0079e0 * sin(2 * f) - 0.0119e0 * sin(m + mp)
                    - 0.0047e0 * sin(m - mp) + 0.0003e0 * sin(2 * f + m)
                    - 0.0004e0 * sin(2 * f - m) - 0.0006e0 * sin(2 * f + mp)
                    + 0.0021e0 * sin(2 * f - mp) + 0.0003e0 * sin(m + 2 * mp)
                    + 0.0004e0 * sin(m - 2 * mp) - 0.0003e0 * sin(2 * m + mp);
                if (i == 1) {                            /* Premier quartier */
                    date.JJD = j + 0.0028e0 - 0.0004 * cos(m)
                        + 0.0003e0 * cos(mp);
                    testmoi(i, xMOIS);
                    if (oar.OK == 1) affmoph(form, i);
                }
                else {                            /* Dernier quartier */
                    date.JJD = j - 0.0028e0 + 0.0004 * cos(m)
                        - 0.0003e0 * cos(mp);
                    testmoi(i, xMOIS);
                    if (oar.OK == 1) affmoph(form, i);
                }
            }
        }
        /*fermeture biblio Math*/
        if (oar.OK == 1) nx++;
        if (nx >= 4 && oar.OK == 0) alert('break');
    }
    date.AN = oar.CODE1;
    date.MOIS = oar.CODE2;
    if (date.MOIS == 2) date.NBJRS = ((date.TYPEA == 0) ? 28 : 29);
    else {
        if (date.MOIS < 8) date.NBJRS = (((date.MOIS & 1) != 0) ? 31 : 30);
        else date.NBJRS = (((date.MOIS & 1) != 0) ? 30 : 31);
    }
    /* editer les derniers jours du mois*/
    while (oar.JR_courant <= date.NBJRS)
        affich_age(form);
}

function testmoi(i, pMOIS)    /* le test sur le mois doit etre
 fait sur JJD final et non sur sa
 valeur brute. */ {
    D = oar.CODE1 / 100.0;
    /* TE-TU (P.B.) en secondes */
    TETUS = 32.23 * (D - 18.30) * (D - 18.30) - 15;
    TETUJ = TETUS / 86400e0;
    date.JJD += 0.0003472222e0;
    /* ajout de 30s pour arrondi sur la
     minute avant troncature lors de l'affichage */
    date.JJD += (-TETUJ);
    if (date.JJD < 2299160.5e0) {
        JJDATEJ();
        BISJ();
    } else {
        JJDATE();
        BISG();
    }
    oar.OK = 0;
    if (date.MOIS == pMOIS) oar.OK = 1;
    /*NL*/
    if (i == 0) if (pMOIS > date.MOIS) init_jrl(pMOIS);
    else if (date.MOIS == 12 && pMOIS == 1) init_jrl(pMOIS);
}

function init_jrl(xmois)  /* calcul no jour lune du 1er du mois*/ {
    if (oar.bool == 0) {
        if (date.MOIS == 2) date.NBJRS = ((date.TYPEA == 0) ? 28 : 29);
        else {
            if (date.MOIS < 8) date.NBJRS = (((date.MOIS & 1) != 0) ? 31 : 30);
            else date.NBJRS = (((date.MOIS & 1) != 0) ? 30 : 31);
        }
        oar.JR_courant = 1;
        oar.n_jrl = date.NBJRS - date.JOUR + 2;
    }
}

function affmoph(form, i)            /* affichage phase Lune */ {
    mois = new Array("nul", "janvier", "février", "mars ", "avril", " mai ", "juin ",
        "juillet", "août ", "septembre", "octobre", "novembre", "décembre");
    mois_fix = new Array("nul", "janvier  ", "février  ", "mars     ", "avril    ", "mai      ", "juin     ", "juillet  ", "août     ", "septembre", "octobre  ", "novembre ", "décembre ");
    nompha = new Array("NOUVELLE LUNE    ", "PREMIER  QUARTIER",
        "PLEINE   LUNE    ", "DERNIER  QUARTIER");
    sigpha = new Array("NL", "PQ", "PL", "DQ");
    tabjm = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    /* date et heure */
    if (date.JJD < 2299160.5E0) JJDATEJ(); else  JJDATE();
    FRACJ = (date.JJD + 0.5E0) % 1.0;
    jour = date.JOUR;
    HH = FRACJ * 24e0;
    hh = Math.floor(HH);
    FRACJ -= hh / 24.e0;
    MM = FRACJ * 1440.e0;
    mm = Math.floor(MM);
    if (hh == 24)                    /* cas op heure=24 ....... */
    {
        jfin = tabjm[date.MOIS - 1];
        if (date.JJD < 2299160.5E0) BISJ(); else  BISG();
        if (date.MOIS == 2 && date.TYPEA == 1)jfin = 29;
        if (date.JOUR < jfin) {
            hh = 0;
            jour = date.JOUR + 1;
        }
    }
    if (hh < 10) hh = "0" + hh;
    if (mm < 10) mm = "0" + mm;

    while (oar.JR_courant < date.JOUR)
        /*affich_age(form);*/
    {
        nombre = ((oar.JR_courant <= 9) ? "0" + oar.JR_courant++ : oar.JR_courant++);
        document.form.CAL_JR.value = document.form.CAL_JR.value + nombre;
        nombre = ((oar.n_jrl <= 9) ? "0" + oar.n_jrl++ : oar.n_jrl++);
        if (date.AN >= -9 && date.AN <= 99) oar.chaine = "  " + date.AN;
        else oar.chaine = date.AN;
        document.form.CAL_JR.value = document.form.CAL_JR.value + " " + mois_fix[date.MOIS] + " " + oar.chaine + "    " + nombre + "\r\n  ";
    }

    /*marquer phase*/
    nombre = ((oar.JR_courant <= 9) ? "0" + oar.JR_courant++ : oar.JR_courant++);
    document.form.CAL_JR.value = document.form.CAL_JR.value + nombre;
    if (date.AN >= -9 && date.AN <= 99) oar.chaine = "  " + date.AN;
    else oar.chaine = date.AN;
    document.form.CAL_JR.value = document.form.CAL_JR.value + " " + mois_fix[date.MOIS] + " " + oar.chaine + "    " + sigpha[i] + "\r\n  ";
    if (i == 0) {
        oar.n_jrl = 2;
        oar.bool = 1;
    } else oar.n_jrl++;

    form.PHASES.value = form.PHASES.value + nompha[i] + " " + jour + " " + mois[date.MOIS] + " " + date.AN + " à " + hh + "h" + mm + "m UTC\r\n";
}

function affich_age(form) {
    mois_fix = new Array("nul", "janvier  ", "février  ", "mars     ", "avril    ", "mai      ", "juin     ", "juillet  ", "août     ", "septembre", "octobre  ", "novembre ", "décembre ");
    nombre = ((oar.JR_courant <= 9) ? "0" + oar.JR_courant++ : oar.JR_courant++);
    document.form.CAL_JR.value = document.form.CAL_JR.value + nombre;
    nombre = ((oar.n_jrl <= 9) ? "0" + oar.n_jrl++ : oar.n_jrl++);
    if (date.AN >= -9 && date.AN <= 99) oar.chaine = "  " + date.AN;
    else oar.chaine = date.AN;
    document.form.CAL_JR.value = document.form.CAL_JR.value + " " + mois_fix[date.MOIS] + " " + oar.chaine + "    " + nombre + "\r\n  ";
}

function suivan(form) {
    date.AN = (form.nyear.value == "") ? "0" : eval(form.nyear.value);
    date.MOIS = (form.nmonth.value == "") ? "0" : eval(form.nmonth.value);
    if (++date.MOIS == 13) {
        date.MOIS = 1;
        date.AN++;
        if (date.AN < -4000 || date.AN > 2500) {
            alert('hors limites');
            date.AN--;
            date.MOIS = 12;
            return;
        }
    }
    form.nyear.value = date.AN;
    form.nmonth.value = date.MOIS;
    form.PHASES.value = "";
    form.CAL_JR.value = "";
    oar.bool = 0;
    moonph(form);
}

function preced(form) {
    date.AN = (form.nyear.value == "") ? "0" : eval(form.nyear.value);
    date.MOIS = (form.nmonth.value == "") ? "0" : eval(form.nmonth.value);
    if (--date.MOIS == 0) {
        date.MOIS = 12;
        date.AN--;
        if (date.AN < -4000 || date.AN > 2500) {
            alert('hors limites');
            date.AN++;
            date.MOIS = 1;
        }
    }
    form.nyear.value = date.AN;
    form.nmonth.value = date.MOIS;
    form.PHASES.value = "";
    form.CAL_JR.value = "";
    oar.bool = 0;
    moonph(form);
}

function couran(form) {
    date.AN = (form.nyear.value == "") ? "0" : eval(form.nyear.value);
    date.MOIS = (form.nmonth.value == "") ? "0" : eval(form.nmonth.value);
    form.PHASES.value = "";
    form.CAL_JR.value = "";
    oar.bool = 0;
    if (date.AN < -4000 || date.AN > 2500) {
        alert('hors limites');
    }
    if (date.MOIS < 1 || date.MOIS > 12) {
        alert('hors limites');
    }
    moonph(form);
}

function dateinit(form) {
    Todays = new Date();
    /*selon les navigateurs la fonction getyear de Javascript
     donne 100 ou 2000 (avant 2000 donnait toujours le millésime*/

    if (Todays.getYear() < 1000)
        document.form.nyear.value = 1900 + Todays.getYear();
    else
        document.form.nyear.value = Todays.getYear();

    document.form.nmonth.value = Todays.getMonth() + 1;
}

// done hiding from old browsers -->