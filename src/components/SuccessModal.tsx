import React from "react";
import { Box, Typography, Button, Modal } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
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
          onClick={onClose}
          sx={{
            backgroundColor: "black",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          Back
        </Button>
      </Box>
    </Modal>
  );
};

export default SuccessModal;
