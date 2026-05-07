import { Component, OnInit } from '@angular/core';
import { SharedModules } from '../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../services/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Ui } from '../../services/ui';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [...SharedModules],
  templateUrl: './add.html',
  styleUrls: ['./add.scss'],
})
export class Add implements OnInit {
  public reportForm: FormGroup;
  public id: any;
  constructor(
    public formBuilder: FormBuilder,
    public apiService: Api,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public uiServices: Ui,
  ) {
    this.reportForm = this.formBuilder.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      try {
        let response: any = await this.apiService.httpGet('/reports/' + this.id);
        if (response.success) {
          let report = response.data;
          this.reportForm.setValue({
            title: report.title,
            category: report.category,
            date: this.parseApiDate(report.date),
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  private parseApiDate(value: string | Date | null): Date | null {
    if (!value) {
      return null;
    }
    if (value instanceof Date) {
      return value;
    }
    if (typeof value !== 'string') {
      return null;
    }

    // Try ISO format first
    const isoDate = new Date(value);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }

    // Support dd/mm/yyyy or dd-mm-yyyy from the API
    const dmy = /^([0-3]\d)[\/\-]([0-1]\d)[\/\-](\d{4})$/.exec(value);
    if (dmy) {
      const day = Number(dmy[1]);
      const month = Number(dmy[2]) - 1;
      const year = Number(dmy[3]);
      return new Date(year, month, day);
    }

    return null;
  }

  private formatDateToString(value: Date | string | null): string | null {
    if (!value) {
      return null;
    }
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) {
      return null;
    }
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  async onSubmit() {
    if (this.reportForm.invalid) {
    }

    try {
      const rawData: any = this.reportForm.value;
      const reportData: any = {
        ...rawData,
        date: this.formatDateToString(rawData.date) ?? rawData.date,
      };
      let message: string = 'Report submitted successfully';
      if (this.id) {
        var res = await this.apiService.httpPost('/reports/update/' + this.id, reportData, 'put');
        message = 'Report updated successfully';
      } else if (this.router.url.includes('/delete/')) {
        var res = await this.apiService.httpPost(
          '/reports/delete/' + this.id,
          reportData,
          'delete',
        );
      } else {
        var res = await this.apiService.httpPost('/reports/add', reportData);
      }

      if (res) {
        this.uiServices.openSnackBar(message, 'OK');
      }

      this.router.navigateByUrl('/reports');
    } catch (error) {
      console.log(error);
    }
  }
}
