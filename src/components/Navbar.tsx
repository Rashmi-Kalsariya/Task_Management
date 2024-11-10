import React, { useCallback } from "react";
import { Box, InputBase, IconButton, Button } from "@mui/material";
import { FiSearch } from "react-icons/fi";
import { IoFilterSharp } from "react-icons/io5";

interface NavbarProps {
  onSearch: (searchTerm: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearch(e.target.value);
    },
    [onSearch]
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
        padding: "12px 24px",
        borderRadius: "16px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Search Input */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: "30px",
          padding: "6px 16px",
          boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <IconButton sx={{ color: "#999" }}>
          <FiSearch />
        </IconButton>
        <InputBase
          placeholder="Search Project"
          onChange={handleSearchChange}
          sx={{ ml: 1, flex: 1, fontSize: "0.875rem", color: "#666" }}
        />
      </Box>

      {/* Filter Button */}
      <Button
        variant="outlined"
        startIcon={<IoFilterSharp />}
        sx={{
          borderRadius: "30px",
          textTransform: "none",
          borderColor: "#ddd",
          color: "#666",
          padding: "6px 16px",
          "&:hover": {
            borderColor: "#ccc",
            backgroundColor: "#f4f4f4",
          },
        }}
      >
        Filter
      </Button>
    </Box>
  );
};

export default React.memo(Navbar);
