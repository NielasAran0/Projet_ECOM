import { Component, OnInit } from '@angular/core';
import { User } from 'app/admin/user-management/user-management.model';
import { IAppUser } from 'app/entities/app-user/app-user.model';
import { Observable } from 'rxjs';
import { ProfileService } from './service/profile.service';

@Component({
  selector: 'jhi-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user!: IAppUser;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.profileService.getLoggedInUser().subscribe((user: IAppUser) => {
      this.user = user;
    });
  }
}
