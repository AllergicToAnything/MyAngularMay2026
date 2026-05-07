import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SharedModules } from '../../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import { Ui } from '../../services/ui';

interface reportItem {
  title: string;
  category: string;
  date: string;
}

@Component({
  selector: 'app-reports',
  imports: [...SharedModules, RouterLink],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports implements OnInit {
  public reportList: reportItem[] = [
    { title: 'Sample report title 1', category: 'Sample category', date: '01/01/1978' },
  ];
  public dataSource: any = new MatTableDataSource(this.reportList);
  public displayedColumns: string[] = ['no', 'title', 'date', 'actions'];

  constructor(
    private router: Router,
    private apiServices: Api,
    private cdr: ChangeDetectorRef,
    private uiServices: Ui,
  ) {}

  async ngOnInit() {
    try {
      let response: any = await this.apiServices.httpGet('/reports');
      console.log(response);
      this.reportList = response.data;
      this.dataSource = new MatTableDataSource(this.reportList);
      this.dataSource.data = this.dataSource.data.map((report: any) => ({ ...report }));
      this.cdr.detectChanges();
    } catch (error) {}
  }

  async deleteReport(id: number) {
    const confirmation = confirm('Are you sure you want to delete this report?');
    if (confirmation) {
      try {
        let res: any = await this.apiServices.httpPost('/reports/delete/' + id, {}, 'delete');
        if (res) {
          this.uiServices.openSnackBar('Report deleted successfully', 'OK');
          this.ngOnInit(); // Refresh the list
        }
      } catch (error) {
        this.uiServices.openSnackBar('Failed to delete report', 'OK');
        console.error(error);
      }
    }
  }
}
