import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div *ngFor="let msg of messages">{{msg}}</div>
      <input [(ngModel)]="message" placeholder="Escribe aquí..." type="text">
      <button (click)="sendMsg()">Enviar</button>
    </div>
  `,
  styles: [
  ]
})
export class ChatComponent implements OnInit {
  private socket:any;
  messages:string[]=[];
  message:string=''; //llegará con el método emmit

  ngOnInit(): void {
    this.socket = io.io('http://localhost:3000');
    this.socket.on('chat',(msg:string)=>{
      this.messages.push(msg);
    })
  }

  sendMsg(){
    this.socket.emit('chat', this.message);
    this.message = '';
  }
}
