package com.debateApp.Main.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.debateApp.Main.entities.Groups;

public interface GroupRepository extends JpaRepository<Groups, Long> {
    
    List<Groups> findByNameContainingIgnoreCase(String name);
}
