import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RoomService } from '@ng-mf/data-access-user';

@Component({
  selector: 'ng-mf-add-room',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css', './../../styles.css'],
  // styleUrls: ['./add-room.component.css'],

})
export class AddRoomComponent {
  submit = false;
  errorAddition: any | undefined;
  
  constructor(
    private router: Router,
    private roomService: RoomService,
  ) {}

  onSubmit(f: NgForm) {
    this.submit = true;
  
    const formData: any = {
      name: f.value.name,
      capacity: Number(f.value.capacity),
    };
  
    // Add resources if they exist
    if (f.value.resources && f.value.resources.trim() !== '') {
      formData.resources = f.value.resources.split(',').map((resource: string) => resource.trim());
    }
  
    if (f.value.name && f.value.capacity && !this.errorAdditionExist()) {
      console.log('formData', formData);
  
      this.roomService.create(formData).subscribe(
        (data: any) => {
          console.log('Room added successfully:', data);
          this.router.navigateByUrl('/room');
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout :', error.error.message);
          this.errorAddition = error.error;
        }
      );
    }
  }

  onNameChange() {
    if (this.errorAddition) {
      this.errorAddition = undefined;
    }
  }

  errorAdditionExist() {
    return this.errorAddition !== undefined;
  }

  errorIsName() {
    return this.errorAddition && this.errorAddition.type === 'name';
  }

  errorIsCapacity() {
    return this.errorAddition && this.errorAddition.type === 'capacity';
  }
}