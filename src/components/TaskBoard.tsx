import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Box, Typography, Snackbar, Alert } from "@mui/material";
import { Task, fetchTasks, addTask, updateTask } from "../redux/task/taskSlice";
import { RootState, AppDispatch } from "../redux/store";
import ModalComponent from "./ModalComponent";
import Sidebar from "./Sidebar";
import TaskColumns from "./TaskColumns";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Navbar from "./Navbar";

const TaskBoard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    dispatch(fetchTasks())
      .unwrap()
      .catch((error: any) => {
        setSnackbar({
          open: true,
          message: `Failed to fetch tasks: ${error.message || "An error occurred"}`,
          severity: "error",
        });
      });
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const { items, loading } = useSelector((state: RootState) => state.tasks);

  const filteredTasks = useMemo(() => {
    return items.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const categorizedTasks = useMemo(() => {
    return {
      toDoTasks: filteredTasks.filter((task) => task.status === "To Do"),
      inProgressTasks: filteredTasks.filter(
        (task) => task.status === "In Progress"
      ),
      doneTasks: filteredTasks.filter((task) => task.status === "Done"),
      timeoutTasks: filteredTasks.filter((task) => task.status === "Timeout"),
    };
  }, [filteredTasks]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      if (!destination || destination.droppableId === source.droppableId) {
        return;
      }

      const updatedStatus = destination.droppableId;
      dispatch(
        updateTask({
          id: draggableId,
          updatedTask: { status: updatedStatus as Task["status"] },
        })
      )
        .unwrap()
        .then(() => {
          setSnackbar({
            open: true,
            message: `Task ${draggableId} moved to ${updatedStatus}`,
            severity: "success",
          });
        })
        .catch((error: any) => {
          setSnackbar({
            open: true,
            message: `Failed to update task: ${error.message || "An error occurred"}`,
            severity: "error",
          });
        });
    },
    [dispatch]
  );

  const handleAddTask = useCallback(
    (newTask: Partial<Task>) => {
      if (newTask.title && newTask.duration) {
        dispatch(addTask(newTask))
          .unwrap()
          .then(() => {
            setSnackbar({
              open: true,
              message: "Task added successfully",
              severity: "success",
            });
            setOpen(false);
          })
          .catch((error: any) => {
            setSnackbar({
              open: true,
              message: `Failed to add task: ${error.message || "An error occurred"}`,
              severity: "error",
            });
          });
      } else {
        setSnackbar({
          open: true,
          message: "Task data is incomplete",
          severity: "error",
        });
      }
    },
    [dispatch]
  );

  if (loading || showLoader) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
        sx={{ backgroundColor: "#f5f5f5" }}
      >
        <Box
          sx={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "6px solid #f0f0f0",
            borderTop: "6px solid #3f51b5",
            animation: "spin 1s linear infinite",
            mb: 2,
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#3f51b5",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animation: "pulse 1s infinite alternate",
            }}
          />
        </Box>
        <Typography variant="h6" color="textSecondary">
          Preparing your tasks... please wait!
        </Typography>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            100% { transform: translate(-50%, -50%) scale(1.5); }
          }
        `}</style>
      </Box>
    );
  }

  return (
    <>
      <Navbar onSearch={setSearchTerm} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2} padding={3}>
          <Grid item xs={12} md={3}>
            <Sidebar
              timeoutTasksCount={
                items.filter((task) => task.status === "Timeout").length
              }
              activeTasksCount={
                items.filter((task) => task.status === "To Do").length +
                items.filter((task) => task.status === "In Progress").length
              }
              completedTasksCount={
                items.filter((task) => task.status === "Done").length
              }
              totalTasksCount={items.length}
              onAddTaskClick={() => setOpen(true)}
            />
          </Grid>
          <Grid item xs={12} md={9} container spacing={2}>
            <Grid item xs={12} md={4}>
              <TaskColumns
                tasks={categorizedTasks.toDoTasks}
                columnTitle="To Do"
                columnColor="purple"
                columnId="To Do"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TaskColumns
                tasks={categorizedTasks.inProgressTasks}
                columnTitle="In Progress"
                columnColor="orange"
                columnId="In Progress"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TaskColumns
                tasks={categorizedTasks.doneTasks}
                columnTitle="Done"
                columnColor="green"
                columnId="Done"
              />
            </Grid>
          </Grid>
        </Grid>
        <ModalComponent
          open={open}
          onClose={() => setOpen(false)}
          onAddTask={handleAddTask}
        />
      </DragDropContext>
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
    </>
  );
};

export default React.memo(TaskBoard);
