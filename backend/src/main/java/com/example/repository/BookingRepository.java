package com.example.repository;

import com.example.model.Booking;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@ApplicationScoped
public class BookingRepository {
    private final Map<String, Booking> store = new ConcurrentHashMap<>();

    public Uni<List<Booking>> listAll() {
        return Uni.createFrom().item(() -> new ArrayList<>(store.values()));
    }

    public Uni<List<Booking>> findByEventTypeId(String eventTypeId) {
        return Uni.createFrom().item(() ->
            store.values().stream()
                .filter(b -> b.eventTypeId.equals(eventTypeId))
                .collect(Collectors.toList())
        );
    }

    public Uni<Booking> save(Booking booking) {
        return Uni.createFrom().item(() -> {
            store.put(booking.id, booking);
            return booking;
        });
    }

    public Uni<Boolean> existsConflict(String eventTypeId, LocalDateTime startTime, LocalDateTime endTime) {
        return Uni.createFrom().item(() ->
            store.values().stream()
                .filter(b -> b.eventTypeId.equals(eventTypeId))
                .anyMatch(b -> startTime.isBefore(b.endTime) && endTime.isAfter(b.startTime))
        );
    }
}
