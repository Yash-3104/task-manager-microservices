package com.example.taskservice.controller;

import com.example.taskservice.dto.DashboardResponse;
import com.example.taskservice.model.Task;
import com.example.taskservice.service.TaskService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController	
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @PostMapping
    public Task create(@RequestBody Task task) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();  // ✅ correct way

        boolean isAdmin = auth.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return service.createTask(task, username, isAdmin);
    }

    @GetMapping
    public List<Task> getTasks() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return service.getAllTasks(); // 🔥 admin sees all
        }
        

        return service.getTasks(username);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        boolean isAdmin = auth.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        service.deleteTask(id, username, isAdmin);
    }
    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {

        var auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return service.getDashboard(username, isAdmin);
    }
    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @RequestBody Task updatedTask) {

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String username = auth.getName();
    boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

    return service.updateTask(id, updatedTask, username, isAdmin);
    }
 }