import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  distance: { type: Number },
});

export default mongoose.model("Route", routeSchema);
