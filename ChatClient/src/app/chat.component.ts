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
      <div *ngFor="let msg of messages">{{msg}}</div><br>
    </div>
    <div>
      <label for="username">Nombre de usuario:</label>
      <input type="text" [(ngModel)]="username" placeholder="Nombre de usuario..."><br>
      <label for="room">Sala:</label>
      <input type="text" [(ngModel)]="room" placeholder="Nombre de la sala..."><br>
      <button (click)="joinRoom()">Crear sala</button>
    </div>
    <div *ngIf="this.username.trim() !== '' && this.room.trim() !== ''">
      <input [(ngModel)]="message" (keyup.enter)="sendMsg()" placeholder="Escribe aqui..." type="text">
      <button (click)="sendMsg()" >Enviar</button>
    </div>
    <div>
      <div *ngFor="let room of rooms">{{room}}</div><br>
    </div>

  `,
  styles: [
  ]
})
export class ChatComponent implements OnInit {
  private socket: any;
  messages: string[] = [];
  message: string = '';
  username: string = '';
  room: string = '';
  rooms:string[] = [];

  ngOnInit(): void {
    this.socket = io.io('http://localhost:3000');

    this.socket.on('chat', (data:any) => {
      this.messages.push(data.msg);
      if(!this.rooms.includes(data.room)) this.rooms.push(data.room);
    })
    this.socket.on('join', (msg:string) => {
      this.messages.push(msg);
    })
  }

  joinRoom() {
    if (this.username.trim() !== '' && this.room.trim() !== '') {

      this.socket.emit('join', { username: this.username, room: this.room })

      this.messages.push(`Te has unido al chat ${this.room}`);
/*       this.username = ''; */
    }
    else{
      alert("Introduce los datos")
    }
  }

  sendMsg() {
    this.socket.emit('chat', this.message);
    this.message = '';
  }

}