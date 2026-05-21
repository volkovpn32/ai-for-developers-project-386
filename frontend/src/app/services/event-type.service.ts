import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { guestEventTypesList, GuestEventTypesList$Params } from '../api/fn/operations/guest-event-types-list';
import { guestEventTypesGetEventType, GuestEventTypesGetEventType$Params } from '../api/fn/operations/guest-event-types-get-event-type';
import { adminEventTypesCreate, AdminEventTypesCreate$Params } from '../api/fn/operations/admin-event-types-create';
import { adminEventTypesUpdate, AdminEventTypesUpdate$Params } from '../api/fn/operations/admin-event-types-update';
import { adminEventTypesDelete, AdminEventTypesDelete$Params } from '../api/fn/operations/admin-event-types-delete';
import { EventType } from '../api/models/event-type';
import { ErrorResponse } from '../api/models/error-response';
import { CreateEventTypeRequest } from '../api/models/create-event-type-request';
import { UpdateEventTypeRequest } from '../api/models/update-event-type-request';

@Injectable({ providedIn: 'root' })
export class EventTypeService {
  constructor(private api: Api) {}

  async getEventTypes(): Promise<EventType[]> {
    return this.api.invoke<GuestEventTypesList$Params, EventType[]>(guestEventTypesList, {});
  }

  async getEventType(id: string): Promise<EventType | ErrorResponse> {
    return this.api.invoke<GuestEventTypesGetEventType$Params, EventType | ErrorResponse>(guestEventTypesGetEventType, { id });
  }

  async createEventType(body: CreateEventTypeRequest): Promise<EventType | ErrorResponse> {
    return this.api.invoke<AdminEventTypesCreate$Params, EventType | ErrorResponse>(adminEventTypesCreate, { body });
  }

  async updateEventType(id: string, body: UpdateEventTypeRequest): Promise<EventType | ErrorResponse> {
    return this.api.invoke<AdminEventTypesUpdate$Params, EventType | ErrorResponse>(adminEventTypesUpdate, { id, body });
  }

  async deleteEventType(id: string): Promise<void | ErrorResponse> {
    return this.api.invoke<AdminEventTypesDelete$Params, void | ErrorResponse>(adminEventTypesDelete, { id });
  }
}
