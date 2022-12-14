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
  user!: User;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getLoggedInUser().subscribe((user: User) => {
      this.user = user;
    });
  }
}
