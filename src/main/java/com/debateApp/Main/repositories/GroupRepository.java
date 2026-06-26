package com.debateApp.Main.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.debateApp.Main.entities.Groups;

public interface GroupRepository extends JpaRepository<Groups, Long> {
    
}
