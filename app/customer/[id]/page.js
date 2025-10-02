import {
    ArrowBack as ArrowBackIcon,
    Badge as BadgeIcon,
    CalendarToday as CalendarIcon,
    Interests as InterestsIcon
} from "@mui/icons-material";
import {
    Avatar,
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

export default async function CustomerDetail({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/fin-customer/api";
  const h = headers();
  const protocol = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host");
  const origin = `${protocol}://${host}`;
  const res = await fetch(`${origin}${API_BASE}/customer/${params.id}`, { cache: "no-store" });
  const customer = await res.json();

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box className="page-header mb-6">
          <Box className="flex items-center gap-4 mb-4">
            <Button
              component={Link}
              href="/customer"
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              color="secondary"
            >
              Back to Customers
            </Button>
            <Chip label="Customer Details" color="primary" />
          </Box>
          <Typography variant="h4" component="h1" className="page-title">
            Customer Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View detailed information about this customer
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card className="text-center" sx={{ height: 'fit-content' }}>
              <CardContent sx={{ py: 4 }}>
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem'
                  }}
                >
                  {getInitials(customer.name || 'Unknown')}
                </Avatar>
                <Typography variant="h5" component="h2" className="mb-2 font-semibold">
                  {customer.name || 'Unknown Customer'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customer ID: {customer._id}
                </Typography>
                {customer.memberNumber && (
                  <Chip 
                    label={`Member #${customer.memberNumber}`} 
                    color="primary" 
                    size="small" 
                    sx={{ mt: 2 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper className="data-section">
              <Typography variant="h6" component="h3" className="mb-4 font-medium">
                Customer Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                    <Box className="flex items-center gap-2 mb-2">
                      <CalendarIcon color="action" />
                      <Typography variant="subtitle1" className="font-medium">
                        Date of Birth
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.primary">
                      {formatDate(customer.dateOfBirth)}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                    <Box className="flex items-center gap-2 mb-2">
                      <BadgeIcon color="action" />
                      <Typography variant="subtitle1" className="font-medium">
                        Member Number
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.primary">
                      {customer.memberNumber || "Not assigned"}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 3 }}>
                    <Box className="flex items-center gap-2 mb-2">
                      <InterestsIcon color="action" />
                      <Typography variant="subtitle1" className="font-medium">
                        Interests & Preferences
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.primary">
                      {customer.interests || "No interests specified"}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box className="flex justify-end">
                <Button
                  component={Link}
                  href="/customer"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Return to Customer List
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}


