import styles from '../styles/Home.module.css'
import Image from 'next/image'
import nftcc from '../public/nftccbg_1.png'

export default function Header() {
    return (
        <header className={styles.footer}>
            <a
                //href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                href="https://www.xMooneyToken.com"
                target="_blank"
                rel="noopener noreferrer"
            >
                {/* <Image src="https://static.wixstatic.com/media/0d6414_04bb2c3af25b4e51835d91bc89a8c8f6~mv2.png/v1/fill/w_200,h_200,al_c,q_85/xMooney_Logo_Token_200px_x_200px.webp" title="xMooney Logo" alt="xMooney Logo" width={100} height={100} /> */}
                <Image src={nftcc} title="NFT CC Logo" alt="NFT CC Logo" width={256} height={256} />
                {' '}
                <span className={styles.logo}>
                    {/* 
                    <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /> */}
                </span>
            </a>
        </header>
    )
}
