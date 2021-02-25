import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private store: AngularFirestore) { }

  add(data) {
    return new Promise<void>((resolve, reject) =>{
        this.store
            .collection("todo")
            .add(data)
            .then(res => { resolve(); }, err => reject(err));
    });
  }

  read(){
    return this.store.collection("todo").snapshotChanges()
  }

  update(itm){
    // this.store.doc(`todo/${itm.id}`).update({...itm});
     this.store.doc('todo/'+itm.fsid).update({...itm})
  }

  delete(itm){
    this.store.doc('todo/'+itm.fsid).delete();
  }


}
