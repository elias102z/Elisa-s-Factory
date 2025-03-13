// contact.component.ts
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

interface ContactForm {
  name: string;
  lastname: string;
  phone: string;
  email: string;
  service: string;
  appointmentSuggestion: string;
  message: string;
  consent: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactData: ContactForm = {
    name: '',
    lastname: '',
    phone: '',
    email: '',
    service: '',
    appointmentSuggestion: '',
    message: '',
    consent: false
  };

  submitted = false;
  loading = false;

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    
    emailjs.init('GlOorXRTu0yFm2PcH');
    
    const templateParams = {
      from_name: `${this.contactData.name} ${this.contactData.lastname}`,
      reply_to: this.contactData.email,
      phone: this.contactData.phone,
      service: this.contactData.service,
      appointment: this.contactData.appointmentSuggestion,
      message: this.contactData.message
    };
    
    // First email - to the customer for confirmation
    emailjs.send(
      'service_0unzrfn', 
      'template_y55gb2b', 
      templateParams
    )
    .then((response) => {
      console.log('Confirmation email sent to customer!', response);
      
      // Second email - to your business account
      return emailjs.send(
        'service_0unzrfn',  
        'template_sbdl2eh', 
        templateParams 
      );
    })
    .then((response) => {
      console.log('Notification email sent to business!', response);
      Swal.fire({
        title: "Thank you for choosing us",
        text: "Check your email for confirmation",
        icon: "success"
      });
      this.resetForm();
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      Swal.fire({
        title: "Error",
        text: "Sorry, there was a problem sending your message. Please try again later.",
        icon: "error"
      });
    })
    .finally(() => {
      this.loading = false;
    });
  }
  
  resetForm() {
    this.contactData = {
      name: '',
      lastname: '',
      phone: '',
      email: '',
      service: '',
      appointmentSuggestion: '',
      message: '',
      consent: false
    };
    this.submitted = false;
  }
}