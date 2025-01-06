import React, { useState } from "react";
import { Dialog, DialogContent, DialogActions, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ProductImages = ({ images = [] }) => {
    const [open, setOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
  
    const handleOpen = (index) => {
      setCurrentImage(index);
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        {/* Thumbnails */}
        <Box display="flex" gap={2} flexWrap="wrap">
          {images.map((image, index) => (
            <Box key={index} onClick={() => handleOpen(index)} sx={{ cursor: "pointer" }}>
              <img 
              
                src={image.url}
                key={image.url}
                alt={`Product ${index}`}
                style={{ width: "280px", height: "200px", objectFit: "cover" }}
              />
            </Box>
          ))}
        </Box>
  
        {/* Lightbox Modal */}
        <Dialog  open={open} onClose={handleClose} maxWidth="lg">
          <DialogActions>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogActions>
          <DialogContent>
            <img
              src={images[currentImage]?.url}
              alt="Product"
              style={{ width: "100%", height: "auto", maxHeight: "80vh" }}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  };
  
  export default ProductImages;
  
