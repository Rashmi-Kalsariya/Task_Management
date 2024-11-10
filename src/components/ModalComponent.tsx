import React, { useState} from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  FormControl,
  IconButton,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Task } from "../redux/task/taskSlice";
import { Close } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface ModalComponentProps {
  open: boolean;
  onClose: () => void;
  onAddTask: (newTask: Partial<Task>) => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  open,
  onClose,
  onAddTask,
}) => {
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "To Do",
    duration: new Date(),
  });
  const [errors, setErrors] = useState({ title: "", duration: "" });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const validate = () => {
    let valid = true;
    let newErrors = { title: "", duration: "" };

    if (!newTask.title) {
      newErrors.title = "Task title is required.";
      valid = false;
    }

    if (!newTask.duration) {
      newErrors.duration = "Task duration is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAddTask = () => {
    if (validate()) {
      onAddTask(newTask);
      setNewTask({
        title: "",
        description: "",
        status: "To Do",
        duration: new Date(),
      });

      setSuccessModalOpen(true);
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalOpen(false);
    // onClose(); // Close the main modal only after the success modal is closed
  };

  return (
    <>
      <Modal open={open} onClose={onClose} closeAfterTransition>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
            width: { xs: "70%", sm: "55%", md: "35%", lg: "28%" },
            maxWidth: 400,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "teal" }}>
              ● Add New Task
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Task Title"
              variant="standard"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              error={!!errors.title}
              helperText={errors.title}
              sx={{ marginTop: 2 }}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Description"
              variant="standard"
              multiline
              rows={4}
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              sx={{ marginTop: 2 }}
            />
          </FormControl>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginTop={2}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: "medium", cursor: "pointer" }}
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              Deadline:{" "}
              {newTask.duration
                ? newTask.duration.toLocaleDateString()
                : "Select Date"}
            </Typography>

            <Button
              variant="contained"
              onClick={handleAddTask}
              sx={{
                fontWeight: "bold",
                borderRadius: 1,
                backgroundColor: "black",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Add Task
            </Button>
          </Box>

          {showDatePicker && (
            <DatePicker
              selected={newTask.duration}
              onChange={(date) => {
                if (date) {
                  setNewTask({ ...newTask, duration: date });
                  setShowDatePicker(false);
                }
              }}
              dateFormat="MM/dd/yyyy"
              inline
            />
          )}
        </Box>
      </Modal>

      {/* Success Modal */}
      <Modal open={successModalOpen} onClose={handleSuccessClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
            textAlign: "center",
            width: { xs: "80%", sm: "50%", md: "30%" },
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 48, color: "green", mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            New task has been created successfully
          </Typography>
          <Button
            variant="contained"
            onClick={handleSuccessClose}
            sx={{
              backgroundColor: "black",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Back
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ModalComponent;
