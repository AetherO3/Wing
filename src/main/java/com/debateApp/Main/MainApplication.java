package com.debateApp.Main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class MainApplication {

	public static void main(String[] args) {
        //configuration of dotenv.java
        
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        dotenv.entries().forEach((entry) -> System.setProperty(
                    entry.getKey(), entry.getValue()
        ));

		SpringApplication.run(MainApplication.class, args);

	}

}
