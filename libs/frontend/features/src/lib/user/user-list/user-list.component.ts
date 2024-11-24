import { Component, OnDestroy, OnInit } from '@angular/core';
import { IUserInfo, UserGender, UserRole } from '@festival-planner/shared/api';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'festival-planner-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
    users?: IUserInfo[];
    sub?: Subscription;

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.sub = this.userService.getUsersAsObservable().subscribe((users) => (this.users = users))
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}