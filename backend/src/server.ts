import { app } from "./app.ts";
import connectDb from "./db.ts";

const PORT = Number(process.env.PORT) || 3005;

await connectDb(); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
