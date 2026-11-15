export const GameState = Object.freeze({
    EXPLORING: "EXPLORING",
    FISHING_CASTING: "FISHING_CASTING",
    FISHING_WAITING: "FISHING_WAITING",
    FISHING_BITING: "FISHING_BITING",
    FISHING_MINIGAME: "FISHING_MINIGAME",
    FISHING_RESULT: "FISHING_RESULT",
    UI_MODAL: "UI_MODAL",
    PAUSED: "PAUSED"
});

export function isFishingState(state) {
    return (
        state === GameState.FISHING_CASTING ||
        state === GameState.FISHING_WAITING ||
        state === GameState.FISHING_BITING ||
        state === GameState.FISHING_MINIGAME ||
        state === GameState.FISHING_RESULT
    );
}
