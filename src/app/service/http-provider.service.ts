import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from './web-api.service';

var apiUrl = "https://angular-4870a-default-rtdb.europe-west1.firebasedatabase.app";

var httpLink = {
  getAllEmployee: apiUrl + "/api/employee.json",
  deleteEmployeeById: apiUrl + "/api/employee",
  getEmployeeDetailById: apiUrl + "/api/employee",
  saveEmployee: apiUrl + "/api/employee"
}

@Injectable({
  providedIn: 'root'
})

export class HttpProviderService {
  constructor(private webApiService: WebApiService) { }

  public getAllEmployee(): Observable<any> {
    return this.webApiService.get(httpLink.getAllEmployee);
  }
  public deleteEmployee(model: any): Observable<any> {
    return this.webApiService.delete(httpLink.deleteEmployeeById + "/" + model?.FirstName + " " + model?.LastName + ".json");
  }
  public getEmployeeDetailById(model: any): Observable<any> {
    return this.webApiService.get(httpLink.getEmployeeDetailById + '/' + model + ".json");
  }
  public saveEmployee(model: any): Observable<any> {
    return this.webApiService.post(httpLink.saveEmployee + "/" + model?.FirstName + " " + model?.LastName + ".json", model);
  }  
  public updateEmployee(model: any): Observable<any> {
    return this.webApiService.patch(httpLink.saveEmployee + "/" + model?.FirstName + " " + model?.LastName + "/" + model?.name + ".json", model);
  }  
}                          