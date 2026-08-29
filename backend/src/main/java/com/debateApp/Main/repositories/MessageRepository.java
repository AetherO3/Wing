package com.debateApp.Main.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import com.debateApp.Main.entities.Messages;

public interface MessageRepository extends JpaRepository<Messages, Long> {

    List<Messages> findByGroupId(Long groupId);
    
}
