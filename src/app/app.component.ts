import { Component, ViewChild, Inject, AfterViewInit, Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Config, AppService } from './services/app.service';
import { AddDialog } from './dialog/dialog.component';
import { Socket } from 'ngx-socket-io';
import { Document } from './models/document.model';

// @Injectable({
//   providedIn: 'app-root'
// })

export interface PeriodicElement {
  _id: string;
  date: string;
  open: number;
  close: number;
}


const ELEMENT_DATA: PeriodicElement[] = []


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [AppService],
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  displayedColumns: string[] = ['date', 'open', 'close'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  array: any;
  pageSize = 30;
  currentPage = 0;
  totalSize: any
  error: any;
  // paginator: any;
  openRate: any;
  closeRate: any;
  currentDocument = this.socket.fromEvent<Document>('document');
  documents = this.socket.fromEvent<string[]>('documents');


  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
  //   this.paginator = mp;
  // }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  constructor(
    private appService: AppService,
    private socket: Socket,
    public dialog: MatDialog) {
      console.log("SOCKET: ", this.socket)
      this.socket.on('newSensex', (sensex:any) => {
        console.log('newSensex: ', sensex)
        const data = [sensex, ...this.dataSource.data]
        this.dataSource = new MatTableDataSource<PeriodicElement>(data);
        this.dataSource.paginator = this.paginator;
        this.array = data;
        // this.iterator();
      })

      this.socket.on('socketId', (id:any) => {
        console.log('SOCKET ID: ', id)
      })
     }

  ngOnInit() {
    console.log("ngOnInit")
    this.getSensexList(0);
  }

  handlePageChange(e: any) {
    console.log("E: ", e)
    console.log("dataSource: ", this.dataSource)
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length < (this.pageSize * (e.pageIndex + 1))) {
      console.log(' fetch more' )
      const offset = this.pageSize * e.pageIndex
      this.getSensexList(offset)
    } else {
      // this.currentPage = e.pageIndex;
      // this.pageSize = e.pageSize;
      // this.iterator();
    }
  }

  clear() {
    this.error = undefined;
  }

  getSensexList(offset = 0) {
    console.log(offset)
    const limit = offset ? this.pageSize : this.pageSize+1
    this.appService.getSensexList(limit, offset).subscribe(
      (response: any) => {
        console.log('[getSensexList] ', response)
        const data = [...this.dataSource.data, ...response.data]
        this.dataSource = new MatTableDataSource<PeriodicElement>(data);
        this.dataSource.paginator = this.paginator;
        this.array = response.data;
        this.totalSize = response.count;
        // this.iterator();
      },
      error => this.error = error // error path
    );
  }

  private iterator() {
    console.log(this)
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }

  formatDate(date: any) {
    return new Date(date).toDateString()
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddDialog, {
      width: '250px',
      data: { openRate: this.openRate, closeRate: this.closeRate }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
