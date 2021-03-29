
import { Component, ViewChild, Inject, AfterViewInit, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Config, AppService } from './../services/app.service';
import { Document } from './../models/document.model';


export interface DialogData {
  openRate: number;
  closeRate: number;
}

@Component({
  selector: 'app-dialog',
  providers: [AppService],
  templateUrl: './dialog.component.html',
})
export class AddDialog {
  error: any;
  ip:any;
  currentDocument = this.socket.fromEvent<Document>('document');
  documents = this.socket.fromEvent<string[]>('documents');

  constructor(
    public dialogRef: MatDialogRef<AddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private appService: AppService,
    private socket: Socket) {

    // this.socket.on('newSensex', (data: any) => {
    //   console.log('newSensex handler: ', data)
    // });

    // this.socket.on('socketId', (id:any) => {
    //   console.log('SOCKET ID: ', id)
    // })



    this.appService.getIp().subscribe(
      (response: any) => {
        console.log('[getIp] ', response)
        this.ip = response.ip
        this.socket.emit("userid", this.ip);
      },
      (error: any) => this.error = error // error path
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addSensex(sensexData: DialogData): void {
    this.dialogRef.close();
    console.log("DATA: ", sensexData)
    this.appService.saveTodaysSensex(sensexData).subscribe(
      (response: any) => {
        console.log('[saveTodaysSensex] ', response)
      },
      (error: any) => this.error = error // error path
    );
  }

}

