import {NgModule} from "@angular/core";
import {SharedModule} from "../../../shared/shared.module";
import {EventiRoutingModule} from "./route/eventi-routing.module";
import {CalendarioComponent} from "./calendario/calendario.component";
import {FullCalendarModule} from "@fullcalendar/angular";
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';// a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';// a plugin!
import listPlugin from '@fullcalendar/list';// a plugin!
import scrollGridPlugin from '@fullcalendar/scrollgrid'; // a plugin!
import {EventiService} from "./service/eventi.service";
import {NewEventoComponent} from "./nuovo-evento-stepper/new-evento.component";
import {DetailEventoComponent} from './detail/detail-evento.component';
import {EventoResolver} from "./route/evento.resolver";
import {EditEventoComponent} from "./edit/edit-evento.component";
import {ChipsMultiSelectComponent} from "../../../common/components/chips/chips-multi-select.component";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {MY_FORMATS} from "../../../utils/constants";
import {ComponentsModule} from "../../../common/components/components.module";
import {SchedaEventoResolver} from "./route/schedaEvento.resolver";
import {DocumentoService} from "../spazio-lavoro/service/documento.service";

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin,
  scrollGridPlugin,
]);

@NgModule({
  imports: [
    SharedModule,
    EventiRoutingModule,
    FullCalendarModule,
    ComponentsModule,
  ],
  declarations: [
    CalendarioComponent,
    NewEventoComponent,
    DetailEventoComponent,
    EditEventoComponent,
    ChipsMultiSelectComponent,
  ],
  exports: [],
  providers: [
    EventiService,
    DocumentoService,
    EventoResolver,
    SchedaEventoResolver,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class EventiModule {}
