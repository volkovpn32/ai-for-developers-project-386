package com.example.resource;

import com.example.model.CreateEventTypeRequest;
import com.example.model.EventType;
import com.example.model.UpdateEventTypeRequest;
import com.example.service.EventTypeService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/admin/event-types")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminEventTypeResource {

    @Inject
    EventTypeService eventTypeService;

    @GET
    public Uni<List<EventType>> list() {
        return eventTypeService.listAll();
    }

    @POST
    public Uni<EventType> create(CreateEventTypeRequest request) {
        return eventTypeService.create(request);
    }

    @PUT
    @Path("/{id}")
    public Uni<EventType> update(@PathParam("id") String id, UpdateEventTypeRequest request) {
        return eventTypeService.update(id, request);
    }

    @DELETE
    @Path("/{id}")
    public Uni<Response> delete(@PathParam("id") String id) {
        return eventTypeService.delete(id).map(v -> Response.noContent().build());
    }
}
