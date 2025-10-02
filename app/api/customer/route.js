import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";

export async function GET() {
  await dbConnect();
  const list = await Customer.find();
  return Response.json(list);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const { _id, ...data } = body;
  if (data.memberNumber !== undefined && data.memberNumber !== null && data.memberNumber !== '') {
    data.memberNumber = Number(data.memberNumber);
  }
  if (data.dateOfBirth) {
    data.dateOfBirth = new Date(data.dateOfBirth);
  }
  const c = new Customer(data);
  await c.save();
  return Response.json(c);
}

export async function PUT(request) {
  await dbConnect();
  const body = await request.json();
  const { _id, ...updateData } = body;
  const c = await Customer.findByIdAndUpdate(_id, updateData, { new: true });
  if (!c) {
    return new Response("Customer not found", { status: 404 });
  }
  return Response.json(c);
}

export async function PATCH(request) {
  await dbConnect();
  const body = await request.json();
  const { _id, ...updateData } = body;
  const c = await Customer.findByIdAndUpdate(_id, updateData, { new: true });
  if (!c) {
    return new Response("Customer not found", { status: 404 });
  }
  return Response.json(c);
}


