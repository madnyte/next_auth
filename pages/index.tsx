import {useRouter} from 'next/router';
import {useAuthUser} from "@react-query-firebase/auth";
import auth from "../helpers/auth/firebase";
import {useEffect, useState} from "react";
import Layout from "../components/Layout";
import Login from "../components/login";
import Register from "../components/register";
import {NextPage} from "next";

const Home: NextPage = () => {
    const {data, isLoading} = useAuthUser(["user"], auth);
    const [isLogin, setLogin] = useState(true);
    const router = useRouter();

    const changeLogin = () => {
        setLogin(!isLogin)
    }

    useEffect(() => {
        if (!isLoading) {
            if (data) {
                router.push("/dashboard")
            }
        }
    }, [router, data, isLoading])

    if (isLoading) {
        return <Layout>
            loading...
        </Layout>
    }

    return <Layout>
        {
            (isLogin && !data) && <Login changeLogin={changeLogin}></Login>
        }
        {
            (!isLogin && !data) && <Register changeLogin={changeLogin}></Register>
        }
    </Layout>
};

export default Home;
