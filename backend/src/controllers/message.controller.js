import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async(req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password");
        
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUserForSidebar: ", error.message);
        res.status(500).json({ error: "internal server error" });
    }
}
export const getMessages = async(req, res) => {
    try {
        const {id:userToChatId}= req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!text && !image) {
            return res.status(400).json({ error: "Text or image is required" });
        }

        let imageUrl;
        if (image) {
            try {
                // Validate if image is a valid base64 string
                const base64Regex = /^data:image\/(png|jpg|jpeg|gif);base64,/;
                if (!base64Regex.test(image)) {
                    return res.status(400).json({ error: "Invalid image format" });
                }

                // Upload base64 image to cloudinary
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    resource_type: "image",
                    format: "jpg",
                    quality: "auto",
                });
                imageUrl = uploadResponse.secure_url;
            } catch (error) {
                console.error("Error uploading image to Cloudinary:", error);
                return res.status(500).json({ error: "Error uploading image" });
            }
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        //realtime functionality goes here using socker.io

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}