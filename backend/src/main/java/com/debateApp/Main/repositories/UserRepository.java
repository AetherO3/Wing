package com.debateApp.Main.repositories;

import com.debateApp.Main.entities.Users;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users,Long> {

    boolean existsByUserName(String userName);
    Optional<Users> findByUserName(String userName);
}
