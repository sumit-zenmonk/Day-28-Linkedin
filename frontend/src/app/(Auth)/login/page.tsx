"use client"

import styles from "./login.module.css"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginSchemaType } from "@/schemas/login"
import { loginUser } from "@/redux/feature/Auth/authAction"
import { useRouter } from "next/navigation"
import GoogleIcon from '@mui/icons-material/Google';

import {
    Box,
    Button,
    Card,
    TextField,
    Typography,
    Divider
} from "@mui/material"
import { enqueueSnackbar } from "notistack"
import Image from "next/image"

export default function LoginForm() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginSchemaType) => {
        try {
            await dispatch(loginUser(data)).unwrap()
            router.replace("/")
        } catch (error) {
            enqueueSnackbar(String(error || "Something wrong"), { variant: "error" });
            console.error(error)
        }
    }

    return (
        <Box className={styles.container}>
            <Card className={styles.formWrapper} elevation={3}>
                <Typography variant="h5" className={styles.title}>
                    Sign In
                </Typography>

                <Button
                    variant="outlined"
                    className={styles.providerLoginBox}
                >
                    {/* <GoogleIcon /> */}
                    <Image
                        src={'/google.png'}
                        alt="google icon"
                        width={25}
                        height={25}
                    />
                    <Typography>
                        Login with Google
                    </Typography>
                </Button>

                <Button
                    variant="outlined"
                    className={styles.providerLoginBox}
                >
                    {/* <MicroSoftIcon /> */}
                    <Image
                        src={'/microsoft.png'}
                        alt="google icon"
                        width={25}
                        height={25}
                    />
                    <Typography>
                        Login with microsoft
                    </Typography>
                </Button>

                <Button
                    variant="outlined"
                    className={styles.providerLoginBox}
                >
                    <Box>
                        {/* <GitHubIcon /> */}
                        <Image
                            src={'/github.png'}
                            alt="google icon"
                            width={25}
                            height={25}
                        />
                    </Box>
                    <Typography>
                        Login with github
                    </Typography>
                </Button>

                <Divider className={styles.divider}>OR</Divider>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Box className={styles.field}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            {...register("email")}
                        />
                        {errors.email && (
                            <span className={styles.error}>
                                {errors.email.message}
                            </span>
                        )}
                    </Box>

                    <Box className={styles.field}>
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            {...register("password")}
                        />
                        {errors.password && (
                            <span className={styles.error}>
                                {errors.password.message}
                            </span>
                        )}
                    </Box>

                    <Button
                        variant="contained"
                        type="submit"
                        className={styles.button}
                    >
                        Login
                    </Button>
                </form>

                <Button
                    variant="text"
                    className={styles.button}
                    onClick={() => router.replace("/signup")}
                >
                    Create New Account?
                </Button>
            </Card>
        </Box>
    )
}