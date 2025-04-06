import React, { useEffect } from "react";
import Navbar from "./Components/Navbar";
import { Box, Button, TextField } from "@mui/material";
import { Masonry } from "@mui/lab";
import { useState } from "react";
import axios from "axios";
import { Spin } from "antd";

const App = () => {
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      const res = await axios.get(
        "https://api.unsplash.com/photos/?client_id=d4Bi80zrWBao4b_1wtfYYaVpoLk1GvURLKr-hdY-jfY&per_page=30"
      );
      console.log("res=>", res.data);
      setImages(res.data);
      setLoading(false);
    };
    fetchImage();
  }, []);
  console.log("Storeimages", images);
  const searchImage = async () => {
    if(search){
      setLoading(true);
      const res = await axios.get(
        `https://api.unsplash.com/search/photos?query=${search}&client_id=d4Bi80zrWBao4b_1wtfYYaVpoLk1GvURLKr-hdY-jfY&per_page=30`
      );
      console.log("res.results=>", res.data.results);
      setImages(res.data.results);
      setLoading(false);
    } 
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
          <Masonry columns={{ sm: 1, md: 3, lg: 3 , xl: 4 }} spacing={1}>
            {images.map((image) => (
              <Box key={image.id}>
                <img src={image.urls.small} alt={image.alt_description} />
              </Box>
            ))}
          </Masonry>
        </Box>
      </Box>
    </div>
  );
};

export default App;
