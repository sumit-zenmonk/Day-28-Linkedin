"use client"

import React, { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import { getNetworkConnections } from "@/redux/feature/user/Connection/connectionAction"
import { getChatMessages, sendMessage } from "@/redux/feature/user/Chat/chatAction"
import { receiveMessage, clearChat, setCurrent_reciever } from "@/redux/feature/user/Chat/chatSlice"
import { Box, Typography, TextField, Button, Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import styles from "./chat.module.css"
import { connectSocket, disconnectSocket } from "@/service/socket"
import { useRouter } from "next/navigation"
import { BsThreeDots } from "react-icons/bs";
import { getLinkedInTime } from "@/util/post.time"

export default function ChatPage() {
    const dispatch = useDispatch<AppDispatch>()
    const { network } = useSelector((state: RootState) => state.connectionReducer)
    const { messages, current_reciever } = useSelector((state: RootState) => state.chatReducer)
    const { user, token } = useSelector((state: RootState) => state.authReducer)
    const [selectedFriend, setSelectedFriend] = useState<any>(current_reciever)
    const [input, setInput] = useState("")
    const messageEndSmoothScrollRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        dispatch(getNetworkConnections({ page: 1, limit: 100 }))

        if (token) {
            const socket = connectSocket(token)

            socket.on("newMessage", (message) => {
                dispatch(receiveMessage(message))
            })

            return () => {
                disconnectSocket()
            }
        }
    }, [token, dispatch])

    useEffect(() => {
        if (selectedFriend) {
            dispatch(clearChat())
            dispatch(getChatMessages({ friendUuid: selectedFriend.connected_user.uuid }))
            dispatch(setCurrent_reciever({ current_reciever: selectedFriend }));
        }
    }, [selectedFriend, dispatch])

    useEffect(() => {
        messageEndSmoothScrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = () => {
        if (input.trim() && selectedFriend) {
            dispatch(
                sendMessage({
                    receiver_uuid: selectedFriend.connected_user.uuid,
                    content: input
                })
            )
            setInput("")
        }
    }

    return (
        <Box className={styles.chatContainer}>
            <Box className={styles.sidebar}>
                <Typography variant="h6">Messaging</Typography>
                <List>
                    {network.map((conn) => (
                        <ListItem
                            key={conn.uuid}
                            className={`${styles.friendItem} ${selectedFriend?.uuid === conn.uuid ? styles.selectedFriend : ""}`}
                            onClick={() => setSelectedFriend(conn)}
                        >
                            <ListItemAvatar>
                                <Avatar src={conn.connected_user?.profile?.profile_img?.image_url} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={conn.connected_user?.name}
                                secondary={conn.connected_user?.profile?.bio || "No bio"}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box className={styles.chatWindow}>
                {selectedFriend ? (
                    <>
                        <Box className={styles.FirendInfoBox}>
                            <Box className={styles.FirendInfo} onClick={() => { router.push(`/user/${selectedFriend.connected_user_uuid}`) }} >
                                <Avatar src={selectedFriend.connected_user.profile?.profile_img?.image_url} />
                                <Typography variant="subtitle1" fontWeight={600}>{selectedFriend.connected_user.name}</Typography>
                            </Box>
                            <BsThreeDots />
                        </Box>

                        <Box className={styles.messageList}>
                            {messages.map((msg) => (
                                <Box
                                    key={msg.uuid}
                                    className={`${styles.messageItem} ${msg.sender_uuid === user?.uid ? styles.myMessage : styles.friendMessage}`}
                                >
                                    <Typography>{msg.content}</Typography>
                                    <Typography className={styles.msgTime}>{getLinkedInTime(msg.created_at)}</Typography>
                                </Box>
                            ))}
                            <div ref={messageEndSmoothScrollRef} />
                        </Box>

                        <Box className={styles.inputArea}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Write a message..."
                                size="small"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <Button variant="contained" onClick={handleSendMessage}>Send</Button>
                        </Box>
                    </>
                ) : (
                    <Box>
                        <Typography color="textSecondary">Select a friend to start chatting</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    )
}