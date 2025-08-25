const mongoose = require("mongoose")

const bucketSchema = new mongoose.Schema(
    {
<<<<<<< HEAD
        text: {
            type: String,
            required: true,
            trim: true
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
)

const Bucket = mongoose.model("Bucket", bucketSchema)

module.exports = Bucket
=======
        text:{
            type:String,
            required:true,
            trim:true
        },
        isCompleted:{
            type:Boolean,
            default:false
        },
        date:{
            type:Date,
            default:Date.now
        }
    },
    {timestamps:true}
)

const Bucket = mongoose.model("Bucket",bucketSchema)

module.exports = Bucket
>>>>>>> choyongjun
