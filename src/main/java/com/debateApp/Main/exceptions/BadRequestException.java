package com.debateApp.Main.exceptions;

public class BadRequestException extends RuntimeException{

    public BadRequestException(String message){
        super(message);
    }
    
}
