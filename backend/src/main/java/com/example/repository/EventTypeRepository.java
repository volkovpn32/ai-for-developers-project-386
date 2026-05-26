package com.example.repository;

import com.example.model.EventType;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class EventTypeRepository {
    private final Map<String, EventType> store = new ConcurrentHashMap<>();

    public Uni<List<EventType>> listAll() {
        return Uni.createFrom().item(() -> new ArrayList<>(store.values()));
    }

    public Uni<EventType> findById(String id) {
        return Uni.createFrom().item(() -> store.get(id));
    }

    public Uni<EventType> save(EventType eventType) {
        return Uni.createFrom().item(() -> {
            store.put(eventType.id, eventType);
            return eventType;
        });
    }

    public Uni<Void> delete(String id) {
        return Uni.createFrom().item(() -> {
            store.remove(id);
            return null;
        });
    }
}
