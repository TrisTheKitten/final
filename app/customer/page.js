"use client";
import { Delete as DeleteIcon, Edit as EditIcon, Person as PersonIcon } from "@mui/icons-material";
import {
    Box,
    Button,
    Container,
    Grid,
    IconButton,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ResponsiveAppBar from "../components/ResponsiveAppBar";

export default function CustomerPage() {

  const columns = [
    { field: 'name', headerName: 'Customer Name', width: 180, flex: 1 },
    { 
      field: 'dateOfBirth', 
      headerName: 'Date of Birth', 
      width: 150, 
      valueGetter: (value, row) => row.dateOfBirth ? new Date(row.dateOfBirth).toISOString().slice(0,10) : 'N/A' 
    },
    { field: 'memberNumber', headerName: 'Member #', width: 120 },
    { field: 'interests', headerName: 'Interests', width: 220 },
    {
      field: 'Action', 
      headerName: 'Actions', 
      width: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Box className="flex gap-1">
            <IconButton
              onClick={() => startEditMode(params.row)}
              color="primary"
              size="small"
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => deleteCustomer(params.row)}
              color="error"
              size="small"
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              component={Link}
              href={`/customer/${params.row._id}`}
              color="info"
              size="small"
              aria-label="view details"
            >
              <PersonIcon />
            </IconButton>
          </Box>
        )
      }
    },
  ]

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const [customerList, setCustomerList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  async function fetchCustomers() {
    const res = await fetch(`${API_BASE}/customer`);
    const list = await res.json();
    const withIds = list.map((c) => ({ ...c, id: c._id }));
    setCustomerList(withIds);
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  function handleCustomerFormSubmit(data) {
    if (editMode) {
      fetch(`${API_BASE}/customer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(() => {
        stopEditMode();
        fetchCustomers();
      });
      return;
    }

    const payload = { ...data };
    if (!payload._id) delete payload._id;
    fetch(`${API_BASE}/customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(() => fetchCustomers());
  }

  function startEditMode(customer) {
    reset({
      _id: customer._id,
      name: customer.name || '',
      dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth).toISOString().slice(0,10) : '',
      memberNumber: customer.memberNumber ?? '',
      interests: customer.interests || '',
    });
    setEditMode(true);
  }

  function stopEditMode() {
    reset({
      name: '',
      dateOfBirth: '',
      memberNumber: '',
      interests: ''
    });
    setEditMode(false);
  }

  async function deleteCustomer(customer) {
    if (!confirm(`Are you sure to delete [${customer.name}]`)) return;
    const id = customer._id;
    await fetch(`${API_BASE}/customer/${id}`, { method: "DELETE" });
    fetchCustomers();
  }

  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box className="page-header mb-6">
          <Typography variant="h4" component="h1" className="page-title">
            Customer Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage customer information, membership details, and preferences
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper className="form-section">
              <Typography variant="h6" component="h2" className="mb-4 font-medium">
                {editMode ? "Edit Customer" : "Add New Customer"}
              </Typography>
              
              <form onSubmit={handleSubmit(handleCustomerFormSubmit)}>
                <input type="hidden" {...register("_id")} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Customer Name"
                      variant="outlined"
                      {...register("name", { required: "Customer name is required" })}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      variant="outlined"
                      type="date"
                      {...register("dateOfBirth")}
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Member Number"
                      variant="outlined"
                      type="number"
                      {...register("memberNumber")}
                      size="small"
                      helperText="Optional membership identifier"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Interests"
                      variant="outlined"
                      multiline
                      rows={2}
                      {...register("interests")}
                      size="small"
                      helperText="Customer preferences and interests"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box className="flex gap-3">
                      {editMode ? (
                        <>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                          >
                            Update Customer
                          </Button>
                          <Button
                            type="button"
                            variant="outlined"
                            color="secondary"
                            size="large"
                            onClick={stopEditMode}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          size="large"
                          fullWidth
                        >
                          Add Customer
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper className="data-section">
              <Typography variant="h6" component="h2" className="mb-4 font-medium">
                Customers ({customerList.length})
              </Typography>
              
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={customerList}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  disableSelectionOnClick
                  sx={{
                    '& .MuiDataGrid-root': {
                      border: 'none',
                    },
                    '& .MuiDataGrid-cell': {
                      borderBottom: '1px solid #f0f0f0',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#fafafa',
                      borderBottom: '2px solid #e0e0e0',
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}


