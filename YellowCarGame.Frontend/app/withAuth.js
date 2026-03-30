"use client"
import { useEffect } from 'react';
import { useAppContext } from "$/AppContext";
import { laesDekrypteret } from '@/helpers/storage';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const router = useRouter();
        const { isLoggedIn } = useAppContext();

        useEffect(() => {
            const user = laesDekrypteret("bruger");
            if (!isLoggedIn || !user || !user.id) {
                router.push('/');
            }
        }, [isLoggedIn]);

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;