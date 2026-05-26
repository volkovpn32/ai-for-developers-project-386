package com.example.resource;

import com.example.model.EventType;
import com.example.service.EventTypeService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/api/event-types")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class GuestEventTypeResource {

    @Inject
    EventTypeService eventTypeService;

    @GET
    public Uni<List<EventType>> list() {
        return eventTypeService.listAll();
    }

    @GET
    @Path("/{id}")
    public Uni<EventType> get(@PathParam("id") String id) {
        return eventTypeService.findById(id);
    }
}
