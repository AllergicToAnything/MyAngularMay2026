import { ChangeDetectorRef, Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SharedModules } from '../../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import { Ui } from '../../services/ui';
import { Data } from '../../services/data';

interface reportItem {
  id: number;
  no: number;
  title: string;
  category: string;
  date: string;
}

@Component({
  selector: 'app-reports',
  imports: [...SharedModules, RouterLink, MatSortModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  public reportList: reportItem[] = [];
  public dataSource = new MatTableDataSource<reportItem>([]);
  public displayedColumns: string[] = ['no', 'title', 'category', 'date', 'actions'];

  public categoryFilter = '';
  public categoryOptions: string[] = [];

  constructor(
    private router: Router,
    private apiServices: Api,
    private cdr: ChangeDetectorRef,
    private uiServices: Ui,
    private dataServices: Data,
  ) {
    this.dataSource.filterPredicate = (data: reportItem, filter: string) => {
      if (!filter) return true;
      return (data.category || '').trim().toLowerCase() === filter;
    };

    this.dataSource.sortingDataAccessor = (item: reportItem, property: string): string | number => {
      switch (property) {
        case 'no':
          return Number(item.no) || 0;
        case 'title':
          return (item.title || '').toLowerCase();
        case 'category':
          return (item.category || '').toLowerCase();
        case 'date':
          return this.parseDate(item.date);
        default:
          return (item as any)[property] ?? '';
      }
    };
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  async ngOnInit() {
    try {
      const response: any = await this.apiServices.httpGet('/reports');

      this.reportList = (response.data || []).map((report: any, index: number) => ({
        ...report,
        no: report.no ?? index + 1,
      }));

      this.dataSource.data = this.reportList;
      this.categoryOptions = [...new Set(this.reportList.map((r) => r.category).filter(Boolean))];

      this.cdr.detectChanges();

      // reattach after view updates
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      });
    } catch (error) {
      console.error(error);
    }
  }

  applyCategoryFilter(value: string) {
    this.categoryFilter = value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  private parseDate(value: string): number {
    if (!value) return 0;

    const raw = String(value).trim();

    const dmy = raw.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
    if (dmy) {
      const [, d, m, y] = dmy;
      return new Date(Number(y), Number(m) - 1, Number(d)).getTime();
    }

    const ymd = raw.match(/^(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})$/);
    if (ymd) {
      const [, y, m, d] = ymd;
      return new Date(Number(y), Number(m) - 1, Number(d)).getTime();
    }

    const parsed = Date.parse(raw);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  async onLogout() {
    this.dataServices.removeStorage('TOKEN');
    this.dataServices.removeStorage('USER');
    this.router.navigateByUrl('/login');
  }

  async deleteReport(id: number) {
    const confirmation = confirm('Are you sure you want to delete this report?');
    if (confirmation) {
      try {
        const res: any = await this.apiServices.httpPost('/reports/delete/' + id, {}, 'delete');
        if (res) {
          this.uiServices.openSnackBar('Report deleted successfully', 'OK');
          this.ngOnInit();
        }
      } catch (error) {
        this.uiServices.openSnackBar('Failed to delete report.', 'OK');
        console.error(error);
      }
    }
  }
}
