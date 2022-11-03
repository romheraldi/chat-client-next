import React, { FunctionComponent } from 'react'

type Props = {
    text: string
    link: string
    className: any
}

const ButtonLink: FunctionComponent<Props> = ({text, link, className}) => (
    <a href={link} className={["px-10 py-5 border-2 hover:bg-white hover:text-black", className].join(" ")}>
        {text}
    </a>
)

export default ButtonLink
