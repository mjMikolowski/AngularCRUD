import { Component, Input, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../service/http-provider.service';

@Component({
  selector: 'ng-modal-confirm',
  template: `
  <div class="modal-header">
    <h5 class="modal-title" id="modal-title">Delete Confirmation</h5>
    <button type="button" class="btn close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">×</span>
    </button>
  </div>
  <div class="modal-body">
    <p>Are you sure you want to delete?</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">CANCEL</button>
    <button type="button" ngbAutofocus class="btn btn-success" (click)="modal.close('Ok click')">OK</button>
  </div>
  `,
})

export class NgModalConfirm {
  constructor(public modal: NgbActiveModal) { }
}

const MODALS: { [name: string]: Type<any> } = {
  deleteModal: NgModalConfirm,
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  closeResult = '';
  employeeList: any = [];
  constructor(private router: Router, private modalService: NgbModal,
    private toastr: ToastrService, private httpProvider : HttpProviderService) { }

  ngOnInit(): void {
    this.getAllEmployee();
  }
  async getAllEmployee() {
    this.httpProvider.getAllEmployee().subscribe((data : any) => {
      if (data != null && data.body != null) {
        let resultData = data.body;
        resultData = Array.from(new Map(Object.entries(resultData)).values());
        resultData = resultData.map((data: any) =>  Array.from(new Map(Object.entries(data)).values())[0]);
        if (resultData) {
          this.employeeList = resultData;
        }
      }
    }, (error : any) => {
      this.employeeList = [];
    });
  }

  AddEmployee() {
    this.router.navigate(['AddEmployee']);
  }

  deleteEmployeeConfirmation(employee: any) {
    this.modalService.open(MODALS['deleteModal'],
      {
        ariaLabelledBy: 'modal-basic-title'
      }).result.then((result: any) => {
        this.deleteEmployee(employee);
      }, (reason: any) => {});
  }

  deleteEmployee(employee: any) {
    this.httpProvider.deleteEmployee(employee).subscribe((data : any) => {
      this.toastr.success(employee.FirstName + ' ' + employee.LastName + ' deleted successfully');
      this.getAllEmployee();
    },
    (error : any) => {});
  }
}