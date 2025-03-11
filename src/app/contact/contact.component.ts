import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import emailjs from '@emailjs/browser';

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
    
    emailjs.send(
      'service_0unzrfn', 
      'template_y55gb2b', 
      templateParams
    )
    .then((response) => {
      console.log('Email sent successfully!', response);
      alert('Thank you for your message! We will get back to you soon.');
      

      this.resetForm();
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      alert('Sorry, there was a problem sending your message. Please try again later.');
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