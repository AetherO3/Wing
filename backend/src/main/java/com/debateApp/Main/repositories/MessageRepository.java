package com.debateApp.Main.repositories;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Collection;

import com.debateApp.Main.entities.Messages;

public interface MessageRepository extends JpaRepository<Messages, Long> {

    List<Messages> findByGroupId(Long groupId);

    @EntityGraph(attributePaths = "author")
    List<Messages> findByGroupIdOrderByCreateDateTimeDescIdDesc(Long groupId);

    @EntityGraph(attributePaths = "author")
    List<Messages> findByParentIdOrderByIdAsc(Long parentId);

    @Query("select m.parent.id as parentId, count(m) as total from Messages m where m.parent.id in :ids group by m.parent.id")
    List<ReplyCount> countRepliesByParentId(@Param("ids") Collection<Long> ids);

    interface ReplyCount {
        Long getParentId();

        Long getTotal();
    }
}
