export const WhiteBox = ({ title, children }: { title: string, children?: React.ReactNode }) => {
    return <div className="bg-white rounded-lg p-4 w-full">
        <div className="text-lg font-bold mb-2">{title}</div>
        {children}
    </div>
}