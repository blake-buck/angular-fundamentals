import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import {simpleReducer} from './simple.reducer'

import 
{ MatCardModule, 
  MatListModule, 
  MatDividerModule, 
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatGridListModule,
  MatSelectModule,
  MatMenuModule,
  MatCheckboxModule,
  MatTabsModule,
  MatIconModule,
  MatExpansionModule,
  MatToolbarModule
} 
from '@angular/material';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { RowComponent } from './row/row.component';
import { BoardComponent, DeleteBoardDialogComponent } from './board/board.component';
import { TaskComponent, TaskDialogComponent, DeleteDialogComponent, DatePickDialogComponent, PhotoDialogComponent, AttachmentDialogComponent, TransferTaskDialogComponent } from './board/task/task.component';


@NgModule({
  declarations: [
    AppComponent,

    RowComponent,

    BoardComponent,
    DeleteBoardDialogComponent,

    TaskComponent,
    TaskDialogComponent,
    DeleteDialogComponent,
    DatePickDialogComponent,
    PhotoDialogComponent, 
    AttachmentDialogComponent,
    TransferTaskDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatGridListModule,
    StoreModule.forRoot({simpleReducer}),
    MatSelectModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTabsModule,
    MatIconModule,
    MatExpansionModule,
    MatToolbarModule
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue:{hasBackdrop:false}}
  ],
  bootstrap: [AppComponent],
  entryComponents : [TaskDialogComponent, DeleteDialogComponent, DatePickDialogComponent, PhotoDialogComponent, AttachmentDialogComponent, DeleteBoardDialogComponent, TransferTaskDialogComponent]
})
export class AppModule { }
