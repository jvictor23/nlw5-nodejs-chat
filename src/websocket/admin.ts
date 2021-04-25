import {io} from '../http'
import {ConnectionService} from "../services/ConnectionService"
import {MessageService} from '../services/MessageService'

io.on("connection", async (socket)=>{
    const connectionsService = new ConnectionService();
    const messagesService = new MessageService();
    const allConectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();

    io.emit("admin_list_all_users", allConectionsWithoutAdmin);

    socket.on("admin_list_messages_by_users", async (params, callback) =>{
        const {user_id} = params;

        const allMessages = await messagesService.listByUser(user_id)

        callback(allMessages);
    });

    socket.on("admin_send_message", async params =>{  
        const {user_id,text} = params;


        await messagesService.create({
            text,
            user_id,
            // admin_id: socket.id
        });

        const {socket_id} = await connectionsService.findByUserId(user_id);

        io.to(socket_id).emit("admin_send_to_client",{
            text,
            socket_id: socket_id
        })
        
    })
})