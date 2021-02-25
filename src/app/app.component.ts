import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { isTemplateRef } from 'ng-zorro-antd';
import { Todo } from './todo';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'todo-app';
  value: string = '';
  todo = [];
  pendingData = [];
  completedData = [];
  data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.'
  ];

  constructor(private apiService: TodoService, private store: AngularFirestore) {}

  ngOnInit(){
    /// 1. Get Data from Firebase
      this.apiService.read().subscribe((data) => {
        this.todo = data.map((document) => {
          return { 
            fsid: document.payload.doc.id,
            ...document.payload.doc.data() as {}
          } 
        });
    /// 2. Categorize Pending & Completed
        this.pendingData = this.todo.filter(todo => todo.status === false);
        this.completedData = this.todo.filter(todo => todo.status === true);
      });
   }

  /// Get Record from Firebase
  addItem(){
    /// Initialize
    const data = {
      id              : this.pendingData.length,
      item            : this.value,
      status          : false,
      createdDateTime : new Date()
    }

    /// Insert into firebase
    this.apiService.add(data).then((res) => {
      this.pendingData.push(data);
      this.value = '';
    });
  }

  /// Update Record - Incomplete
  movetoPending(x){
    x.createdDateTime = new Date();
    x.status = false;
    this.apiService.update(x);
  }

  /// Update Record - Completed
  movetoCompleted(x){
    x.createdDateTime = new Date();
    x.status = true;
    this.apiService.update(x);
  }

  /// Delete Record
  delete(x){
    this.apiService.delete(x);
  }

}
