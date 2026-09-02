package com.debateApp.Main.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.debateApp.Main.entities.Groups;

public interface GroupRepository extends JpaRepository<Groups, Long> {
    
    List<Groups> findByNameContainingIgnoreCase(String name);

    @Query(value = "select * from groups where name % :term order by similarity(name, :term) desc",
    countQuery = "select count(*) from groups where name % :term",
    nativeQuery = true)
    Page<Groups> searchByNameFuzzy(@Param("term") String term, Pageable pageable);
}
