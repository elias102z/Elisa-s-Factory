
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule
import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule for ngModel
import { BLOCKED_SLOTS } from '../bookings'; // ✅ Import blocked slots
import { OFFERS } from '../offers'; // ✅ Import offers

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [FullCalendarModule, FormsModule, CommonModule], // ✅ Add FormsModule here
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent {
  events: EventInput[] = [...BLOCKED_SLOTS, ...this.loadEvents()]; // ✅ Merge blocked slots with saved events

  selectedDate: string = '';
  selectedTime: string = '';
  selectedService: string = 'Service A';

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    nowIndicator: true,
    selectable: true,
    editable: true,
    events: this.events,
  
    slotMinTime: '10:00:00',
    slotMaxTime: '17:00:00',
  
    height: 'auto',
    contentHeight: 'auto',
  
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
  
    // ✅ Prevent selecting blocked slots
    selectAllow: (selectInfo) => !this.isBlockedSlot(selectInfo.startStr)
  };
  

  handleEventClick(info: any) {
    if (confirm(`Do you want to remove the event: "${info.event.title}"?`)) {
      this.events = this.events.filter(event => event.start !== info.event.startStr);
      this.saveEvents();
      this.calendarOptions = { ...this.calendarOptions, events: this.events };
    }
  }  

  handleDateSelect(selectInfo: any) {
    const selectedSlot = selectInfo.startStr;
    
    // ✅ Prevent blocked slots from being booked
    if (this.isBlockedSlot(selectedSlot)) {
      alert('This time slot is unavailable.');
      return;
    }

    this.selectedDate = selectedSlot.split('T')[0];
    this.selectedTime = selectedSlot.split('T')[1]?.substring(0, 5);
    document.getElementById('eventModal')!.style.display = 'block';
  }

  isBlockedSlot(dateTime: string): boolean {
    return BLOCKED_SLOTS.some((event: EventInput) => event.start === dateTime);
  }

  closeModal() {
    const modal = document.getElementById('eventModal');
    if (modal) modal.style.display = 'none';
  }

  confirmEvent() {
    const newEvent = {
      title: this.selectedService,
      start: `${this.selectedDate}T${this.selectedTime}:00`
    };

    this.events = [...this.events, newEvent];
    this.saveEvents();
    this.calendarOptions = { ...this.calendarOptions, events: this.events };

    this.closeModal();

    console.log(this.events);
  }

  deleteAllEvents() {
    this.events = [...BLOCKED_SLOTS]; // ✅ Keep blocked slots, remove everything else
    this.saveEvents();
    this.calendarOptions = { ...this.calendarOptions, events: this.events };
    
    console.log(this.events);
  }

  addToCart() {
    const selectedEvents = this.events.filter(event => !BLOCKED_SLOTS.includes(event)); // ✅ Exclude blocked slots
    localStorage.setItem('cart', JSON.stringify(selectedEvents));
    alert('Events added to cart!');

    console.log(this.events);
  }

  saveEvents() {
    const savedEvents = this.events.filter(event => !BLOCKED_SLOTS.includes(event)); // ✅ Save only user-selected events
    localStorage.setItem('calendarEvents', JSON.stringify(savedEvents));
  }

  loadEvents(): EventInput[] {
    const storedEvents = localStorage.getItem('calendarEvents');
    return storedEvents ? JSON.parse(storedEvents) : [];
  }

// offers 

cartEvents: any[] = []; 
totalPrice: number = 0;

openCart() {
  const storedEvents = localStorage.getItem('cart');
  this.cartEvents = storedEvents ? JSON.parse(storedEvents) : [];

  // ✅ Calculate total price
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
  alert('Purchase confirmed! 🎉');
  localStorage.removeItem('cart');
  this.cartEvents = [];
  this.closeCart();
}

getPrice(serviceName: string): number {
  return OFFERS.find(s => s.name === serviceName)?.price || 0;
}


}
