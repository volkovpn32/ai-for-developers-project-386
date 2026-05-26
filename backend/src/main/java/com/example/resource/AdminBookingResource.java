package com.example.resource;

import com.example.model.Booking;
import com.example.service.BookingService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/api/admin/bookings")
@Produces(MediaType.APPLICATION_JSON)
public class AdminBookingResource {

    @Inject
    BookingService bookingService;

    @GET
    public Uni<List<Booking>> list() {
        return bookingService.listAll();
    }
}
