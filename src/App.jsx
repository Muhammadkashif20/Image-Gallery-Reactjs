import React, { useEffect } from "react";
import Navbar from "./Components/Navbar";
import { Box, Button, Modal, TextField, IconButton, Typography, Avatar, Chip } from "@mui/material";
import { Masonry } from "@mui/lab";
import { useState } from "react";
import axios from "axios";
import { Spin } from "antd";
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';

const App = () => {
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [modal, setModal] = useState(false);
  const [chosenImage, setChosenImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      const res = await axios.get(
        "https://api.unsplash.com/photos/?client_id=d4Bi80zrWBao4b_1wtfYYaVpoLk1GvURLKr-hdY-jfY&per_page=30"
      );
      setImages(res.data);
      setLoading(false);
    };
    fetchImage();
  }, []);

  const searchImage = async () => {
    if (search) {
      setLoading(true);
      const res = await axios.get(
        `https://api.unsplash.com/search/photos?query=${search}&client_id=d4Bi80zrWBao4b_1wtfYYaVpoLk1GvURLKr-hdY-jfY&per_page=30`
      );
      setImages(res.data.results);
      setLoading(false);
    }
  };

  const handleModalOpen = (image) => {
    setChosenImage(image);
    setModal(true);
  };

  const handleModalClose = () => {
    setModal(false);
    setChosenImage(null);
  };

  return (
    <div>
      <Box>
        <Navbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "row",
            gap: 2,
            my: "2rem",
            mx: "2rem",
          }}
        >
          <TextField
            fullWidth
            name="Search Your Image"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            label="Search Your Image"
          />
          <Button
            onClick={searchImage}
            disabled={search == "" || search.length < 3}
            variant="outlined"
            color="primary"
          >
            Search
          </Button>
        </Box>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <Spin size="large" tip="Loading..." />
          </Box>
        ) : null}
        <Box sx={{ mx: "2rem", my: "2rem" }}>
          <Masonry columns={{ sm: 1, md: 2, lg: 4, xl: 4 }} spacing={1}>
            {images.map((image) => (
              <Box key={image.id}>
                <img
                  src={image.urls.small}
                  onClick={() => handleModalOpen(image)}
                  alt={image.alt_description}
                  style={{ width: "100%", cursor: "pointer", borderRadius: "8px" }}
                />
              </Box>
            ))}
          </Masonry>
        </Box>
        <Modal open={modal} onClose={handleModalClose}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              outline: "none",
              p: 2
            }}
          >
            <Box sx={{ 
              position: "relative",
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              display: "flex",
              flexDirection: { xs: "column", md: "row" }
            }}>
              <IconButton
                onClick={handleModalClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  zIndex: 1,
                  '&:hover': {
                    backgroundColor: "rgba(0,0,0,0.7)",
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
              
              {/* Image Section */}
              <Box sx={{ 
                flex: 1,
                minWidth: { md: "60%" },
                p: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <img
                  src={chosenImage?.urls?.regular || chosenImage?.urls?.small}
                  alt={chosenImage?.alt_description}
                  style={{ 
                    maxWidth: "100%",
                    maxHeight: "80vh",
                    objectFit: "contain",
                    borderRadius: "8px"
                  }}
                />
              </Box>
              
              {/* Details Section */}
              <Box sx={{ 
                flex: 1,
                minWidth: { md: "40%" },
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2
              }}>
                {/* Photographer Info */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar 
                    src={chosenImage?.user?.profile_image?.medium} 
                    alt={chosenImage?.user?.name}
                    sx={{ width: 56, height: 56 }}
                  />
                  <Box>
                    <Typography variant="h6">{chosenImage?.user?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{chosenImage?.user?.username}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Image Stats */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Chip 
                    icon={<FavoriteBorderIcon fontSize="small" />} 
                    label={chosenImage?.likes?.toLocaleString() || 0} 
                    variant="outlined" 
                  />
                  <Chip 
                    icon={<VisibilityIcon fontSize="small" />} 
                    label={chosenImage?.views?.toLocaleString() || "N/A"} 
                    variant="outlined" 
                  />
                  <Chip 
                    icon={<DownloadIcon fontSize="small" />} 
                    label={chosenImage?.downloads?.toLocaleString() || "N/A"} 
                    variant="outlined" 
                  />
                </Box>
                
                {/* Description */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {chosenImage?.description || chosenImage?.alt_description || "No description available"}
                  </Typography>
                </Box>
                
                {/* Tags */}
                {chosenImage?.tags?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Tags
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {chosenImage.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={typeof tag === 'string' ? tag : tag.title} 
                          size="small" 
                          variant="outlined" 
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                
                {/* Download Button */}
                <Box sx={{ mt: "auto", pt: 2 }}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    href={chosenImage?.links?.download} 
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<DownloadIcon />}
                  >
                    Download
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>
    </div>
  );
};

export default App;