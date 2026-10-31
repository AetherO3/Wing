package com.debateApp.Main.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController{
    @GetMapping({"/group/**", "/user/**"})
    public String forwardToIndex(){
        return "forward:/index.html";
    }
}
