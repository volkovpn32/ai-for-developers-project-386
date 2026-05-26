import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EventTypeService } from '../../services/event-type.service';
import { BookingService } from '../../services/booking.service';
import { EventType } from '../../api/models/event-type';
import { Booking } from '../../api/models/booking';
import { CreateEventTypeRequest } from '../../api/models/create-event-type-request';
import { UpdateEventTypeRequest } from '../../api/models/update-event-type-request';
import { ErrorResponse } from '../../api/models/error-response';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  eventTypes: EventType[] = [];
  bookings: Booking[] = [];
  loading = true;
  error: string | null = null;

  formTitle = '';
  formDescription = '';
  formDuration: number | null = null;
  editingEventType: EventType | null = null;

  activeTab: 'events' | 'bookings' = 'events';

  constructor(
    private eventTypeService: EventTypeService,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    this.error = null;
    try {
      [this.eventTypes, this.bookings] = await Promise.all([
        this.eventTypeService.getEventTypes(),
        this.bookingService.getBookings()
      ]);
    } catch (err: any) {
      this.error = 'Ошибка загрузки данных';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async submitForm() {
    if (!this.formTitle || !this.formDescription || !this.formDuration) return;
    this.loading = true;
    this.error = null;
    try {
      if (this.editingEventType) {
        const request: UpdateEventTypeRequest = {
          title: this.formTitle,
          description: this.formDescription,
          duration: this.formDuration,
        };
        const result = await this.eventTypeService.updateEventType(this.editingEventType.id, request);
        if (this.isError(result)) {
          this.error = result.message;
        } else {
          this.resetForm();
          await this.loadData();
        }
      } else {
        const request: CreateEventTypeRequest = {
          title: this.formTitle,
          description: this.formDescription,
          duration: this.formDuration,
        };
        const result = await this.eventTypeService.createEventType(request);
        if (this.isError(result)) {
          this.error = result.message;
        } else {
          this.resetForm();
          await this.loadData();
        }
      }
    } catch (err: any) {
      this.error = 'Ошибка сохранения';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  editEventType(et: EventType) {
    this.editingEventType = et;
    this.formTitle = et.title;
    this.formDescription = et.description;
    this.formDuration = et.duration;
  }

  resetForm() {
    this.editingEventType = null;
    this.formTitle = '';
    this.formDescription = '';
    this.formDuration = null;
  }

  async deleteEventType(id: string) {
    if (!confirm('Удалить этот тип события?')) return;
    this.loading = true;
    try {
      const result = await this.eventTypeService.deleteEventType(id);
      if (this.isError(result)) {
        this.error = result.message;
      } else {
        await this.loadData();
      }
    } catch (err: any) {
      this.error = 'Ошибка удаления';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  formatDateTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private isError(obj: any): obj is ErrorResponse {
    return obj && typeof obj.code === 'number' && typeof obj.message === 'string';
  }
}
