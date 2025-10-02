import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  await dbConnect();
  const products = await Product.find().populate("category");
  return Response.json(products);
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const data = { ...body };

    if (data._id === '' || data._id === null || data._id === undefined || (typeof data._id === 'string' && data._id.trim() === '')) {
      delete data._id;
    }

    if (data.price !== undefined && data.price !== null && data.price !== '') {
      data.price = Number(data.price);
    }
    if (data.category === '' || data.category === null || data.category === undefined) {
      delete data.category;
    }

    const requiredFields = ['code', 'name', 'description', 'price'];
    const missing = requiredFields.filter((f) => data[f] === undefined || data[f] === null || data[f] === '');
    if (missing.length) {
      return new Response(`Missing required fields: ${missing.join(', ')}`, { status: 400 });
    }

    const product = new Product(data);
    await product.save();
    return Response.json(product);
  } catch (err) {
    return new Response((err && err.message) || 'Invalid request', { status: 400 });
  }
}

export async function PUT(request) {
  await dbConnect();
  const body = await request.json();
  const { _id, ...updateData } = body;
  const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }
  return Response.json(product);
}

export async function PATCH(request) {
  await dbConnect();
  const body = await request.json();
  const { _id, ...updateData } = body;
  const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }
  return Response.json(product);
}