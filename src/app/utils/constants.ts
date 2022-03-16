export class Constants {
    //Url context internet
    public static readonly CONTEXT_URL_INTERNET = '/AS0207/EESSIGateWEB/';

    //ConfApp value
    public static readonly DESC_DASHBOARD = 'DESC_DASHBOARD';

    //Workspace
    public static readonly ACCOUNT_DELIVERABLES = 1;
    public static readonly NG_DOCUMENTATION = 2;
    public static readonly EESS_NEWS_DOCUMENTATION = 3;
    public static readonly RINA_HANDOVER = 4;

    //Sezione Contenuti
    public static readonly MODIFICA = 1;
    public static readonly APPROVA = 2;
    public static readonly PUBBLICA = 3;

    //get sigle value
    public static readonly contextUrlInternet = Constants.CONTEXT_URL_INTERNET;
    public static readonly descDashboard = Constants.DESC_DASHBOARD;
    public static readonly accountDeliverables = Constants.ACCOUNT_DELIVERABLES;
    public static readonly ngDocumentation = Constants.NG_DOCUMENTATION;
    public static readonly eessiNewsDocumentation = Constants.EESS_NEWS_DOCUMENTATION;
    public static readonly rina_handover = Constants.RINA_HANDOVER;
    public static readonly modificaContenuto = Constants.MODIFICA;
    public static readonly approvaContenuto = Constants.APPROVA;
    public static readonly pubblicaContenuto = Constants.PUBBLICA;


    // risposta partecipanti
    public static readonly IN_ATTESA = "IN ATTESA";
    public static readonly PARTECIPANTI = "PARTECIPA";
    public static readonly IN_FORSE = "IN FORSE";
    public static readonly NON_PARTECIPA = "NON PARTECIPA";



}

export const MY_FORMATS = {
    parse: {
        dateInput: 'L',
    },
    display: {
        dateInput: 'L',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'L',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
