package com.example.resource;

import com.example.model.Slot;
import com.example.service.SlotService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/api/event-types/{id}/slots")
@Produces(MediaType.APPLICATION_JSON)
public class GuestSlotResource {

    @Inject
    SlotService slotService;

    @GET
    public Uni<List<Slot>> list(@PathParam("id") String id, @QueryParam("date") String date) {
        return slotService.generateSlots(id, date);
    }
}
