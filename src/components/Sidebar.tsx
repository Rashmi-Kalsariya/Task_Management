import React, { useCallback } from "react";
import { Box, Typography, Button } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface SidebarComponentProps {
  timeoutTasksCount: number;
  activeTasksCount: number;
  completedTasksCount: number;
  totalTasksCount: number;
  onAddTaskClick: () => void;
}

const Sidebar: React.FC<SidebarComponentProps> = ({
  timeoutTasksCount,
  activeTasksCount,
  completedTasksCount,
  totalTasksCount,
  onAddTaskClick,
}) => {
  const handleAddTaskClick = useCallback(() => {
    onAddTaskClick();
  }, [onAddTaskClick]);

  return (
    <Box
      padding={2}
      bgcolor="#f9f9f9"
      borderRadius={3}
      boxShadow={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        margin: 2,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap={1}
        sx={{
          width: "80%",
          padding: 2.5,
          borderRadius: 2,
          backgroundColor: "#f0f0f0",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Box
            sx={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#fdecea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 1,
            }}
          >
            <WarningAmberIcon color="error" sx={{ fontSize: 20 }} />
          </Box>
        </Box>
        <Typography variant="h6">Expired Tasks</Typography>
        <Typography variant="h5" color="error.main">
          {timeoutTasksCount}
        </Typography>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap={1}
        sx={{
          width: "80%",
          padding: 2.5,
          borderRadius: 2,
          backgroundColor: "#f0f0f0",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Box
            sx={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#fff7e6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 1,
            }}
          >
            <WorkOutlineIcon color="warning" sx={{ fontSize: 20 }} />
          </Box>
        </Box>
        <Typography variant="h6">All Active Tasks</Typography>
        <Typography variant="h5" color="warning.main">
          {activeTasksCount}
        </Typography>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap={1}
        sx={{
          width: "80%",
          padding: 2.5,
          borderRadius: 2,
          backgroundColor: "#f0f0f0",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Box
            sx={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#e8f5e9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 1,
            }}
          >
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 20 }} />
          </Box>
        </Box>
        <Typography variant="h6">Completed Tasks</Typography>
        <Typography variant="h5" color="success.main">
          {completedTasksCount}/{totalTasksCount - timeoutTasksCount}
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddTaskClick}
        sx={{
          mt: 2,
          backgroundColor: "black",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#0d47a1", // Darker blue for a better contrast on hover
          },
          padding: "8px 16px",
          fontSize: "14px",
          transition: "background-color 0.3s ease", // Smooth transition for hover effect
        }}
      >
        Add Task
      </Button>
    </Box>
  );
};

export default React.memo(Sidebar);
