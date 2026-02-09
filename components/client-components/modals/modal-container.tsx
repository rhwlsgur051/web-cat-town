// components/Modal.tsx
'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function ModalContainer({
    open,
    onClose,
    children,
}: {
    open: boolean
    onClose: () => void
    children: React.ReactNode
}) {
    const modalRoot = document.getElementById('modal-root')

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!open) { return setIsVisible(false); }
        else {
            const t = requestAnimationFrame(() => {
                setIsVisible(true);
            });

            const onKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose()
            }

            document.addEventListener('keydown', onKeyDown)
            document.body.style.overflow = 'hidden'

            return () => {
                document.removeEventListener('keydown', onKeyDown)
                document.body.style.overflow = ''
                cancelAnimationFrame(t);
            }
        }
    }, [open, onClose])

    if (!open || !modalRoot) return null
    return createPortal(
        <div className={`fit-content w-max-90% fixed inset-0 bg-black/50 flex justify-center items-center z-50 transition-opacity duration-200 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <button
                type="button"
                aria-label="닫기"
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
                <span className="text-2xl leading-none">×</span>
            </button>
            <div className={'bg-white rounded-[12px] w-max max-w-[90%] max-h-[90%] p-4 overflow-y-auto'} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        modalRoot
    )
}
