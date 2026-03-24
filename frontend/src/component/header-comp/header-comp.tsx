"use client"

import { usePathname, useRouter } from "next/navigation"
import { Box, Button } from "@mui/material"
import { logoutUser } from "@/redux/feature/Auth/authAction"
import { AppDispatch, RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import "./header-comp.css"
import { useState } from "react"
import { RoleEnum } from "@/enums/user.role"
import { enqueueSnackbar } from "notistack"

export default function HeaderComp() {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()

    const { user } = useSelector(
        (state: RootState) => state.authReducer
    )

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleLogOut = async () => {
        try {
            await dispatch(logoutUser()).unwrap()
            localStorage.clear()
            router.replace("/login")
        } catch (error) {
            enqueueSnackbar(String(error || "Something wrong"), { variant: "error" });
            console.error(error)
        }
    }

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    return (
        <header className="header">
            <Box className="left-container">
                <p>Linkedin</p>
            </Box>

            <Box className="right-container">

                {user ? (
                    <>
                        <Button
                            onClick={() => {
                                router.push("/")
                                handleMenuClose()
                            }}
                        >
                            Home
                        </Button>

                        <Button
                            onClick={() => {
                                router.push("/profile")
                                handleMenuClose()
                            }}
                        >
                            Profile
                        </Button>

                        <Button
                            onClick={() => {
                                router.push("/connection")
                                handleMenuClose()
                            }}
                        >
                            Global Professionals
                        </Button>

                        <Button
                            onClick={() => {
                                router.push("/profile/form")
                                handleMenuClose()
                            }}
                        >
                            Update Profile
                        </Button>

                        <Button
                            sx={{ color: "red" }}
                            onClick={async () => {
                                await handleLogOut()
                                handleMenuClose()
                            }}
                        >
                            Log Out
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            onClick={() => {
                                router.push("/signup")
                                handleMenuClose()
                            }}
                        >
                            Join Now
                        </Button>

                        <Button
                            onClick={() => {
                                router.push("/login")
                                handleMenuClose()
                            }}
                        >
                            Sign In
                        </Button>
                    </>
                )}
            </Box>
        </header>
    )
}