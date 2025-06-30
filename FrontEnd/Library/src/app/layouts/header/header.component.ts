import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
} from '@angular/core';
//import { Images } from '../../../../assets/data/images';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { NgClass } from '@angular/common';
  import { AuthService } from '../../services/auth/auth.service';
  import { Router } from '@angular/router';




@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, NgClass],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  //public userOne: string = Images.users.userOne;
  
  // Variable pour gérer l'état du modal
  showHelpCenterModal: boolean = false;

  //notifications: any[] = [];
  unreadCount: number = 0;
  //isNotificationOpen: boolean = false;
  isProfileOpen: boolean = false;

  isOpen: boolean = false;
  private intervalId: any;

  nomComplet: string = '';
  email: string = '';
  role: string = '';

  constructor(
    //private notificationService: NotificationService,
    private authService: AuthService,
    private readonly router: Router,
    //private userService: UserService,
    private element: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  Deconnexion() {
    this.authService.logout();
    this.router.navigateByUrl('/connexion');
  }
}