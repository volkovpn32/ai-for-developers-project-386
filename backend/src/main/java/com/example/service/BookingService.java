package com.example.service;

import com.example.exception.ConflictException;
import com.example.exception.NotFoundException;
import com.example.model.Booking;
import com.example.model.CreateBookingRequest;
import com.example.repository.BookingRepository;
import com.example.repository.EventTypeRepository;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class BookingService {

    @Inject
    BookingRepository bookingRepository;

    @Inject
    EventTypeRepository eventTypeRepository;

    public Uni<List<Booking>> listAll() {
        return bookingRepository.listAll();
    }

    public Uni<Booking> create(CreateBookingRequest request) {
        return eventTypeRepository.findById(request.eventTypeId)
                .onItem().ifNull().failWith(() -> new NotFoundException("Event type not found"))
                .onItem().transformToUni(eventType -> {
                    LocalDateTime startTime = request.startTime;
                    LocalDateTime endTime = startTime.plusMinutes(eventType.duration);

                    return bookingRepository.existsConflict(startTime, endTime)
                            .onItem().transformToUni(conflict -> {
                                if (conflict) {
                                    return Uni.createFrom().failure(new ConflictException("Slot is already booked"));
                                }
                                Booking booking = new Booking();
                                booking.id = UUID.randomUUID().toString();
                                booking.eventTypeId = request.eventTypeId;
                                booking.guestName = request.guestName;
                                booking.guestEmail = request.guestEmail;
                                booking.startTime = startTime;
                                booking.endTime = endTime;
                                booking.createdAt = LocalDateTime.now();
                                return bookingRepository.save(booking);
                            });
                });
    }
}
