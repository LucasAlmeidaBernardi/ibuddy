import mongoose from "mongoose";

const pictureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  src: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  }
});

const Picture = mongoose.model("Picture", pictureSchema);

export default Picture;
