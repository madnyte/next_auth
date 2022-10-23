import NextLink from "next/link";
import { Url } from "url";

interface LinkProps {
    href: Url,
    children: React.ReactNode,
}

const Link: React.FC<LinkProps> = ({href, children, ...props}) => {
    return (
        <NextLink href={href}>
            <a {...props}>
                {children}
            </a>
        </NextLink>
    )
}