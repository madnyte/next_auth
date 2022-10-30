import {useRouter} from 'next/router';
import {useAuthUser} from "@react-query-firebase/auth";
import auth from "../helpers/auth/firebase";
import {useEffect} from "react";
import Layout from "../components/Layout";

const Home = () => {
    const {data, isLoading} = useAuthUser(["user"], auth);
    const router = useRouter();

    useEffect(() => {
        if(!isLoading) {
            if (typeof data === 'undefined') {
                router.push("/login")
            } else if (data == null) {
                router.push("/login")
            } else if (data) {
                router.push("/dashboard")
            }
        }
    }, [router, data, isLoading])

    if (isLoading) {
        return <Layout>
            loading...
        </Layout>
    }
};

export default Home;
