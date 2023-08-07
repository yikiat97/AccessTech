import * as React from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Button from "@mui/material/Button";


export default function Admin_add_menu() {
  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const categories = [
    "science",
    "sports",
    "business",
    "politics",
    "entertainment",
    "technology",
    "world",
    "all"
  ];
  return (
    <React.Fragment>
      <Paper elevation={3} sx={{ marginRight: "15%", marginLeft: "15%" }}>
        <Box sx={{ padding: 5 }}>
          <Typography variant="h6" gutterBottom sx={{ paddingBottom: 5 }}>
           <h3>Add new item into menu</h3> 
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                Item Name
              </InputLabel>
            </Grid>      
            <Grid item xs={12} sm={4}>
              <TextField
                required
                id="Item Name"
                name="Item Name"
                label="Item Name"
                fullWidth
                size="small"
                autoComplete="off"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                Price
              </InputLabel>
            </Grid>      
            <Grid item xs={12} sm={4}>
              <TextField
                required
                id="Price"
                name="Price"
                label="Price"
                fullWidth
                size="small"
                autoComplete="off"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                Short content
              </InputLabel>
            </Grid>      
            <Grid item xs={12} sm={10}>
              <TextField
                required
                id="Short content"
                name="Short content"
                label="Short content"
                fullWidth
                size="small"
                autoComplete="off"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                Content
              </InputLabel>
            </Grid>
            <Grid item xs={12} sm={10}>
              <TextField
                id="outlined-multiline-static"
                label="Content"
                multiline
                fullWidth
                rows={4}
              />
            </Grid>

            {/* <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                Dish Type
              </InputLabel>
            </Grid>

            <Grid item xs={12} sm={10}>
              <TextField
                required
                id="Dish Type"
                name="Dish Type"
                label="Dish Type"
                fullWidth
                size="small"
                autoComplete="off"
                variant="outlined"
              />
            </Grid> */}

            <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                Dish Type
              </InputLabel>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="Dish-Type">ingredient</InputLabel>
                <Select
                  labelId="Dish-Type"
                  id="Dish-Type"
                  value={age}
                  label="Age"
                  onChange={handleChange}
                >
                  {categories.map((item) => (
                    <MenuItem value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                Tag
              </InputLabel>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="Dish-Type">Tag</InputLabel>
                <Select
                  labelId="Tag"
                  id="Tag"
                  value={age}
                  label="Age"
                  onChange={handleChange}
                >
                  {categories.map((item) => (
                    <MenuItem value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                placement
              </InputLabel>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="Dish-Type">placement</InputLabel>
                <Select
                  labelId="placement"
                  id="placement"
                  value={age}
                  label="placement"
                  onChange={handleChange}
                >
                  {categories.map((item) => (
                    <MenuItem value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
     

            <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                Img Upload
              </InputLabel>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button>
                <UploadFileIcon />
              </Button>
            </Grid>



            <Grid item xs={12} sm={6} />
            <Grid item xs={12} sm={5} />
            <Grid item xs={12} sm={4}>
              <Button variant="contained" sx={{ color: "#ff781f" }}>
                Save
              </Button>
            </Grid>
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}

            {/* <Grid item xs={12} sm={5}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Weekdays</FormLabel>
                <FormGroup aria-label="position">
          <FormControlLabel
            value=""
            control={<Input />}
            label="Title"
            labelPlacement="bottom"
          />

          <FormControlLabel
            value=""
            control={<Input />}
            label="Artist"
            labelPlacement="bottom"
          />
        </FormGroup>
                <FormControlLabel
                  value="tuesday"
                  control={<Checkbox />}
                  label="Tuesday"
                  labelPlacement="bottom"
                />
              </FormControl>
            </Grid> */}
          </Grid>
        </Box>
      </Paper>
    </React.Fragment>
  );
}
