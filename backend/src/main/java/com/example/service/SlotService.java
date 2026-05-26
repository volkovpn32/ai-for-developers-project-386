package com.example.service;

import com.example.exception.NotFoundException;
import com.example.exception.ValidationException;
import com.example.model.EventType;
import com.example.model.Slot;
import com.example.repository.BookingRepository;
import com.example.repository.EventTypeRepository;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class SlotService {

    @Inject
    EventTypeRepository eventTypeRepository;

    @Inject
    BookingRepository bookingRepository;

    public Uni<List<Slot>> generateSlots(String eventTypeId, String dateStr) {
        if (dateStr == null || dateStr.isBlank()) {
            return Uni.createFrom().failure(new ValidationException("date query parameter is required"));
        }

        return eventTypeRepository.findById(eventTypeId)
                .onItem().ifNull().failWith(() -> new NotFoundException("Event type not found"))
                .onItem().transformToUni(eventType -> {
                    LocalDate date;
                    try {
                        date = LocalDate.parse(dateStr);
                    } catch (Exception e) {
                        return Uni.createFrom().failure(new ValidationException("invalid date format, expected yyyy-MM-dd"));
                    }

                    LocalDateTime dayStart = date.atTime(9, 0);
                    LocalDateTime dayEnd = date.atTime(18, 0);
                    int duration = eventType.duration;

                    return bookingRepository.listAll()
                            .onItem().transform(bookings -> {
                                List<Slot> slots = new ArrayList<>();
                                LocalDateTime current = dayStart;

                                while (!current.plusMinutes(duration).isAfter(dayEnd)) {
                                    LocalDateTime slotStart = current;
                                    LocalDateTime slotEnd = current.plusMinutes(duration);

                                    boolean isBooked = bookings.stream().anyMatch(b ->
                                            slotStart.isBefore(b.endTime) && slotEnd.isAfter(b.startTime)
                                    );

                                    if (!isBooked) {
                                        Slot slot = new Slot();
                                        slot.startTime = current;
                                        slot.endTime = slotEnd;
                                        slots.add(slot);
                                    }
                                    current = current.plusMinutes(duration);
                                }
                                return slots;
                            });
                });
    }
}
