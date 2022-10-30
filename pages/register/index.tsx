import type {NextPage} from 'next';
import {useRouter} from 'next/router';
import {SubmitHandler, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {getFunctions, httpsCallable} from 'firebase/functions';
import Layout from '../../components/Layout';
import {useState} from 'react';
import Card from "../../components/Card";
import Button from "../../components/Button";
import Link from "next/link";
import {
    ConfirmationResult,
    RecaptchaVerifier,
} from "firebase/auth";
import auth from "../../helpers/auth/firebase";
import {
    useAuthCreateUserWithEmailAndPassword,
    useAuthSignInWithPhoneNumber
} from "@react-query-firebase/auth";
import {z} from "zod";

const emailRegSchema = z.object({
    regEmail: z.string().min(1, "email is required").email("invalid email address"),
    regPassword: z.string().min(8, "password is too short")
})

const phoneRegSchema = z.object({
    phone: z.string().min(10, "invalid number"),
})

const otpRegSchema = z.object({
    otp: z.string().length(6, "invalid otp"),
})

type EmailFormSchema = z.infer<typeof emailRegSchema>;
type PhoneFormSchema = z.infer<typeof phoneRegSchema>;
type OtpFormSchema = z.infer<typeof otpRegSchema>;

const Register: NextPage = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [isPhone, setLoginMethod] = useState(false);
    const [isOtp, setOtp] = useState(false);
    const [confirm, setConfirm] = useState<ConfirmationResult | null>(null);

    const emailMutation = useAuthCreateUserWithEmailAndPassword(auth, {
        onSuccess() {
            router.push("/")
        },
        onError(error) {
            setError(error.code)
        }
    })
    const phoneRegMutation = useAuthSignInWithPhoneNumber(
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
        resolver: zodResolver(emailRegSchema),
        defaultValues: {
            regEmail: "",
            regPassword: "",
        },
    });

    const {
        register: phoneRegister,
        handleSubmit: phoneHandleSubmit,
        formState: {errors: phoneErrors, isSubmitting: phoneIsSubmitting},
    } = useForm<PhoneFormSchema>({
        resolver: zodResolver(phoneRegSchema),
        defaultValues: {
            phone: "",
        },
    });

    const {
        register: otpRegister,
        handleSubmit: otpHandleSubmit,
        formState: {errors: otpErrors, isSubmitting: otpIsSubmitting},
    } = useForm<OtpFormSchema>({
        resolver: zodResolver(otpRegSchema),
        defaultValues: {
            otp: ""
        },
    });

    const onChangeLoginMethod = () => {
        setError(null);
        setMessage('');
        setLoginMethod((state) => !state);
    }

    const onRegisterNumber: SubmitHandler<PhoneFormSchema> = async data => {
        setError(null);
        setMessage('');
        phoneRegMutation.mutate({
            phoneNumber: data.phone as string,
            appVerifier: new RecaptchaVerifier("recaptcha-container", {'size': 'invisible',}, auth)
        })
    };

    const onVerifyOtp: SubmitHandler<OtpFormSchema> = async data => {
        setError(null);
        setMessage('');
        const user = await confirm?.confirm(data.otp)
            .catch((error) => {
                setError(error.code);
            })
        const functions = getFunctions();
        const addUserRole = httpsCallable(functions, 'addUserRole');
        await addUserRole(user)
            .then(() => {
                setMessage('Registration successful');
                setOtp(false)
                setConfirm(null)
                router.push("/")
            }).catch((error) => {
                setError(error.code);
            })
    }

    const onRegister: SubmitHandler<EmailFormSchema> = async data => {
        setError(null);
        setMessage('');
        emailMutation.mutate({email: data.regEmail as string, password: data.regPassword as string})
    };

    return (
        <Layout>
            <Card>
                <h2 className="text-xl font-bold sm:text-2xl lg:text-3xl 2xl:text-4xl">Get Started.</h2>
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
                            {...emailRegister('regEmail',)}
                            onChange={() => {
                                setError(null);
                                setMessage('');
                            }}
                            className="bg-blue-50 border border-gray-400 text-sm p-1 sm:text-3xl"
                            disabled={otpIsSubmitting || phoneIsSubmitting || emailIsSubmitting}
                            placeholder="email address"
                        />
                        {emailErrors.regEmail &&
                            <p className="text-sm text-red-600 mt-1 sm:text-base lg:text-lg 2xl:text-2xl">{emailErrors.regEmail.message}</p>}
                    </div>}
                    {isPhone ? null : <div className="flex flex-col gap-2 sm:gap-4">
                        <input
                            type="password"
                            {...emailRegister('regPassword',)}
                            className="bg-blue-50 border border-gray-400 text-sm p-1 sm:text-3xl"
                            onChange={() => {
                                setError(null);
                                setMessage('');
                            }}
                            disabled={otpIsSubmitting || phoneIsSubmitting || emailIsSubmitting}
                            placeholder="password"
                        />
                        {emailErrors.regPassword && (
                            <p className="text-sm text-red-600 mt-1 sm:text-base lg:text-lg 2xl:text-2xl">{emailErrors.regPassword.message}</p>
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
                        () => {
                            if (isPhone && !isOtp) phoneHandleSubmit(onRegisterNumber)()
                            else if (isPhone && isOtp) otpHandleSubmit(onVerifyOtp)()
                            else emailHandleSubmit(onRegister)()
                        }
                    }>
                        {emailIsSubmitting || phoneIsSubmitting || otpIsSubmitting ? (
                                <div
                                    className="spinner-border animate-spin inline-block w-4 h-4 border-4 rounded-full"
                                    role="status"
                                >
                                </div>
                            )
                            : <p className="text-sm text-center sm:text-base lg:text-lg 2xl:text-2xl">Register</p>}
                    </Button>

                    <p className="text-sm self-center font-bold sm:text-base lg:text-lg 2xl:text-2xl">
                        - Or Register with -
                    </p>

                    <Button onClick={onChangeLoginMethod}>
                        <p className="text-sm text-center sm:text-base lg:text-lg 2xl:text-2xl">{isPhone ? "Email" : "Phone Number"}</p>
                    </Button>

                    <p className="text-sm sm:text-base lg:text-lg 2xl:text-2xl">
                        {"Already have an account? "}
                        <Link href="/login">
                            <a className="text-base text-blue-700 underline sm:text-lg lg:text-xl 2xl:text-2xl">Login</a>
                        </Link>
                    </p>
                </form>
            </Card>
        </Layout>
    );
};

export default Register;
