import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../service/http-provider.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})

export class EditEmployeeComponent implements OnInit {
  editEmployeeForm: employeeForm = new employeeForm();

  @ViewChild("employeeForm")
  employeeForm!: NgForm;

  isSubmitted: boolean = false;
  employeeId: any;
  name: string | undefined;

  constructor(private toastr: ToastrService, private route: ActivatedRoute, private router: Router,
    private httpProvider: HttpProviderService) { }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.params['employeeId'];
    this.getEmployeeDetailById();
    this.name = '';
  }
  getEmployeeDetailById() {
    this.httpProvider.getEmployeeDetailById(this.employeeId).subscribe((data: any) => {
      if (data != null && data.body != null) {
        let resultData = data.body;
        this.name = Array.from(new Map(Object.entries(resultData)).keys())[0];
        resultData = Array.from(new Map(Object.entries(resultData)).values())[0];
        if (resultData) {
          this.editEmployeeForm.FirstName = resultData.FirstName;
          this.editEmployeeForm.LastName = resultData.LastName;
          this.editEmployeeForm.Email = resultData.Email;
          this.editEmployeeForm.Phone = resultData.Phone;
        }
      }
    },
      (error: any) => { });
  }

  EditEmployee(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      this.httpProvider.updateEmployee({
        ...this.editEmployeeForm,
        name: this.name
      }).subscribe(async data => {
        if (data != null && data.body != null) {
          var resultData = data.body;
          if (resultData != null) {
            this.toastr.success(this.editEmployeeForm.FirstName + ' ' + this.editEmployeeForm.LastName + ' updated successfully');
              setTimeout(() => {
                this.router.navigate(['/Home']);
              }, 500);
          }
        }
      }, async error => {
        this.toastr.error(error.message);
        setTimeout(() => {
          this.router.navigate(['/Home']);
        }, 500);
      });
    }
  }
}

export class employeeForm {
  Id: number = 0;
  FirstName: string = "";
  LastName: string = "";
  Email: string = "";
  Phone: string = "";
}