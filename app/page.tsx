import { headers } from "next/headers";
import { FullAdress } from "../types/FullAdress";
import { CopyButton } from "./components/CopyButton";
import Link from "next/link";

export default async function Home() {
    const host = (await headers()).get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const response = await fetch(`${protocol}://${host}/api/cep`, {
        cache: 'no-store'
    });

    if (!response.ok) return 'Erro'

    const addresses: FullAdress[] = await response.json()

    return (
        <div className='container'>
            <h1>Lista de endereços salvos</h1>
            <div>
                {addresses.map(address => (
                    <div key={address.id}>
                        <h2>{address.name}</h2>
                        <ul>
                            <li>
                                {address.address}, {address.number}
                            </li>

                            <li className="flex gap-1">
                                {address.code}
                                <CopyButton text={address.code} />
                            </li>
                        </ul>
                    </div>
                ))}
            </div>
            <Link href={'/new'}>Cadastrar novo endereço</Link>
        </div>
    );
};
