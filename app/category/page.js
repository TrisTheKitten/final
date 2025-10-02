"use client";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ResponsiveAppBar from "../components/ResponsiveAppBar";

export default function Home() {

  const columns = [
    { field: 'name', headerName: 'Category Name', width: 200, flex: 1 },
    { field: 'order', headerName: 'Display Order', width: 150 },
    {
      field: 'Action', 
      headerName: 'Actions', 
      width: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              onClick={() => startEditMode(params.row)}
              color="primary"
              size="small"
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => deleteCategory(params.row)}
              color="error"
              size="small"
              aria-label="delete"
              sx={{ ml: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )
      }
    },
  ]

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  console.log(process.env.NEXT_PUBLIC_API_URL)

  const [categoryList, setCategoryList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    const c2 = c.map((category) => {
      return {
        ...category,
        id: category._id
      }
    })
    setCategoryList(c2);
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  function handleCategoryFormSubmit(data) {
    if (editMode) {
      // Updating a category
      fetch(`${API_BASE}/category`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        stopEditMode();
        fetchCategory()
      });
      return
    }

    // Creating a new category
    fetch(`${API_BASE}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => fetchCategory());

  }

  function startEditMode(category) {
    // console.log(category)
    reset(category);
    setEditMode(true);
  }

  function stopEditMode() {
    reset({
      name: '',
      order: ''
    })
    setEditMode(false)
  }

  async function deleteCategory(category) {
    if (!confirm(`Are you sure to delete [${category.name}]`)) return;

    const id = category._id
    await fetch(`${API_BASE}/category/${id}`, {
      method: "DELETE"
    })
    fetchCategory()
  }

  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box className="page-header mb-6">
          <Typography variant="h4" component="h1" className="page-title">
            Category Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organize your products with categories and display order
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper className="form-section">
              <Typography variant="h6" component="h2" className="mb-4 font-medium">
                {editMode ? "Edit Category" : "Add New Category"}
              </Typography>
              
              <form onSubmit={handleSubmit(handleCategoryFormSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Category Name"
                      variant="outlined"
                      {...register("name", { required: "Category name is required" })}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Display Order"
                      variant="outlined"
                      type="number"
                      {...register("order", { required: "Display order is required" })}
                      size="small"
                      helperText="Lower numbers appear first"
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
                            Update Category
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
                          Add Category
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
                Categories ({categoryList.length})
              </Typography>
              
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={categoryList}
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
