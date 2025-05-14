export async function GET() {
  return Response.json({
    API_URL: process.env.API_URL,
  });
}
