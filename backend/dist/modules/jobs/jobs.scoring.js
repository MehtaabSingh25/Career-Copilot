/**
 * Scores demonstrated job requirements. Required requirements count twice as
 * much as preferred requirements; partial matches receive half credit.
 */
export const scoreRequirements = (requirements) => {
    if (requirements.length === 0)
        return 0;
    let possiblePoints = 0;
    let earnedPoints = 0;
    for (const requirement of requirements) {
        const weight = requirement.importance === "required" ? 2 : 1;
        const statusValue = requirement.status === "match"
            ? 1
            : requirement.status === "partial"
                ? 0.5
                : 0;
        possiblePoints += weight;
        earnedPoints += weight * statusValue;
    }
    return Math.round((earnedPoints / possiblePoints) * 100);
};
