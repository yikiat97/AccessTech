import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from "@mui/material/Paper";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: '#4b7fce7f', // Replace with the desired color
        },
      },
    },
  },
});

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'Username', headerName: 'Username',width: 200 },
  { field: 'Password', headerName: 'Password',width: 200},
  { field: 'Role', headerName: 'Role',width: 200},
  {
    field: 'update', 
    headerName: 'Update',
    width: 200,
    renderCell: (params) => (
      <Button startIcon={<EditNoteIcon />} variant="contained" color="primary">
        Update
      </Button>
    ),
  },
  {
    field: 'delete', 
    headerName: 'Delete',
    width: 200,
    renderCell: (params) => (
      <Button startIcon={<DeleteIcon />} variant="contained" color="error">
        Delete
      </Button>
    ),
  },
];

const rows = [
  { id: 1, Username: 'Snow', Password: '123456', Role: 'Admin'},
  { id: 2, Username: 'Lannister', Password: 'abcdef', Role: 'User'},
  { id: 3, Username: 'Stark', Password: 'qwerty', Role: 'User'},
  { id: 4, Username: 'Targaryen', Password: 'asdfgh', Role: 'Admin'},
];

export default function DataTable() {
  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: 400, width: '100%' ,marginLeft:"300px"}}>
        <Paper elevation={3} sx={{ marginRight: "15%", marginLeft: "5%", marginTop: "5%" ,position: "fixed", width:"60%"}}>
          <DataGrid 
            rows={rows}
            columns={columns}
            disableSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </Paper>
      </div>
    </ThemeProvider>
  );
}
