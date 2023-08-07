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
import Button from "@mui/material/Button";

export default function Admin_add_ingredients() {
  const [qty_type_value, set_qty_type_value] = useState("");
  const [qty_value, set_qty_value] = useState("");
  const [Ingredient_Name_value, set_Ingredient_Name_value] = useState("");
  const [error, setError] = useState({
    name: false,
    qty: false,
    type: false
  });

  const qty_type = ["Pieces", "Grams", "Kilograms"];

  const handleQtyTypeChange = (event) => {
    set_qty_type_value(event.target.value);
    setError({...error, type: false});
  };

  const handleQtyValueChange = (event) => {
    set_qty_value(event.target.value);
    setError({...error, qty: false});
  };

  const handleIngredientNameChange = (event) => {
    set_Ingredient_Name_value(event.target.value);
    setError({...error, name: false});
  };

  const submitButton = () => {
    if (Ingredient_Name_value == ""){
      setError(Error1 => ({...Error1, name: true}));
    } 
    if (qty_value == "") {
      setError({...error, qty: true});
    }
    if (qty_type_value == "") {
      // setError({...error, type: true});
      setError(prevError => ({...prevError, type: true}));
    }

    console.log(error)
    
    if(Ingredient_Name_value && qty_value && qty_type_value){
      fetch('http://127.0.0.1:5000/ingredient/addIngredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ingredients_name: Ingredient_Name_value, 
          ingredients_qty: qty_value, 
          ingredients_type: qty_type_value 
        })
      })
      .then(response => response.json())
      .then(data => {
          alert(data.result)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }

  return (
    <React.Fragment>
      <Paper elevation={3} sx={{ marginRight: "15%", marginLeft: "15%" }}>
        <Box sx={{ padding: 5 }}>
          <Typography variant="h6" gutterBottom sx={{ paddingBottom: 5 }}>
           <h3>Add new ingredient</h3> 
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
                Ingredient Name
              </InputLabel>
            </Grid>      
            <Grid item xs={12} sm={10}>
        <TextField
          required
          error={error.name}
          id="Ingredient Name"
          name="Ingredient Name"
          label="Ingredient Name"
          fullWidth
          size="small"
          autoComplete="off"
          variant="outlined"
          onChange={handleIngredientNameChange}
          value={Ingredient_Name_value}
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
                Qty
              </InputLabel>
            </Grid>      
      <Grid item xs={12} sm={4}>
        <TextField
          type="Number"
          required
          error={error.qty}
          id="Qty"
          name="Qty"
          label="Qty"
          fullWidth
          size="small"
          autoComplete="off"
          variant="outlined"
          onChange={handleQtyValueChange}
          value={qty_value}
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
                Qty Type
              </InputLabel>
            </Grid>      
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth size="small" error={error.type}>
          <InputLabel required id=" Qty Type"> Qty Type</InputLabel>
          <Select
            labelId="Qty Type"
            id="Qty Type"
            value={qty_type_value}
            label="qty_type"
            onChange={handleQtyTypeChange}
          >
            {qty_type.map((item) => (
              <MenuItem value={item}>{item}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

            <Grid item xs={12} sm={6} />
            <Grid item xs={12} sm={4} />
            <Grid item xs={12} sm={2}>
              <Button variant="contained" onClick={submitButton} sx={{ color: "white" }}>
                Save
              </Button>
            </Grid>
         
          </Grid>
        </Box>
      </Paper>
    </React.Fragment>
  );
}
