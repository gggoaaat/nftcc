import styles from '../styles/Home.module.css'
import Image from 'next/image'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <a
                //href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                href="https://www.thenftcc.io"
                target="_blank"
                rel="noopener noreferrer"
            >
                {' '}
                <span className={styles.logo}>
                    { 
                    <Image src="https://thenftcc.io/wp-content/uploads/2022/01/Powered_final4x.png?resize=300%2C67&ssl=1" alt="Vercel Logo" width={156} height={35} /> }
                </span>
            </a>
        </footer>
    )
}
