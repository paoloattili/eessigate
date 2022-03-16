import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {CalendarOptions, EventInput, FullCalendarComponent} from "@fullcalendar/angular";
import itLocale from '@fullcalendar/core/locales/it';
import {SpinnerService} from "../../../../common/services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TipologicheService} from "../../../../common/services/tipologiche.service";
import {EventTypePlanningBean} from "../../spazio-lavoro/model/tipologiche.model";
import {FormControl} from "@angular/forms";
import {EventiService} from "../service/eventi.service";
import {EventPlanningBean} from "../model/eventi.model";
import {Subject} from "rxjs";
import {Observable} from "rxjs-compat";
import {map} from "rxjs/operators";

export class CalendarEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
}

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarioComponent implements OnInit, AfterViewInit {
  title: string;
  tuttiGliEventi: FormControl = new FormControl();
  listTokensEventi = [];

  currentMonth: number;

  eventGuid = 0;
  @ViewChild('calendar') calendar: FullCalendarComponent;

  listTipiEventi: EventTypePlanningBean[];
  multiSelectControl: FormControl = new FormControl();
  eventiByTipo: Map<string, EventPlanningBean[]> = new Map<string, EventPlanningBean[]>();
  dateSubject: Subject<{ month: number, year: number }> = new Subject<{ month: number; year: number }>();

  events: any[] = [];
  calendarOptions: CalendarOptions = {
    schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
    headerToolbar: {
      start: 'prevCustom,nextCustom today aggiungiEvento',
      center: 'title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
    },
    titleFormat: {
      year: 'numeric',
      month: 'long',
    },
    buttonText: {
      today: 'Oggi',
      month: 'Mese',
      week: 'Settimana',
      day: 'Giorno',
      list: 'Elenco'
    },
    initialView: 'dayGridMonth',
    selectable: true,
    nowIndicator: true,
    height: 'auto',
    locale: itLocale,
    customButtons: {
      aggiungiEvento: {
        text: 'Aggiungi Evento',
        click: this.addEventoButton.bind(this),
      },
      prevCustom: {
        text: 'Mese precendente',
        click: this.previousMonth.bind(this),
        icon: 'chevron-left',
      },
      nextCustom: {
        text: 'Mese prossimo',
        click: this.nextMonth.bind(this),
        icon: 'chevron-right'
      },
    },
    events: this.events,
    eventClick: this.goToDetail.bind(this),
    eventContent: this.eventContent.bind(this),

  };

  constructor(
    private eventiService: EventiService,
    private tipologicheService: TipologicheService,
    private spinnerService: SpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.title = "Calendario";
    this.spinnerService.activeSpinner();

    this.tipologicheService.listaTipiEventiSelect().subscribe(
      resp => {
        this.listTipiEventi = resp.listObj;
        this.listTokensEventi = [];
        this.tuttiGliEventi.setValue(true);
      },
      (err) => {
        // console.error(err);
        // this.spinnerService.closeSpinner()
      },
      () => {
      }
    );

    this.tuttiGliEventi.valueChanges.subscribe((tuttiGliEventi) => {
      if(tuttiGliEventi) {
        let listTokens = [];
        this.listTipiEventi.forEach(tipoEvento => listTokens.push(tipoEvento.token));
        this.multiSelectControl.setValue([]);
        this.multiSelectControl.setValue(listTokens);
      } else {
        this.multiSelectControl.setValue([]);
      }
    });

  }

  ngAfterViewInit(): void {

    this.updateCalendarioBySelectedItems();
    this.updateCalendarioByMese();

    this.currentMonth = this.calendar.getApi().currentData.currentDate.getMonth();

  }

  updateCalendarioBySelectedItems(): void {
    this.multiSelectControl.valueChanges.subscribe(selectedTokenTipoEvento => {

      let year = this.calendar.getApi().getDate().getFullYear();
      let month = this.calendar.getApi().getDate().getMonth() + 1;

      this.spinnerService.activeSpinner();

      if (selectedTokenTipoEvento.length == 0) {
        console.warn("[Nessun evento]");
        this.eventiByTipo.clear();
        this.updateCalendarioByTipo(this.eventiByTipo);
        this.spinnerService.closeSpinner();

      } else if (selectedTokenTipoEvento.length === this.listTipiEventi.length) {
        this.eventiService.listaEventi(month, year).pipe(
          map(resp => {
            let events = resp.listObj;
            if (events) {
              for (let tipoEvento of this.listTipiEventi) {
                let listEventiByTipo = events.filter(event => event.tokenType === tipoEvento.token);
                this.eventiByTipo.set(tipoEvento.token, listEventiByTipo ? listEventiByTipo : null);
              }
            }
          })
        ).subscribe( () => {
          this.updateCalendarioByTipo(this.eventiByTipo);
          this.spinnerService.closeSpinner();
        });

      } else if (selectedTokenTipoEvento.length > Array.from(this.eventiByTipo.keys()).length) {
        console.warn("[Aggiungi evento]");
        let observables: Observable<any>[] = []
        let tokens = [];
        for (let token of selectedTokenTipoEvento) {
          if (!this.eventiByTipo.has(token)) {
            observables.push(this.eventiService.listaEventi(month, year, token))
            tokens.push(token);
          }
        }

        Observable.forkJoin(observables).subscribe(
          (resps) => {
            console.warn("resps",resps);
            let i = 0;
            for (let resp of resps) {
              this.eventiByTipo.set(tokens[i], resp.listObj ? resp.listObj : null);
              this.updateCalendarioByTipo(this.eventiByTipo);
              i++;
            }
          },
          (err) => {
            // console.error(err)
            // this.spinnerService.closeSpinner()
          },
          () => {
            this.spinnerService.closeSpinner();
          },
        );


      } else if (selectedTokenTipoEvento.length < Array.from(this.eventiByTipo.keys()).length) {
        console.warn("[Togli evento]");
        let esiste = true;

        for (let tokenKey of Array.from(this.eventiByTipo.keys())) {
          for (let selectedToken of selectedTokenTipoEvento) {
            if (selectedToken == tokenKey) {
              esiste = true;
              break;
            } else {
              esiste = false;
            }
          }
          if (!esiste) {
            this.eventiByTipo.delete(tokenKey);
            console.warn("Eliminato un item.", tokenKey);
            console.warn("this.eventiByTipo: ", this.eventiByTipo);
            this.updateCalendarioByTipo(this.eventiByTipo);
          }
        }
        this.spinnerService.closeSpinner();
      }

    });
  }

  updateCalendarioByMese(): void {
    this.dateSubject.subscribe(date => {
      this.spinnerService.activeSpinner();
      let year = date.year;
      let month = date.month;

      console.warn("aggiornamento calendario mese ", date, this.eventiByTipo);

      let observables: Observable<any>[] = []
      let tokens = [];

      if (this.multiSelectControl.value.length === this.listTipiEventi.length) {
        this.eventiService.listaEventi(month, year).pipe(
          map(resp => {
            let events = resp.listObj;
            if (events) {
              for (let tipoEvento of this.listTipiEventi) {
                let listEventiByTipo = events.filter(event => event.tokenType === tipoEvento.token);
                this.eventiByTipo.set(tipoEvento.token, listEventiByTipo ? listEventiByTipo : null);
              }
            }
          })
        ).subscribe( () => {
          this.updateCalendarioByTipo(this.eventiByTipo);
          this.spinnerService.closeSpinner();
        });
      } else {
        this.eventiByTipo.forEach((value, token) => {
          observables.push(this.eventiService.listaEventi(month, year, token))
          tokens.push(token);
        });

        Observable.forkJoin(observables).subscribe(
          (resps) => {
            let i = 0;
            for (let resp of resps) {
              this.eventiByTipo.set(tokens[i], resp.listObj ? resp.listObj : null);
              this.updateCalendarioByTipo(this.eventiByTipo);
              i++;
            }
          },
          (err) => {
            // console.error(err)
            // this.spinnerService.closeSpinner()
          },
          () => {this.spinnerService.closeSpinner();},
        );
      }


    });
  }

  updateCalendarioByTipo(eventiByTipo: Map<string, EventPlanningBean[]>): void {

    this.calendar.getApi().removeAllEvents();
    let events = [];

    eventiByTipo.forEach((value) => {
      if (value) {
        events = events.concat(this.convertToCalendarEvents(value));
      }
    });

    this.events = events;
    this.addEvents(this.events);

  }


  /**
   * Gestione oggetti eventi
   */
  convertToCalendarEvents(objs: EventPlanningBean[]): EventInput[] {
    let events: EventInput[] = [];
    for (let obj of objs) {
      events.push(this.convertToCalendarEvent(obj));
    }
    return events;
  }

  convertToCalendarEvent(obj: EventPlanningBean): EventInput {
    let event: EventInput;
    const currentDate = new Date();
    const closeDate = this.convertToDate(obj.closingDate);
    const lock = currentDate > closeDate;

    event = {
      ...new CalendarEvent(),
      id: this.createEventId(),
      title: obj.title,
      start: this.convertToDate(obj.startDate),
      end: this.convertToDate(obj.endDate),
      backgroundColor: obj.color,
      borderColor: obj.color,
      icon: lock,
      token: obj.token,
    };
    return event;
  }

  eventContent(arg) {
    let divEl = document.createElement('div');
    let spanTitle = document.createElement('span');
    let spanLock = document.createElement('span');
    let spanText = document.createElement('span');
    let italicEl = document.createElement('i');

    divEl.className = "custom-display";
    spanTitle.className = "title";
    spanLock.className = "lock";
    spanText.className = "text";
    italicEl.className = "material-icons";

    divEl.appendChild(spanTitle);
    divEl.appendChild(spanLock);
    spanLock.appendChild(spanText);
    spanLock.appendChild(italicEl);

    spanTitle.innerText = arg.event.title;

    let startDate = (arg.event['_instance'].range.start as Date).getDate();
    let endDate = (arg.event['_instance'].range.end as Date).getDate();


    if (this.calendar.getApi().view['type'] === 'listMonth') {
      divEl.style.color = "black";
      divEl.style.borderRadius = "3px";
      divEl.style.padding = "1px"
    } else {
      if (startDate === endDate) {
        divEl.style.borderRadius = "3px";
        divEl.style.padding = "1px"
        divEl.style.color = "whitesmoke";
        divEl.style.backgroundColor = arg.backgroundColor;
      }
    }

    const lockOpen = "lock_open";
    const lock = "lock";
    if (arg.event.extendedProps.icon) {
      italicEl.innerText = lock;
      spanText.innerText = "Chiuso";
    } else {
      italicEl.innerText = lockOpen;
      spanText.innerText = "Aperto";
    }

    let arrayOfDomNodes = [ divEl ]

    return { domNodes: arrayOfDomNodes};
  }


  createEventId(): string {
    return String(this.eventGuid++);
  }

  convertToDate(date: string): Date {
    let data = date.split(" ")[0];
    let tempo = date.split(" ")[1];

    let year = Number(data.split("-")[2]);
    let month = Number(data.split("-")[1]) - 1;
    let day = Number(data.split("-")[0]);

    let ora = Number(tempo.split(":")[0]);
    let minuti = Number(tempo.split(":")[0]);

    return new Date(year, month, day, ora, minuti);
  }

  /**
   * Metodi eventi
   */
  addEvents(events: EventInput[]): void {
    for (let event of events) {
      this.calendar.getApi().addEvent(event);
    }
  }

  /**
   * Metodi Fullcalendar
   */

  previousMonth(): void {
    this.calendar.getApi().prev();
    this.validaMeseAndInviaSubject();
  }

  nextMonth(): void {
    this.calendar.getApi().next();
    this.validaMeseAndInviaSubject();
  }

  validaMeseAndInviaSubject(): void {
    if (this.currentMonth !== this.calendar.getApi().currentData.currentDate.getMonth()) {
      let month = this.calendar.getApi().getDate().getMonth() + 1;
      let year = this.calendar.getApi().getDate().getFullYear();
      this.dateSubject.next({month, year});
      this.currentMonth = this.calendar.getApi().currentData.currentDate.getMonth();
    }
  }

  addEventoButton(): void {
    this.spinnerService.activeSpinner();
    this.router.navigate(['../nuovo'], {relativeTo: this.activatedRoute}).then(this.spinnerService.closeSpinner);
  }

  goToDetail(info): void {
    this.spinnerService.activeSpinner();
    console.warn("INFO DETAIL", info.event['_def'].extendedProps['token'])
    const token = info.event['_def'].extendedProps['token'];
    this.router.navigate(['../dettaglio'], {
      queryParams: {t: token},
      relativeTo: this.activatedRoute
    }).then(this.spinnerService.closeSpinner);
  }


}
