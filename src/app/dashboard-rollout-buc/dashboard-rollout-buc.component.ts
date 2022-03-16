import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { RolloutBUC } from '../_viewmodel/rollout-buc';

@Component({
  selector: 'app-dashboard-rollout-buc',
  templateUrl: './dashboard-rollout-buc.component.html',
  styleUrls: ['./dashboard-rollout-buc.component.css']
})
export class DashboardRolloutBUCComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['settore', 'tipoBUC', 'paese', 'dataPianificazione', 'dataInProduzione'];
  dataSource: MatTableDataSource<RolloutBUC> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
    this.dataSource.data = [
      {
        settore: 'Accident at Work / Occupational Disease',
        tipoBUC: 'AW_BUC_01a',
        paese: 'Austria',
        dataPianificazione: new Date(2018, 11, 21),
        dataInProduzione: new Date(2019, 4, 31)
      },
      {
        settore: 'Accident at Work / Occupational Disease',
        tipoBUC: 'AW_BUC_01b',
        paese: 'Austria',
        dataPianificazione: new Date(2018, 11, 21),
        dataInProduzione: new Date(2019, 4, 31)
      },
      {
        settore: 'Accident at Work / Occupational Disease',
        tipoBUC: 'AW_BUC_02',
        paese: 'Austria',
        dataPianificazione: new Date(2018, 11, 21),
        dataInProduzione: new Date(2019, 4, 31)
      },
      {
        settore: 'Accident at Work / Occupational Disease',
        tipoBUC: 'AW_BUC_03',
        paese: 'Austria',
        dataPianificazione: new Date(2018, 11, 21),
        dataInProduzione: new Date(2018, 11, 21)
      }
    ];
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    // TODO: Applicare logica di filtro custom sulle date
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
