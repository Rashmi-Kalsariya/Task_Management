import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { Task } from "../redux/task/taskSlice";

interface EditTaskModalProps {
  open: boolean;
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Partial<Task>) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  open,
  task,
  onClose,
  onSave,
}) => {
  const [editedTask, setEditedTask] = useState<Partial<Task>>(task);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleChange = (field: keyof Task) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSave = () => {
    onSave(editedTask);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-task-modal-title"
      aria-describedby="edit-task-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="edit-task-modal-title" variant="h6" component="h2">
          Edit Task
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              fullWidth
              value={editedTask.title || ""}
              onChange={handleChange("title")}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={editedTask.description || ""}
              onChange={handleChange("description")}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Deadline"
              type="datetime-local"
              fullWidth
              value={editedTask.duration ? new Date(editedTask.duration).toISOString().slice(0, -1) : ""}
              onChange={handleChange("duration")}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose} sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditTaskModal;
