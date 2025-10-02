"use client";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ResponsiveAppBar from "../components/ResponsiveAppBar";

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  console.debug("API_BASE", API_BASE);
  const { register, handleSubmit, reset, control } = useForm();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [editMode, setEditMode] = useState(false);

  async function fetchProducts() {
    const data = await fetch(`${API_BASE}/product`);
    // const data = await fetch(`http://localhost:3000/product`);
    const p = await data.json();
    setProducts(p);
  }

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    setCategory(c);
  }

  const createProduct = (data) => {
    fetch(`${API_BASE}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => fetchProducts());
  };

  const updateProduct = (data) => {
    fetch(`${API_BASE}/product`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      stopEditMode();
      fetchProducts();
    });
  };

  const onSubmit = (data) => {
    if (editMode) return updateProduct(data);
    return createProduct(data);
  }

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;
    
    await fetch(`${API_BASE}/product/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  }

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, []);

  const startEditMode = (product) => {
    reset({
      _id: product._id,
      code: product.code,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?._id || product.category
    });
    setEditMode(true);
  }

  const stopEditMode = () => {
    reset({ code: '', name: '', description: '', price: '', category: '' });
    setEditMode(false);
  }

  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box className="page-header mb-6">
          <Typography variant="h4" component="h1" className="page-title">
            Product Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Add, edit, and manage your product inventory
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} lg={5}>
            <Paper className="form-section">
              <Typography variant="h6" component="h2" className="mb-4 font-medium">
                {editMode ? "Edit Product" : "Add New Product"}
              </Typography>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register("_id")} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Product Code"
                      variant="outlined"
                      {...register("code", { required: "Product code is required" })}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Product Name"
                      variant="outlined"
                      {...register("name", { required: "Product name is required" })}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      variant="outlined"
                      multiline
                      rows={3}
                      {...register("description", { required: "Description is required" })}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Price"
                      variant="outlined"
                      type="number"
                      step="0.01"
                      {...register("price", { required: "Price is required" })}
                      size="small"
                      InputProps={{ startAdornment: "$" }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: "Category is required" }}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          select
                          label="Category"
                          variant="outlined"
                          size="small"
                          value={field.value || ""}
                          onChange={field.onChange}
                        >
                          {category.map((c) => (
                            <MenuItem key={c._id} value={c._id}>
                              {c.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
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
                            Update Product
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
                        >
                          Add Product
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={7}>
            <Paper className="data-section">
              <Box className="mb-4 flex items-center justify-between">
                <Typography variant="h6" component="h2" className="font-medium">
                  Product List
                </Typography>
                <Chip 
                  label={`${products.length} products`} 
                  color="primary" 
                  size="small" 
                />
              </Box>
              
              {products.length === 0 ? (
                <Alert severity="info">No products found. Add your first product to get started.</Alert>
              ) : (
                <List>
                  {products.map((p) => (
                    <ListItem key={p._id} divider>
                      <ListItemText
                        primary={
                          <Box className="flex items-center gap-2">
                            <Link href={`/product/${p._id}`} className="text-blue-600 hover:text-blue-800 font-medium no-underline">
                              {p.name}
                            </Link>
                            <Chip 
                              label={p.category?.name || 'No Category'} 
                              size="small" 
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Code: {p.code} | Price: ${p.price}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {p.description}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => startEditMode(p)}
                          color="primary"
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={deleteById(p._id)}
                          color="error"
                          size="small"
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
