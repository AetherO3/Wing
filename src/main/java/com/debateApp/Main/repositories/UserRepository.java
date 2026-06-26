package com.debateApp.Main.repositories;

import com.debateApp.Main.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users,Long> {

}
