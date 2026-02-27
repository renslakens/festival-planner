import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service'; // <--- IMPORT TOEVOEGEN

@Component({
    selector: 'festival-planner-user-edit',
    templateUrl: './user-edit.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    styles: []
})
export class UserEditComponent implements OnInit {
    form: FormGroup;
    userId: string | null = null; // Kan nu null zijn voordat de auth is gecheckt
    submitted = false;
    isEditMode = false;
    errorMessage: string | null = null;

    constructor(
        private userService: UserService,
        private authService: AuthService, // <--- INJECTEER AUTHSERVICE
        private router: Router,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            emailAddress: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit(): void {
        this.userId = this.authService.getCurrentUser()?.user_id || null;

        if (this.userId) {
            this.userService.getUserById(this.userId).subscribe({
                next: (response: any) => {
                    const user = response.results;
                    console.log('User data loaded:', user);
                    this.form.patchValue({
                        name: user.name,
                        emailAddress: user.emailAddress
                    });
                    this.isEditMode = true;
                },
                error: (err) => {
                    this.errorMessage = 'Fout bij ophalen gebruiker: ' + err.message;
                }
            });
        } else {
            this.errorMessage = 'Niet ingelogd of geen geldige sessie.';
        }
    }

    onSubmit(): void {
        this.submitted = true;
        if (this.form.valid && this.userId) {
            const updateData = { _id: this.userId, ...this.form.value };
            this.userService.updateUser(updateData).subscribe({
                next: () => {
                    this.router.navigate(['/profile'])
                },
                error: (err) => {
                    this.errorMessage = 'Fout bij opslaan: ' + err.message;
                }
            });
        }
    }
}