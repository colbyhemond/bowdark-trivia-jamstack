

const PlayersWidget = ({playersCount}) => {
    
    return (<>
        <div className="stats shadow bg-zinc-900 text-primary">
            <div className="stat place-items-center">
                <div className="stat-title">Players in Game</div>
                <div className="stat-value">{playersCount}</div>
            </div>
        </div>
    </>)
}

export default PlayersWidget