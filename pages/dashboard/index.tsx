import {useAuthUser} from "@react-query-firebase/auth";
import auth from "../../helpers/auth/firebase";
import {useEffect, useState} from "react";
import Layout from "../../components/Layout";
import EmployeeDashboard from "../../components/employee";
import UserDashboard from "../../components/user";
import {useRouter} from "next/router";
import {NextPage} from "next";

const Dashboard: NextPage = () => {
    const {data} = useAuthUser(["user"], auth);
    const [isLoading, setLoading] = useState(true)
    const [isUser, setIsUser] = useState<boolean | null>(null)
    const router = useRouter();


    useEffect(() => {
        if (!data && !isLoading) {
            router.push("/")
        }

        data?.getIdTokenResult(true).then(user => {
            const obj = user.claims;
            setIsUser(Object.hasOwn(obj, 'isUser'));
            setLoading(false)
        })

    }, [router,data,isLoading])

    if (isLoading) {
        return <Layout>
            loading...
        </Layout>
    }

    return (    <Layout>
        {(isUser && data) && <UserDashboard user={data}></UserDashboard>}
        {(!isUser && data) && <EmployeeDashboard user={data}></EmployeeDashboard>}
    </Layout>)
}
export default Dashboard