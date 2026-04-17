package com.example.taskservice.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
public class Task {

    @Id @GeneratedValue
    private Long id;

    private String title;
    private String description;

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public String getPriority() {
		return priority;
	}

	public void setPriority(String priority) {
		this.priority = priority;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDate dueDate) {
		this.dueDate = dueDate;
	}

	public String getAssignedUsername() {
		return assignedUsername;
	}

	public void setAssignedUsername(String assignedUsername) {
		this.assignedUsername = assignedUsername;
	}

	@Enumerated(EnumType.STRING)
    private Status status;

    private String priority;

    private LocalDate startDate;
    private LocalDate dueDate;

    private String assignedUsername; // 🔥 important for microservices
}