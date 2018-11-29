import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';
//added after, this is the Http client import
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactComponent implements OnInit {

  contacts: Array<Contact> = [];
  contactParams: string = '';
  // make sure to add HttpClient to constructor
  constructor(private http: HttpClient) { }

  async ngOnInit() {
    const savedContacts = await this.getItemsFromLocalStorage('contacts');
    if (savedContacts && savedContacts.length > 0) {
      this.contacts = savedContacts
    } else {
      this.contacts = await this.loadItemsFromFile();
    }

  }

  async loadItemsFromFile() {
    const data = await this.http.get('assets/contacts.json').toPromise();
    return data;
  }

  addContact() {
    this.contacts.unshift(new Contact({}));
  }

  deleteContact(index: number) {
    this.contacts.splice(index, 1);
    this.saveItemsToLocalStorage(this.contacts)
  }

  saveContact(contact: any) {
    contact.editing = false;
    this.sortById(this.contacts);
  }

  saveItemsToLocalStorage(contacts: Array<Contact>) {
    const savedContacts = localStorage.setItem('contacts', JSON.stringify(contacts));
    return savedContacts;
  }

  async getItemsFromLocalStorage(key: string) {
    const savedContacts = JSON.parse(localStorage.getItem(key));
    if (savedContacts.length > 0) {
      return savedContacts;
    } else {
      this.contacts = await this.loadItemsFromFile();
    }
  }

  searchContact(params: string) {
    this.contacts = this.contacts.filter((item: Contact) => {
      const fullName = item.firstName + ' ' + item.lastName;
      if (params === item.firstName || params === item.lastName || params === fullName) {
        return true;
      } else {
        return false;
      }
    })
  }

//sorting function
  sortById(contacts: Array<Contact>) {
    contacts.sort((a:Contact, b:Contact) => {
      return a.id > b.id ? 1: -1;
    })
  }
}
