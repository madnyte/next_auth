import {useRouter} from 'next/router';
import {z} from 'zod';
import {SubmitHandler, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { useState} from 'react';
import Link from "next/link";
import {ConfirmationResult, RecaptchaVerifier} from "firebase/auth";
import {
    useAuthSignInWithEmailAndPassword,
    useAuthSignInWithPhoneNumber,
} from "@react-query-firebase/auth";
import Card from './Card';
import auth from "../helpers/auth/firebase";
import Button from "./Button";

const emailSchema = z.object({
    email: z.string().email("invalid email address"),
    password: z.string().min(8, "password is too short")
})

const phoneSchema = z.object({
    phone: z.string().min(10, "invalid number"),
})

const otpSchema = z.object({
    otp: z.string().length(6, "invalid otp"),
})

type EmailFormSchema = z.infer<typeof emailSchema>;
type PhoneFormSchema = z.infer<typeof phoneSchema>;
type OtpFormSchema = z.infer<typeof otpSchema>;

interface LoginProps {
    changeLogin: () => void
}

const Login: React.FC<LoginProps> = ({changeLogin}) => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [isPhone, setLoginMethod] = useState(false);
    const [isOtp, setOtp] = useState(false);
    const [confirm, setConfirm] = useState<ConfirmationResult | null>(null);


    const emailMutation = useAuthSignInWithEmailAndPassword(auth, {
        onSuccess() {
            router.push("/dashboard")
        },
        onError(error) {
            setError(error.code)
        }
    })
    const phoneMutation = useAuthSignInWithPhoneNumber(
        auth, {
            onSuccess(result) {
                setOtp((state) => !state)
                setMessage("check phone for otp")
                setConfirm(result)
            },
            onError(error) {
                setError(error.code)
            }
        })

    const {
        register: emailRegister,
        handleSubmit: emailHandleSubmit,
        formState: {errors: emailErrors, isSubmitting: emailIsSubmitting},
    } = useForm<EmailFormSchema>({
        resolver: zodResolver(emailSchema),
        mode: 'onChange',
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const {
        register: phoneRegister,
        handleSubmit: phoneHandleSubmit,
        formState: {errors: phoneErrors, isSubmitting: phoneIsSubmitting},
    } = useForm<PhoneFormSchema>({
        resolver: zodResolver(phoneSchema),
        defaultValues: {
            phone: "",
        },
    });

    const {
        register: otpRegister,
        handleSubmit: otpHandleSubmit,
        formState: {errors: otpErrors, isSubmitting: otpIsSubmitting},
    } = useForm<OtpFormSchema>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: ""
        },
    });

    const buttonFunction = () => {
        if (isPhone && !isOtp) return phoneHandleSubmit(onPhoneLogin)
        else if (isPhone && isOtp) return otpHandleSubmit(onOtpVerify)
        return emailHandleSubmit(onLogin)
    }

    const onLogin: SubmitHandler<EmailFormSchema> = async data => {
        setError(null);
        setMessage('');
        await emailMutation.mutate({email: data.email as string, password: data.password as string})
    };

    const onPhoneLogin: SubmitHandler<PhoneFormSchema> = async data => {
        setError(null);
        setMessage('');
        await phoneMutation.mutate({
            phoneNumber: data.phone,
            appVerifier: new RecaptchaVerifier("recaptcha-container", {'size': 'invisible',}, auth)
        })
    };

    const onOtpVerify: SubmitHandler<OtpFormSchema> = async data => {
        setError(null);
        setMessage('');
        await confirm?.confirm(data.otp)
            .then(() => {
                setMessage('Registration successful');
                setOtp(false)
                setConfirm(null)
                router.push("/dashboard")
            }).catch((error) => {
                setError(error.code);
            })
    }

    const onChangeLoginMethod = () => {
        setError(null);
        setMessage('');
        setLoginMethod((state) => !state);
    }

    return (
            <Card>
                <h2 className="text-xl font-bold sm:text-2xl lg:text-3xl 2xl:text-4xl">Welcome Back...</h2>
                <h3 className="text-sm text-gray-500 sm:text-base lg:text-lg 2xl:text-2xl">Enter your details to sign in
                    to your account</h3>
                {message && <p className="text-sm text-green-500 font-bold sm:text-base lg:text-lg 2xl:text-2xl">
                    {message}
                </p>}
                {error && <p className="text-sm text-red-500 font-bold sm:text-base lg:text-lg 2xl:text-2xl">
                    {error}
                </p>}
                <form className="flex flex-col gap-4 sm:gap-4 lg:gap-6">
                    {isPhone ? null : <div className="flex flex-col gap-2 sm:gap-4">
                        <input
                            type="email"
                            {...emailRegister('email')}
                            onChange={() => {
                                setError(null);
                                setMessage('');
                            }}
                            className="bg-blue-50 border border-gray-400 text-sm p-1 sm:text-3xl"
                            disabled={otpIsSubmitting || phoneIsSubmitting || emailIsSubmitting}
                            placeholder="email address"
                        />
                        {emailErrors.email &&
                            <p className="text-sm text-red-600 mt-1 sm:text-base lg:text-lg 2xl:text-2xl">{emailErrors.email.message}</p>}
                    </div>}
                    {isPhone ? null : <div className="flex flex-col gap-2 sm:gap-4">
                        <input
                            type="password"
                            {...emailRegister('password',)}
                            className="bg-blue-50 border border-gray-400 text-sm p-1 sm:text-3xl"
                            onChange={() => {
                                setError(null);
                                setMessage('');
                            }}
                            disabled={otpIsSubmitting || phoneIsSubmitting || emailIsSubmitting}
                            placeholder="password"
                        />
                        {emailErrors.password && (
                            <p className="text-sm text-red-600 mt-1 sm:text-base lg:text-lg 2xl:text-2xl">{emailErrors.password.message}</p>
                        )}
                    </div>}

                    {isPhone ? <div className="flex flex-col gap-2 sm:gap-4">
                        <input
                            type="phone"
                            {...phoneRegister('phone',)}
                            onChange={() => {
                                setError(null);
                                setMessage('');
                            }}
                            className="bg-blue-50 border border-gray-400 text-sm p-1 sm:text-3xl"
                            disabled={otpIsSubmitting || phoneIsSubmitting || emailIsSubmitting}
                            placeholder="phone number"
                        />
                        {phoneErrors.phone &&
                            <p className="text-sm text-red-600 mt-1 sm:text-base lg:text-lg 2xl:text-2xl">{phoneErrors.phone.message}</p>}
                    </div> : null}
                    <div id="recaptcha-container"></div>
                    {isOtp ? <div className="flex flex-col gap-2 sm:gap-4">
                        <input
                            type="number"
                            {...otpRegister('otp')}
                            onChange={() => {
                                setError(null);
                                setMessage('');
                            }}
                            className="bg-blue-50 border border-gray-400 text-sm p-1 sm:text-3xl"
                            disabled={otpIsSubmitting || phoneIsSubmitting || emailIsSubmitting}
                            placeholder="enter otp"
                        />
                        {otpErrors.otp &&
                            <p className="text-sm text-red-600 mt-1 sm:text-base lg:text-lg 2xl:text-2xl">{otpErrors.otp.message}</p>}
                    </div> : null}


                    <Button onClick={
                        buttonFunction()
                    }>
                        {emailIsSubmitting || phoneIsSubmitting || otpIsSubmitting ? (
                                <div
                                    className="spinner-border animate-spin inline-block w-4 h-4 border-4 rounded-full"
                                    role="status"
                                >
                                </div>
                            )
                            : (<p className="text-sm text-center sm:text-base lg:text-lg 2xl:text-2xl">Login</p>)}
                    </Button>

                    <p className="text-sm self-center font-bold sm:text-base lg:text-lg 2xl:text-2xl">
                        - Or Login with -
                    </p>

                    <Button onClick={onChangeLoginMethod}>
                        <p className="text-sm text-center sm:text-base lg:text-lg 2xl:text-2xl">{isPhone ? "Email" : "Phone Number"}</p>
                    </Button>

                    <p className="text-sm sm:text-base lg:text-lg 2xl:text-2xl">
                        {"Don't have an account? "}
                        <Link href="components/login" >
                            <a onClick={changeLogin} className="text-base text-blue-700 underline sm:text-lg lg:text-xl 2xl:text-2xl">Register</a>
                        </Link>
                    </p>
                </form>
            </Card>
    );
};

export default Login;