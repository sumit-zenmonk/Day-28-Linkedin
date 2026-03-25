"use client"

import { usePathname, useRouter } from "next/navigation"
import { Box, Button, Tabs, Tab } from "@mui/material"
import { logoutUser } from "@/redux/feature/Auth/authAction"
import { AppDispatch, RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import "./header-comp.css"
import { useState, useEffect } from "react"
import { enqueueSnackbar } from "notistack"

export default function HeaderComp() {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()

    const { user } = useSelector(
        (state: RootState) => state.authReducer
    )

    const [tabValue, setTabValue] = useState(0);
    const routes = [
        "/",
        "/profile",
        "/profile/form",
        "/connection/global",
        "/connection/request",
        "/connection/network",
    ]

    useEffect(() => {
        const index = routes.indexOf(pathname)
        if (index !== -1) {
            setTabValue(index)
        }
    }, [pathname])

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
        router.push(routes[newValue])
    }

    const handleLogOut = async () => {
        try {
            await dispatch(logoutUser()).unwrap()
            localStorage.clear()
            router.replace("/login")
        } catch (error) {
            enqueueSnackbar(String(error || "Something wrong"), { variant: "error" })
            console.error(error)
        }
    }

    return (
        <header className="header">
            <Box className="left-container">
                <p>Linkedin</p>
            </Box>

            <Box className="right-container">
                {user ? (
                    <>
                        <Tabs
                            value={tabValue}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab label="Home" />
                            <Tab label="Profile" />
                            <Tab label="Update Profile" />
                            <Tab label="Global Professionals" />
                            <Tab label="Request" />
                            <Tab label="Network" />
                        </Tabs>

                        <Button
                            sx={{ color: "red", ml: 2 }}
                            onClick={handleLogOut}
                        >
                            Log Out
                        </Button>
                    </>
                ) : (
                    <Tabs
                        value={tabValue}
                        onChange={(_, newValue) => {
                            const publicRoutes = ["/signup", "/login"]
                            setTabValue(newValue)
                            router.push(publicRoutes[newValue])
                        }}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="Join Now" />
                        <Tab label="Sign In" />
                    </Tabs>
                )}
            </Box>
        </header>
    )
}