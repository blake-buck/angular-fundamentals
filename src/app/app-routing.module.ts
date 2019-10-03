import { LoginComponent } from "./login/login.component";
import {RouterModule, Routes, Router} from '@angular/router'
import { NgModule } from '@angular/core';
import { RowHolderComponent } from './row-holder/row-holder.component';

const routes:Routes = [
    {path:'', component:LoginComponent},
    {path:'app', component:RowHolderComponent}
]

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})

export class AppRoutingModule{}