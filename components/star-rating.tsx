type StarRatingProps = {
    stars: number
    max?: number
    size?: "sm" | "md" | "lg"
    showNumber?: boolean
    count?: number
}

export default function StarRating({
    stars,
    max = 5,
    size = "md",
    showNumber = true,
    count,
}: StarRatingProps){

    const sizeClass = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-xl",
    }[size]

    return(
        <div className={`flex items-center gap-1 ${sizeClass}`}>
            {Array.from({ length: max }).map((_,i) => {
                const filled = i < Math.floor(stars)
                const partial = !filled && i < stars

                return (
                    <span
                    key={i}
                    className={
                        filled
                        ? "text-yellow-400"
                        : partial
                        ? "text-yellow-400 opacity-50"
                        : "text-gray-600"
                    }>
                        ★
                    </span>
                )
            })}
            {showNumber && (
                <span className="text-gray-400 ml-1">
                    {stars > 0 ? stars.toFixed(1) : "No ratings"}
                    {count !== undefined && count > 0 && (
                        <span className="ml-1">({count} reviews)</span>
                    )}
                </span>
            )}
        </div>
    )
}