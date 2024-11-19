import { NextResponse } from 'next/server';
import { healthCheck } from '../../../controllers/stravaController';

export async function GET(req) {
  try {
    console.log("Checking application health...");
    const baseUrl = process.env.BASE_URL;
    await healthCheck(baseUrl);
    return NextResponse.json({ message: "Application is healthy" });
  } catch (error) {
    console.error("Error during health check:", error);
    return NextResponse.json({ message: "Health check failed", error }, { status: 500 });
  }
}
