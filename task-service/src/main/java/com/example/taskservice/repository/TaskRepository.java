package com.example.taskservice.repository;

import com.example.taskservice.model.Task;
import com.example.taskservice.model.Status;
import com.example.taskservice.model.Priority;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignedUsername(String username);

    long countByAssignedUsername(String username);

    long countByAssignedUsernameAndStatus(String username, Status status);

    long countByAssignedUsernameAndPriority(String username, Priority priority);
    
    long countByStatus(Status status);

    long countByPriority(Priority priority);
    
    
}	