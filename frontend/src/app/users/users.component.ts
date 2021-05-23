import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { webService, ResultType } from '../services/web-service'
import {
  AjaxService
} from '../services/ajax.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'
import * as json2csv  from 'json2csv';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { format as formatFns } from 'date-fns'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: []
})
export class UsersComponent implements OnInit {
  @ViewChild('userForm') userFormHtml: NgForm;
  @ViewChild('closeModalButton') closeModalButton: ElementRef;


  users = []
  userList = []
  p: number = 1;
  pageSize: number = 5;
  initialPage: number = 1;
  totalEntries: number = 0;
  ifEditUser = false
  materialIconOthers = 'transgender'
  currentPage: number = 1
  getInitialFormValues = () => {
    return {
      id: null,
      name: '',
      email: '',
      gender: '',
      status: '',
      otherGenderName: 'Others'
    }
  }

  userFormTs = this.getInitialFormValues()
  constructor(private toastyService: ToastrService, private AjaxService: AjaxService, private webService: webService, private domSanitizer: DomSanitizer ) { }

  async ngOnInit() {
    this.insertUsersIfNoUserExists()

  }
  private apicall = this.webService.apicall
  private apiGet = this.webService.apiGet

  async insertUsersIfNoUserExists(getNewUsers?) {
    let url = "insertUsersIfNoneFound";
    let datas = <ResultType>await this.apicall( { getNewUsers }, url, false, true)
    if(datas.code == 200 || 201) {
      this.users = datas.result
      this.totalEntries = datas.result.length
    }
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items

    console.log(pageOfItems)
    this.userList = pageOfItems;
}

  processFormData(form) {
    let data = { formValues : form.form.value }

    data.formValues['gender'] =
    this.userFormTs.gender === 'Others'
    ? this.userFormTs.otherGenderName
    : this.userFormTs.gender

    return data
  }

  async addEditUser(addFrm: NgForm, ifEdit?) {

    let data = this.processFormData(addFrm)
    data['id'] = this.userFormTs.id

    if(data.formValues['gender'] === '') {
      this.toastyService.warning('Please Provide Gender Before Submiting', '')
      return;
    }
    console.log(data)
    let url = ifEdit ? 'editUser' : "addUser";
    let datas = <ResultType>await this.apicall( data, url, false, true)
    if(datas.code == 200) {
      if(ifEdit)
        this.updateClientAfterEdit(datas.result)
      else
        this.insertUsersIfNoUserExists(false)
      this.closeModalButton.nativeElement.click()
    }
  }

  updateClientAfterEdit(datas) {
    let userIndex = this.users.findIndex(user => user.id == datas.id)

    Object.keys(datas).forEach( key => {
      if(key !== 'id')
        this.users[userIndex][key] = datas[key];
    })
  }

  resetForm() {
    this.userFormHtml.resetForm()
    this.userFormTs = this.getInitialFormValues()
}


  findIndex = ind => this.users.findIndex(use => use.id == ind)

  async userEditFormSetValues(user) {
    this.userFormTs.otherGenderName = 'Others'
    this.userFormTs.email = user.email
    this.userFormTs.name = user.name
    this.userFormTs.status = user.status
    this.userFormTs.id = user.id

    if(user.gender === 'Male' || user.gender === 'Female')
      this.userFormTs.gender = user.gender
    else {
      this.userFormTs.gender = 'Others'
      this.userFormTs.otherGenderName = user.gender
    }
  }

  getGenderIcon(gender:string) {
    let genderLower = gender.toLowerCase()
    if(genderLower === 'male') return 'male'
    else if(genderLower === 'female') return 'female'
    else return 'transgender'
  }

  async deleteUser(userId) {
    let swalResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    })

    if(swalResult.isConfirmed) {

      let url = "deleteUser";
      let datas = <ResultType>await this.apicall( { id: userId }, url, false, true)
      if(datas.code == 200 ) {
        console.log(this.currentPage, "CURRENTPAGE")
        let userIndex = this.users.findIndex(user => user.id == userId)
        this.users.splice(userIndex, 1)
        this.totalEntries = this.users.length
        this.users = JSON.parse(JSON.stringify(this.users))
        Swal.fire(
          'Deleted!',
          'User has been deleted successfully.',
          'success'
        )
      }
      else {
        Swal.fire(
          'User Could not be deleted!',
          datas.message,
          'error'
        )
      }
    }
    else if(swalResult.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Your data is safe :)',
        'error'
      )
    }


  }

  getDateInObj (date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
      )
  }

  exportToCsv() {
    let csvUsers = JSON.parse(JSON.stringify(this.users))
    csvUsers.forEach((user, index) => {
      user.sno = index + 1
      let date = this.getDateInObj(new Date(user.created_at))
      user.dateCreated = formatFns(date, 'MMM d, yyyy')
    } );

    return this.generateCSVDownloadLink({
      filename: "Users Data.csv",
      data: csvUsers,
      columns: [
        'sno',
        'id',
        'name',
        'email',
        'gender',
        'dateCreated',
        'status',
      ],
    });
  }

  generateCSVDownloadLink(options: { filename: string, data: any[], columns: string[] }): SafeUrl {
    const fields = options.columns;
    const opts = { fields, output: options.filename };
    const csv = json2csv.parse(options.data, opts);
    return this.domSanitizer.bypassSecurityTrustUrl('data:text/csv,' + encodeURIComponent(csv));
  }

  // async exportToCsv() {
  //   let fields = ['field1', 'field2', 'field3'];
  //   let result = json2csv({ data:[{ field1: 'a', field2: 'b', field3: 'c' }], fields: fields });
  //   console.log(result);
  // }
// absoluteIndex(indexOnPage: number): number {
//   return this.itemsPerPage * (this.currentPage - 1) + indexOnPage;
// }

}
