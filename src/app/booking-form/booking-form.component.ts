import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class BookingFormComponent {
  bookingForm: FormGroup;
  availableDates: Date[] = this.generateAvailableDates();

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      service: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  generateAvailableDates(): Date[] {
    let dates: Date[] = [];
    let today = new Date();
    for (let i = 1; i <= 14; i++) {
      let futureDate = new Date();
      futureDate.setDate(today.getDate() + i);
      dates.push(futureDate);
    }
    return dates;
  }

  sendRequest() {
    if (this.bookingForm.valid) {
      console.log('Booking Request:', this.bookingForm.value);
      alert('Your booking request has been submitted!');
    } else {
      alert('Please select a service and a date.');
    }
  }
}

