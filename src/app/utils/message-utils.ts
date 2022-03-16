import { TIPO_MESSAGGI } from "./enums";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Injectable, NgZone } from "@angular/core";

@Injectable({ providedIn: "root" })
export class MessageUtils {

    constructor(
        private matSnackBar: MatSnackBar,
        private zone: NgZone
    ) { }

    alertSuccess(message: string, timeout ?: number) {
        this.zone.run(() => {
            this.matSnackBar.open(message, " ", { duration: timeout || 3000, verticalPosition: "bottom", horizontalPosition: "center", panelClass: "alert-success"});
        });
    }

    alertError(message: string, timeout ?: number) {
        this.zone.run(() => {
            this.matSnackBar.open(message, " ", { duration: timeout || 3000, verticalPosition: "bottom", horizontalPosition: "center", panelClass: "alert-error" });
        });
    }

    alertWarning(message: string, timeout ?: number) {
        this.zone.run(() => {
            this.matSnackBar.open(message, " ", { duration: timeout || 5000, verticalPosition: "bottom", horizontalPosition: "center", panelClass: "alert-warning" });
        });
    }
}
