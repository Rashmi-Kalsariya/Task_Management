import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { FiMoreVertical } from "react-icons/fi";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { deleteTask, Task, updateTask } from "../redux/task/taskSlice";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { Draggable, Droppable } from "react-beautiful-dnd";
import EditTaskModal from "./EditTaskModal";

interface TaskColumnsProps {
  tasks: Task[];
  columnTitle: string;
  columnColor: string;
  columnId: string;
}

const TaskColumns: React.FC<TaskColumnsProps> = ({
  tasks,
  columnTitle,
  columnColor,
  columnId,
}) => {
  const [anchorEl, setAnchorEl] = useState<{
    [key: string]: HTMLElement | null;
  }>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "info" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const dispatch: AppDispatch = useDispatch();

  const displayToast = (
    message: string,
    severity: "success" | "error" | "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleIconClick = (
    event: React.MouseEvent<HTMLElement>,
    taskId: string
  ) => {
    setAnchorEl((prev) => ({ ...prev, [taskId]: event.currentTarget }));
  };

  const handleClose = (taskId: string) => {
    setAnchorEl((prev) => ({ ...prev, [taskId]: null }));
  };

  const handleOptionClick = (action: () => void, taskId: string) => {
    action();
    handleClose(taskId);
  };

  useEffect(() => {
    tasks.forEach((task) => {
      const isPastDue = new Date() > new Date(task.duration);
      if (isPastDue && task.status !== "Timeout") {
        handleUpdate(task._id, { status: "Timeout" });
      }
    });
  }, [tasks]);

  const handleUpdate = (id: string, updatedFields: Partial<Task>) => {
    dispatch(updateTask({ id, updatedTask: updatedFields }))
      .unwrap()
      .then(() => {
        displayToast(`Task updated successfully`, "success");
      })
      .catch((error) => {
        displayToast(`Failed to update task: ${error}`, "error");
      });
  };

  const handleDelete = (id: string) => {
    dispatch(deleteTask(id))
      .unwrap()
      .then(() => {
        displayToast(`Task deleted successfully`, "success");
      })
      .catch((error) => {
        displayToast(`Failed to delete task: ${error}`, "error");
      });
  };

  const handleEditClick = (task: Task) => {
    setTaskToEdit(task);
    setEditModalOpen(true);
  };

  const getPriorityLabel = (task: Task) => {
    const daysRemaining = differenceInDays(new Date(task.duration), new Date());
    if (columnTitle === "Done") {
      return (
        <Typography
          sx={{
            backgroundColor: "#dff0d8", // Light green
            color: "#3c763d", // Dark green text
            padding: "2px 6px",
            borderRadius: 1,
            width: "fit-content",
          }}
        >
          Completed
        </Typography>
      );
    } else if (daysRemaining <= 2) {
      return (
        <Typography
          sx={{
            backgroundColor: "#f2dede", // Very light red
            color: "#a94442", // Light red text
            padding: "2px 6px",
            borderRadius: 1,
            width: "fit-content",
          }}
        >
          High
        </Typography>
      );
    } else if (daysRemaining > 2 && daysRemaining <= 10) {
      return (
        <Typography
          sx={{
            backgroundColor: "#fcf8e3", // Light yellow
            color: "#8a6d3b", // Light brown text
            padding: "2px 6px",
            borderRadius: 1,
            width: "fit-content",
          }}
        >
          Medium
        </Typography>
      );
    } else {
      return (
        <Typography
          sx={{
            backgroundColor: "#faf2cc", // Lighter yellow
            color: "#a07a00", // Light orange text
            padding: "2px 6px",
            borderRadius: 1,
            width: "fit-content",
          }}
        >
          Low
        </Typography>
      );
    }
  };

  return (
    <>
      <Droppable droppableId={columnId}>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            bgcolor="#f9f9f9"
            padding={1}
            borderRadius={2}
            boxShadow={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              margin: 2,
            }}
          >
            <Typography
              variant="h6"
              color={columnColor}
              sx={{
                borderBottom: `2px solid ${columnColor}`,
                paddingBottom: 1,
                paddingTop: 1,
                paddingX: 2,
                borderRadius: 2,
                backgroundColor: `${columnColor}1A`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                boxSizing: "border-box",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <span>{columnTitle}</span>
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: columnColor,
                    color: "#fff",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    fontSize: "0.75rem",
                  }}
                >
                  {tasks.length}
                </Box>
              </Box>
            </Typography>

            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    bgcolor="#fff"
                    padding={1}
                    borderRadius={2}
                    boxShadow={1}
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    position="relative"
                  >
                    <Box
                      position="absolute"
                      top={2}
                      right={2}
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Tooltip title="More options">
                        <IconButton
                          size="small"
                          onClick={(event) => handleIconClick(event, task._id)}
                        >
                          <FiMoreVertical />
                        </IconButton>
                      </Tooltip>
                      <Menu
                        anchorEl={anchorEl[task._id] || null}
                        open={Boolean(anchorEl[task._id])}
                        onClose={() => handleClose(task._id)}
                        PaperProps={{
                          style: {
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      >
                        {task.status !== "To Do" && (
                          <MenuItem
                            onClick={() =>
                              handleOptionClick(() => {
                                handleUpdate(task._id, { status: "To Do" });
                              }, task._id)
                            }
                          >
                            Move to To Do
                          </MenuItem>
                        )}
                        {task.status !== "In Progress" && (
                          <MenuItem
                            onClick={() =>
                              handleOptionClick(() => {
                                handleUpdate(task._id, {
                                  status: "In Progress",
                                });
                              }, task._id)
                            }
                          >
                            Move to In Progress
                          </MenuItem>
                        )}
                        {task.status !== "Done" && (
                          <MenuItem
                            onClick={() =>
                              handleOptionClick(() => {
                                handleUpdate(task._id, { status: "Done" });
                              }, task._id)
                            }
                          >
                            Mark as Completed
                          </MenuItem>
                        )}
                        <MenuItem
                          onClick={() =>
                            handleOptionClick(() => {
                              handleEditClick(task);
                            }, task._id)
                          }
                        >
                          Edit Task
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleOptionClick(() => {
                              handleDelete(task._id);
                            }, task._id)
                          }
                        >
                          Delete Task
                        </MenuItem>
                      </Menu>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="secondary.main"
                    >
                      {getPriorityLabel(task)}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {task.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {task.description || "No description provided"}
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      Deadline:{" "}
                      {differenceInDays(new Date(task.duration), new Date()) > 1
                        ? new Date(task.duration).toLocaleDateString()
                        : formatDistanceToNow(new Date(task.duration), {
                            addSuffix: true,
                          })}
                    </Typography>
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            <Snackbar
              open={snackbar.open}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        )}
      </Droppable>
      {editModalOpen && taskToEdit && (
        <EditTaskModal
          open={editModalOpen}
          task={taskToEdit}
          onClose={() => setEditModalOpen(false)}
          onSave={(updatedTask: any) => {
            handleUpdate(taskToEdit._id, updatedTask);
            setEditModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default TaskColumns;
