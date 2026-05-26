package com.example.service;

import com.example.exception.NotFoundException;
import com.example.exception.ValidationException;
import com.example.model.CreateEventTypeRequest;
import com.example.model.EventType;
import com.example.model.UpdateEventTypeRequest;
import com.example.repository.EventTypeRepository;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class EventTypeService {

    @Inject
    EventTypeRepository repository;

    public Uni<List<EventType>> listAll() {
        return repository.listAll();
    }

    public Uni<EventType> findById(String id) {
        return repository.findById(id)
                .onItem().ifNull().failWith(() -> new NotFoundException("Event type not found"));
    }

    public Uni<EventType> create(CreateEventTypeRequest request) {
        if (request.duration < 1) {
            return Uni.createFrom().failure(new ValidationException("duration must be at least 1"));
        }
        EventType eventType = new EventType();
        eventType.id = UUID.randomUUID().toString();
        eventType.title = request.title;
        eventType.description = request.description;
        eventType.duration = request.duration;
        return repository.save(eventType);
    }

    public Uni<EventType> update(String id, UpdateEventTypeRequest request) {
        return repository.findById(id)
                .onItem().ifNull().failWith(() -> new NotFoundException("Event type not found"))
                .onItem().transformToUni(existing -> {
                    if (request.title != null) {
                        existing.title = request.title;
                    }
                    if (request.description != null) {
                        existing.description = request.description;
                    }
                    if (request.duration != null) {
                        if (request.duration < 1) {
                            return Uni.createFrom().failure(new ValidationException("duration must be at least 1"));
                        }
                        existing.duration = request.duration;
                    }
                    return repository.save(existing);
                });
    }

    public Uni<Void> delete(String id) {
        return repository.findById(id)
                .onItem().ifNull().failWith(() -> new NotFoundException("Event type not found"))
                .onItem().transformToUni(ignored -> repository.delete(id));
    }
}
