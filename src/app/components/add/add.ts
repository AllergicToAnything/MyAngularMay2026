import { Inject, Component } from '@angular/core';
import { SharedModules } from '../../shared/shared.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add',
  imports: [...SharedModules],
  templateUrl: './add.html',
  styleUrl: './add.scss',
})
export class Add {
  public todoForm: any = FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<Add>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.todoForm = this.formBuilder.group({
      title: data?.title || '',
    });
  }

  onSubmit() {
    let formData = this.todoForm.value;
    let title = formData.title;
    if (title != '') this.dialogRef.close(title);
  }
  onCancel() {
    this.dialogRef.close();
  }
}
