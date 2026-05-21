import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { adminBookingsList, AdminBookingsList$Params } from '../api/fn/operations/admin-bookings-list';
import { guestBookingsCreate, GuestBookingsCreate$Params } from '../api/fn/operations/guest-bookings-create';
import { Booking } from '../api/models/booking';
import { ErrorResponse } from '../api/models/error-response';
import { CreateBookingRequest } from '../api/models/create-booking-request';

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private api: Api) {}

  async getBookings(): Promise<Booking[]> {
    return this.api.invoke<AdminBookingsList$Params, Booking[]>(adminBookingsList, {});
  }

  async createBooking(body: CreateBookingRequest): Promise<Booking | ErrorResponse> {
    return this.api.invoke<GuestBookingsCreate$Params, Booking | ErrorResponse>(guestBookingsCreate, { body });
  }
}
