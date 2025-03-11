
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { BLOCKED_SLOTS } from '../bookings'; // Import blocked slots
import { OFFERS } from '../offers'; // Import offers
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [FullCalendarModule, FormsModule, CommonModule], // Add FormsModule here
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent {
  offers = OFFERS;
  events: EventInput[] = [...BLOCKED_SLOTS, ...this.loadEvents()]; // Merge blocked slots with saved events

  selectedDate: string = '';
  selectedTime: string = '';
  selectedService: string = 'Service A';

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    nowIndicator: true,
    selectable: true,
    // editable: true,
    events: this.events,

    // excludes weekends
    hiddenDays: [0,6],

    // Prevent navigating to past weeks
    validRange: {
      start: new Date()
    },
  
    slotMinTime: '10:00:00',
    slotMaxTime: '17:00:00',
  
    height: 'auto',
    contentHeight: 'auto',
  
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
  
    // Prevent selecting blocked slots
    selectAllow: (selectInfo) => !this.isBlockedSlot(selectInfo.startStr)
  };
  

  handleEventClick(info: any) {
    // you cannot remove blocked events
    console.log(info.event.title);
    
    if (info.event.title === "Blocked") {
      // alert('This time slot is blocked.');
      Swal.fire({
        title: 'Blocked Slot',
        text: 'This time slot is blocked.',
        icon: 'warning',
        confirmButtonText: 'OK',
        background: 'rgb(246, 248, 213)', 
        color: 'rgb(0, 0, 0)', 
        confirmButtonColor: 'rgb(32, 87, 129)'
      });
    } else {

      Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to remove the event: "${info.event.title}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel',
        background: 'rgb(246, 248, 213)', 
        confirmButtonColor: '#d33', // Red color for confirm button
        cancelButtonColor: 'rgb(32, 87, 129)' // Blue color for cancel button
      }).then((result) => {
        if (result.isConfirmed) {
          this.events = this.events.filter(event => event.start !== info.event.startStr);
          this.saveEvents();
          this.calendarOptions = { ...this.calendarOptions, events: this.events };
          console.log(this.events);
      
          Swal.fire({
            title: 'Deleted!',
            text: 'Your event has been removed.',
            icon: 'success',
            background: 'rgb(246, 248, 213)', 
            confirmButtonText: 'OK',
            confirmButtonColor: 'rgb(32, 87, 129)',
          });
        }
      });
      
    }
  }  

  handleDateSelect(selectInfo: any) {
    const selectedSlot = selectInfo.startStr;
  
    // Prevent booking if the slot is blocked or overlaps with an existing event
    if (this.isBlockedSlot(selectedSlot) || this.isOverlappingSlot(selectedSlot)) {
      Swal.fire({
        title: 'Blocked Slot',
        text: 'This time slot is blocked.',
        icon: 'warning',
        confirmButtonText: 'OK',
        background: 'rgb(246, 248, 213)', 
        color: 'rgb(0, 0, 0)', 
        confirmButtonColor: 'rgb(32, 87, 129)'
      });
      return;
    }
  
    this.selectedDate = selectedSlot.split("T")[0];
    this.selectedTime = selectedSlot.split("T")[1]?.substring(0, 5);
    document.getElementById("eventModal")!.style.display = "block";
  }
  

  isBlockedSlot(dateTime: string) : boolean {
    let blocked = true;
    const found = BLOCKED_SLOTS.find((slot)=> dateTime == slot.start)
    if (!found) {
      blocked = false
    } else {
      blocked = true
    }
    return blocked;
  }

  isOverlappingSlot(dateTime: string): boolean {
    const selectedStart = new Date(dateTime);
    const selectedEnd = new Date(selectedStart.getTime() + 60 * 60 * 1000); // One-hour slot
  
    return this.events.some((event: EventInput) => {
      const eventStart = new Date(event.start as string);
      const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000); // Assume 1-hour duration
  
      // Check if the new slot overlaps with an existing event
      return (
        (selectedStart >= eventStart && selectedStart < eventEnd) || // Starts within an existing event
        (selectedEnd > eventStart && selectedEnd <= eventEnd) || // Ends within an existing event
        (selectedStart <= eventStart && selectedEnd >= eventEnd) // Completely covers an existing event
      );
    });
  }
  
  closeModal() {
    const modal = document.getElementById('eventModal');
    if (modal) modal.style.display = 'none';
  }

  confirmEvent() {
    const newEvent = {
      title: this.selectedService,
      start: `${this.selectedDate}T${this.selectedTime}:00+01:00`
    };

    this.events = [...this.events, newEvent];
    this.saveEvents();
    this.calendarOptions = { ...this.calendarOptions, events: this.events };

    this.closeModal();

    console.log(this.events);
  }

  deleteAllEvents() {
    localStorage.removeItem('calendarEvents'); // Completely clear stored events
    localStorage.removeItem('cart'); // Ensure cart is also cleared
    this.events = [...BLOCKED_SLOTS]; // Reset to only blocked slots
    this.cartEvents = []; // Empty the cart
    this.totalPrice = 0; // Reset total price
    this.calendarOptions = { ...this.calendarOptions, events: this.events };
    console.log(this.events)
  }
  

  addToCart() {
    const selectedEvents = this.events.filter(event => 
      !BLOCKED_SLOTS.some(blocked => blocked.start === event.start)
    );
    localStorage.setItem('cart', JSON.stringify(selectedEvents));
    // alert('Events added to cart!');
    Swal.fire({
      title: 'Slot added',
      text: 'Slot added to the cart.',
      icon: 'success',
      confirmButtonText: 'OK',
      background: 'rgb(246, 248, 213)', 
      color: 'rgb(0, 0, 0)', 
      confirmButtonColor: 'rgb(32, 87, 129)'
    });
  }
  

  saveEvents() {
    const savedEvents = this.events.filter(event => !BLOCKED_SLOTS.includes(event)); // Save only user-selected events
    localStorage.setItem('calendarEvents', JSON.stringify(savedEvents));
  }

  loadEvents(): EventInput[] {
    const storedEvents = localStorage.getItem('calendarEvents');
    return storedEvents ? JSON.parse(storedEvents) : [];
  }

// Offers 

cartEvents: any[] = []; 
totalPrice: number = 0;

openCart() {
  const storedEvents = localStorage.getItem('cart');
  this.cartEvents = storedEvents ? JSON.parse(storedEvents) : [];

  // Remove blocked slots from the cart
  this.cartEvents = this.cartEvents.filter(event => 
    !BLOCKED_SLOTS.some(blocked => blocked.start === event.start)
  );

  // Update total price based on valid cart items
  this.totalPrice = this.cartEvents.reduce((sum, event) => {
    const service = OFFERS.find(s => s.name === event.title);
    return service ? sum + service.price : sum;
  }, 0);

  document.getElementById('cartModal')!.style.display = 'block';
}


closeCart() {
  document.getElementById('cartModal')!.style.display = 'none';
}

buyItems() {
  // alert('Purchase confirmed! 🎉');
  Swal.fire({
    title: 'Slot booked',
    text: 'Purchase confirmed! 🎉',
    icon: 'success',
    confirmButtonText: 'OK',
    background: 'rgb(246, 248, 213)', 
    color: 'rgb(0, 0, 0)', 
    confirmButtonColor: 'rgb(32, 87, 129)'
  });
  localStorage.removeItem('cart');
  this.cartEvents = [];
  this.closeCart();
}

getPrice(serviceName: string): number {
  return OFFERS.find(s => s.name === serviceName)?.price || 0;
}

scrollToCalendar() {
  const calendarSection = document.getElementById('calendar-container');
  if (calendarSection) {
    calendarSection.scrollIntoView({ behavior: 'smooth' });
  }
}

}
