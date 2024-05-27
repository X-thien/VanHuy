import { Injectable } from '@angular/core';
import { User } from './user.i';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private dataUserSub = new BehaviorSubject<User>({ name: '', images: [] });
  dataUser$ = this.dataUserSub.asObservable();
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setData(data: any) {
    const user: User = {
      name: data.display_name,
      images: data.images,
    };
    this.dataUserSub.next(user);
  }

  getData(): Observable<User> {
    return this.dataUser$;
  }
}
