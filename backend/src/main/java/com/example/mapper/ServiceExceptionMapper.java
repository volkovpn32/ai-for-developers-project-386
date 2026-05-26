package com.example.mapper;

import com.example.exception.ServiceException;
import com.example.model.ErrorResponse;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class ServiceExceptionMapper implements ExceptionMapper<ServiceException> {
    @Override
    public Response toResponse(ServiceException e) {
        ErrorResponse error = new ErrorResponse();
        error.code = e.getStatusCode();
        error.message = e.getMessage();
        return Response.status(e.getStatusCode()).entity(error).build();
    }
}
