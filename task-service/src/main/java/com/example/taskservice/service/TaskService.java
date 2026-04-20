package com.example.taskservice.service;

import com.example.taskservice.dto.DashboardResponse;
import com.example.taskservice.model.*;
import com.example.taskservice.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import java.util.List;
import org.springframework.cache.annotation.CacheEvict;

@Service
public class TaskService {

    private final TaskRepository repo;

    public TaskService(TaskRepository repo) {
        this.repo = repo;
    }

    // ✅ CREATE TASK (invalidate cache)
    @CacheEvict(value = "dashboard", key = "#username")
    public Task createTask(Task task, String username) {
        task.setAssignedUsername(username);
        return repo.save(task);
    }

    public List<Task> getTasks(String username) {
        return repo.findByAssignedUsername(username);
    }

    public List<Task> getAllTasks() {
        return repo.findAll();
    }

    // ✅ DELETE TASK (invalidate cache)
    @CacheEvict(value = "dashboard", key = "#username")
    public void deleteTask(Long id, String username) {
        Task task = repo.findById(id).orElseThrow();

        if (!task.getAssignedUsername().equals(username)) {
            throw new RuntimeException("Not allowed");
        }

        repo.delete(task);
    }

    // ✅ CACHE READ
    @Cacheable(value = "dashboard", key = "#username")
    public DashboardResponse getDashboard(String username, boolean isAdmin) {

        System.out.println("🔥 DB HIT (not cache)");

        DashboardResponse res = new DashboardResponse();

        if (isAdmin) {
            res.setTotalTasks(repo.count());
            res.setTodoTasks(repo.countByStatus(Status.TODO));
            res.setInProgressTasks(repo.countByStatus(Status.IN_PROGRESS));
            res.setDoneTasks(repo.countByStatus(Status.DONE));
            return res;
        }

        res.setTotalTasks(repo.countByAssignedUsername(username));
        res.setTodoTasks(repo.countByAssignedUsernameAndStatus(username, Status.TODO));
        res.setInProgressTasks(repo.countByAssignedUsernameAndStatus(username, Status.IN_PROGRESS));
        res.setDoneTasks(repo.countByAssignedUsernameAndStatus(username, Status.DONE));

        return res;
    }
}