import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { User } from '../../model/user';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { StatisticService } from '../../services/statistic/statistic.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
users: User[] = [] ;
user: any = null;

imageSrc: string | null = null;

  //public userOne: string = Image.users.userOne;
  
  // Variable pour gérer l'état du modal
  showHelpCenterModal: boolean = false;
  showStatisticModal: boolean = false;

  notifications: any[] = [];
  unreadCount: number = 0;
  isNotificationOpen: boolean = false;
  isProfileOpen: boolean = false;

  isOpen: boolean = false;
  private intervalId: any;

  //public userOne: string = Image.users.userOne;
  userName: string = '';
  userEmail: string = '';
  role: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private element: ElementRef,
    private renderer: Renderer2,
    private statisticService: StatisticService
  ){}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (res: any) => {
        this.userName = res.userName;
        this.userEmail = res.userEmail;
        this.role = res.role;

        if(res.imageData){
          this.imageSrc = `data:${res.contentType};base64,${res.imageData}`;
        }
      },
      error: (err: any) => {
        console.log('Error into return information ', err);
      },
    });
  }

  ngOnDestroy(): void {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }

  getImageUrl(userId: number): string {
    return `http://localhost:5000/api/users/${userId}/image`;
  }

  logout() {
      const confirmed = window.confirm('Are you sure you want to log out?');
      
      if (confirmed) {
        localStorage.removeItem('token');
        this.router.navigate(['/Login']);
      }
    }

  navigateTo(page: string){
    this.router.navigate([`/${page}`]);
  }

  /*startNotificationPolling(): void {
    // Appel initial pour charger les notifications immédiatement
    this.loadNotifications();

    // Démarre l'intervale pour appeler loadNotifications toutes les 5 secondes
    this.intervalId = setInterval(() => {
      this.loadNotifications();
    }, 5000); // 5000 millisecondes = 5 secondes
  }*/

  /*loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.unreadCount = data.filter((n) => !n.isOpen).length;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des notifications', err);
      },
    });
  }*/

 /* markAsRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        const notification = this.notifications.find((n) => n.id === id);
        if (notification) {
          notification.isOpen = true;
          this.unreadCount--;
        }
      },
      error: (err) => {
        console.error(
          'Erreur lors du marquage de la notification comme lue',
          err
        );
      },
    });
  }*/

  // Gestion du clic sur le bouton de notification
  toggleNotificationPanel(): void {
    this.isNotificationOpen = !this.isNotificationOpen;
  }

  // Gestion du clic sur le bouton de profil
  toggleProfilePanel(): void {
    this.isProfileOpen = !this.isProfileOpen;
    this.isNotificationOpen = false; // Fermer la liste des notifications si ouverte
  }

  // Fermer les menus lors d'un clic en dehors
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Fermer la liste des notifications si on clique en dehors
    if (
      !target.closest('.notification-button') &&
      !target.closest('.notification-panel')
    ) {
      this.isNotificationOpen = false;
    }

    // Fermer le menu de profil si on clique en dehors
    if (
      !target.closest('.profile-button') &&
      !target.closest('.profile-dropdown')
    ) {
      this.isProfileOpen = false;
    }
  }

  // Méthode pour ouvrir le modal
  openHelpCenterModal(): void {
    this.showHelpCenterModal = true;
  }

  // Méthode pour fermer le modal
  closeHelpCenterModal(): void {
    this.showHelpCenterModal = false;
  }

  // Méthode pour ouvrir le modal statistic
  openStatisticModal(): void {
    this.showHelpCenterModal = true;
  }

  // Méthode pour fermer le modal statistic
  closeStatisticModal(): void {
    this.showHelpCenterModal = false;
  }

  Deconnexion() {
    const confirmed = window.confirm('Are you sure you want to log out?');
    
    if (confirmed) {
      localStorage.removeItem('token');
      this.router.navigate(['/Login']);
    }
  } 
  
}
