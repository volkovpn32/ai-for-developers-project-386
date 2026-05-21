import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { guestSlotsList, GuestSlotsList$Params } from '../api/fn/operations/guest-slots-list';
import { Slot } from '../api/models/slot';
import { ErrorResponse } from '../api/models/error-response';

@Injectable({ providedIn: 'root' })
export class SlotService {
  constructor(private api: Api) {}

  async getSlots(id: string, date: string): Promise<Slot[] | ErrorResponse> {
    return this.api.invoke<GuestSlotsList$Params, Slot[] | ErrorResponse>(guestSlotsList, { id, date });
  }
}
