import { MessageUtils } from "./message-utils";
import { NotificheService } from "./../common/services/notifiche.service";
import { environment } from "./../../environments/environment";
import { Notifica } from "./../model/notifica";
import { JsonResponseBean } from "./../common/json-response-bean";
import { NotificheComponent } from "./../common/components/notifiche/notifiche.component";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Injectable } from "@angular/core";
import { User } from "../model/user";

@Injectable({
    providedIn: 'root'
})
export class WebsocketNotifiche {
    webSocketEndPoint: string = environment.baseUrl + '/ws';
    poolNotifiche: string = '/topic/get-notifica';
    stompClient: any;

    constructor(
        private notificheService: NotificheService
    ){}

    _connect() {
        console.log('Initialize WebSocket Connection');
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        _this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe(_this.poolNotifiche, function (sdkEvent) {
                _this.onhandleNotifica(sdkEvent);
            });
            //_this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    }

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log('Disconnected');
    }

    _send(token) {
        console.log('calling logout api via web socket');
        let user: User = localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')) : null;

        if(user)
            this.stompClient.send('/app/invia-dati-da-notificare', {}, JSON.stringify({'token': token, 'userId': user.userId}));
    }

    onhandleNotifica(notifica) {
        console.log('Notified Recieved from Server :: ', notifica?.body);
        this.notificheService.addNotifica(JSON.parse(notifica?.body));
    }

    errorCallBack(error) {
        console.log('errorCallBack -> ' + error)
        setTimeout(() => {
            this._connect();
        }, 5000);
    }
}
