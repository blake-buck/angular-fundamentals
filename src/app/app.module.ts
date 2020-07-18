import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import {simpleReducer} from './store/simple.reducer'

import { HttpClientModule } from '@angular/common/http';

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
  MatToolbarModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatTooltipModule
} 
from '@angular/material';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { RowComponent } from './row/row.component';
import { BoardComponent } from './board/board.component';
import { TransferBoardDialogComponent } from './board/transfer-board-dialog/transfer-board-dialog.component';
import { DeleteBoardDialogComponent } from './board/delete-board-dialog/delete-board-dialog.component';
import { ExportButtonComponent } from './board/export-button/export-button.component';

import { TaskComponent } from './task/task.component';

import {TaskDialogComponent} from './task_dialog/task_dialog.component';
import {AttachmentDialogComponent} from './task_dialog/attachment_dialog/attachment_dialog.component';
import {DatePickDialogComponent} from './task_dialog/date_pick_dialog/date_pick_dialog.component';
import {PhotoDialogComponent} from './task_dialog/photo_dialog/photo_dialog.component';
import { DeleteDialogComponent} from './task_dialog/delete_dialog/delete_dialog.component';
import {TransferTaskDialogComponent} from './task_dialog/transfer_task_dialog/transfer_task_dialog.component';
import {PreviewAttachmentDialogComponent} from './task_dialog/preview_attachment_dialog/preview_attachment_dialog.component';
import { LinkTaskDialogComponent } from './task_dialog/link_task_dialog/link_task_dialog.component';

import { RowHolderComponent } from './row-holder/row-holder.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { AppEffects } from './store/app.effects';
import { EffectsModule } from '@ngrx/effects';



@NgModule({
  declarations: [
    AppComponent,

    RowComponent,

    BoardComponent,
    ExportButtonComponent,
    DeleteBoardDialogComponent,
    TransferBoardDialogComponent,

    TaskComponent,
    TaskDialogComponent,
    DeleteDialogComponent,
    DatePickDialogComponent,
    PhotoDialogComponent, 
    AttachmentDialogComponent,
    TransferTaskDialogComponent,
    PreviewAttachmentDialogComponent,
    LinkTaskDialogComponent,

    RowHolderComponent,
    LoginComponent
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
    EffectsModule.forRoot([AppEffects, RowComponent]),
    MatSelectModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTabsModule,
    MatIconModule,
    MatExpansionModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,

    HttpClientModule,

    AppRoutingModule
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue:{hasBackdrop:false}}
  ],
  bootstrap: [AppComponent],
  entryComponents : [TaskDialogComponent, DeleteDialogComponent, DatePickDialogComponent, PhotoDialogComponent, AttachmentDialogComponent, DeleteBoardDialogComponent, TransferTaskDialogComponent, TransferBoardDialogComponent, PreviewAttachmentDialogComponent, LinkTaskDialogComponent]
})
export class AppModule { }
