import { FormControl } from "@angular/forms";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { MessageUtils } from "./../../../utils/message-utils";
import { SpinnerService } from "../../../common/services/spinner.service";
import { Breadcrumb } from "./../../../class/breadcrumb";
import { catchError, filter, map } from "rxjs/operators";
import { Constants } from "./../../../utils/constants";
import { DashboardRolloutBuc } from "./../../../model/dashboard-rollout-buc";
import { Confapp } from "./../../../model/confapp";
import { ConfappService } from "../../../common/services/confapp.service";
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Subscription } from "rxjs";
// import {BreadcrumbsService} from "../../../common/services/breadcrumbs.service";
import { DashboardRolloutBucService } from "./service/dashboard-rollout-buc.service";

const FILTER_OBJ = [
  {
    name: 'Descrizione',
    columnProp: 'descrizione',
    options: []
  }, {
    name: 'Tipo BUC',
    columnProp: 'bucType',
    options: []
  }, {
    name: 'Paese',
    columnProp: 'codCountry',
    options: []
  }, {
    name: 'Data Pianificazione',
    columnProp: 'datePlannedGate',
    options: []
  }, {
    name: 'Data In Produzione',
    columnProp: 'dateInProd',
    options: []
  }
]

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  title = 'Dashboard Rollout BUC';
  confapp: Confapp;
  displayedColumns: string[] = ['descrizione', 'bucType', 'codCountry', 'datePlannedGate', 'dateInProd'];
  dataSource: MatTableDataSource<DashboardRolloutBuc>;
  codeDesc = Constants.descDashboard;
  filterSelectObj = FILTER_OBJ;
  filterValues = {};
  filterText = "";
  defaultFilterPredicate?: (data: any, filter: string) => boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private serviceConfapp: ConfappService,
    private serviceDashboard: DashboardRolloutBucService,
    private spinnerService: SpinnerService,
    private messageUtils: MessageUtils,
    // private breadcrumbsService: BreadcrumbsService,
  ) {
    console.warn("sono in buc dashboard component");
  }

  ngOnInit(): void {
    this.getDescriptionBuc();
    this.getDashboardRollout();
  }

  getDashboardRollout(){
    this.spinnerService.activeSpinner();
    this.serviceDashboard.getDashboardRolloutBuc().subscribe(
      resp => {
        this.dataSource = new MatTableDataSource(resp.listObj);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.filterSelectObj.filter((o) => {
          o.options = this.getFilterObject(resp.listObj, o.columnProp);
        });
        this.defaultFilterPredicate = this.dataSource.filterPredicate;
      },
      (err) => {
        // console.error(err);
        // this.messageUtils.alertError('Errore nel recupero dei dati della dashboard')
        // this.spinnerService.closeSpinner()
      },
      () => {
        this.spinnerService.closeSpinner();
      }
    );
  }

  applyFilter(event: Event) {
    this.dataSource.filterPredicate = this.createFilter();
    this.filterText = (event.target as HTMLInputElement).value;
    this.filterValues['filterText'] = this.filterText ? this.filterText : null;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  getDescriptionBuc(){
    this.serviceConfapp.getConfAppByCode(this.codeDesc).subscribe(
      resp => {
        this.confapp = resp.obj;
      }
    );
  }

  getPageTitleByBreadcrumbs(route: ActivatedRoute) {
    const pageTitle = route.routeConfig? route.routeConfig.data['breadcrumb'] : '';
    // this.breadcrumbsService.generateBreadcrumbs([pageTitle])
    return pageTitle;
  }

  // Get Uniqu values from columns to build filter
  getFilterObject(fullObj, key) {
    const uniqChk = [];
    fullObj.filter((obj) => {
      if (!uniqChk.includes(obj[key])) {
        uniqChk.push(obj[key]);
      }
      return obj;
    });
    return uniqChk;
  }

  filterChange(filter, event) {
    this.dataSource.filterPredicate = this.createFilter();
    this.filterValues[filter.columnProp] = event.target.value.trim().toLowerCase();
    this.filterValues['filterText'] = this.filterText ? this.filterText : null;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  // Custom filter method fot Angular Material Datatable
  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      let isFilterSet = false;
      let searchTerms = JSON.parse(filter);
      let filterText = null;
      if (searchTerms['filterText']) {
        isFilterSet = true;
        filterText = searchTerms.filterText;
      }
      delete searchTerms['filterText']

      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }

      let nameSearch = () => {
        let found = false;
        if (isFilterSet) {
          let arrayBoolean = [];
          for (const col in searchTerms) {
            arrayBoolean.push(false);
          }
          let i = 0;
          for (const col in searchTerms) {
            let dataToString: string = data[col]? data[col].toString() : null
            let dataValue: string = dataToString? dataToString.trim().toLowerCase().split(' ').join() : null;
            let searchToString: string = searchTerms[col]? searchTerms[col].toString() : null
            let search: string = searchToString? searchToString.trim().toLowerCase().split(' ').join(): null;

            if (dataValue === search && isFilterSet) {
              found = true;
              arrayBoolean[i] = true;
            }
            i++;
          }

          let valuesBoolean: boolean = true;
          for (let itemBoolean of arrayBoolean){
            valuesBoolean = valuesBoolean && itemBoolean;
            if (!valuesBoolean) {
              return false;
            }
          }

          // validazione text filter
          if (filterText) {
            let rowString = "";
            for (let col in data) {
              rowString += data[col];
            }
            rowString = rowString.toLowerCase().trim().split(' ').join('');
            return rowString.includes(filterText.toLowerCase()) && valuesBoolean;
          }

          return found;
        } else {
          return true;
        }
      }
      return nameSearch()
    }
    return filterFunction
  }

  // Reset table filters
  resetFilters() {
    this.filterValues = {}
    this.filterSelectObj.forEach((value, key) => {
      value = undefined;
    })
    this.dataSource.filter = "";
  }

  ngOnDestroy(): void { }

}
