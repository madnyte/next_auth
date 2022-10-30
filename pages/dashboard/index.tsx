import {useAuthUser} from "@react-query-firebase/auth";
import auth from "../../helpers/auth/firebase";
import {useEffect, useState} from "react";
import Layout from "../../components/Layout";
import EmployeeDashboard from "./employee";
import UserDashboard from "./user";
import {User} from "firebase/auth";
import {useRouter} from "next/router";
import {NextPage} from "next";

const Dashboard: NextPage = () => {
    const {data} = useAuthUser(["user"], auth);
    const [isLoading, setLoading] = useState(true)
    const [isUser, setIsUser] = useState<boolean | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter();


    useEffect(() => {
        if (data) {
            setUser(data)
        }
        data?.getIdTokenResult(true).then(user => {
            const obj = user.claims;
            setIsUser(Object.hasOwn(obj, 'isUser'));
            setLoading(false)
        })

        if (!data && !user) {
            router.push("/")
        }
    }, [router,data,isLoading,user])

    if (isLoading) {
        return <Layout>
            loading...
        </Layout>
    }

    return (    <Layout>
        {(isUser && user) && <UserDashboard user={user}></UserDashboard>}
        {(!isUser && user) && <EmployeeDashboard user={user}></EmployeeDashboard>}
    </Layout>)
}
export default Dashboard