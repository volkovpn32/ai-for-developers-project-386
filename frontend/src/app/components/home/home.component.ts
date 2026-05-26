import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventTypeService } from '../../services/event-type.service';
import { EventType } from '../../api/models/event-type';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  eventTypes: EventType[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private eventTypeService: EventTypeService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      this.eventTypes = await this.eventTypeService.getEventTypes();
    } catch (err: any) {
      this.error = 'Не удалось загрузить типы событий.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
