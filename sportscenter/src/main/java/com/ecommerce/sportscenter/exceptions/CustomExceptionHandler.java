package com.ecommerce.sportscenter.exceptions;


import com.ecommerce.sportscenter.model.CustomErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

// -----------------------Mesmin-Dev---------------------------------
@RestControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Object> handleProductNotFoundException(
            ProductNotFoundException ex, WebRequest request) {

        // Construction du corps de la réponse d'erreur personnalisée
        CustomErrorResponse customErrorResponse = new CustomErrorResponse(
                HttpStatus.NOT_FOUND,
                "Product does not exist",
                ex.getMessage()
        );

        // Renvoi de la réponse avec le statut HTTP 404 NOT_FOUND
        return new ResponseEntity<>(customErrorResponse, HttpStatus.NOT_FOUND);
    }

}
