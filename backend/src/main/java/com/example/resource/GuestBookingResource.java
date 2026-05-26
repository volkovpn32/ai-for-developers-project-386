package com.example.resource;

import com.example.model.Booking;
import com.example.model.CreateBookingRequest;
import com.example.service.BookingService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("/api/bookings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class GuestBookingResource {

    @Inject
    BookingService bookingService;

    @POST
    public Uni<Booking> create(CreateBookingRequest request) {
        return bookingService.create(request);
    }
}
