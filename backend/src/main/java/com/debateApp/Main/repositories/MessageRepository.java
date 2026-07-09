package com.debateApp.Main.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.debateApp.Main.entities.Messages;

public interface MessageRepository extends JpaRepository<Messages, Long> {
    
}
