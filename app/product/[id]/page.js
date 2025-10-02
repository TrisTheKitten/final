import {
    ArrowBack as ArrowBackIcon,
    Category as CategoryIcon,
    Code as CodeIcon,
    Description as DescriptionIcon,
    AttachMoney as PriceIcon,
    Inventory as ProductIcon
} from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Grid,
    Paper,
    Typography
} from "@mui/material";
import { headers } from "next/headers";
import Link from "next/link";
import ResponsiveAppBar from "../../components/ResponsiveAppBar";

export default async function ProductDetail({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/fin-customer/api";
  const h = headers();
  const protocol = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host");
  const origin = `${protocol}://${host}`;
  const data = await fetch(`${origin}${API_BASE}/product/${params.id}`, { cache: "no-store" });
  const product = await data.json();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box className="page-header mb-6">
          <Box className="flex items-center gap-4 mb-4">
            <Button
              component={Link}
              href="/product"
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              color="secondary"
            >
              Back to Products
            </Button>
            <Chip label="Product Details" color="primary" />
          </Box>
          <Typography variant="h4" component="h1" className="page-title">
            Product Information
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View detailed information about this product
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: 'fit-content' }}>
              <CardContent sx={{ py: 4, textAlign: 'center' }}>
                <ProductIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: 'primary.main', 
                    mb: 2 
                  }} 
                />
                <Typography variant="h5" component="h2" className="mb-2 font-semibold">
                  {product.name || 'Unknown Product'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Product ID: {product._id}
                </Typography>
                <Box className="flex justify-center">
                  <Chip 
                    label={formatPrice(product.price)} 
                    color="success" 
                    size="large"
                    sx={{ 
                      fontSize: '1rem', 
                      fontWeight: 'bold',
                      px: 2
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper className="data-section">
              <Typography variant="h6" component="h3" className="mb-4 font-medium">
                Product Details
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                    <Box className="flex items-center gap-2 mb-2">
                      <CodeIcon color="action" />
                      <Typography variant="subtitle1" className="font-medium">
                        Product Code
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.primary" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                      {product.code || "No code assigned"}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                    <Box className="flex items-center gap-2 mb-2">
                      <CategoryIcon color="action" />
                      <Typography variant="subtitle1" className="font-medium">
                        Category
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.primary">
                      {product.category?.name || "Uncategorized"}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                    <Box className="flex items-center gap-2 mb-2">
                      <PriceIcon color="action" />
                      <Typography variant="subtitle1" className="font-medium">
                        Unit Price
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                      {formatPrice(product.price)}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                    <Box className="flex items-center gap-2 mb-2">
                      <ProductIcon color="action" />
                      <Typography variant="subtitle1" className="font-medium">
                        Product Status
                      </Typography>
                    </Box>
                    <Chip 
                      label="Active" 
                      color="success" 
                      variant="filled"
                      size="small"
                    />
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 3 }}>
                    <Box className="flex items-center gap-2 mb-2">
                      <DescriptionIcon color="action" />
                      <Typography variant="subtitle1" className="font-medium">
                        Product Description
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.7 }}>
                      {product.description || "No description available"}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box className="flex justify-end">
                <Button
                  component={Link}
                  href="/product"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Return to Product List
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
