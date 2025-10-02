import {
  Category as CategoryIcon,
  People as CustomerIcon,
  Inventory as ProductIcon
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography
} from "@mui/material";
import Link from "next/link";

const navigationCards = [
  {
    title: "Products",
    description: "Manage your product inventory, pricing, and details",
    href: "/product",
    icon: ProductIcon,
    color: "primary"
  },
  {
    title: "Categories",
    description: "Organize products with categories and hierarchies",
    href: "/category", 
    icon: CategoryIcon,
    color: "secondary"
  },
  {
    title: "Customers",
    description: "Manage customer information and relationships",
    href: "/customer",
    icon: CustomerIcon,
    color: "success"
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Box className="page-header">
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" className="page-title text-center">
            Stock Management System
          </Typography>
          <Typography variant="h6" color="text.secondary" className="text-center mt-2">
            Manage your inventory, categories, and customers efficiently
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {navigationCards.map((card) => (
            <Grid item xs={12} md={4} key={card.title}>
              <Card className="h-full transition-transform hover:scale-105 hover:shadow-lg">
                <CardActionArea component={Link} href={card.href} className="h-full">
                  <CardContent className="text-center py-8">
                    <Box className="mb-4">
                      <card.icon 
                        sx={{ 
                          fontSize: 48, 
                          color: card.color === 'primary' ? 'primary.main' : 
                                card.color === 'secondary' ? 'text.secondary' : 'success.main'
                        }} 
                      />
                    </Box>
                    <Typography variant="h5" component="h2" className="mb-2 font-semibold">
                      {card.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" className="px-2">
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper className="mt-8 p-6 text-center" elevation={1}>
          <Typography variant="h6" className="mb-2 font-medium">
            Welcome to your Stock Management Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select any section above to get started managing your business inventory
          </Typography>
        </Paper>
      </Container>
    </main>
  );
}
