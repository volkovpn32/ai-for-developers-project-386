import "@typespec/http";

using TypeSpec.Http;

@service(#{ title: "Calendar Booking API" })
namespace CalendarBooking {
  model EventType {
    id: string;
    title: string;
    description: string;
    duration: int32;
  }

  model CreateEventTypeRequest {
    title: string;
    description: string;
    @minValue(1)
    duration: int32;
  }

  model UpdateEventTypeRequest {
    title?: string;
    description?: string;
    @minValue(1)
    duration?: int32;
  }

  model Booking {
    id: string;
    eventTypeId: string;
    guestName: string;
    guestEmail: string;
    startTime: utcDateTime;
    endTime: utcDateTime;
    createdAt: utcDateTime;
  }

  model CreateBookingRequest {
    eventTypeId: string;
    guestName: string;
    @format("email")
    guestEmail: string;
    startTime: utcDateTime;
  }

  model Slot {
    startTime: utcDateTime;
    endTime: utcDateTime;
  }

  model ErrorResponse {
    code: int32;
    message: string;
  }

  @route("/api/event-types")
  interface GuestEventTypes {
    @get list(): EventType[];
    @get getEventType(@path id: string): EventType | ErrorResponse;
  }

  @route("/api/event-types/{id}/slots")
  interface GuestSlots {
    @get list(
      @path id: string,
      @query date: string,
    ): Slot[] | ErrorResponse;
  }

  @route("/api/bookings")
  interface GuestBookings {
    @post create(@body body: CreateBookingRequest): Booking | ErrorResponse;
  }

  @route("/api/admin/event-types")
  interface AdminEventTypes {
    @get list(): EventType[];
    @post create(@body body: CreateEventTypeRequest): EventType | ErrorResponse;
    @put update(@path id: string, @body body: UpdateEventTypeRequest): EventType | ErrorResponse;
    @delete delete(@path id: string): void | ErrorResponse;
  }

  @route("/api/admin/bookings")
  interface AdminBookings {
    @get list(): Booking[];
  }
}
