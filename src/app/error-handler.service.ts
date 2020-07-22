import { ErrorHandler } from "@angular/core";
import {MatSnackBar} from '@angular/material/snack-bar';

export class AppErrorHandler implements ErrorHandler{
    constructor(private snackbar:MatSnackBar){}

    handleError(e){
        console.error(e);
        this.snackbar.open(
            `Error: ${e.message}`, 
            'CLOSE',
            {
                verticalPosition:'top',
                horizontalPosition:'right'
            }
        );
    }

}