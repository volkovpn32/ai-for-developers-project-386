import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { EventTypeService } from '../../services/event-type.service';
import { SlotService } from '../../services/slot.service';
import { BookingService } from '../../services/booking.service';
import { EventType } from '../../api/models/event-type';
import { Slot } from '../../api/models/slot';
import { CreateBookingRequest } from '../../api/models/create-booking-request';
import { ErrorResponse } from '../../api/models/error-response';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit {
  eventTypeId: string = '';
  eventType: EventType | null = null;
  selectedDate: Date | null = null;
  slots: Slot[] = [];
  selectedSlot: Slot | null = null;

  guestName = '';
  guestEmail = '';

  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventTypeService: EventTypeService,
    private slotService: SlotService,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.eventTypeId = this.route.snapshot.paramMap.get('eventTypeId') || '';
    if (!this.eventTypeId) {
      this.error = 'Не указан тип события';
      return;
    }
    try {
      const result = await this.eventTypeService.getEventType(this.eventTypeId);
      if (this.isError(result)) {
        this.error = result.message;
      } else {
        this.eventType = result;
      }
    } catch (err: any) {
      this.error = 'Ошибка загрузки типа события';
    } finally {
      this.cdr.detectChanges();
    }
  }

  async loadSlots() {
    if (!this.selectedDate) return;
    this.loading = true;
    this.error = null;
    this.slots = [];
    this.selectedSlot = null;
    this.successMessage = null;

    const dateStr = this.formatDate(this.selectedDate);

    try {
      const result = await this.slotService.getSlots(this.eventTypeId, dateStr);
      if (this.isError(result)) {
        this.error = result.message;
      } else {
        this.slots = result;
      }
    } catch (err: any) {
      this.error = 'Ошибка загрузки слотов';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  selectSlot(slot: Slot) {
    this.selectedSlot = slot;
    this.successMessage = null;
  }

  async submitBooking() {
    if (!this.selectedSlot || !this.eventType) return;
    this.loading = true;
    this.error = null;
    const request: CreateBookingRequest = {
      eventTypeId: this.eventTypeId,
      guestName: this.guestName,
      guestEmail: this.guestEmail,
      startTime: this.selectedSlot.startTime,
    };
    try {
      const result = await this.bookingService.createBooking(request);
      if (this.isError(result)) {
        this.error = result.message;
      } else {
        this.successMessage = 'Бронирование успешно создано!';
        this.selectedSlot = null;
        this.guestName = '';
        this.guestEmail = '';
      }
    } catch (err: any) {
      this.error = 'Ошибка создания бронирования';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  formatTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private isError(obj: any): obj is ErrorResponse {
    return obj && typeof obj.code === 'number' && typeof obj.message === 'string';
  }
}
