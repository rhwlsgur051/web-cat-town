// components/Modal.tsx
'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({
    open,
    onClose,
    children,
}: {
    open: boolean
    onClose: () => void
    children: React.ReactNode
}) {
    const modalRoot = document.getElementById('modal-root')

    useEffect(() => {
        if (!open) return

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', onKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = ''
        }
    }, [open, onClose])

    if (!open || !modalRoot) return null

    return createPortal(
        <div className={modalBackdropCss} onClick={onClose}>
            <div className={modalCss} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        modalRoot
    )
}

const modalBackdropCss = 'fixed inset-0 bg-white flex justify-center items-center z-50'
const modalCss = 'bg-white rounded-[12px] w-[600px] max-w-[90%] max-h-[90%] p-4overflow-y-auto'