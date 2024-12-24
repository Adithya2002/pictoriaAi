import { Sparkle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
    return (
        <Link href="/" className='flex gap-2 items-center'>
            <Sparkles className='size-8' strokeWidth={1.5} />
            <span className='text-lg font-semibold'>Pictoria AI</span>
        </Link>
    )
}

export default Logo